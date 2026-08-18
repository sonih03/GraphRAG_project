'use client';

import { AnimatePresence } from 'framer-motion';
import { GraphSystemState, DynamicSubgraphData } from '@/types/graph';
import { BenchmarkRadarOverlay } from './BenchmarkRadarOverlay';
import { GraphRAGAnswerPanel } from './GraphRAGAnswerPanel';

interface OverlayManagerProps {
  state: GraphSystemState;
  onSetState: (nextState: GraphSystemState) => void;
  subgraphData?: DynamicSubgraphData | null;
  legalAnswer?: string | null;
}

export function OverlayManager({
  state,
  onSetState,
  subgraphData = null,
  legalAnswer = null,
}: OverlayManagerProps) {
  return (
    <AnimatePresence mode="wait">
      {/* 1. Benchmark Radar Modal */}
      {state === 'STATE_BENCHMARK_RADAR' && (
        <BenchmarkRadarOverlay
          key="benchmark-radar"
          onClose={() => onSetState('STATE_IDLE')}
        />
      )}

      {/* 2. GraphRAG AI Legal Analysis Side Box (Opened during Graph Traversal) */}
      {state === 'STATE_GRAPH_TRAVERSAL' && subgraphData && (
        <GraphRAGAnswerPanel
          key="graphrag-answer-panel"
          subgraphData={subgraphData}
          legalAnswer={legalAnswer}
          onClose={() => onSetState('STATE_IDLE')}
        />
      )}
    </AnimatePresence>
  );
}
