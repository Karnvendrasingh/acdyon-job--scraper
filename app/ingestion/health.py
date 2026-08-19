from datetime import datetime
from typing import Dict
from app.config import settings

class SourceHealth:
    def __init__(self):
        self.consecutive_successes = 0
        self.consecutive_failures = 0
        self.last_success: datetime = None
        self.state = "healthy" # healthy, degraded, down

    def record_success(self):
        self.consecutive_successes += 1
        self.consecutive_failures = 0
        self.last_success = datetime.utcnow()
        self.state = "healthy"

    def record_failure(self, is_hard_failure: bool = True):
        self.consecutive_successes = 0
        if is_hard_failure:
            self.consecutive_failures += 1
            
        if self.consecutive_failures >= settings.FAILURE_THRESHOLD:
            self.state = "down"
        elif self.consecutive_failures > 0:
            self.state = "degraded"

class HealthTracker:
    def __init__(self):
        self.sources: Dict[str, SourceHealth] = {}
        
    def get(self, source_name: str) -> SourceHealth:
        if source_name not in self.sources:
            self.sources[source_name] = SourceHealth()
        return self.sources[source_name]
        
health_tracker = HealthTracker()
