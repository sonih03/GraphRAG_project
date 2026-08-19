'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { MorphingGraphUniverse } from './MorphingGraphUniverse';
import { CameraController } from './CameraController';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';

interface GraphCanvasProps {
  state: GraphSystemState;
  subgraphData?: DynamicSubgraphData | null;
  panelOpen?: boolean;
  currentQuery?: string | null;
}

export function GraphCanvas({ state, subgraphData, panelOpen = false, currentQuery }: GraphCanvasProps) {
  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden bg-black">
      {/* Dynamic Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.06),transparent_70%)]" />

      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.0} />

        <Suspense fallback={null}>
          {/* Central 5,000 Particle Morphing Engine */}
          <MorphingGraphUniverse
            state={state}
            pointCount={5000}
            subgraphData={subgraphData}
            panelOpen={panelOpen}
            currentQuery={currentQuery}
          />
        </Suspense>

        {/* Dynamic Smooth Lerp Camera */}
        <CameraController
          state={state}
          subgraphData={subgraphData}
          panelOpen={panelOpen}
        />
      </Canvas>
    </div>
  );
}
