from fastapi import APIRouter
from app.models.graph import GraphDataResponse, NodeModel, EdgeModel
from app.models.query import QueryRequest, QueryResponse
from app.services.llm_service import llm_service

router = APIRouter()

@router.get("/overview", response_model=GraphDataResponse)
async def get_graph_overview():
    """Returns overview graph data for initial visualization"""
    # Sample/skeleton payload for initial testing
    sample_nodes = [
        NodeModel(id=f"node_{i}", label=f"Concept {i}", type="entity", degree=i % 5 + 1)
        for i in range(1, 11)
    ]
    sample_edges = [
        EdgeModel(id=f"edge_{i}", source=f"node_{i}", target=f"node_{(i%10)+1}", relation="RELATED_TO")
        for i in range(1, 10)
    ]
    return GraphDataResponse(
        nodes=sample_nodes,
        edges=sample_edges,
        node_count=len(sample_nodes),
        edge_count=len(sample_edges)
    )

@router.post("/query", response_model=QueryResponse)
async def query_graphrag(request: QueryRequest):
    """Executes a GraphRAG query with LLM reasoning"""
    answer = await llm_service.generate_completion(
        prompt=request.prompt,
        system_prompt="You are a GraphRAG assistant synthesizing knowledge graph insights."
    )
    return QueryResponse(
        query=request.prompt,
        answer=answer,
        subgraph_nodes=["node_1", "node_2", "node_3"],
        subgraph_edges=["edge_1", "edge_2"],
        confidence=0.95,
        metadata={"mode": request.mode}
    )
