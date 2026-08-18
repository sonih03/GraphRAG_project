import os
import sys
import argparse
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.logging import logger
from app.pipeline.civil_act_parser import parse_civil_law_text
from app.pipeline.hybrid_extractor import extract_legal_relationships
from app.pipeline.neo4j_loader import load_data_to_neo4j

def run_ingestion(file_path: str):
    logger.info("==================================================")
    logger.info("  🚀 대한민국 민법 Neo4j GraphRAG 파이프라인 가동")
    logger.info("==================================================")

    if not os.path.exists(file_path):
        logger.error(f"Error: File not found: {file_path}")
        sys.exit(1)

    logger.info(f"[1/4] Reading Civil Law text file: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        raw_text = f.read()
    logger.info(f"File size: {len(raw_text):,} characters ({len(raw_text.splitlines()):,} lines)")

    logger.info("[2/4] Parsing Civil Act structure (with branch number defense: e.g. 제14조의2)...")
    parsed_data = parse_civil_law_text(raw_text)
    logger.info(f" -> Parts: {len(parsed_data['parts'])}")
    logger.info(f" -> Chapters: {len(parsed_data['chapters'])}")
    logger.info(f" -> Sections: {len(parsed_data['sections'])}")
    logger.info(f" -> Articles: {len(parsed_data['articles'])}")
    logger.info(f" -> Clauses: {len(parsed_data['clauses'])}")

    logger.info("[3/4] Extracting legal relationships (Mutatis Mutandis & Exception & References)...")
    relations_data = extract_legal_relationships(
        parsed_data["articles"],
        parsed_data["existing_article_ids"],
        parsed_data["article_number_to_id"]
    )
    logger.info(f" -> MUTATIS_MUTANDIS edges (준용): {len(relations_data['mutatis_edges'])}")
    logger.info(f" -> EXCEPTION_TO edges (예외): {len(relations_data['exception_edges'])}")
    logger.info(f" -> REFERENCES edges (참조): {len(relations_data['reference_edges'])}")

    logger.info("[4/4] Loading into Neo4j with UNIQUE CONSTRAINTs and UNWIND batching...")
    stats = load_data_to_neo4j(parsed_data, relations_data, batch_size=500)

    logger.info("==================================================")
    logger.info("  [COMPLETE] Civil Act Neo4j Ingestion Statistics")
    logger.info("==================================================")
    logger.info(f"  * Article (Total Nodes): {stats['articles']:,}")
    logger.info(f"  * Clause (Sub-nodes): {stats['clauses']:,}")
    logger.info(f"  * Part: {stats['parts']} | Chapter: {stats['chapters']} | Section: {stats['sections']}")
    logger.info(f"  * Mutatis Mutandis Edges (준용): {stats['mutatis_edges']:,}")
    logger.info(f"  * Exception To Edges (예외): {stats['exception_edges']:,}")
    logger.info(f"  * Reference Edges (참조): {stats['reference_edges']:,}")
    logger.info(f"  * Contains Hierarchy Edges (계층): {stats['contains_edges']:,}")
    logger.info("==================================================")
    return stats

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest Korean Civil Law into Neo4j Graph Database")
    parser.add_argument("--file", type=str, default="civil_law.txt", help="Path to civil_law.txt")
    args = parser.parse_args()

    # Find file path relative to backend or current working dir
    target_path = args.file
    if not os.path.exists(target_path):
        alt_path = os.path.join(backend_dir, args.file)
        if os.path.exists(alt_path):
            target_path = alt_path

    run_ingestion(target_path)
