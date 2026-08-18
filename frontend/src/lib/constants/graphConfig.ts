import { GraphSphereConfig } from '@/types/graph';

export const IDLE_SPHERE_CONFIG: GraphSphereConfig = {
  nodeCount: 5000,
  radius: 2.1,
  nodeSize: 0.026,
  coreColor: '#38bdf8',
  glowColor: '#0ea5e9',
  edgeColor: '#0369a1',
  rotationSpeedY: 0.07,
  rotationSpeedX: 0.04,
  maxNeighbors: 0,
  maxConnectionDistance: 0,
};

export const GALAXY_CONFIG = {
  numArms: 5,
  armColors: [
    '#38bdf8', // 총칙: Cyan
    '#818cf8', // 물권: Indigo
    '#a855f7', // 채권: Purple
    '#34d399', // 친족: Emerald
    '#fbbf24', // 상속: Amber
  ],
  maxRadius: 7.0,
};
