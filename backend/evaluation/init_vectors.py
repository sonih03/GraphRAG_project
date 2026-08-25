import asyncio
import logging
import sys
import os
from typing import List, Dict, Any

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastembed import TextEmbedding
from evaluation.config import eval_settings
from evaluation.database import db

# Set up logging to stdout
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("evaluation.init_vectors")

async def create_vector_index(dimension: int = 384):
    driver = db.get_neo4j_driver()
    
    # DDL statement for Neo4j Vector Index creation
    ddl_query = f"""
    CREATE VECTOR INDEX civilArticleVectorIndex IF NOT EXISTS
    FOR (a:Article) ON (a.embedding)
    OPTIONS {{
      indexConfig: {{
        `vector.dimensions`: {dimension},
        `vector.similarity_function`: 'cosine'
      }}
    }}
    """
    
    async with driver.session() as session:
        logger.info("Creating civilArticleVectorIndex vector index if not exists...")
        await session.run(ddl_query)
        logger.info("Vector index DDL query sent successfully.")

async def fetch_articles() -> List[Dict[str, str]]:
    driver = db.get_neo4j_driver()
    query = "MATCH (a:Article) RETURN a.id AS id, a.fullText AS fullText"
    
    async with driver.session() as session:
        logger.info("Fetching articles from Neo4j...")
        result = await session.run(query)
        articles = []
        async for record in result:
            articles.append({
                "id": record["id"],
                "fullText": record["fullText"] or ""
            })
        logger.info(f"Fetched {len(articles)} articles from Neo4j.")
        return articles

def generate_embeddings_sync(texts: List[str], model_name: str) -> List[List[float]]:
    logger.info(f"Loading FastEmbed model: '{model_name}'...")
    # FastEmbed loads and caches model locally.
    model = TextEmbedding(model_name=model_name)
    logger.info(f"Generating embeddings for {len(texts)} texts...")
    embeddings = list(model.embed(texts))
    # Convert ndarray to list of floats
    return [e.tolist() for e in embeddings]

async def update_article_embeddings(batch: List[Dict[str, Any]]):
    driver = db.get_neo4j_driver()
    query = """
    UNWIND $batch AS item
    MATCH (a:Article {id: item.id})
    SET a.embedding = item.embedding
    """
    async with driver.session() as session:
        await session.run(query, batch=batch)

async def main():
    try:
        # 1. Fetch articles from Neo4j
        articles = await fetch_articles()
        if not articles:
            logger.warning("No articles found in Neo4j database. Please run ingest pipeline first.")
            return

        # 2. Generate embeddings in a separate thread to prevent blocking the event loop
        texts = [a["fullText"] for a in articles]
        model_name = eval_settings.EMBEDDING_MODEL
        
        embeddings = await asyncio.to_thread(
            generate_embeddings_sync, texts, model_name
        )
        
        # Verify dimension size
        if not embeddings:
            logger.error("No embeddings generated.")
            return
        dimension = len(embeddings[0])
        logger.info(f"Generated embeddings dimension: {dimension}")
        
        # 3. Create Neo4j Vector Index with matching dimensions
        await create_vector_index(dimension=dimension)
        
        # 4. Upload in batches
        batch_size = 200
        total_articles = len(articles)
        logger.info(f"Uploading embeddings to Neo4j in batches of {batch_size}...")
        
        for i in range(0, total_articles, batch_size):
            batch_articles = articles[i:i+batch_size]
            batch_embeddings = embeddings[i:i+batch_size]
            
            batch_payload = [
                {"id": art["id"], "embedding": emb}
                for art, emb in zip(batch_articles, batch_embeddings)
            ]
            
            await update_article_embeddings(batch_payload)
            logger.info(f"Processed batch {i // batch_size + 1}/{(total_articles - 1) // batch_size + 1} ({min(i + batch_size, total_articles)}/{total_articles})")
            
        logger.info("Successfully updated all Article node embeddings and initialized Vector Index!")
        
    except Exception as e:
        logger.exception(f"An error occurred during vector initialization: {e}")
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(main())
