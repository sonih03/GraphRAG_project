from neo4j import GraphDatabase, Driver
from typing import Optional, List, Dict, Any
from app.core.config import settings
from app.core.logging import logger
from app.models.graph import NodeModel, EdgeModel, GraphDataResponse

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

    @classmethod
    def get_article_subgraph(cls, target_id: str = "art_13") -> Dict[str, Any]:
        """
        Retrieves the multi-hop subgraph for target article (e.g. art_13 -> 14, 15, 16)
        with relationships EXCEPT_IF and MUTATIS_MUTANDIS.
        """
        driver = cls.get_driver()
        nodes_dict: Dict[str, Dict[str, Any]] = {}
        edges_list: List[Dict[str, Any]] = []

        query = """
        MATCH (center:LawArticle)
        WHERE center.id = $target_id OR center.id CONTAINS $target_id
        OPTIONAL MATCH path = (center)-[r:EXCEPT_IF|MUTATIS_MUTANDIS*1..2]-(neighbor:LawArticle)
        RETURN center, relationships(path) AS rels, nodes(path) AS path_nodes
        """

        with driver.session() as session:
            result = session.run(query, target_id=target_id)
            records = list(result)

            for record in records:
                center = record.get("center")
                if center:
                    props = dict(center)
                    nodes_dict[props.get("id", target_id)] = {
                        "id": props.get("id", target_id),
                        "label": f"{props.get('title', '')} {props.get('name', '')}".strip(),
                        "type": "origin_node",
                        "number": props.get("number"),
                        "title": props.get("title", ""),
                        "name": props.get("name", ""),
                        "content": props.get("content", ""),
                        "principle": props.get("principle", ""),
                        "properties": props
                    }

                path_nodes = record.get("path_nodes") or []
                for n in path_nodes:
                    props = dict(n)
                    nid = props.get("id")
                    if nid and nid not in nodes_dict:
                        nodes_dict[nid] = {
                            "id": nid,
                            "label": f"{props.get('title', '')} {props.get('name', '')}".strip(),
                            "type": "traversal_node",
                            "number": props.get("number"),
                            "title": props.get("title", ""),
                            "name": props.get("name", ""),
                            "content": props.get("content", ""),
                            "principle": props.get("principle", ""),
                            "properties": props
                        }

                rels = record.get("rels") or []
                for r in rels:
                    edge_item = {
                        "id": f"{r.start_node['id']}_{r.type}_{r.end_node['id']}",
                        "source": r.start_node["id"],
                        "target": r.end_node["id"],
                        "type": r.type,
                        "relation": r.type,
                        "color": "#10b981" if r.type == "MUTATIS_MUTANDIS" else "#ef4444",
                        "label": "준용 규정 (Mutatis Mutandis)" if r.type == "MUTATIS_MUTANDIS" else "예외 규정 (Except If)"
                    }
                    if not any(e["id"] == edge_item["id"] for e in edges_list):
                        edges_list.append(edge_item)

        # Fallback if no paths were found
        if not nodes_dict:
            return cls._get_fallback_art13_subgraph()

        return {
            "target_id": target_id,
            "nodes": list(nodes_dict.values()),
            "edges": edges_list,
            "node_count": len(nodes_dict),
            "edge_count": len(edges_list)
        }

    @classmethod
    def get_all_overview(cls, limit: int = 300) -> Dict[str, Any]:
        """Retrieves overview nodes from Neo4j for 3D background visualization"""
        driver = cls.get_driver()
        query = "MATCH (n:LawArticle) RETURN n LIMIT $limit"
        nodes = []
        with driver.session() as session:
            result = session.run(query, limit=limit)
            for rec in result:
                props = dict(rec["n"])
                nodes.append({
                    "id": props.get("id"),
                    "title": props.get("title", ""),
                    "name": props.get("name", ""),
                    "number": props.get("number", 0),
                    "principle": props.get("principle", "")
                })

        return {"nodes": nodes, "count": len(nodes)}

    @classmethod
    def _get_fallback_art13_subgraph(cls) -> Dict[str, Any]:
        return {
            "target_id": "art_13",
            "nodes": [
                {"id": "art_13", "title": "제13조", "name": "피한정후견인의 행위와 동의", "type": "origin_node"},
                {"id": "art_14", "title": "제14조", "name": "한정후견종료의 심판", "type": "traversal_node"},
                {"id": "art_15", "title": "제15조", "name": "제한능력자의 상대방의 확답을 촉구할 권리", "type": "traversal_node"},
                {"id": "art_16", "title": "제16조", "name": "피특정후견인의 행위와 보호", "type": "traversal_node"}
            ],
            "edges": [
                {"id": "art_13_EXCEPT_IF_art_14", "source": "art_13", "target": "art_14", "type": "EXCEPT_IF", "relation": "EXCEPT_IF", "color": "#ef4444"},
                {"id": "art_13_MUTATIS_MUTANDIS_art_15", "source": "art_13", "target": "art_15", "type": "MUTATIS_MUTANDIS", "relation": "MUTATIS_MUTANDIS", "color": "#10b981"},
                {"id": "art_15_MUTATIS_MUTANDIS_art_16", "source": "art_15", "target": "art_16", "type": "MUTATIS_MUTANDIS", "relation": "MUTATIS_MUTANDIS", "color": "#10b981"}
            ],
            "node_count": 4,
            "edge_count": 3
        }

neo4j_service = Neo4jService()
