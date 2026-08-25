import asyncio
import logging
import time
import re
import sys
import os
import pandas as pd
from typing import List, Dict, Any, Tuple

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from evaluation.database import db
from evaluation.dataset import load_dataset
from evaluation.metrics import MetricsCalculator
from evaluation.pipeline import pipeline
from evaluation.neo4j_search import neo4j_search

# Configure logging to stdout
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("evaluation.runner")

async def run_baseline_pipeline(query: str) -> Tuple[List[str], float]:
    """
    Baseline retrieval: splits raw query words and runs simple Lucene fulltext search.
    No query normalization, no vector indexing, no reranking, and no graph expansion.
    """
    start_time = time.perf_counter()
    
    # Split query into keywords (standard string tokenizer)
    words = [w.strip() for w in re.split(r'[\s,\.\?\!]+', query) if len(w.strip()) >= 2]
    
    # Simple Lucene OR query
    if not words:
        words = ["제13조"] # Default fallback
    lucene_query = " OR ".join(words)
    
    # Search Neo4j fulltext index (top 10 candidates)
    docs = await neo4j_search.sparse_search(lucene_query, top_k=10)
    retrieved_ids = [doc["id"] for doc in docs]
    
    latency_ms = (time.perf_counter() - start_time) * 1000
    return retrieved_ids, latency_ms

async def evaluate_single_query(item: Dict[str, Any], semaphore: asyncio.Semaphore) -> Dict[str, Any]:
    async with semaphore:
        qid = item["id"]
        raw_query = item["raw_query"]
        expected_id = item["expected_article_id"]
        
        logger.info(f"[Test Case {qid}] Query: '{raw_query}' (Expected Target: {expected_id})")

        # --- Baseline Execution ---
        baseline_ids, baseline_lat = await run_baseline_pipeline(raw_query)
        
        # Calculate baseline metrics
        b_hit_1 = MetricsCalculator.calculate_hit_rate(baseline_ids, expected_id, 1)
        b_hit_3 = MetricsCalculator.calculate_hit_rate(baseline_ids, expected_id, 3)
        b_mrr = MetricsCalculator.calculate_mrr(baseline_ids, expected_id)
        b_ndcg = MetricsCalculator.calculate_ndcg(baseline_ids, expected_id, 3)
        b_gtcr = await MetricsCalculator.calculate_gtcr(baseline_ids, expected_id)

        # --- Proposed Execution ---
        prop_res = await pipeline.execute_search(raw_query)
        prop_ids = [n["id"] for n in prop_res["nodes"]]
        prop_lat = prop_res["total_latency_ms"]
        timed_out = prop_res["metrics"]["timed_out"]
        routed_method = prop_res["metrics"]["routed_method"]
        cost = prop_res.get("normalized_query", {}).get("cost_usd", 0.0)
        
        # Calculate proposed metrics
        p_hit_1 = MetricsCalculator.calculate_hit_rate(prop_ids, expected_id, 1)
        p_hit_3 = MetricsCalculator.calculate_hit_rate(prop_ids, expected_id, 3)
        p_mrr = MetricsCalculator.calculate_mrr(prop_ids, expected_id)
        p_ndcg = MetricsCalculator.calculate_ndcg(prop_ids, expected_id, 3)
        
        # Proposed retrieved_ids includes expanded context neighbors
        retrieved_context_ids = []
        for n in prop_res["nodes"]:
            retrieved_context_ids.append(n["id"])
            retrieved_context_ids.extend(n.get("mutatis_mutandis_relations", []))
            
        p_gtcr = await MetricsCalculator.calculate_gtcr(retrieved_context_ids, expected_id)

        logger.info(f" -> Baseline (Sparse): Hit@3={b_hit_3:.0f} | Latency={baseline_lat:.1f}ms")
        logger.info(f" -> Proposed (Hybrid): Hit@3={p_hit_3:.0f} | Latency={prop_lat:.1f}ms | Routed={routed_method} | Timeout={timed_out}")

        return {
            "id": qid,
            "query": raw_query,
            "expected_id": expected_id,
            # Baseline metrics
            "b_hit_1": b_hit_1,
            "b_hit_3": b_hit_3,
            "b_mrr": b_mrr,
            "b_ndcg": b_ndcg,
            "b_gtcr": b_gtcr,
            "b_latency": baseline_lat,
            # Proposed metrics
            "p_hit_1": p_hit_1,
            "p_hit_3": p_hit_3,
            "p_mrr": p_mrr,
            "p_ndcg": p_ndcg,
            "p_gtcr": p_gtcr,
            "p_latency": prop_lat,
            "cost_usd": cost,
            "timed_out": timed_out,
            "routed": routed_method
        }


async def run_benchmark(csv_path: str = ""):
    logger.info("================================================================================")
    logger.info("   🏁 GraphRAG RAG 3-Tier Hybrid Search Benchmark Runner (Parallel)")
    logger.info("================================================================================")

    # 1. Initialize Pipeline and Indexes
    await pipeline.initialize()
    
    # 2. Load dataset
    dataset = load_dataset(csv_path)
    if not dataset:
        logger.error("Empty evaluation dataset. Exiting.")
        return

    # 3. Iterate through queries concurrently with a Semaphore of 5
    semaphore = asyncio.Semaphore(5)
    tasks = [evaluate_single_query(item, semaphore) for item in dataset]
    results = await asyncio.gather(*tasks)
    
    # Sort results by the numeric part of the ID (e.g. Q1, Q2, ..., Q50)
    try:
        results.sort(key=lambda x: int(re.search(r"\d+", x["id"]).group()))
    except Exception:
        pass # Fallback if ID is not in standard Q{N} format
        
    total_cost_usd = sum(res["cost_usd"] for res in results)

    # 4. Generate Summaries via Pandas DataFrame
    df = pd.DataFrame(results)

    # 5. Output Markdown Summary Table
    print("\n\n" + "="*80)
    print("                 BENCHMARK PERFORMANCE COMPARISON TABLE")
    print("="*80)
    
    # Format detailed table
    detailed_table_header = "| ID | Target | Baseline (Hit@3 / Lat) | Proposed (Hit@3 / Lat / Cost) | Method |"
    detailed_table_divider = "|:---|:---|:---|:---|:---|"
    print(detailed_table_header)
    print(detailed_table_divider)
    for res in results:
        b_str = f"{'Hit' if res['b_hit_3'] > 0 else 'Miss'} ({res['b_latency']:.1f}ms)"
        p_str = f"{'Hit' if res['p_hit_3'] > 0 else 'Miss'} ({res['p_latency']:.1f}ms) / ${res['cost_usd']:.6f}"
        method_str = f"{res['routed']}{' [TIMEOUT]' if res['timed_out'] else ''}"
        print(f"| {res['id']} | {res['expected_id'].split('-')[-1]} | {b_str} | {p_str} | {method_str} |")
    
    print("="*80)
    
    # Calculate average aggregations
    num_queries = len(results)
    b_avg_hit_1 = df["b_hit_1"].mean() * 100
    p_avg_hit_1 = df["p_hit_1"].mean() * 100
    b_avg_hit_3 = df["b_hit_3"].mean() * 100
    p_avg_hit_3 = df["p_hit_3"].mean() * 100
    
    b_avg_mrr = df["b_mrr"].mean()
    p_avg_mrr = df["p_mrr"].mean()
    
    b_avg_ndcg = df["b_ndcg"].mean()
    p_avg_ndcg = df["p_ndcg"].mean()
    
    b_avg_gtcr = df["b_gtcr"].mean() * 100
    p_avg_gtcr = df["p_gtcr"].mean() * 100
    
    b_p99_lat = df["b_latency"].quantile(0.99)
    p_p99_lat = df["p_latency"].quantile(0.99)
    
    print("                       SUMMARY STATISTICAL METRICS")
    print("="*80)
    print(f"| Metric (n={num_queries}) | Baseline (Old) | Proposed (3-Tier GraphRAG) | Delta |")
    print("|:---|:---|:---|:---|")
    print(f"| Average Hit Rate@1 | {b_avg_hit_1:.1f}% | {p_avg_hit_1:.1f}% | {p_avg_hit_1 - b_avg_hit_1:+.1f}% |")
    print(f"| Average Hit Rate@3 | {b_avg_hit_3:.1f}% | {p_avg_hit_3:.1f}% | {p_avg_hit_3 - b_avg_hit_3:+.1f}% |")
    print(f"| Mean Reciprocal Rank (MRR) | {b_avg_mrr:.3f} | {p_avg_mrr:.3f} | {p_avg_mrr - b_avg_mrr:+.3f} |")
    print(f"| Average NDCG@3 | {b_avg_ndcg:.3f} | {p_avg_ndcg:.3f} | {p_avg_ndcg - b_avg_ndcg:+.3f} |")
    print(f"| Graph Traversal Coverage (GTCR) | {b_avg_gtcr:.1f}% | {p_avg_gtcr:.1f}% | {p_avg_gtcr - b_avg_gtcr:+.1f}% |")
    print(f"| P99 Latency (ms) | {b_p99_lat:.1f}ms | {p_p99_lat:.1f}ms | {p_p99_lat - b_p99_lat:+.1f}ms |")
    print("="*80)
    print(f"Total API Cost generated: ${total_cost_usd:.6f}")
    print("="*80 + "\n")

    return df

if __name__ == "__main__":
    # Allow passing custom CSV path via command line argument
    csv_path_arg = sys.argv[1] if len(sys.argv) > 1 else ""
    asyncio.run(run_benchmark(csv_path_arg))
