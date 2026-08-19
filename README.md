# Scrapling Job Radar

A resilient job-listing ingestion pipeline that pulls postings from public job APIs on a schedule, survives source failures, and serves the results over a small API and dashboard.

**Live Demo (Render Free Tier):** [https://job-radar-placeholder.onrender.com](https://job-radar-placeholder.onrender.com)

## Running Locally

### With Docker (Recommended)
```bash
docker build -t job-radar .
docker run -p 8000:8000 job-radar
```
Navigate to `http://localhost:8000` to see the dashboard.

### Manual Setup
1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Copy `.env.example` to `.env` and configure it (the defaults work out of the box).
3. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Running Tests
To verify failover, throttling, and empty-response guards against our mock source server, run:
```bash
pytest tests/
```

---

## Project Overview

This project was built as a portfolio/demo to demonstrate robust scraping and pipeline engineering. 

### 1. Detection Surface
We interact exclusively with public, unauthenticated, ToS-friendly JSON APIs (Primary: RemoteOK, Fallback: Arbeitnow). We do not log into, authenticate against, or scrape pages behind any login walls.

### 2. Ingestion Strategy
The ingestion is driven by an in-process `APScheduler` loop running every 30 minutes. It orchestrates a cycle that queries a `HealthTracker` to find the most optimal source, utilizes a `ThrottleManager` to respect API limits (with exponential backoffs on `429`s), fetches the payload, normalizes it to a canonical `Job` schema, deduplicates based on a `content_hash`, and stores it.

### 3. Resilience
- **Failover:** If a source fails consecutively 3 times, it's marked as `down` and traffic routes to a fallback source automatically.
- **Empty Response Guard:** If an endpoint returns an HTTP 200 but an empty list, it's treated as a soft failure with an immediate retry, rather than assuming no jobs exist.
- **Adaptive Re-anchoring (Tested):** While the demo endpoints are JSON, we prove out Scrapling's adaptive selector matching (`auto_save=True`, `adaptive=True`) in our tests against a local HTTP server that simulates structural markup changes, validating that the pipeline can recover even if a site is redesigned overnight.

### 4. Where We Stop
- We do not run JavaScript to bypass bot protection.
- We do not handle CAPTCHAs, proxies, or credential storage.
- We do not attempt to bypass `robots.txt` where it's explicitly hostile. We adhere to conservative scraping practices focused on public, available data.
