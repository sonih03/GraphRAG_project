import logging
from typing import List, Dict, Any
from evaluation.database import db

logger = logging.getLogger("evaluation.neo4j_search")

class Neo4jSearch:
    async def initialize_search_indexes(self):
        """Creates the CJK analyzer-based fulltext index if it does not exist."""
        driver = db.get_neo4j_driver()
        
        # CJK analyzer-based fulltext DDL
        fulltext_ddl = """
        CREATE FULLTEXT INDEX articleFulltextIndex IF NOT EXISTS
FOR (a:Article) ON EACH [a.name, a.summary, a.fullText]
OPTIONS {
  indexConfig: {
    `fulltext.analyzer`: 'cjk'
  }
}
        """
        
        async with driver.session() as session:
            logger.info("Initializing Neo4j CJK fulltext index...")
            await session.run(fulltext_ddl)
            logger.info("Fulltext index initialization finished.")

    async def sparse_search(self, lucene_query: str, top_k: int = 15) -> List[Dict[str, Any]]:
        """
        Performs Lucene sparse full-text search against name, summary, and fullText fields.
        Weighted logic is expected to be specified inside the lucene_query.
        """
        driver = db.get_neo4j_driver()
        query = """
        CALL db.index.fulltext.queryNodes("articleFulltextIndex", $lucene_query)
        YIELD node, score
        RETURN node.id AS id, 
               node.name AS name, 
               node.summary AS summary, 
               node.fullText AS fullText, 
               score
        LIMIT $top_k
        """
        
        results = []
        try:
            async with driver.session() as session:
                logger.debug(f"[SPARSE SEARCH] Query: '{lucene_query}'")
                result = await session.run(query, lucene_query=lucene_query, top_k=top_k)
                async for record in result:
                    results.append({
                        "id": record["id"],
                        "name": record["name"] or "",
                        "summary": record["summary"] or "",
                        "fullText": record["fullText"] or "",
                        "score": float(record["score"])
                    })
        except Exception as e:
            logger.error(f"Sparse search query failed: {e}")
        return results

    async def dense_search(self, query_vector: List[float], top_k: int = 15) -> List[Dict[str, Any]]:
        """
        Performs vector search query using Neo4j vector index.
        """
        driver = db.get_neo4j_driver()
        query = """
        CALL db.index.vector.queryNodes("civilArticleVectorIndex", $top_k, $query_vector)
        YIELD node, score
        RETURN node.id AS id, 
               node.name AS name, 
               node.summary AS summary, 
               node.fullText AS fullText, 
               score
        """
        
        results = []
        try:
            async with driver.session() as session:
                logger.debug(f"[DENSE SEARCH] Executing Vector similarity lookup...")
                result = await session.run(query, query_vector=query_vector, top_k=top_k)
                async for record in result:
                    results.append({
                        "id": record["id"],
                        "name": record["name"] or "",
                        "summary": record["summary"] or "",
                        "fullText": record["fullText"] or "",
                        "score": float(record["score"])
                    })
        except Exception as e:
            logger.error(f"Dense search query failed: {e}")
        return results

neo4j_search = Neo4jSearch()
