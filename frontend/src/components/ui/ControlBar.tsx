'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Search, Sparkles, Mic, Globe, GitPullRequest, BarChart3, RotateCcw, Loader2, Layers, ShieldAlert } from 'lucide-react';
import { GraphSystemState } from '@/types/graph';

interface ControlBarProps {
  currentState: GraphSystemState;
  onSetState: (nextState: GraphSystemState) => void;
  onQueryResult?: (data: any) => void;
  onSearchStart?: (queryText: string) => void;
}

export function ControlBar({ currentState, onSetState, onQueryResult, onSearchStart }: ControlBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // 4 Curated prompt chips for live presentation
  const chips: { label: string; state: GraphSystemState; icon: any; queryText: string }[] = [
    {
      label: '기본 구체 (IDLE)',
      state: 'STATE_IDLE',
      icon: RotateCcw,
      queryText: '',
    },
    {
      label: '전체 DB 지식 그래프',
      state: 'STATE_GALAXY_VIEW',
      icon: Globe,
      queryText: '전체 데이터베이스 구조 보여줘',
    },
    {
      label: '내 땅에 무단 구조물 설치 (물권↔채권)',
      state: 'STATE_GRAPH_TRAVERSAL',
      icon: ShieldAlert,
      queryText: '다른 사람이 내 땅에 구조물을 설치했는데 법적으로 어떻게 해야 해?',
    },
    {
      label: '성능 벤치마크',
      state: 'STATE_BENCHMARK_RADAR',
      icon: BarChart3,
      queryText: '벤치마크 성능 수치 보여줘',
    },
  ];

  const handleExecuteQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);

    if (onSearchStart) {
      onSearchStart(queryText);
    }

    const isOverviewQuery = queryText.includes('전체') || queryText.includes('데이터베이스') || queryText.includes('모두');
    const isBenchmarkQuery = queryText.includes('벤치마크') || queryText.includes('성능') || queryText.includes('비교');

    if (isOverviewQuery) {
      onSetState('STATE_GALAXY_VIEW');
      setLoading(false);
      return;
    } else if (isBenchmarkQuery) {
      onSetState('STATE_BENCHMARK_RADAR');
      setLoading(false);
      return;
    } else {
      onSetState('STATE_QUERYING');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      // Call FastAPI live query endpoint
      const res = await fetch('http://localhost:8000/api/v1/graph/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (onQueryResult) {
        onQueryResult(data);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('Query execution timed out (45s).');
      } else {
        console.error('Query execution failed:', err);
      }
      // Fallback state change
      onSetState('STATE_IDLE');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleChipClick = (chip: typeof chips[0]) => {
    onSetState(chip.state);
    if (chip.queryText) {
      setQuery(chip.queryText);
      handleExecuteQuery(chip.queryText);
    } else {
      setQuery('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteQuery(query);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-30 flex flex-col items-center gap-3">
      {/* 4 Focused Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
        {chips.map((chip, idx) => {
          const Icon = chip.icon;
          const isActive = currentState === chip.state && (!chip.queryText || query === chip.queryText);

          return (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide backdrop-blur-md transition-all duration-300 border ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:bg-slate-800/80 hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Glassmorphic Search Input Bar */}
      <GlassCard className="w-full p-2 flex items-center gap-2 border-cyan-500/20 bg-slate-950/75 shadow-2xl backdrop-blur-2xl">
        <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
          <div className="pl-3 text-cyan-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 다른 사람이 내 땅에 구조물을 설치했는데 법적으로 어떻게 해야 해?"
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500 font-sans tracking-wide"
          />

          {/* Voice Input Indicator Button */}
          <button
            type="button"
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors"
            title="Groq Whisper 음성 인식 (준비됨)"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/40 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>질의 실행</span>
          </button>
        </form>
      </GlassCard>

      {/* Status Bar Indicator */}
      <div className="flex items-center justify-between w-full px-2 text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Neo4j 1,118 Articles & 530 Relations
          </span>
          <span>•</span>
          <span>Live Backend</span>
          <span>•</span>
          <span>60 FPS Fluid Damping</span>
        </div>
        <div className="text-slate-500">
          칩 클릭 또는 텍스트 입력으로 3D 전환
        </div>
      </div>
    </div>
  );
}
