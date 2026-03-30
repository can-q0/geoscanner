from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import API_SECRET_KEY, FRONTEND_URL
from database import get_pool, close_pool
from routers import scan, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    yield
    await close_pool()


app = FastAPI(title="GEO Scanner Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def verify_api_key(request: Request, call_next):
    if request.url.path == "/health":
        return await call_next(request)
    api_key = request.headers.get("x-api-key")
    if api_key != API_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return await call_next(request)


app.include_router(health.router)
app.include_router(scan.router, prefix="/scan")
