'use client';

import { NoiseWaveSphere } from './NoiseWaveSphere';

export function IdleSphereGraph() {
  return (
    <group>
      <NoiseWaveSphere
        radius={2.0}
        pointCount={5000}
      />
    </group>
  );
}
