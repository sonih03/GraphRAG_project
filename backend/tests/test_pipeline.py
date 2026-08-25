import pytest
import asyncio
from evaluation.config import eval_settings
from evaluation.database import db
from evaluation.kiwi_router import kiwi_router
from evaluation.neo4j_search import neo4j_search
from evaluation.reranker import reranker
from evaluation.cache_service import cache_service
from evaluation.pipeline import pipeline

# Configure pytest-asyncio to run tests in the event loop
pytestmark = pytest.mark.asyncio

async def test_database_connections():
    """Verify Neo4j async driver can be obtained."""
    driver = db.get_neo4j_driver()
    assert driver is not None
    
    # Check if redis client can be fetched (can be None if Redis server is down, which is expected/fallback)
    redis_client = await db.get_redis_client()
    # No assertion on Redis presence since it could be run on offline runner
    logger_msg = "Redis client verified" if redis_client else "Redis offline, using memory cache fallback"
    print(f"\n[DB TEST] {logger_msg}")

async def test_cache_fallback():
    """Verify caching works in-memory if Redis is offline."""
    test_key = "test_key_abc"
    test_val = {"articles": ["123", "456"], "confidence": 0.99}
    
    # Store value
    await cache_service.set(test_key, test_val, expire_seconds=10)
    
    # Retrieve value
    retrieved = await cache_service.get(test_key)
    assert retrieved == test_val
    print("\n[CACHE TEST] Caching set and get verified successfully.")

async def test_kiwi_router_ratio():
    """Verify Kiwi router tokenizes and calculates legal noun ratio."""
    # Test query with high legal keywords
    legal_query = "소유물방해제거청구의 소멸시효에 대해 설명해주세요"
    await kiwi_router.initialize()
    
    ratio = kiwi_router.get_legal_word_ratio(legal_query)
    # Ratio should be > 0.0 because of added custom vocabulary
    assert ratio > 0.0
    print(f"\n[KIWI TEST] Legal query ratio calculated: {ratio:.2f}")

async def test_normalizer_mock_or_real():
    """Verify normalizer model configurations."""
    assert eval_settings.EMBEDDING_MODEL is not None
    assert eval_settings.RERANKER_MODEL is not None

async def test_rrf_calculation():
    """Verify RRF fusion logic."""
    sparse_res = [{"id": "ArtA", "score": 2.0}, {"id": "ArtB", "score": 1.5}]
    dense_res = [{"id": "ArtB", "score": 0.9}, {"id": "ArtA", "score": 0.8}]
    
    merged = reranker.compute_rrf(sparse_res, dense_res)
    assert len(merged) == 2
    # ArtA and ArtB must have RRF scores
    assert "rrf_score" in merged[0]
    print(f"\n[RRF TEST] Combined documents: {[doc['id'] for doc in merged]}")

async def test_synthesize_context_format():
    """Verify Mutatis Mutandis synthesis format styling."""
    article = {"id": "KR-CIVIL-ART-139", "name": "무효행위의 추인", "fullText": "무효인 법률행위는..."}
    neighbors = [{"id": "KR-CIVIL-ART-138", "name": "무효행위의 전환", "fullText": "무효인 법률행위가..."}]
    
    synthesized = pipeline.synthesize_context(article, neighbors)
    assert "[기준 조문: 제139조 (무효행위의 추인)]" in synthesized
    assert "└── [준용 관련 조문: 제138조 (무효행위의 전환)]" in synthesized
    print("\n[SYNTHESIS TEST] Mutatis Mutandis context layout formatting verified.")
