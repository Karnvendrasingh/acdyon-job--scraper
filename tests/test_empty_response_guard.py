import pytest
from tests.fixtures.mock_source_server import start_mock_server
from app.sources.remoteok import RemoteOKSource
from app.sources.base import SourceEmptyResponse
from scrapling.fetchers import FetcherSession
from app.config import settings
import time

def test_empty_response_guard():
    server, state = start_mock_server(port=8082)
    settings.REMOTEOK_URL = "http://localhost:8082/remoteok"
    
    state["status"] = 200
    state["empty"] = True
    
    source = RemoteOKSource()
    with FetcherSession() as session:
        with pytest.raises(SourceEmptyResponse):
            source.fetch(session)
            
    server.shutdown()
