import logging
import asyncio
from typing import List, Dict, Any
from fastembed.rerank.cross_encoder import TextCrossEncoder
from evaluation.config import eval_settings

logger = logging.getLogger("evaluation.reranker")

class Reranker:
    def __init__(self, k: int = 60, candidate_limit: int = 10):
        self.k = k
        self.candidate_limit = candidate_limit
        self._reranker_model = None

    def _get_model(self) -> TextCrossEncoder:
        if self._reranker_model is None:
            model_name = eval_settings.RERANKER_MODEL
            logger.info(f"Loading CPU-optimized ONNX Reranker: '{model_name}'...")
            # FastEmbed automatically downloads and optimizes the model for CPU via ONNX Runtime
            self._reranker_model = TextCrossEncoder(model_name=model_name)
        return self._reranker_model

    def compute_rrf(self, sparse_results: List[Dict[str, Any]], dense_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Applies Reciprocal Rank Fusion (RRF) to merge Sparse and Dense search results.
        Formula: score = 1 / (k + rank_sparse) + 1 / (k + rank_dense)
        """
        scores: Dict[str, float] = {}
        doc_map: Dict[str, Dict[str, Any]] = {}

        # 1. Process Sparse rankings
        for rank, doc in enumerate(sparse_results):
            doc_id = doc["id"]
            doc_map[doc_id] = doc
            scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (self.k + rank + 1))

        # 2. Process Dense rankings
        for rank, doc in enumerate(dense_results):
            doc_id = doc["id"]
            # If doc not in map, save it (prefers sparse properties if present, but they are identical)
            if doc_id not in doc_map:
                doc_map[doc_id] = doc
            scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (self.k + rank + 1))

        # 3. Sort by RRF score descending
        sorted_ids = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        merged_results = []
        for doc_id, rrf_score in sorted_ids:
            doc = doc_map[doc_id].copy()
            doc["rrf_score"] = rrf_score
            merged_results.append(doc)
            
        logger.debug(f"Merged {len(merged_results)} unique docs using RRF (k={self.k})")
        return merged_results

    def _rerank_sync(self, query: str, candidate_docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Synchronous CPU reranker execution via fastembed."""
        model = self._get_model()
        
        # Prepare text content list to score
        # BGE Reranker scores queries against candidate document texts.
        # We concatenate title (name), summary, and fullText for best context.
        candidate_texts = []
        for doc in candidate_docs:
            text_context = f"{doc.get('name', '')} {doc.get('summary', '')} {doc.get('fullText', '')}".strip()
            candidate_texts.append(text_context)

        # Call FastEmbed Reranker (returns a generator of score dictionaries/objects)
        # Note: In fastembed, rerank returns elements containing score and index/text
        results_gen = model.rerank(query, candidate_texts)
        scores_list = list(results_gen)
        
        # In fastembed, scores_list looks like list of objects containing 'score' attribute
        # Let's map scores back to candidate_docs
        reranked_results = []
        for item, doc in zip(scores_list, candidate_docs):
            score = float(item.score) if hasattr(item, "score") else float(item)
            doc_copy = doc.copy()
            doc_copy["rerank_score"] = score
            reranked_results.append(doc_copy)

        # Sort by rerank_score descending
        reranked_results.sort(key=lambda x: x.get("rerank_score", -99.0), reverse=True)
        return reranked_results

    async def rerank(self, query: str, candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Reranks the top-N candidate documents using the CPU-optimized ONNX Cross-Encoder model.
        Runs inside asyncio.to_thread to keep API execution non-blocking.
        """
        # Limit candidate count to top-N (e.g. 10) to control CPU latency under SLA
        target_candidates = candidates[:self.candidate_limit]
        if not target_candidates:
            return []

        logger.debug(f"Reranking top {len(target_candidates)} candidates via ONNX cross-encoder...")
        try:
            reranked = await asyncio.to_thread(self._rerank_sync, query, target_candidates)
            return reranked
        except Exception as e:
            logger.error(f"ONNX Reranker execution failed: {e}. Falling back to RRF rankings.")
            return target_candidates

reranker = Reranker()
