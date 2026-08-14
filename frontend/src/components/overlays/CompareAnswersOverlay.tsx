'use client';

import { motion } from 'framer-motion';
import { COMPARISON_DUMMY_DATA } from '@/lib/dummy/legalGraphData';
import { XCircle, CheckCircle2, Split, Sparkles, AlertCircle } from 'lucide-react';

interface CompareAnswersOverlayProps {
  onClose?: () => void;
}

export function CompareAnswersOverlay({ onClose }: CompareAnswersOverlayProps) {
  const { query, vectorRAG, graphRAG } = COMPARISON_DUMMY_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', damping: 25, stiffness: 240 }}
      className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8 pointer-events-auto bg-black/60 backdrop-blur-md"
    >
      <div className="w-full max-w-5xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header Question Bar */}
        <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Split className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-wider">
                  실시간 법률 RAG 답변 비교 평가 (Live Compare)
                </span>
                <h2 className="text-sm md:text-base font-bold text-slate-100 mt-0.5">
                  질의: &quot;{query}&quot;
                </h2>
              </div>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                닫기 ✕
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Split Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: VectorRAG */}
          <div className="backdrop-blur-xl bg-red-950/30 border border-red-500/40 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h3 className="font-bold text-sm text-red-200">{vectorRAG.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-red-500/10 text-red-300 border-red-500/30">
                  신뢰도 {vectorRAG.confidence}
                </span>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/20">
                <span className="text-[10px] font-mono text-red-400 font-bold block mb-1">
                  생성된 답변 (오답 및 누락 발생)
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {vectorRAG.answer}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-mono text-red-400 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>주요 결함 및 누락 요인</span>
                </span>
                <ul className="space-y-1 text-[11px] text-slate-300 font-mono">
                  {vectorRAG.missingPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-400 shrink-0">✕</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-red-500/20 text-[10px] font-mono text-slate-400">
              추출 단위: 단일 텍스트 청크 임베딩
            </div>
          </div>

          {/* Right: GraphRAG */}
          <div className="backdrop-blur-xl bg-emerald-950/30 border border-emerald-500/50 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-emerald-200">{graphRAG.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                  신뢰도 {graphRAG.confidence}
                </span>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
                  생성된 답변 (완벽한 다중 홉 법률 분석)
                </span>
                <p className="text-xs text-slate-100 leading-relaxed whitespace-pre-line">
                  {graphRAG.answer}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>GraphRAG 핵심 강점</span>
                </span>
                <ul className="space-y-1 text-[11px] text-slate-200 font-mono">
                  {graphRAG.highlights.map((hl, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-300/80">
              추출 단위: Neo4j 온톨로지 경로 다중 홉 서브그래프
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
