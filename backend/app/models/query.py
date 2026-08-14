from pydantic import BaseModel, Field
from typing import Optional, Any

class QueryRequest(BaseModel):
    prompt: str = Field(..., description="User query prompt for GraphRAG")
    mode: str = Field(default="hybrid", description="Retrieval mode: local, global, hybrid")
    top_k: int = Field(default=10, description="Top K nodes/subgraphs to retrieve")

class QueryResponse(BaseModel):
    query: str
    answer: str
    subgraph_nodes: list[str] = Field(default_factory=list)
    subgraph_edges: list[str] = Field(default_factory=list)
    confidence: Optional[float] = 1.0
    metadata: dict[str, Any] = Field(default_factory=dict)
