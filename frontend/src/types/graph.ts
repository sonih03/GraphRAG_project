export type GraphSystemState =
  | 'STATE_IDLE'
  | 'STATE_GALAXY_VIEW'
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
