'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, GitFork, Server, Code, FileText, BarChart3, Database } from 'lucide-react';

export type SlideVisualType = 'text' | 'regex' | 'ontology' | 'architecture' | 'comparison' | 'summary';

interface PresentationSlideCardProps {
  slideIndex: number;
  title: string;
  subtitle: string;
  bullets: string[];
  visualType?: SlideVisualType;
  isActive: boolean;
  rotateY?: number;
}

export function PresentationSlideCard({
  slideIndex,
  title,
  subtitle,
  bullets,
  visualType = 'text',
  isActive,
  rotateY = 0,
}: PresentationSlideCardProps) {
  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideIndex}
        initial={{ opacity: 0, scale: 0.85, rotateY: rotateY - 20, y: 30 }}
        animate={{ opacity: 1, scale: 1, rotateY: rotateY, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotateY: rotateY + 15, y: -20 }}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1], // Custom cinematic cubic-bezier easing
        }}
        style={{ perspective: 1200 }}
        className="w-full max-w-4xl mx-auto overflow-hidden rounded-3xl border border-white/15 bg-slate-950/88 p-8 md:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.7)] backdrop-blur-3xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Slide Text Content (Left Panel) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex items-center space-x-3 text-sky-400 font-semibold tracking-wider uppercase text-sm">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                Slide {String(slideIndex).padStart(2, '0')}
              </span>
              <span>•</span>
              <span>민법 GraphRAG 교안</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-base md:text-lg text-slate-400 font-medium">
                {subtitle}
              </p>
            </div>

            <ul className="space-y-3.5 text-slate-300">
              {bullets.map((bullet, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
                  className="flex items-start space-x-3 text-sm md:text-base leading-relaxed"
                >
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                  <span>{bullet}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Slide Dynamic Graphic (Right Panel) */}
          <div className="lg:col-span-5 h-[300px] lg:h-[350px] w-full flex items-center justify-center rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-md overflow-hidden">
            {renderVisualGraphic(visualType)}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Render appropriate SVG Infographic based on visualType to maximize audience comprehension.
 */
function renderVisualGraphic(type: SlideVisualType) {
  switch (type) {
    case 'regex':
      return (
        <div className="flex flex-col space-y-4 w-full h-full justify-center">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono bg-indigo-500/10 px-2.5 py-1.5 rounded-lg border border-indigo-500/20 self-start">
            <Code className="w-3.5 h-3.5" />
            <span>Regex Parser Pattern</span>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
            <span className="text-emerald-400">const</span> pattern = <span className="text-sky-300">/제\s*(\d+(?:의\d+)?)\s*조/g</span>;<br />
            <span className="text-slate-500">// 제14조의2 가지번호 보존 파싱</span><br />
            <span className="text-purple-400">"제14조의2 제1항"</span>.match(pattern);<br />
            <span className="text-amber-400">➔ ["제14조의2"] (오차율 0% 추출)</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 px-1">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />결정론적 매칭</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />비용 ₩0원 빌드</span>
          </div>
        </div>
      );

    case 'ontology':
      return (
        <div className="relative w-full h-full flex flex-col justify-center space-y-5">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 self-start">
            <GitFork className="w-3.5 h-3.5" />
            <span>Legal Ontology Edges</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mb-1.5 shadow-[0_0_6px_#10b981]" />
              <span className="text-white text-xs font-semibold">MUTATIS</span>
              <span className="text-[9px] text-emerald-400/80 mt-0.5">준용한다</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-rose-400 mb-1.5 shadow-[0_0_6px_#f43f5e]" />
              <span className="text-white text-xs font-semibold">EXCEPTION</span>
              <span className="text-[9px] text-rose-400/80 mt-0.5">불구하고</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-sky-400 mb-1.5 shadow-[0_0_6px_#0ea5e9]" />
              <span className="text-white text-xs font-semibold">REFER</span>
              <span className="text-[9px] text-sky-400/80 mt-0.5">참조/인용</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center bg-slate-950/40 py-2 rounded-lg border border-white/5">
            상대 참조("전조") 및 범위 전개("내지") 자동 해석
          </div>
        </div>
      );

    case 'architecture':
      return (
        <div className="flex flex-col space-y-4 w-full h-full justify-center">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20 self-start">
            <Server className="w-3.5 h-3.5" />
            <span>4-Stage Ingestion Pipeline</span>
          </div>
          <div className="flex flex-col space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border-l-2 border-sky-500 text-slate-300">
              <span>1. 로드 & 인코딩 정화</span>
              <span className="text-[10px] text-slate-500">UTF-8 Normalization</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border-l-2 border-indigo-500 text-slate-300">
              <span>2. 정규식 조문/항 파싱</span>
              <span className="text-[10px] text-slate-500">Clause Sub-chunking</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border-l-2 border-emerald-500 text-slate-300">
              <span>3. 하이브리드 관계 추출</span>
              <span className="text-[10px] text-slate-500">Ontology Builder</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border-l-2 border-purple-500 text-slate-300">
              <span>4. Neo4j 멱등 배치 적재</span>
              <span className="text-[10px] text-slate-500">UNWIND Batch Ingest</span>
            </div>
          </div>
        </div>
      );

    case 'comparison':
      return (
        <div className="flex flex-col space-y-3.5 w-full h-full justify-center">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono bg-sky-500/10 px-2.5 py-1.5 rounded-lg border border-sky-500/20 self-start">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>MS GraphRAG vs 본 시스템</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-[10px] text-left text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-1.5 font-semibold">구분</th>
                  <th className="pb-1.5 font-semibold">Microsoft</th>
                  <th className="pb-1.5 font-semibold text-sky-400">본 시스템 (민법)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 font-medium">관계 추출</td>
                  <td className="py-2 text-slate-400">LLM 호출 (비쌈)</td>
                  <td className="py-2 text-emerald-400 font-semibold">정규식 매칭 (₩0원)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 font-medium">빌드 시간</td>
                  <td className="py-2 text-slate-400">수십 분 소요</td>
                  <td className="py-2 text-emerald-400 font-semibold">로컬 단 3초</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">컨텍스트</td>
                  <td className="py-2 text-slate-400">요약문 위주</td>
                  <td className="py-2 text-emerald-400 font-semibold">조문 원문 팩트 100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'summary':
      return (
        <div className="flex flex-col space-y-4 w-full h-full justify-center">
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono bg-purple-500/10 px-2.5 py-1.5 rounded-lg border border-purple-500/20 self-start">
            <Database className="w-3.5 h-3.5" />
            <span>Hybrid GraphRAG Core</span>
          </div>
          <div className="flex justify-around items-center h-24 relative bg-slate-950/50 rounded-xl border border-white/5 p-4">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 mb-1">지식 탐색</span>
              <span className="px-2 py-1 bg-sky-500/20 text-sky-300 rounded text-xs font-bold border border-sky-500/30">Neo4j DB (규칙)</span>
            </div>
            <div className="text-slate-500 font-bold text-lg">➔</div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 mb-1">자연어 생성</span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-bold border border-purple-500/30">Gemini LLM (생성)</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center font-medium">
            결정론(지식 그래프)과 확률론(LLM)의 완벽한 결합
          </div>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center space-y-3 text-slate-400">
          <FileText className="w-12 h-12 stroke-[1.2] text-slate-500" />
          <span className="text-xs font-mono text-center">대한민국 민법 지식망<br />GraphRAG 시스템 시연 중</span>
        </div>
      );
  }
}
