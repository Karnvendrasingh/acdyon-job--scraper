# AcdyOn-scraper (Job Scraper)

> **Acdyon Technologies Engineering Challenge — Part 1 (Data Ingestion Track)**  
> A resilient job-listing ingestion pipeline that pulls postings from public job APIs on a 30-minute schedule, survives source failures with automatic circuit breakers, and serves results over a high-performance API and dynamic Cyber UI dashboard.

---

## 📄 Architectural Design & Engineering Decisions

For full technical analysis of anti-bot detection surfaces, ingestion strategies, failover circuit breakers, resilience guards, ethical boundaries, and written question responses, see **[DECISIONS.md](file:///d:/job-radar/scraper/DECISIONS.md)**.

---

## 🚀 Deployment Options

### Option 1: Render Deployment (Recommended)

1. Fork or push this repository to GitHub: `https://github.com/Karnvendrasingh/AcdyOn-scraper.git`
2. Create a new **Web Service** on [Render](https://render.com).
3. Select **Docker** environment (or use `render.yaml` Blueprint).
4. Render automatically detects the multi-stage [`Dockerfile`](file:///d:/job-radar/scraper/Dockerfile), builds the Vite React frontend, sets up Python 3.11, and starts the server with the dynamic `$PORT`.

### Option 2: Docker Compose (Local or VPS)

Run the entire application stack (Frontend + Backend + SQLite Ingestion Engine) with Docker Compose:

```bash
docker compose up --build -d
```

Navigate to **`http://localhost:8005`** to view the live dashboard.

---

## ⚡ Local Setup (Without Docker)

### 1. Python Virtual Environment & Dependencies
```powershell
# Create & activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Copy default environment configuration
cp .env.example .env
```

### 2. Build Frontend (React + Vite)
```powershell
cd frontend
npm install
npm run build
cd ..
```

### 3. Run Application Server
```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8005
```

Navigate to **`http://127.0.0.1:8005/`** to view the live dashboard and telemetry drawer.

---

## 🧪 Automated Test Suite

To verify circuit-breaker failover, rate throttling, empty-response guards, and Scrapling adaptive element re-anchoring against isolated mock servers:

```powershell
python -m pytest tests/
```

- `test_router_failover.py`: Verifies automatic fallback to secondary source after 3 consecutive failures.
- `test_adaptive_reanchor.py`: Verifies Scrapling element selector re-anchoring across HTML markup redesigns.
- `test_empty_response_guard.py`: Verifies soft-fail handling on HTTP 200 OK empty array responses.

---

## 🏗️ Architecture Overview

```
                      [APScheduler Loop (30-min Tick)]
                                     │
                                     ▼
                          [HealthTracker Router]
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
   [RemoteOK (Primary Source)]                [Arbeitnow (Fallback Source)]
   (Consec. Failures < 3)                    (Triggered if Primary Down)
              │                                         │
              └────────────────────┬────────────────────┘
                                   │
                        [ThrottleManager Check]
                        (Dynamic Delay / 429 Guard)
                                   │
                                   ▼
                        [Scrapling FetcherSession]
                                   │
                                   ▼
                       [Canonical Job Normalizer]
                                   │
                  [Content-Hash SHA-256 Deduplication]
                                   │
                                   ▼
                        [SQLite Storage & Telemetry]
```

### Core Components
1. **HealthTracker Circuit Breaker**: Tracks consecutive failures per source. Automatically routes traffic away from degraded endpoints.
2. **ThrottleManager**: Respects rate limits, applies exponential backoff on HTTP 429s, and extracts `Retry-After` headers.
3. **Scrapling Engine**: Uses browser-forge profiles to bypass basic TLS/JA3 fingerprinting.
4. **Content Hash Deduplication**: Generates a deterministic SHA-256 digest to prevent duplicate listings.
5. **Telemetry Dashboard**: Provides live visibility into source health, execution times, and job yields at `/ingest/status`.
