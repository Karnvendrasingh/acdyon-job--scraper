from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class IngestRun(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    source: str
    status: str # "success", "failed", "skipped"
    item_count: int
    duration_seconds: float
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
