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
  /** Called when the AI panel is explicitly closed by the user */
  onPanelClose?: () => void;
}

export function OverlayManager({
  state,
  onSetState,
  subgraphData = null,
  legalAnswer = null,
  onPanelClose,
}: OverlayManagerProps) {
  const handlePanelClose = () => {
    if (onPanelClose) {
      onPanelClose();
    } else {
      onSetState('STATE_IDLE');
    }
  };

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
          onClose={handlePanelClose}
        />
      )}
    </AnimatePresence>
  );
}
