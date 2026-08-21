'use client';

import { useState, useRef } from 'react';
import { GraphCanvas } from '@/components/canvas/GraphCanvas';
import { Header } from '@/components/ui/Header';
import { ControlBar } from '@/components/ui/ControlBar';
import { OverlayManager } from '@/components/overlays/OverlayManager';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';

export default function Home() {
  const [currentState, setCurrentState] = useState<GraphSystemState>('STATE_IDLE');
  const [subgraphData, setSubgraphData] = useState<DynamicSubgraphData | null>(null);
  const [legalAnswer, setLegalAnswer] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const queryStartRef = useRef<number>(0);

  // Panel is considered open when traversal mode has active subgraph data
  const isPanelOpen =
    currentState === 'STATE_GRAPH_TRAVERSAL' && subgraphData !== null;

  const handleQueryResult = (result: any) => {
    if (result) {
      const elapsed = Date.now() - queryStartRef.current;
      const minAnimationTime = 1200; // 1.2s connection animation time
      const delay = Math.max(0, minAnimationTime - elapsed);

      setTimeout(() => {
        // 1. Transition state to trigger highlights
        const isVector = result.mode === 'vector' || result.subgraph?.mode === 'vector';
        setCurrentState(isVector ? 'STATE_VECTOR_SEARCH' : 'STATE_GRAPH_TRAVERSAL');

        // 2. Delay loading panel data by 800ms so graph connects fully before panel slides open
        setTimeout(() => {
          if (result.subgraph) {
            setSubgraphData(result.subgraph);
          }
          if (result.answer) {
            setLegalAnswer(result.answer);
          } else if (result.legal_answer) {
            setLegalAnswer(result.legal_answer);
          }
        }, 800);
      }, delay);
    }
  };

  const handlePanelClose = () => {
    setCurrentState('STATE_IDLE');
    // Delay clearing data so exit animation can play
    setTimeout(() => {
      setSubgraphData(null);
      setLegalAnswer(null);
      setCurrentQuery('');
    }, 400);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 select-none">
      {/* Central 3D Canvas — Fullscreen Absolute Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <GraphCanvas state={currentState} subgraphData={subgraphData} panelOpen={isPanelOpen} currentQuery={currentQuery} />
      </div>

      {/* Top Header with live State Synchronized */}
      <Header state={currentState} />

      {/* Interactive Glassmorphism Overlay Popups & GraphRAG AI Answer Box */}
      <OverlayManager
        state={currentState}
        onSetState={setCurrentState}
        subgraphData={subgraphData}
        legalAnswer={legalAnswer}
        onPanelClose={handlePanelClose}
      />

      {/* Bottom Query & Quick Prompt Chips */}
      <ControlBar
        currentState={currentState}
        onSetState={setCurrentState}
        onQueryResult={handleQueryResult}
        onSearchStart={(queryText) => {
          setCurrentQuery(queryText);
          queryStartRef.current = Date.now();
        }}
      />
    </main>
  );
}
