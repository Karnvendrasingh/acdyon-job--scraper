from typing import List
from scrapling.fetchers import FetcherSession
from app.models.job import RawJob
from app.sources.base import BaseSource, SourceRateLimited, SourceUnavailable, SourceEmptyResponse
from app.config import settings

class RemoteOKSource(BaseSource):
    @property
    def name(self) -> str:
        return "remoteok"

    def fetch(self, session: FetcherSession) -> List[RawJob]:
        try:
            # We use Scrapling's FetcherSession to do the GET request.
            # Notice the prompt requested using adaptive re-anchoring as a mock test for JSON endpoints,
            # but for the actual implementation it's a JSON API, so we parse JSON.
            # To fulfill "mock Scrapling's adaptive re-anchoring on local fixture", we will do that in testing.
            # Here, we will just request the JSON.
            response: Response = session.get(settings.REMOTEOK_URL)
        except Exception as e:
            raise SourceUnavailable(f"Network error: {str(e)}")

        if response.status == 429:
            retry_after = response.headers.get("Retry-After")
            retry_val = int(retry_after) if retry_after and retry_after.isdigit() else None
            raise SourceRateLimited(retry_after=retry_val)
        
        if response.status >= 500:
            raise SourceUnavailable(f"Server error: {response.status}")
            
        if response.status != 200:
            raise SourceUnavailable(f"Unexpected status code: {response.status}")

        try:
            data = response.json()
        except Exception:
            raise SourceUnavailable("Malformed JSON response")
            
        if not data:
            raise SourceEmptyResponse("API returned empty list")
            
        jobs = []
        for item in data:
            # RemoteOK often includes a legal/meta object at index 0. Skip it.
            if "legal" in item or not item.get("id"):
                continue
                
            jobs.append(
                RawJob(
                    title=item.get("position", "Unknown Title"),
                    company=item.get("company", "Unknown Company"),
                    location=item.get("location", ""),
                    tags=item.get("tags", []),
                    apply_url=item.get("apply_url", item.get("url", "")),
                    source=self.name
                )
            )

        if not jobs:
            raise SourceEmptyResponse("No valid jobs found in response")

        return jobs
