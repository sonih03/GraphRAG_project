import math
import logging
from typing import List, Dict, Any, Set
from evaluation.database import db

logger = logging.getLogger("evaluation.metrics")

class MetricsCalculator:
    @staticmethod
    def calculate_hit_rate(retrieved_ids: List[str], expected_id: str, k: int) -> float:
        """Returns 1.0 if expected_id is in the top-K retrieved IDs, else 0.0."""
        top_k = retrieved_ids[:k]
        return 1.0 if expected_id in top_k else 0.0

    @staticmethod
    def calculate_mrr(retrieved_ids: List[str], expected_id: str) -> float:
        """Returns 1 / rank (1-indexed) if expected_id is found, else 0.0."""
        for rank, rid in enumerate(retrieved_ids):
            if rid == expected_id:
                return 1.0 / (rank + 1)
        return 0.0

    @staticmethod
    def calculate_ndcg(retrieved_ids: List[str], expected_id: str, k: int) -> float:
        """
        Calculates NDCG@K for binary relevance (1 if matches expected_id, 0 otherwise).
        Since there is only one expected item, IDCG is always 1.0 (at rank 1).
        Formula: DCG = 1 / log2(rank + 1). NDCG = DCG / IDCG = 1 / log2(rank + 1).
        """
        top_k = retrieved_ids[:k]
        for rank, rid in enumerate(top_k):
            if rid == expected_id:
                # math.log2(2) = 1.0, math.log2(3) = 1.58...
                return 1.0 / math.log2(rank + 2)
        return 0.0

    @staticmethod
    async def get_expected_neighbors(expected_id: str) -> Set[str]:
        """Queries Neo4j for the actual MUTATIS_MUTANDIS neighbors of the expected article."""
        driver = db.get_neo4j_driver()
        query = """
        MATCH (a:Article {id: $expected_id})-[r:MUTATIS_MUTANDIS]-(neighbor:Article)
        RETURN neighbor.id AS id
        """
        neighbors = set()
        try:
            async with driver.session() as session:
                result = await session.run(query, expected_id=expected_id)
                async for record in result:
                    neighbors.add(record["id"])
        except Exception as e:
            logger.error(f"Failed to fetch ground truth neighbors for GTCR: {e}")
        return neighbors

    @classmethod
    async def calculate_gtcr(cls, retrieved_context_node_ids: List[str], expected_id: str) -> float:
        """
        Calculates Graph Traversal Coverage Ratio (GTCR).
        Formula: (Number of expected neighbors present in retrieved context) / (Total expected neighbors)
        """
        expected_neighbors = await cls.get_expected_neighbors(expected_id)
        if not expected_neighbors:
            # If the expected node has no 준용 relationships, return 1.0 (perfect coverage of 0 items)
            return 1.0

        retrieved_set = set(retrieved_context_node_ids)
        intersection = expected_neighbors.intersection(retrieved_set)
        
        ratio = len(intersection) / len(expected_neighbors)
        logger.debug(f"GTCR for {expected_id}: {len(intersection)}/{len(expected_neighbors)} matched -> {ratio:.2f}")
        return ratio
