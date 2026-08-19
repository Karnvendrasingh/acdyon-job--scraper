import pytest
from app.ingestion.health import health_tracker
from app.ingestion.router import get_best_source
from app.sources.remoteok import RemoteOKSource
from app.sources.arbeitnow import ArbeitnowSource
from app.config import settings

def test_router_failover():
    # Reset health tracker
    health_tracker.sources = {}
    
    # Initally primary is healthy
    source = get_best_source()
    assert isinstance(source, RemoteOKSource)
    
    # Simulate 3 consecutive failures for primary
    primary_health = health_tracker.get(source.name)
    primary_health.record_failure(is_hard_failure=True)
    primary_health.record_failure(is_hard_failure=True)
    primary_health.record_failure(is_hard_failure=True)
    
    # State should be down
    assert primary_health.state == "down"
    
    # Next pick should be fallback
    source = get_best_source()
    assert isinstance(source, ArbeitnowSource)
