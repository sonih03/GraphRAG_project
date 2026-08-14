import { GraphSystemState } from '@/types/graph';
import { cn } from '@/lib/utils/cn';
import { Radio, Globe, AlertTriangle, GitPullRequest, Layers, BarChart3 } from 'lucide-react';

interface StatusBadgeProps {
  state: GraphSystemState;
  className?: string;
}

export function StatusBadge({ state, className }: StatusBadgeProps) {
  const stateConfig = {
    STATE_IDLE: {
      label: 'STATE_IDLE',
      description: 'Dynamic Wave Lattice Active',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      dotColor: 'bg-cyan-400 animate-pulse',
      icon: Radio,
    },
    STATE_GALAXY_VIEW: {
      label: 'GALAXY_VIEW',
      description: 'Full Civil Act 3D Galaxy',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      dotColor: 'bg-indigo-400 animate-pulse',
      icon: Globe,
    },
    STATE_VECTOR_SEARCH: {
      label: 'VECTOR_SEARCH',
      description: 'Isolated Semantic Nodes (No Edges)',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
      dotColor: 'bg-red-400 animate-ping',
      icon: AlertTriangle,
    },
    STATE_GRAPH_TRAVERSAL: {
      label: 'GRAPH_TRAVERSAL',
      description: 'Art. 13 -> 14/15/16 Traversal',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dotColor: 'bg-emerald-400 animate-pulse',
      icon: GitPullRequest,
    },
    STATE_COMPARE_ANSWERS: {
      label: 'COMPARE_ANSWERS',
      description: 'Vector vs Graph Reasoning Split',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      dotColor: 'bg-purple-400',
      icon: Layers,
    },
    STATE_BENCHMARK_RADAR: {
      label: 'BENCHMARK_RADAR',
      description: 'Legal Benchmark Metrics Active',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dotColor: 'bg-amber-400 animate-pulse',
      icon: BarChart3,
    },
  }[state];

  const Icon = stateConfig.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono backdrop-blur-md transition-all shadow-sm',
        stateConfig.badgeColor,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75', stateConfig.dotColor)} />
        <span className={cn('relative inline-flex rounded-full h-2 w-2', stateConfig.dotColor.split(' ')[0])} />
      </span>
      <Icon className="w-3.5 h-3.5" />
      <span className="font-semibold">{stateConfig.label}</span>
      <span className="text-slate-600">|</span>
      <span className="text-slate-300">{stateConfig.description}</span>
    </div>
  );
}
