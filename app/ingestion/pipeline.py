import time
import logging
from typing import Tuple
from scrapling.fetchers import FetcherSession

from app.ingestion.router import get_best_source
from app.ingestion.health import health_tracker
from app.ingestion.throttle import throttle_manager
from app.storage.db import engine
from sqlmodel import Session
from app.storage.repository import upsert_jobs, log_ingest_run
from app.models.ingest_run import IngestRun
from app.sources.base import SourceRateLimited, SourceUnavailable, SourceEmptyResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_tick():
    start_time = time.time()
    source = get_best_source()
    
    if not source:
        logger.error("All sources are down. Serving from cache.")
        with Session(engine) as session:
            log_ingest_run(session, IngestRun(
                source="none",
                status="skipped",
                item_count=0,
                duration_seconds=time.time() - start_time,
                error_message="All sources down"
            ))
        return

    source_health = health_tracker.get(source.name)
    throttle = throttle_manager.get(source.name)
    
    throttle.wait()
    
    with FetcherSession(impersonate="chrome", stealthy_headers=True) as fetcher:
        try:
            logger.info(f"Fetching from {source.name}")
            raw_jobs = source.fetch(fetcher)
            _process_success(source.name, raw_jobs, start_time)
        except SourceEmptyResponse as e:
            logger.warning(f"Empty response from {source.name}: {e}. Retrying once...")
            # Retry once immediately
            try:
                raw_jobs = source.fetch(fetcher)
                _process_success(source.name, raw_jobs, start_time)
            except Exception as retry_e:
                _process_failure(source.name, retry_e, start_time, is_hard_failure=False)
        except SourceRateLimited as e:
            throttle.record_429(e.retry_after)
            _process_failure(source.name, e, start_time, is_hard_failure=True)
        except Exception as e:
            _process_failure(source.name, e, start_time, is_hard_failure=True)

def _process_success(source_name: str, raw_jobs: list, start_time: float):
    health = health_tracker.get(source_name)
    throttle = throttle_manager.get(source_name)
    
    health.record_success()
    throttle.record_success()
    
    valid_jobs = []
    for rj in raw_jobs:
        # validate, here RawJob is already validated minimally by pydantic
        # we can just append. If it failed to create RawJob, it would have crashed.
        # But since we create RawJob in the source and any failure there is caught, this is safe.
        valid_jobs.append(rj)

    with Session(engine) as session:
        inserted = upsert_jobs(session, valid_jobs)
        log_ingest_run(session, IngestRun(
            source=source_name,
            status="success",
            item_count=inserted,
            duration_seconds=time.time() - start_time
        ))
    logger.info(f"Success: {source_name}. Inserted {inserted} new jobs.")

def _process_failure(source_name: str, error: Exception, start_time: float, is_hard_failure: bool):
    health = health_tracker.get(source_name)
    throttle = throttle_manager.get(source_name)
    
    health.record_failure(is_hard_failure)
    throttle.record_failure()
    
    logger.error(f"Failed: {source_name}. Error: {error}")
    with Session(engine) as session:
        log_ingest_run(session, IngestRun(
            source=source_name,
            status="failed",
            item_count=0,
            duration_seconds=time.time() - start_time,
            error_message=str(error)
        ))
