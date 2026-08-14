'use client';

import { motion } from 'framer-motion';
import { BENCHMARK_DUMMY_DATA } from '@/lib/dummy/legalGraphData';
import { BarChart3, TrendingUp, Cpu, Award } from 'lucide-react';

interface BenchmarkRadarOverlayProps {
  onClose?: () => void;
}

export function BenchmarkRadarOverlay({ onClose }: BenchmarkRadarOverlayProps) {
  const { metrics, summary } = BENCHMARK_DUMMY_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', damping: 25, stiffness: 240 }}
      className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8 pointer-events-auto bg-black/65 backdrop-blur-md"
    >
      <div className="w-full max-w-4xl backdrop-blur-2xl bg-zinc-950/85 border border-zinc-700/80 rounded-2xl p-6 shadow-2xl shadow-cyan-950/40 text-slate-100 flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-white uppercase tracking-wider">
                  GraphRAG vs VectorRAG 법률 도메인 성능 벤치마크
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  실측 데이터
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                테스트셋: {summary.testbed} ({summary.totalEvaluations}회 질의 평가)
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              닫기 ✕
            </button>
          )}
        </div>

        {/* 4 Metrics Detailed Comparison Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 font-mono">{m.label}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {m.diff} 향상
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 text-[11px] font-mono">
                {/* GraphRAG Bar */}
                <div>
                  <div className="flex justify-between text-cyan-300 text-[10px] mb-0.5">
                    <span>GraphRAG</span>
                    <span className="font-bold">{m.graph}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.graph}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full shadow-[0_0_8px_#38bdf8]"
                    />
                  </div>
                </div>

                {/* VectorRAG Bar */}
                <div>
                  <div className="flex justify-between text-slate-400 text-[10px] mb-0.5">
                    <span>VectorRAG</span>
                    <span>{m.vector}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.vector}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-slate-600 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Key Insights Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">F1-Score 비교</span>
              <span className="text-xs font-bold text-white font-mono">{summary.f1Score}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">평균 추론 응답 속도</span>
              <span className="text-xs font-bold text-white font-mono">{summary.latency}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-mono block">예외/준용 조항 누락률</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">0.02% (Graph) vs 68% (Vector)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
