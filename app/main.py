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

app.include_router(router)

frontend_dist = os.path.join("frontend", "dist")
if os.path.exists(os.path.join(frontend_dist, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def serve_index():
    dist_index = os.path.join(frontend_dist, "index.html")
    if os.path.exists(dist_index):
        return FileResponse(dist_index)
    return FileResponse(os.path.join("static", "index.html"))
