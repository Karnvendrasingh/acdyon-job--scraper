# DECISIONS.md — Job Scraper Design & Architecture

**Candidate Track:** Part 1 — Getting Data Out of a Platform That Doesn't Want You To  
**Project:** Job Scraper  
**Stack:** Python 3.13, FastAPI, Scrapling, SQLModel / SQLite, APScheduler, React 18, Vite  

---

## 1. Detection Surface & Countermeasures

| Detection Vector | How Anti-Bot Systems Detect Automation | Our Engineering Countermeasure |
| :--- | :--- | :--- |
| **Fingerprinting (TLS/JA3)** | SSL/TLS handshake cipher suite order & HTTP/2 SETTINGS frame signatures reveal headless Python/Node clients (e.g. `requests` / `axios`). | Powered by **Scrapling Fetchers** (`curl_cffi` / `browserforge`) to mimic real browser TLS fingerprints and HTTP/2 headers. |
| **Request Headers & Leaks** | Missing `sec-ch-ua`, `accept-language`, or generic `User-Agent` strings trigger instant WAF/Cloudflare bot challenge. | Contextual browser header synthesis with realistic browser headers and referer headers. |
| **Request Velocity & Timing** | Fixed-interval HTTP requests (e.g. exactly every 60s) trigger statistical rate-limit alarms. | `ThrottleManager` adds Poisson-jittered delay padding and respects `Retry-After` HTTP headers dynamically. |
| **Behavioral & Identity** | Unauthenticated automated clients requesting protected endpoints without session history or cookies. | Scope-restricted to public, unauthenticated APIs/feeds without touching login walls or cookie consent traps. |

---

## 2. Ingestion Strategy & Circuit Breaker Architecture

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
                        [Empty-Response Guard Check]
                                    │
                        [Canonical Job Normalizer]
                                    │
                   [Content-Hash SHA-256 Deduplication]
                                    │
                                    ▼
                         [SQLite Storage & Telemetry]
```

### Ingestion & Rotation Strategy
- **Primary vs Fallback Routing**: The pipeline routes network requests through a central `HealthTracker` circuit breaker. If the primary source (`RemoteOK`) suffers 3 consecutive network failures or anti-bot blocks, it is automatically marked as `down` and traffic routes immediately to the fallback source (`Arbeitnow`).
- **Pacing**: Requests pass through a `ThrottleManager` enforcing base delays and dynamic exponential backoff upon encountering HTTP 429 status codes.
- **Plan B when Primary Source gets Shut Down**:
  - *Tier 1 (Current)*: Automatic fallback to secondary public API/RSS feeds.
  - *Tier 2 (Plan B)*: Headless browser integration using TLS-fingerprint spoofing and browser-forge profiles.
  - *Tier 3 (Plan C)*: Residential proxy pool IP rotation (e.g., BrightData / SmartProxy) combined with dynamic session cookie generation.

---

## 3. Pipeline Resilience & Edge-Case Guards

1. **Overnight Structural Markup Changes**:
   - In HTML scraping mode, Scrapling utilizes **Adaptive Selector Matching** (`adaptive=True`). If a target element's class or ID changes overnight, Scrapling evaluates element tree similarity score to re-anchor selectors without throwing `AttributeError`. (Verified in `tests/test_adaptive_reanchor.py`).
2. **Rate Limiting & 429 Traps**:
   - The `ThrottleManager` traps HTTP 429 responses, parses standard `Retry-After` headers, and enforces exponential backoff delays instead of blindly retrying and burning IPs.
3. **Empty Response Guard (HTTP 200 `[]`)**:
   - Anti-bot systems often return HTTP 200 OK with empty payloads `[]` to trick scrapers into thinking no data exists. Our pipeline traps empty responses as soft failures, performs an immediate retry, and logs telemetry without purging database records. (Verified in `tests/test_empty_response_guard.py`).

---

## 4. Ethical Boundaries & Scope Guardrail ("Where We Stop")

- **No Authenticated Scraping**: We do not log into, bypass credentials for, or extract data from gated platforms (e.g. LinkedIn, Indeed, Naukri login portals).
- **No Hostile Bot-Wall Bypassing**: We do not attempt to bypass CAPTCHAs, Cloudflare Turnstile, or paywalled networks.
- **Public Data Only**: We strictly ingest unauthenticated, public JSON APIs/RSS feeds with conservative request rates, adhering to public data guidelines and respecting `robots.txt`.

---

## Written Explanation & Architectural Trade-offs

### 1. Why this ingestion strategy over the obvious alternative rejected?
**Rejected Alternative**: Spawning headless Playwright/Selenium browsers to scrape single-page web apps like LinkedIn or Indeed directly.  
**Why Rejected**: Headless browsers consume high CPU/memory, leak Chromium CDP signatures, trigger JA3/TLS fingerprint blocks, and risk IP bans. In contrast, leveraging public API/RSS ingestion with Scrapling TLS spoofing, rate throttling, and a circuit-breaker failover router provides a deterministic, lightweight, fast, and resilient system that runs indefinitely without maintenance overhead.

### 2. Trade-offs under time limit vs. A real production week
- **Current Trade-off**: Used an in-process `APScheduler` loop, local SQLite database (`jobs.db`), and in-memory state tracking for simplicity and self-contained execution.
- **With a Real Week**:
  - Replace SQLite with PostgreSQL / Supabase and Redis for distributed locking.
  - Upgrade `APScheduler` to a distributed task queue (Celery / Temporal).
  - Add residential proxy IP rotation middleware.
  - Add webhook notifications (Slack/Discord alerts) when circuit breakers trip.

### 3. AI Tool Usage & Personal Verification
- **AI Usage**: Used AI (Antigravity AI) for scaffolding Vite + React UI components, styling glassmorphism layout CSS, and generating mock server test fixtures.
- **Personal Verification & Modifications**:
  - Debugged and fixed Python 3.13 venv path incompatibility on Windows.
  - Resolved `pytest` import module paths (`PYTHONPATH=.`).
  - Handled socket port collisions by migrating the backend server to port 8005 when port 8000 was bound.
  - Audited `HealthTracker` consecutive failure counter math and SQLModel session commit logic line-by-line to ensure absolute reliability.
