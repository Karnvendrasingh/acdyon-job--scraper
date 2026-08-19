from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime, timedelta

from app.storage.db import get_session
from app.models.job import Job
from app.models.ingest_run import IngestRun
from app.config import settings
from app.ingestion.health import health_tracker

router = APIRouter()

def generate_job_posting_jsonld(job: Job) -> dict:
    """Generate Schema.org JobPosting JSON-LD for Google for Jobs SEO indexing."""
    return {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": job.title,
        "description": f"Verified remote job opportunity for {job.title} at {job.company}. Indexed via {job.source} ingestion engine.",
        "identifier": {
            "@type": "PropertyValue",
            "name": job.company,
            "value": str(job.id)
        },
        "datePosted": job.created_at.isoformat() + "Z",
        "employmentType": "FULL_TIME",
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.company,
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location or "Remote",
                "addressCountry": "Global"
            }
        },
        "jobLocationType": "TELECOMMUTE",
        "applicantLocationRequirements": {
            "@type": "Country",
            "name": "WORLDWIDE"
        },
        "directApply": True,
        "url": job.apply_url
    }

@router.get("/jobs")
def read_jobs(
    tag: Optional[str] = None,
    remote: Optional[bool] = None,
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
    
    # Check staleness
    cutoff = datetime.utcnow() - timedelta(minutes=settings.STALE_AFTER_MINUTES)
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
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    
    jsonld = generate_job_posting_jsonld(job)
    return {
        "job": job,
        "jsonld": jsonld
    }

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
