import { StatusBadge } from './StatusBadge';
import { GlassCard } from './GlassCard';
import { Network, Cpu } from 'lucide-react';
import { GraphSystemState } from '@/types/graph';

interface HeaderProps {
  state: GraphSystemState;
}

export function Header({ state }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Title */}
        <GlassCard className="pointer-events-auto px-4 py-2.5 flex items-center gap-3 border-cyan-500/20 shadow-xl shadow-cyan-950/40">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
                GraphRAG Legal Navigator
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Live Demo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Korean Civil Act • 3D Morphing Knowledge Graph
            </p>
          </div>
        </GlassCard>

        {/* System State Badge */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-3">
          <StatusBadge state={state} />
          <GlassCard className="px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-slate-400 border-zinc-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>FastAPI • Neo4j Engine</span>
          </GlassCard>
        </div>
      </div>
    </header>
  );
}
