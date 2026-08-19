import time
from typing import Dict
from app.config import settings

class SourceThrottle:
    def __init__(self):
        self.current_delay = settings.RATE_LIMIT_BASE_DELAY_SECONDS
        self.last_request_time = 0.0

    def wait(self):
        now = time.time()
        elapsed = now - self.last_request_time
        if elapsed < self.current_delay:
            time.sleep(self.current_delay - elapsed)
        self.last_request_time = time.time()

    def record_success(self):
        # drift down slightly, floor at 1 sec
        self.current_delay = max(1.0, self.current_delay * 0.9)

    def record_429(self, retry_after: int = None):
        if retry_after:
            self.current_delay = float(retry_after)
        else:
            self.current_delay *= 2

    def record_failure(self):
        # On consecutive failures, maybe stop tightening delay
        pass

class ThrottleManager:
    def __init__(self):
        self.throttles: Dict[str, SourceThrottle] = {}

    def get(self, source_name: str) -> SourceThrottle:
        if source_name not in self.throttles:
            self.throttles[source_name] = SourceThrottle()
        return self.throttles[source_name]

throttle_manager = ThrottleManager()
