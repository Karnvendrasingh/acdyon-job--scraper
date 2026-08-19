from app.ingestion.health import health_tracker
from app.sources.remoteok import RemoteOKSource
from app.sources.arbeitnow import ArbeitnowSource
from app.sources.base import BaseSource

def get_best_source() -> BaseSource:
    primary = RemoteOKSource()
    fallback = ArbeitnowSource()
    
    primary_health = health_tracker.get(primary.name)
    
    # If primary is healthy or degraded, use it.
    if primary_health.state in ("healthy", "degraded"):
        return primary
        
    fallback_health = health_tracker.get(fallback.name)
    if fallback_health.state in ("healthy", "degraded"):
        return fallback
        
    # Both are down
    return None
