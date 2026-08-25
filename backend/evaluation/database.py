import logging
from typing import Optional
from neo4j import AsyncGraphDatabase, AsyncDriver
from redis.asyncio import Redis
from app.core.config import settings as app_settings
from evaluation.config import eval_settings

logger = logging.getLogger("evaluation.database")

class EvaluationDatabase:
    def __init__(self):
        self._neo4j_driver: Optional[AsyncDriver] = None
        self._redis_client: Optional[Redis] = None

    def get_neo4j_driver(self) -> AsyncDriver:
        if self._neo4j_driver is None:
            try:
                self._neo4j_driver = AsyncGraphDatabase.driver(
                    app_settings.NEO4J_URI,
                    auth=(app_settings.NEO4J_USER, app_settings.NEO4J_PASSWORD)
                )
                logger.info("Connected to Neo4j database (Async)")
            except Exception as e:
                logger.error(f"Failed to connect to Neo4j: {e}")
                raise e
        return self._neo4j_driver

    async def get_redis_client(self) -> Optional[Redis]:
        if self._redis_client is None:
            try:
                # Set socket_timeout to ensure quick fallback when Redis is offline
                client = Redis(
                    host=eval_settings.REDIS_HOST,
                    port=eval_settings.REDIS_PORT,
                    password=eval_settings.REDIS_PASSWORD,
                    socket_timeout=1.0,
                    socket_connect_timeout=1.0,
                    decode_responses=True
                )
                # Ping redis to verify active connection
                await client.ping()
                self._redis_client = client
                logger.info("Connected to Redis server successfully")
            except Exception as e:
                logger.warning(f"Redis is unavailable, fallback cache will be used: {e}")
                self._redis_client = None
        return self._redis_client

    async def close(self):
        if self._neo4j_driver is not None:
            await self._neo4j_driver.close()
            self._neo4j_driver = None
            logger.info("Closed Neo4j Async connection")
        if self._redis_client is not None:
            await self._redis_client.aclose()
            self._redis_client = None
            logger.info("Closed Redis connection")

db = EvaluationDatabase()
