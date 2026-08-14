'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';

interface VectorWarningOverlayProps {
  onNextAction?: () => void;
}

export function VectorWarningOverlay({ onNextAction }: VectorWarningOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className="absolute top-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-auto"
    >
      <div className="backdrop-blur-xl bg-red-950/70 border border-red-500/50 rounded-2xl p-5 shadow-2xl shadow-red-950/80 text-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/30 text-red-300 border border-red-500/40">
                VectorRAG 한계 감지
              </span>
              <span className="text-xs text-red-300/80 font-mono">단일 임베딩 유사도 검색</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              고립 청크(Isolated Chunk) 추출로 법률 준용·예외 누락
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              임베딩 벡터는 <span className="text-red-300 font-semibold">제13조 텍스트 청크만 단편적으로 검색</span>하여,
              실제 법률 적용에 필수적인 <span className="text-amber-300 font-semibold">제14조(종료심판)</span> 및{' '}
              <span className="text-amber-300 font-semibold">제15조(상대방 확답촉구권) 준용 규정</span>을 전혀 파악하지 못했습니다.
            </p>

            <div className="mt-3.5 pt-3 border-t border-red-500/30 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                ※ 연결 관계가 단절되어 심각한 환각/오답 유발
              </span>
              {onNextAction && (
                <button
                  type="button"
                  onClick={onNextAction}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>GraphRAG 연관 탐색으로 해결</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
