from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from app.storage.db import get_session
from app.storage.repository import get_latest_jobs
from app.models.job import Job
from app.models.ingest_run import IngestRun
from app.config import settings
from app.ingestion.health import health_tracker

router = APIRouter()

@router.get("/jobs")
def read_jobs(
    tag: Optional[str] = None,
    remote: Optional[bool] = None, # Simple text check if true
    source: Optional[str] = None,
    page: int = Query(1, ge=1),
    session: Session = Depends(get_session)
):
    limit = 50
    skip = (page - 1) * limit
    
    query = select(Job)
    if tag:
        query = query.where(Job.tags.contains(tag) | Job.title.contains(tag))
    if source:
        query = query.where(Job.source == source)
    
    # We use get_latest_jobs to fetch them ordered by created_at.
    # To keep it simple, we filter post-fetch for some advanced things or just use basic queries.
    # We can just apply the same logic as repository's get_latest_jobs directly here since we have filters.
    
    # Check staleness
    cutoff = datetime.utcnow() - __import__('datetime').timedelta(minutes=settings.STALE_AFTER_MINUTES)
    recent_run = session.exec(
        select(IngestRun)
        .where(IngestRun.status == "success")
        .where(IngestRun.created_at >= cutoff)
    ).first()
    
    query = query.order_by(Job.created_at.desc()).offset(skip).limit(limit)
    jobs = session.exec(query).all()
    
    return {
        "stale": recent_run is None,
        "data": jobs
    }

@router.get("/jobs/{id}")
def read_job(id: int, session: Session = Depends(get_session)):
    job = session.get(Job, id)
    return job

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/ingest/status")
def ingest_status(session: Session = Depends(get_session)):
    runs = session.exec(select(IngestRun).order_by(IngestRun.created_at.desc()).limit(10)).all()
    
    sources = {}
    for name in ["remoteok", "arbeitnow"]:
        h = health_tracker.get(name)
        sources[name] = {
            "state": h.state,
            "consecutive_failures": h.consecutive_failures,
            "consecutive_successes": h.consecutive_successes,
            "last_success": h.last_success
        }
        
    return {
        "sources": sources,
        "recent_runs": runs
    }
