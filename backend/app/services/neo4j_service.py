from neo4j import GraphDatabase, Driver
from typing import Optional, List, Dict, Any
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

    @classmethod
    def get_article_subgraph(cls, target_query: Any = "13") -> Dict[str, Any]:
        """
        Retrieves the multi-hop subgraph for target article (e.g. Art. 13 -> 14, 15, 16)
        with relationships MUTATIS_MUTANDIS, EXCEPTION_TO, and REFERENCES.
        """
        driver = cls.get_driver()
        nodes_dict: Dict[str, Dict[str, Any]] = {}
        edges_list: List[Dict[str, Any]] = []

        query_str = str(target_query).replace("제", "").replace("조", "").strip()

        cypher = """
        MATCH (center:Article)
        WHERE center.id = $raw_query 
           OR center.id = 'KR-CIVIL-ART-' + $query_str
           OR center.number_str = $query_str
           OR center.number_base = toInteger($query_str)
        OPTIONAL MATCH path = (center)-[r:MUTATIS_MUTANDIS|EXCEPTION_TO|REFERENCES*1..2]-(neighbor:Article)
        RETURN center, relationships(path) AS rels, nodes(path) AS path_nodes
        """

        with driver.session() as session:
            result = session.run(cypher, raw_query=str(target_query), query_str=query_str)
            records = list(result)

            for record in records:
                center = record.get("center")
                if center:
                    props = dict(center)
                    cid = props.get("id", "KR-CIVIL-ART-13")
                    nodes_dict[cid] = {
                        "id": cid,
                        "label": f"{props.get('title', '')} {props.get('name', '')}".strip(),
                        "type": "origin_node",
                        "number": props.get("number_base", 13),
                        "title": props.get("title", ""),
                        "name": props.get("name", ""),
                        "fullText": props.get("fullText", ""),
                        "summary": props.get("summary", ""),
                        "contextPath": props.get("contextPath", ""),
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
                            "number": props.get("number_base", 0),
                            "title": props.get("title", ""),
                            "name": props.get("name", ""),
                            "fullText": props.get("fullText", ""),
                            "summary": props.get("summary", ""),
                            "contextPath": props.get("contextPath", ""),
                            "properties": props
                        }

                rels = record.get("rels") or []
                for r in rels:
                    edge_id = f"{r.start_node['id']}_{r.type}_{r.end_node['id']}"
                    color = "#10b981" if r.type == "MUTATIS_MUTANDIS" else "#ef4444" if r.type == "EXCEPTION_TO" else "#38bdf8"
                    label = (
                        "준용 규정 (Mutatis Mutandis)" if r.type == "MUTATIS_MUTANDIS" 
                        else "예외 규정 (Exception To)" if r.type == "EXCEPTION_TO" 
                        else "참조 규정 (References)"
                    )
                    edge_item = {
                        "id": edge_id,
                        "source": r.start_node["id"],
                        "target": r.end_node["id"],
                        "type": r.type,
                        "relation": r.type,
                        "color": color,
                        "label": label,
                        "description": r.get("description", "")
                    }
                    if not any(e["id"] == edge_item["id"] for e in edges_list):
                        edges_list.append(edge_item)

        if not nodes_dict:
            return cls._get_fallback_art13_subgraph()

        return {
            "target_id": str(target_query),
            "nodes": list(nodes_dict.values()),
            "edges": edges_list,
            "node_count": len(nodes_dict),
            "edge_count": len(edges_list)
        }

    @classmethod
    def get_all_overview(cls, limit: int = 1200) -> Dict[str, Any]:
        """Retrieves overview nodes and relationships from Neo4j for full graph network visualization"""
        driver = cls.get_driver()
        nodes = []
        edges = []
        with driver.session() as session:
            # Nodes
            result = session.run("""
                MATCH (a:Article)
                RETURN a.id AS id, a.title AS title, a.name AS name, a.number_base AS number, a.contextPath AS contextPath
                LIMIT $limit
            """, limit=limit)
            for rec in result:
                nodes.append({
                    "id": rec["id"],
                    "title": rec["title"],
                    "name": rec["name"],
                    "number": rec["number"],
                    "contextPath": rec["contextPath"]
                })

            # Edges: Include MUTATIS_MUTANDIS, EXCEPTION_TO, and REFERENCES
            edge_result = session.run("""
                MATCH (src:Article)-[r:MUTATIS_MUTANDIS|EXCEPTION_TO|REFERENCES]->(tgt:Article)
                RETURN src.id AS source, tgt.id AS target, type(r) AS type
                LIMIT 1000
            """)
            for er in edge_result:
                r_type = er["type"]
                color = "#10b981" if r_type == "MUTATIS_MUTANDIS" else "#ef4444" if r_type == "EXCEPTION_TO" else "#38bdf8"
                edges.append({
                    "source": er["source"],
                    "target": er["target"],
                    "type": r_type,
                    "color": color
                })

        return {
            "nodes": nodes,
            "edges": edges,
            "node_count": len(nodes),
            "edge_count": len(edges)
        }

    @classmethod
    def _get_fallback_art13_subgraph(cls) -> Dict[str, Any]:
        return {
            "target_id": "KR-CIVIL-ART-13",
            "nodes": [
                {"id": "KR-CIVIL-ART-13", "title": "제13조", "name": "피한정후견인의 행위와 동의", "type": "origin_node"},
                {"id": "KR-CIVIL-ART-14", "title": "제14조", "name": "한정후견종료의 심판", "type": "traversal_node"},
                {"id": "KR-CIVIL-ART-15", "title": "제15조", "name": "제한능력자의 상대방의 확답을 촉구할 권리", "type": "traversal_node"},
                {"id": "KR-CIVIL-ART-16", "title": "제16조", "name": "피특정후견인의 행위와 보호", "type": "traversal_node"}
            ],
            "edges": [
                {"id": "MUTATIS_13_14", "source": "KR-CIVIL-ART-13", "target": "KR-CIVIL-ART-14", "type": "MUTATIS_MUTANDIS", "color": "#10b981", "label": "준용 규정"},
                {"id": "MUTATIS_13_15", "source": "KR-CIVIL-ART-13", "target": "KR-CIVIL-ART-15", "type": "MUTATIS_MUTANDIS", "color": "#10b981", "label": "준용 규정"},
                {"id": "EXCEPT_13_16", "source": "KR-CIVIL-ART-13", "target": "KR-CIVIL-ART-16", "type": "EXCEPTION_TO", "color": "#ef4444", "label": "예외 규정"}
            ],
            "node_count": 4,
            "edge_count": 3
        }

neo4j_service = Neo4jService()
