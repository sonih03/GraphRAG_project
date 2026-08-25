import os
import logging
import csv
from typing import List, Dict, Any

logger = logging.getLogger("evaluation.dataset")

# In-memory PoC dataset
DEFAULT_DATASET = [
    {
        "id": "Q1",
        "raw_query": "옆집 담벼락이 우리 땅을 침범했는데 강제로 허물어도 되나요?",
        "expected_article_id": "KR-CIVIL-ART-214"
    },
    {
        "id": "Q2",
        "raw_query": "친구가 빌린 돈 500만원을 기한이 지났는데도 갚지 않고 피해요.",
        "expected_article_id": "KR-CIVIL-ART-390"
    },
    {
        "id": "Q3",
        "raw_query": "집주인이 전세 계약이 끝났는데도 보증금을 안 돌려주는데 어쩌죠?",
        "expected_article_id": "KR-CIVIL-ART-303"
    }
]

def load_dataset(csv_path: str = "") -> List[Dict[str, Any]]:
    """
    Loads evaluation dataset.
    If csv_path is provided and exists, parses it.
    If not provided (or doesn't exist), checks if a default benchmark_50.csv exists in the evaluation folder and loads it.
    Otherwise, falls back to the default PoC dataset.
    """
    if not csv_path:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        default_csv = os.path.join(current_dir, "benchmark_50.csv")
        if os.path.exists(default_csv):
            csv_path = default_csv

    if not csv_path or not os.path.exists(csv_path):
        logger.info(f"Using default PoC dataset ({len(DEFAULT_DATASET)} queries).")
        return DEFAULT_DATASET

    logger.info(f"Loading dataset from CSV: '{csv_path}'...")
    loaded_data = []
    try:
        with open(csv_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Required columns: id, raw_query, expected_article_id
                if "id" in row and "raw_query" in row and "expected_article_id" in row:
                    item = {
                        "id": row["id"].strip(),
                        "raw_query": row["raw_query"].strip(),
                        "expected_article_id": row["expected_article_id"].strip()
                    }
                    if "category" in row and row["category"]:
                        item["category"] = row["category"].strip()
                    loaded_data.append(item)
        logger.info(f"Successfully loaded {len(loaded_data)} queries from CSV.")
        return loaded_data
    except Exception as e:
        logger.error(f"Failed to read CSV dataset: {e}. Using default PoC instead.")
        return DEFAULT_DATASET
