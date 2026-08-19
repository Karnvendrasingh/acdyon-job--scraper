import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    INGEST_INTERVAL_MINUTES: int = 30
    DB_URL: str = "sqlite:///./jobs.db"
    RATE_LIMIT_BASE_DELAY_SECONDS: int = 3
    STALE_AFTER_MINUTES: int = 120
    FAILURE_THRESHOLD: int = 3
    REMOTEOK_URL: str = "https://remoteok.com/api"
    ARBEITNOW_URL: str = "https://www.arbeitnow.com/api/job-board-api"

    class Config:
        env_file = ".env"

settings = Settings()
