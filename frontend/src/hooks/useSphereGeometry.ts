'use client';

import { useMemo } from 'react';
import { GraphSphereConfig } from '@/types/graph';
import { generateFibonacciSphereNodes } from '@/lib/utils/math';
import { IDLE_SPHERE_CONFIG } from '@/lib/constants/graphConfig';

export function useSphereGeometry(config: GraphSphereConfig = IDLE_SPHERE_CONFIG) {
  const nodes = useMemo(() => {
    return generateFibonacciSphereNodes(config);
  }, [config]);

  return {
    nodes,
    nodeCount: nodes.length,
  };
}
