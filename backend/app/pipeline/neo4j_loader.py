import os
import json
from neo4j import GraphDatabase
from typing import Dict, List, Any
from app.core.config import settings
from app.core.logging import logger

def get_neo4j_driver():
    return GraphDatabase.driver(
        settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )

def create_constraints_and_indexes(session):
    """
    Executes UNIQUE CONSTRAINT DDLs as top priority to enable O(1) hash indexing
    and prevent full scans during UNWIND batch MERGE operations.
    """
    logger.info("Executing Neo4j UNIQUE CONSTRAINT DDLs...")
    ddls = [
        "CREATE CONSTRAINT part_id_unique IF NOT EXISTS FOR (p:Part) REQUIRE p.id IS UNIQUE",
        "CREATE CONSTRAINT chapter_id_unique IF NOT EXISTS FOR (c:Chapter) REQUIRE c.id IS UNIQUE",
        "CREATE CONSTRAINT section_id_unique IF NOT EXISTS FOR (s:Section) REQUIRE s.id IS UNIQUE",
        "CREATE CONSTRAINT article_id_unique IF NOT EXISTS FOR (a:Article) REQUIRE a.id IS UNIQUE",
        "CREATE CONSTRAINT clause_id_unique IF NOT EXISTS FOR (cl:Clause) REQUIRE cl.id IS UNIQUE",
    ]
    for ddl in ddls:
        session.run(ddl)
    logger.info("UNIQUE CONSTRAINTs successfully ensured.")

def load_data_to_neo4j(
    parsed_data: Dict[str, Any],
    relations_data: Dict[str, Any],
    batch_size: int = 500
) -> Dict[str, int]:
    """
    Loads parsed Civil Act nodes and relationships into Neo4j in batches using UNWIND.
    """
    driver = get_neo4j_driver()
    with driver.session() as session:
        # 1. Create Constraints
        create_constraints_and_indexes(session)

        # 2. Clean old data
        logger.info("Cleaning previous database state...")
        session.run("MATCH (n) DETACH DELETE n")

        # 3. Load Parts
        logger.info(f"Loading {len(parsed_data['parts'])} Parts...")
        session.run("""
            UNWIND $parts AS p
            MERGE (part:Part {id: p.id})
            ON CREATE SET part.part_num = p.part_num, part.title = p.title
        """, parts=parsed_data["parts"])

        # 4. Load Chapters
        logger.info(f"Loading {len(parsed_data['chapters'])} Chapters...")
        session.run("""
            UNWIND $chapters AS c
            MERGE (chap:Chapter {id: c.id})
            ON CREATE SET chap.chapter_num = c.chapter_num, chap.title = c.title
        """, chapters=parsed_data["chapters"])

        # 5. Load Sections
        logger.info(f"Loading {len(parsed_data['sections'])} Sections...")
        session.run("""
            UNWIND $sections AS s
            MERGE (sec:Section {id: s.id})
            ON CREATE SET sec.section_num = s.section_num, sec.title = s.title
        """, sections=parsed_data["sections"])

        # 6. Load Articles (in batches of 500)
        articles = parsed_data["articles"]
        logger.info(f"Loading {len(articles)} Articles in batches of {batch_size}...")
        for i in range(0, len(articles), batch_size):
            batch = articles[i:i + batch_size]
            session.run("""
                UNWIND $batch AS art
                MERGE (a:Article {id: art.id})
                ON CREATE SET 
                    a.number_str = art.number_str,
                    a.number_base = art.number_base,
                    a.number_branch = art.number_branch,
                    a.title = art.title,
                    a.name = art.name,
                    a.fullText = art.fullText,
                    a.summary = art.summary,
                    a.contextPath = art.contextPath,
                    a.is_deleted = art.is_deleted
            """, batch=batch)

        # 7. Load Clauses (in batches of 500)
        clauses = parsed_data["clauses"]
        logger.info(f"Loading {len(clauses)} Clauses in batches of {batch_size}...")
        for i in range(0, len(clauses), batch_size):
            batch = clauses[i:i + batch_size]
            session.run("""
                UNWIND $batch AS cl
                MERGE (c:Clause {id: cl.id})
                ON CREATE SET 
                    c.clause_num = cl.clause_num,
                    c.text = cl.text,
                    c.summary = cl.summary
            """, batch=batch)

        # 8. Load Hierarchy CONTAINS Edges
        hierarchy_edges = parsed_data["hierarchy_edges"]
        logger.info(f"Loading {len(hierarchy_edges)} CONTAINS hierarchy edges...")
        for i in range(0, len(hierarchy_edges), batch_size):
            batch = hierarchy_edges[i:i + batch_size]
            session.run("""
                UNWIND $batch AS h
                MATCH (p {id: h.parent_id})
                MATCH (c {id: h.child_id})
                MERGE (p)-[r:CONTAINS {order: h.order}]->(c)
            """, batch=batch)

        # 9. Load MUTATIS_MUTANDIS Edges
        mutatis = relations_data["mutatis_edges"]
        logger.info(f"Loading {len(mutatis)} MUTATIS_MUTANDIS edges...")
        for i in range(0, len(mutatis), batch_size):
            batch = mutatis[i:i + batch_size]
            # Convert modifications list to json string for Neo4j property compatibility
            for item in batch:
                item["modifications_json"] = json.dumps(item["modifications"], ensure_ascii=False)
            session.run("""
                UNWIND $batch AS rel
                MATCH (src:Article {id: rel.source_id})
                MATCH (tgt:Article {id: rel.target_id})
                MERGE (src)-[r:MUTATIS_MUTANDIS]->(tgt)
                ON CREATE SET 
                    r.id = rel.id,
                    r.label = rel.label,
                    r.color = rel.color,
                    r.description = rel.description,
                    r.modifications = rel.modifications_json,
                    r.is_conditional = rel.is_conditional
            """, batch=batch)

        # 10. Load EXCEPTION_TO Edges
        exceptions = relations_data["exception_edges"]
        logger.info(f"Loading {len(exceptions)} EXCEPTION_TO edges...")
        for i in range(0, len(exceptions), batch_size):
            batch = exceptions[i:i + batch_size]
            session.run("""
                UNWIND $batch AS rel
                MATCH (src:Article {id: rel.source_id})
                MATCH (tgt:Article {id: rel.target_id})
                MERGE (src)-[r:EXCEPTION_TO]->(tgt)
                ON CREATE SET 
                    r.id = rel.id,
                    r.label = rel.label,
                    r.color = rel.color,
                    r.description = rel.description,
                    r.proviso_flag = rel.proviso_flag
            """, batch=batch)

        # 11. Load REFERENCES Edges
        references = relations_data["reference_edges"]
        logger.info(f"Loading {len(references)} REFERENCES edges...")
        for i in range(0, len(references), batch_size):
            batch = references[i:i + batch_size]
            session.run("""
                UNWIND $batch AS rel
                MATCH (src:Article {id: rel.source_id})
                MATCH (tgt:Article {id: rel.target_id})
                MERGE (src)-[r:REFERENCES]->(tgt)
                ON CREATE SET 
                    r.id = rel.id,
                    r.label = rel.label,
                    r.color = rel.color,
                    r.description = rel.description
            """, batch=batch)

        # 12. Verification counts
        res_nodes = session.run("""
            RETURN 
                count { MATCH (a:Article) } AS articles,
                count { MATCH (c:Clause) } AS clauses,
                count { MATCH (p:Part) } AS parts,
                count { MATCH (ch:Chapter) } AS chapters,
                count { MATCH (s:Section) } AS sections
        """).single()

        res_edges = session.run("""
            RETURN 
                count { MATCH ()-[r:MUTATIS_MUTANDIS]->() } AS mutatis,
                count { MATCH ()-[r:EXCEPTION_TO]->() } AS exceptions,
                count { MATCH ()-[r:REFERENCES]->() } AS references,
                count { MATCH ()-[r:CONTAINS]->() } AS contains
        """).single()

        stats = {
            "articles": res_nodes["articles"],
            "clauses": res_nodes["clauses"],
            "parts": res_nodes["parts"],
            "chapters": res_nodes["chapters"],
            "sections": res_nodes["sections"],
            "mutatis_edges": res_edges["mutatis"],
            "exception_edges": res_edges["exceptions"],
            "reference_edges": res_edges["references"],
            "contains_edges": res_edges["contains"]
        }
        logger.info(f"Neo4j Ingestion Complete! Stats: {stats}")
        return stats
