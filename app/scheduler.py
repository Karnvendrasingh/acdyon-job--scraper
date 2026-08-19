from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.config import settings
from app.ingestion.pipeline import run_tick
import logging
import threading

logger = logging.getLogger(__name__)

_scheduler = BackgroundScheduler()
_lock = threading.Lock()

def safe_run_tick():
    # Do not run multiple ticks concurrently
    if not _lock.acquire(blocking=False):
        logger.warning("Tick skipped: previous tick is still running.")
        return
    try:
        run_tick()
    finally:
        _lock.release()

def start_scheduler():
    trigger = IntervalTrigger(minutes=settings.INGEST_INTERVAL_MINUTES)
    _scheduler.add_job(safe_run_tick, trigger=trigger, id='ingest_tick', replace_existing=True)
    _scheduler.start()
    logger.info(f"Scheduler started. Interval: {settings.INGEST_INTERVAL_MINUTES} minutes.")
    
    # Run one tick immediately on startup in a separate thread so it doesn't block startup
    threading.Thread(target=safe_run_tick).start()

def stop_scheduler():
    _scheduler.shutdown()
    logger.info("Scheduler stopped.")
