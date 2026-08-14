from typing import Optional, Any
from pydantic import BaseModel, Field

class NodeModel(BaseModel):
    id: str
    label: str
    type: str = "default"
    properties: dict[str, Any] = Field(default_factory=dict)
    community: Optional[int] = None
    degree: int = 1

class EdgeModel(BaseModel):
    id: str
    source: str
    target: str
    relation: str
    weight: float = 1.0
    properties: dict[str, Any] = Field(default_factory=dict)

class GraphDataResponse(BaseModel):
    nodes: list[NodeModel]
    edges: list[EdgeModel]
    node_count: int
    edge_count: int
