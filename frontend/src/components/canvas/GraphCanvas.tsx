'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { MorphingGraphUniverse } from './MorphingGraphUniverse';
import { CameraController } from './CameraController';
import { HelixSpiralDeck } from '../lecture/HelixSpiralDeck';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';

import { EdgeBundleCore } from '../edge-bundle/EdgeBundleCore';

interface GraphCanvasProps {
  state: GraphSystemState;
  subgraphData?: DynamicSubgraphData | null;
  panelOpen?: boolean;
  currentQuery?: string | null;
  isBlurred?: boolean;
  currentSlideIndex?: number;
  isIntro?: boolean;
  onSlideChange?: (index: number) => void;
  showEdgeBundle?: boolean;
}

export function GraphCanvas({
  state,
  subgraphData,
  panelOpen = false,
  currentQuery,
  isBlurred = false,
  currentSlideIndex,
  isIntro = false,
  onSlideChange,
  showEdgeBundle = false,
}: GraphCanvasProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Dynamic Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.06),transparent_70%)]" />

      {/* Canvas Wrapper WITHOUT parent blur to prevent sibling HTML blur propagation */}
      <div className="w-full h-full">
        <Canvas
          className={`transition-all duration-[800ms] ease-out ${isBlurred ? 'blur-[4px] opacity-65 scale-[1.02]' : 'blur-0 opacity-100 scale-100'
            }`}
          camera={{ position: [0, 0, 13.5], fov: 48 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
        >
          <ambientLight intensity={1.0} />

          <Suspense fallback={null}>
            {/* 3D Helix Spinal Cord Core (지식 척추망) */}
            {showEdgeBundle && <EdgeBundleCore state={state} />}

            {/* 3D Helix Spiral Slide Deck wrapping around central DB edges */}
            {currentSlideIndex !== undefined && (
              <HelixSpiralDeck
                currentSlideIndex={currentSlideIndex}
                onSlideChange={onSlideChange}
              />
            )}

            {/* Central 5,000 Particle Morphing Engine */}
            {!showEdgeBundle && (
              <MorphingGraphUniverse
                state={state}
                pointCount={5000}
                subgraphData={subgraphData}
                panelOpen={panelOpen}
                currentQuery={currentQuery}
                currentSlideIndex={currentSlideIndex}
              />
            )}
          </Suspense>

          {/* Dynamic Smooth Lerp Camera */}
          <CameraController
            state={state}
            subgraphData={subgraphData}
            panelOpen={panelOpen}
            currentSlideIndex={currentSlideIndex}
            isIntro={isIntro}
          />
        </Canvas>
      </div>
    </div>
  );
}
