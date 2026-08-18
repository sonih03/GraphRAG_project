from pydantic import BaseModel, Field
from typing import Optional, Any, List, Dict

class QueryRequest(BaseModel):
    prompt: Optional[str] = Field(default=None, description="User query prompt for GraphRAG")
    query: Optional[str] = Field(default=None, description="Alternative field for user query")
    mode: str = Field(default="hybrid", description="Retrieval mode: local, global, hybrid")
    top_k: int = Field(default=10, description="Top K nodes/subgraphs to retrieve")

    def get_prompt(self) -> str:
        return (self.prompt or self.query or "제13조").strip()

class QueryResponse(BaseModel):
    query: str
    answer: str
    subgraph: Optional[Dict[str, Any]] = None
    subgraph_nodes: list[str] = Field(default_factory=list)
    subgraph_edges: list[str] = Field(default_factory=list)
    confidence: Optional[float] = 1.0
    metadata: dict[str, Any] = Field(default_factory=dict)
