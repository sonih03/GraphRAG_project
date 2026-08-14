import { GraphNodeInstance, GraphSphereConfig } from '@/types/graph';

export function generateFibonacciSphereNodes(config: GraphSphereConfig): GraphNodeInstance[] {
  const { nodeCount, radius, coreColor, glowColor } = config;
  const nodes: GraphNodeInstance[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < nodeCount; i++) {
    const y = 1 - (i / (nodeCount - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = 2 * Math.PI * i / goldenRatio;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    nodes.push({
      id: `node-${i}`,
      position: [x * radius, y * radius, z * radius],
      color: i % 2 === 0 ? coreColor : glowColor,
      scale: 1.0,
      degree: 1,
      pulsePhase: (i * 0.2) % (Math.PI * 2),
    });
  }

  return nodes;
}
