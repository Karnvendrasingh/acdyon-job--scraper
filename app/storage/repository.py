import hashlib
import json
from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import Tuple, List

from app.models.job import Job, RawJob
from app.models.ingest_run import IngestRun

def generate_content_hash(title: str, company: str, apply_url: str) -> str:
    raw = f"{title}|{company}|{apply_url}".encode('utf-8')
    return hashlib.sha256(raw).hexdigest()

def upsert_jobs(session: Session, raw_jobs: List[RawJob]) -> int:
    inserted_count = 0
    for rj in raw_jobs:
        chash = generate_content_hash(rj.title, rj.company, rj.apply_url)
        
        # Check if exists
        existing = session.exec(select(Job).where(Job.content_hash == chash)).first()
        if not existing:
            job = Job(
                content_hash=chash,
                title=rj.title,
                company=rj.company,
                location=rj.location,
                tags=json.dumps(rj.tags),
                apply_url=rj.apply_url,
                source=rj.source
            )
            session.add(job)
            inserted_count += 1
            
    session.commit()
    return inserted_count

def log_ingest_run(session: Session, run: IngestRun):
    session.add(run)
    session.commit()

def get_latest_jobs(session: Session, stale_after_minutes: int, skip: int = 0, limit: int = 50) -> Tuple[List[Job], bool]:
    # Check staleness: if there's no successful ingest run within stale_after_minutes, it's stale.
    cutoff = datetime.utcnow() - timedelta(minutes=stale_after_minutes)
    recent_run = session.exec(
        select(IngestRun)
        .where(IngestRun.status == "success")
        .where(IngestRun.created_at >= cutoff)
    ).first()
    
    stale = recent_run is None
    
    # Return data regardless of staleness, sorted by newest
    jobs = session.exec(select(Job).order_by(Job.created_at.desc()).offset(skip).limit(limit)).all()
    
    return list(jobs), stale
