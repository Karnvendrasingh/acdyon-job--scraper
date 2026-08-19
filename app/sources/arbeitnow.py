from typing import List
from scrapling.fetchers import FetcherSession
from app.models.job import RawJob
from app.sources.base import BaseSource, SourceRateLimited, SourceUnavailable, SourceEmptyResponse
from app.config import settings
from app.ingestion.cleaner import clean_text, clean_location, clean_tags, is_valid_job

class ArbeitnowSource(BaseSource):
    @property
    def name(self) -> str:
        return "arbeitnow"

    def fetch(self, session: FetcherSession) -> List[RawJob]:
        try:
            response: Response = session.get(settings.ARBEITNOW_URL)
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
            
        jobs_data = data.get("data", [])
        if not jobs_data:
            raise SourceEmptyResponse("API returned empty data list")
            
        jobs = []
        for item in jobs_data:
            raw_title = item.get("title", "")
            raw_company = item.get("company_name", "")
            
            if not is_valid_job(raw_title, raw_company):
                continue

            title = clean_text(raw_title)
            company = clean_text(raw_company)
            location = clean_location(item.get("location", ""))
            tags = clean_tags(item.get("tags", []), title=title)
            apply_url = clean_text(item.get("url", ""))

            jobs.append(
                RawJob(
                    title=title,
                    company=company,
                    location=location,
                    tags=tags,
                    apply_url=apply_url,
                    source=self.name
                )
            )

        if not jobs:
            raise SourceEmptyResponse("No valid jobs found in response")

        return jobs
