import abc
from typing import List
from scrapling.fetchers import FetcherSession

from app.models.job import RawJob

class SourceException(Exception):
    pass

class SourceRateLimited(SourceException):
    def __init__(self, retry_after: int = None):
        self.retry_after = retry_after
        super().__init__(f"Rate limited. Retry after {retry_after}s")

class SourceUnavailable(SourceException):
    pass

class SourceEmptyResponse(SourceException):
    pass

class BaseSource(abc.ABC):
    
    @property
    @abc.abstractmethod
    def name(self) -> str:
        pass

    @abc.abstractmethod
    def fetch(self, session: FetcherSession) -> List[RawJob]:
        """
        Fetch jobs from the source using the provided Scrapling FetcherSession.
        Raises SourceRateLimited, SourceUnavailable, or SourceEmptyResponse.
        """
        pass
