'use client';

import { useState } from 'react';
import { GraphCanvas } from '@/components/canvas/GraphCanvas';
import { Header } from '@/components/ui/Header';
import { ControlBar } from '@/components/ui/ControlBar';
import { OverlayManager } from '@/components/overlays/OverlayManager';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';

export default function Home() {
  const [currentState, setCurrentState] = useState<GraphSystemState>('STATE_IDLE');
  const [subgraphData, setSubgraphData] = useState<DynamicSubgraphData | null>(null);
  const [legalAnswer, setLegalAnswer] = useState<string | null>(null);

  const handleQueryResult = (result: any) => {
    if (result) {
      if (result.subgraph) {
        setSubgraphData(result.subgraph);
      }
      if (result.legal_answer) {
        setLegalAnswer(result.legal_answer);
      }
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 select-none">
      {/* Top Header with live State Synchronized */}
      <Header state={currentState} />

      {/* Central 3D Canvas with 5,000 Particle Morphing Universe */}
      <div className="w-full h-full">
        <GraphCanvas state={currentState} subgraphData={subgraphData} />
      </div>

      {/* Interactive Glassmorphism Overlay Popups & GraphRAG AI Answer Box */}
      <OverlayManager
        state={currentState}
        onSetState={setCurrentState}
        subgraphData={subgraphData}
        legalAnswer={legalAnswer}
      />

      {/* Bottom Query & Quick Prompt Chips */}
      <ControlBar
        currentState={currentState}
        onSetState={setCurrentState}
        onQueryResult={handleQueryResult}
      />
    </main>
  );
}
