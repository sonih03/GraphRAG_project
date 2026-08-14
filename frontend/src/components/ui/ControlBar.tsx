'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Search, Sparkles, Mic, Globe, GitPullRequest, BarChart3, RotateCcw, Loader2 } from 'lucide-react';
import { GraphSystemState } from '@/types/graph';

interface ControlBarProps {
  currentState: GraphSystemState;
  onSetState: (nextState: GraphSystemState) => void;
  onQueryResult?: (data: any) => void;
}

export function ControlBar({ currentState, onSetState, onQueryResult }: ControlBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // 4 Focused prompt chips
  const chips: { label: string; state: GraphSystemState; icon: any; queryText: string }[] = [
    {
      label: '기본 구체 (IDLE)',
      state: 'STATE_IDLE',
      icon: RotateCcw,
      queryText: '',
    },
    {
      label: '전체 은하 구조',
      state: 'STATE_GALAXY_VIEW',
      icon: Globe,
      queryText: '전체 데이터베이스 구조 보여줘',
    },
    {
      label: 'GraphRAG 연관 탐색',
      state: 'STATE_GRAPH_TRAVERSAL',
      icon: GitPullRequest,
      queryText: 'GraphRAG로 제13조 연관 구조 보여줘',
    },
    {
      label: '성능 벤치마크',
      state: 'STATE_BENCHMARK_RADAR',
      icon: BarChart3,
      queryText: '벤치마크 성능 수치 보여줘',
    },
  ];

  const handleExecuteQuery = async (textToProcess?: string) => {
    const raw = (textToProcess !== undefined ? textToProcess : query).trim();
    const lower = raw.toLowerCase();

    if (!raw) {
      onSetState('STATE_IDLE');
      return;
    }

    if (lower.includes('전체') || lower.includes('은하') || lower.includes('galaxy') || lower.includes('db')) {
      onSetState('STATE_GALAXY_VIEW');
      return;
    } else if (lower.includes('벤치마크') || lower.includes('수치') || lower.includes('benchmark') || lower.includes('radar')) {
      onSetState('STATE_BENCHMARK_RADAR');
      return;
    }

    // GraphRAG / Article query -> Call real backend API
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: raw, mode: 'hybrid' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (onQueryResult) onQueryResult(data);
      }
      onSetState('STATE_GRAPH_TRAVERSAL');
    } catch (err) {
      console.warn('Backend query fallback:', err);
      onSetState('STATE_GRAPH_TRAVERSAL');
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip: (typeof chips)[0]) => {
    setQuery(chip.queryText);
    if (chip.state === 'STATE_GRAPH_TRAVERSAL') {
      handleExecuteQuery(chip.queryText);
    } else {
      onSetState(chip.state);
    }
  };

  return (
    <div className="absolute bottom-5 left-0 right-0 z-20 px-4 pointer-events-none">
      <div className="max-w-3xl mx-auto flex flex-col gap-2.5">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap pointer-events-auto">
          {chips.map((chip, idx) => {
            const Icon = chip.icon;
            const isActive = currentState === chip.state;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all border shadow-lg backdrop-blur-md cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-cyan-950/60 scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-700/80 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Search / Voice Trigger Bar */}
        <GlassCard glow className="pointer-events-auto p-2 flex items-center gap-2 border-cyan-500/30 bg-zinc-900/85 shadow-2xl shadow-cyan-950/40">
          <div className="pl-3 text-cyan-400">
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> : <Search className="w-4 h-4" />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecuteQuery();
            }}
            placeholder="명령어 입력 (예: 'GraphRAG로 제13조 연관 구조 보여줘', '전체 데이터베이스 구조 보여줘')..."
            className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-slate-100 placeholder-slate-500 font-mono px-2 py-1"
          />
          <button
            type="button"
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-300 hover:text-cyan-400 transition-colors border border-zinc-700 cursor-pointer"
            title="Groq Whisper STT 음성 인식"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleExecuteQuery()}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? '추론 중...' : '질의 실행'}</span>
          </button>
        </GlassCard>

        {/* Quick Stats & Controls Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              <span>Neo4j 301 Nodes • Live Backend</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>60 FPS Fluid Damping</span>
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <span className="text-[11px] text-slate-500">칩 클릭 또는 텍스트 입력으로 3D 전환</span>
          </div>
        </div>
      </div>
    </div>
  );
}
