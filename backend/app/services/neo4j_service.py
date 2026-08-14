from neo4j import GraphDatabase, Driver
from typing import Optional
from app.core.config import settings
from app.core.logging import logger

class Neo4jService:
    _driver: Optional[Driver] = None

    @classmethod
    def get_driver(cls) -> Driver:
        if cls._driver is None:
            try:
                cls._driver = GraphDatabase.driver(
                    settings.NEO4J_URI,
                    auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
                )
                logger.info("Connected to Neo4j database")
            except Exception as e:
                logger.error(f"Failed to connect to Neo4j: {e}")
                raise e
        return cls._driver

    @classmethod
    def close(cls):
        if cls._driver is not None:
            cls._driver.close()
            cls._driver = None
            logger.info("Closed Neo4j connection")

    @classmethod
    def check_connection(cls) -> bool:
        try:
            driver = cls.get_driver()
            with driver.session() as session:
                result = session.run("RETURN 1 AS result")
                return result.single()["result"] == 1
        except Exception as e:
            logger.warning(f"Neo4j health check failed: {e}")
            return False

neo4j_service = Neo4jService()
