from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content_hash: str = Field(index=True, unique=True)
    title: str
    company: str
    location: Optional[str] = None
    tags: Optional[str] = None # comma separated or json dumped string, simple enough
    apply_url: str
    source: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RawJob(SQLModel):
    """Temporary model used between fetch and storage."""
    title: str
    company: str
    location: Optional[str] = None
    tags: list[str] = []
    apply_url: str
    source: str
