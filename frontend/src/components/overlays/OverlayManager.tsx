'use client';

import { AnimatePresence } from 'framer-motion';
import { GraphSystemState } from '@/types/graph';
import { BenchmarkRadarOverlay } from './BenchmarkRadarOverlay';

interface OverlayManagerProps {
  state: GraphSystemState;
  onSetState: (nextState: GraphSystemState) => void;
}

export function OverlayManager({ state, onSetState }: OverlayManagerProps) {
  return (
    <AnimatePresence mode="wait">
      {state === 'STATE_BENCHMARK_RADAR' && (
        <BenchmarkRadarOverlay
          key="benchmark-radar"
          onClose={() => onSetState('STATE_IDLE')}
        />
      )}
    </AnimatePresence>
  );
}
