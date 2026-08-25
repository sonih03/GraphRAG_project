import logging
import json
from typing import Optional, Any
from cachetools import TTLCache
from evaluation.database import db

logger = logging.getLogger("evaluation.cache_service")

class DoubleCacheService:
    def __init__(self, maxsize: int = 1000, ttl: int = 3600):
        # L2 local in-memory cache as fallback
        self._local_cache = TTLCache(maxsize=maxsize, ttl=ttl)

    async def get(self, key: str) -> Optional[Any]:
        """
        Attempts to read from L1 Redis cache.
        Falls back to L2 local cache on Redis failure.
        """
        # 1. Attempt Redis (L1)
        redis_client = await db.get_redis_client()
        if redis_client is not None:
            try:
                val = await redis_client.get(key)
                if val is not None:
                    logger.debug(f"[CACHE HIT] L1 Redis: {key}")
                    return json.loads(val)
            except Exception as e:
                logger.warning(f"[CACHE ERROR] Redis get failed, falling back to L2: {e}")

        # 2. Attempt Local In-Memory Cache (L2)
        if key in self._local_cache:
            logger.debug(f"[CACHE HIT] L2 In-Memory: {key}")
            return self._local_cache[key]

        logger.debug(f"[CACHE MISS]: {key}")
        return None

    async def set(self, key: str, value: Any, expire_seconds: int = 3600):
        """
        Writes to both L1 Redis cache and L2 local cache.
        If Redis is offline, writes only to L2.
        """
        # 1. Write to Local In-Memory Cache (L2)
        self._local_cache[key] = value

        # 2. Write to Redis (L1)
        redis_client = await db.get_redis_client()
        if redis_client is not None:
            try:
                serialized = json.dumps(value)
                await redis_client.set(key, serialized, ex=expire_seconds)
                logger.debug(f"[CACHE SET] L1 & L2: {key}")
            except Exception as e:
                logger.warning(f"[CACHE SET ERROR] Redis write failed: {e}")
        else:
            logger.debug(f"[CACHE SET] L2 Only (Redis offline): {key}")

cache_service = DoubleCacheService()
