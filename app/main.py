import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager

from app.storage.db import init_db
from app.api.routes import router
from app.scheduler import start_scheduler, stop_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    start_scheduler()
    yield
    stop_scheduler()

app = FastAPI(title="Job Scraper", lifespan=lifespan)

# Register API endpoints
app.include_router(router)

# Determine base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
frontend_dist = os.path.join(BASE_DIR, "frontend", "dist")
frontend_assets = os.path.join(frontend_dist, "assets")
static_dir = os.path.join(BASE_DIR, "static")

# Mount assets directory if present
if os.path.exists(frontend_assets):
    app.mount("/assets", StaticFiles(directory=frontend_assets), name="assets")

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def serve_index():
    dist_index = os.path.join(frontend_dist, "index.html")
    if os.path.exists(dist_index):
        return FileResponse(dist_index)
    
    fallback_index = os.path.join(static_dir, "index.html")
    if os.path.exists(fallback_index):
        return FileResponse(fallback_index)
    
    return {"message": "Job Scraper API is running. Build frontend/ or check endpoints."}

# Catch-all route for Single Page Application (SPA) routing
@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    # Ignore API routes
    if full_path.startswith("jobs") or full_path.startswith("health") or full_path.startswith("ingest"):
        return {"error": "Endpoint not found"}
        
    dist_index = os.path.join(frontend_dist, "index.html")
    if os.path.exists(dist_index):
        return FileResponse(dist_index)
        
    fallback_index = os.path.join(static_dir, "index.html")
    if os.path.exists(fallback_index):
        return FileResponse(fallback_index)
        
    return {"message": "Job Scraper API is running."}
