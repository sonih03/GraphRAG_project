import logging
import asyncio
import time
from typing import List, Dict, Any, Tuple
from fastembed import TextEmbedding
from evaluation.config import eval_settings
from evaluation.database import db
from evaluation.kiwi_router import kiwi_router
from evaluation.neo4j_search import neo4j_search
from evaluation.reranker import reranker
from evaluation.cache_service import cache_service

logger = logging.getLogger("evaluation.pipeline")

class Embedder:
    def __init__(self):
        self._model = None

    def get_model(self) -> TextEmbedding:
        if self._model is None:
            model_name = eval_settings.EMBEDDING_MODEL
            logger.info(f"Loading CPU-optimized embedding model: '{model_name}'...")
            self._model = TextEmbedding(model_name=model_name)
        return self._model

    def embed_sync(self, text: str) -> List[float]:
        model = self.get_model()
        embeddings = list(model.embed([text]))
        return embeddings[0].tolist()

    async def embed(self, text: str) -> List[float]:
        return await asyncio.to_thread(self.embed_sync, text)

embedder = Embedder()

class HybridGraphRAGPipeline:
    async def initialize(self):
        """Initializes fulltext and vector indexes in Neo4j."""
        await neo4j_search.initialize_search_indexes()

    async def get_mutatis_neighbors(self, article_ids: List[str]) -> Dict[str, List[Dict[str, Any]]]:
        """
        Queries Neo4j for MUTATIS_MUTANDIS (준용) relationships of multiple base articles in a single call.
        """
        driver = db.get_neo4j_driver()
        query = """
        MATCH (a:Article) WHERE a.id IN $article_ids
        OPTIONAL MATCH (a)-[r:MUTATIS_MUTANDIS]-(neighbor:Article)
        RETURN a.id AS base_id, 
               neighbor.id AS id, 
               neighbor.name AS name, 
               neighbor.fullText AS fullText
        """
        
        neighbors_map: Dict[str, List[Dict[str, Any]]] = {aid: [] for aid in article_ids}
        try:
            async with driver.session() as session:
                result = await session.run(query, article_ids=article_ids)
                async for record in result:
                    base_id = record["base_id"]
                    n_id = record["id"]
                    if n_id:
                        # Append neighbor info
                        neighbors_map[base_id].append({
                            "id": n_id,
                            "name": record["name"] or "",
                            "fullText": record["fullText"] or ""
                        })
        except Exception as e:
            logger.error(f"Failed to fetch Mutatis Mutandis relationships: {e}")
        return neighbors_map

    def synthesize_context(self, article: Dict[str, Any], neighbors: List[Dict[str, Any]]) -> str:
        """
        Standardizes the markdown synthesis representation of main and mutatis mutandis articles.
        Format:
        [기준 조문: 제{ID}조 (이름)] ...본문...
        └── [준용 관련 조문: 제{ID}조 (이름)] ...본문...
        """
        base_name = article.get("name", "")
        base_id = article.get("id", "")
        # Standardize ID prefix extraction
        base_num = base_id.split("-")[-1] if "-" in base_id else base_id
        
        context = f"[기준 조문: 제{base_num}조 ({base_name})]\n{article.get('fullText', '').strip()}"
        
        for neighbor in neighbors:
            n_name = neighbor.get("name", "")
            n_id = neighbor.get("id", "")
            n_num = n_id.split("-")[-1] if "-" in n_id else n_id
            
            context += f"\n└── [준용 관련 조문: 제{n_num}조 ({n_name})]\n    {neighbor.get('fullText', '').strip()}"
            
        return context

    async def execute_search(self, query: str) -> Dict[str, Any]:
        """
        Runs the full 3-Tier Hybrid GraphRAG Retrieval pipeline.
        Returns matched articles, synthesized context, and latency metrics.
        """
        start_time = time.perf_counter()
        
        # --- 0. Cache Lookup ---
        cache_key = f"rag_search:{query}"
        cached_result = await cache_service.get(cache_key)
        if cached_result is not None:
            logger.info(f"RAG search cache hit for query: '{query}'")
            cached_result["cache_hit"] = True
            cached_result["total_latency_ms"] = (time.perf_counter() - start_time) * 1000
            return cached_result

        # --- 1. Query Normalization & Kiwi Routing ---
        norm_result = await kiwi_router.route_and_normalize(query)
        normalized_text = norm_result["normalized_text"]
        lucene_query = norm_result["lucene_query"]

        # --- 2. Tier 1: Parallel Retrieval (Sparse & Dense) ---
        # Generate dense query vector
        vector_task = embedder.embed(normalized_text)
        # Sparse search task
        sparse_task = neo4j_search.sparse_search(lucene_query, top_k=20)
        
        # Run vector generation and sparse lookup concurrently
        query_vector, sparse_results = await asyncio.gather(vector_task, sparse_task)
        
        # Dense search
        dense_results = await neo4j_search.dense_search(query_vector, top_k=20)

        # --- 3. Tier 2: Rank Fusion & Graph Expansion ---
        # RRF fusion
        merged_candidates = reranker.compute_rrf(sparse_results, dense_results)
        
        # Limit candidates for Reranker and retrieve Graph Mutatis Mutandis relationships
        top_candidates = merged_candidates[:reranker.candidate_limit]
        candidate_ids = [c["id"] for c in top_candidates]
        
        neighbors_map = {}
        if candidate_ids:
            neighbors_map = await self.get_mutatis_neighbors(candidate_ids)

        # Expand context using standardized synthesis template
        expanded_candidates = []
        for doc in top_candidates:
            doc_id = doc["id"]
            neighbors = neighbors_map.get(doc_id, [])
            doc_copy = doc.copy()
            # Synthesize final markdown context for this node
            doc_copy["synthesized_context"] = self.synthesize_context(doc, neighbors)
            # Retain references
            doc_copy["mutatis_mutandis_relations"] = [n["id"] for n in neighbors]
            expanded_candidates.append(doc_copy)

        # --- 4. Tier 3: CPU-Optimized ONNX Reranking ---
        final_reranked = await reranker.rerank(query, expanded_candidates)

        total_latency_ms = (time.perf_counter() - start_time) * 1000
        
        # Primary matched node ID
        primary_match_id = final_reranked[0]["id"] if final_reranked else "KR-CIVIL-ART-13"

        # Synthesize overall context block from top nodes
        overall_context = "\n\n".join([doc["synthesized_context"] for doc in final_reranked[:3]])

        result = {
            "query": query,
            "normalized_query": norm_result,
            "primary_match_id": primary_match_id,
            "nodes": final_reranked,
            "synthesized_context": overall_context,
            "total_latency_ms": total_latency_ms,
            "cache_hit": False,
            "metrics": {
                "sparse_count": len(sparse_results),
                "dense_count": len(dense_results),
                "merged_count": len(merged_candidates),
                "routed_method": norm_result["method"],
                "timed_out": norm_result["timed_out"]
            }
        }

        # Cache result
        await cache_service.set(cache_key, result, expire_seconds=3600)
        return result

pipeline = HybridGraphRAGPipeline()
