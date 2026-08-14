'use client';

import { Html } from '@react-three/drei';
import { LEGAL_DEMO_NODES } from '@/lib/dummy/legalGraphData';
import { GraphSystemState } from '@/types/graph';

interface Article3DLabelsProps {
  state: GraphSystemState;
}

export function Article3DLabels({ state }: Article3DLabelsProps) {
  if (state !== 'STATE_GRAPH_TRAVERSAL' && state !== 'STATE_VECTOR_SEARCH') {
    return null;
  }

  const isVector = state === 'STATE_VECTOR_SEARCH';

  return (
    <group>
      {LEGAL_DEMO_NODES.map((node) => {
        // In Vector search mode, only show Article 13
        if (isVector && node.id !== 'art-13') return null;

        const isCenter = node.id === 'art-13';
        const isException = node.id === 'art-16';

        return (
          <group key={node.id} position={node.position}>
            <Html
              center
              distanceFactor={8}
              position={[0, 0.28, 0]}
              className="pointer-events-none select-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wide border backdrop-blur-md whitespace-nowrap shadow-lg ${
                    isVector
                      ? 'bg-red-950/80 text-red-300 border-red-500/60 shadow-red-950/60 animate-pulse'
                      : isCenter
                      ? 'bg-cyan-950/80 text-cyan-200 border-cyan-400/70 shadow-cyan-950/80'
                      : isException
                      ? 'bg-red-950/80 text-red-200 border-red-500/60 shadow-red-950/60'
                      : 'bg-emerald-950/80 text-emerald-200 border-emerald-400/60 shadow-emerald-950/60'
                  }`}
                >
                  <span>{node.articleNumber}</span>
                  <span className="mx-1 opacity-50">•</span>
                  <span className="font-normal text-[10px]">{node.title}</span>
                </div>

                {isCenter && !isVector && (
                  <span className="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    탐색 기점 (Origin Node)
                  </span>
                )}
                {isVector && (
                  <span className="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-500/20 text-red-300 border border-red-500/40">
                    고립 청크 (Isolated Chunk)
                  </span>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
