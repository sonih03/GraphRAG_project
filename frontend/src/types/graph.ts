export type GraphSystemState =
  | 'STATE_IDLE'
  | 'STATE_GALAXY_VIEW'
  | 'STATE_QUERYING'
  | 'STATE_VECTOR_SEARCH'
  | 'STATE_GRAPH_TRAVERSAL'
  | 'STATE_COMPARE_ANSWERS'
  | 'STATE_BENCHMARK_RADAR';

export interface GraphNodeInstance {
  id: string;
  position: [number, number, number];
  color: string;
  scale: number;
  label?: string;
  degree: number;
  pulsePhase: number;
}

export interface GraphSphereConfig {
  nodeCount: number;
  radius: number;
  nodeSize: number;
  coreColor: string;
  glowColor: string;
  edgeColor: string;
  rotationSpeedY: number;
  rotationSpeedX: number;
  maxNeighbors: number;
  maxConnectionDistance: number;
}

// Live Subgraph Model from Backend
export interface DynamicSubgraphNode {
  id: string;
  articleNumber: string;
  title: string;
  name?: string;
  chapter?: string;
  summary: string;
  fullText?: string;
  type?: 'origin_node' | 'traversal_node' | 'target_node';
  color?: string;
  position?: [number, number, number];
}

export interface DynamicSubgraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'MUTATIS_MUTANDIS' | 'EXCEPTION_TO' | 'REFERENCES' | 'CONTAINS';
  label?: string;
  color?: string;
  description?: string;
}

export interface DynamicSubgraphData {
  targetArticle?: string;
  nodes: DynamicSubgraphNode[];
  edges: DynamicSubgraphEdge[];
  node_count?: number;
  edge_count?: number;
}
