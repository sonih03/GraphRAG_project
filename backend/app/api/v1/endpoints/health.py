from fastapi import APIRouter
from app.services.neo4j_service import neo4j_service

router = APIRouter()

@router.get("/health")
async def health_check():
    neo4j_healthy = neo4j_service.check_connection()
    return {
        "status": "online",
        "service": "GraphRAG Backend API",
        "database": {
            "neo4j": "connected" if neo4j_healthy else "disconnected"
        }
    }
