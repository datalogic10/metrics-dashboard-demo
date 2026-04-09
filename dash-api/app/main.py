"""dash-api: Generic query proxy for Postgres databases.

Serves as the backend for metrics-dashboard-demo, replacing the need for
Supabase PostgREST RPC when connecting to non-Supabase databases.
"""
# HOTRELOAD-SMOKETEST: verify watchfiles triggers on pull

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Header, HTTPException

from .config import API_SECRET
from .db import get_pool, close_all_pools
from .models import QueryRequest
from .query_builder import execute_query

logger = logging.getLogger("dash-api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not API_SECRET:
        logger.warning("DASH_API_SECRET is not set — API is running without authentication!")
    yield
    await close_all_pools()


# CORS is handled by Caddy reverse proxy — no CORSMiddleware here to avoid duplicate headers.
app = FastAPI(title="dash-api", lifespan=lifespan)


def _check_auth(authorization: str | None):
    if not API_SECRET:
        return  # no secret configured — logged at startup
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer" or parts[1] != API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API secret")


@app.post("/query")
async def query(request: QueryRequest, authorization: str | None = Header(None)):
    _check_auth(authorization)
    try:
        pool = await get_pool(request.connection)
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Unknown connection: '{request.connection}'")
    result = await execute_query(pool, request)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.get("/health")
async def health():
    return {"status": "ok"}
