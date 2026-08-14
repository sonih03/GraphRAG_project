from fastapi import APIRouter
from app.api.v1.endpoints import health, graph

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(graph.router, prefix="/graph", tags=["Graph"])
