import sys
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure 'backend' directory is always in sys.path for absolute imports
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import settings
from app.core.logging import logger
from app.api.v1.router import api_router
from app.models.query import QueryRequest
from app.api.v1.endpoints.graph import query_graphrag
from app.services.neo4j_service import neo4j_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting {settings.PROJECT_NAME} backend service...")
    yield
    # Shutdown
    neo4j_service.close()
    logger.info(f"Shutting down {settings.PROJECT_NAME} backend service...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

# Root-level /api/query alias
@app.post("/api/query")
async def root_query_graphrag(request: QueryRequest):
    return await query_graphrag(request)

@app.get("/health")
async def root_health():
    neo4j_ok = neo4j_service.check_connection()
    return {"status": "online", "neo4j_connected": neo4j_ok}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
