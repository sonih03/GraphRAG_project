'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from './GlassCard';
import { Search, Sparkles, Mic, Globe, GitPullRequest, BarChart3, RotateCcw, Loader2, Layers, ShieldAlert, Disc } from 'lucide-react';
import { GraphSystemState } from '@/types/graph';
import { AudioControlManager } from '@/lib/utils/AudioControlManager';

interface ControlBarProps {
  currentState: GraphSystemState;
  onSetState: (nextState: GraphSystemState) => void;
  onQueryResult?: (data: any) => void;
  onSearchStart?: (queryText: string) => void;
}

export function ControlBar({ currentState, onSetState, onQueryResult, onSearchStart }: ControlBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Audio control manager states
  const [isRecording, setIsRecording] = useState(false);
  const [yamnetStatus, setYamnetStatus] = useState<'loading' | 'ready' | 'listening' | 'error'>('loading');
  const [yamnetMsg, setYamnetMsg] = useState('캘리브레이션 준비 중...');

  const audioManagerRef = useRef<AudioControlManager | null>(null);
  const recognitionRef = useRef<any>(null);
  const liveQueryRef = useRef('');
  const isListeningRef = useRef(false);

  // Handle manual/real-time query state synchronization
  const handleQueryChange = (text: string) => {
    setQuery(text);
    liveQueryRef.current = text;
  };

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

  // Send recording blob to API
  const sendAudioToTranscribe = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice.webm');

      console.log("[Voice Control] Submitting audio stream...");
      const res = await fetch('http://localhost:8000/api/v1/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`STT API returned error status: ${res.status}`);
      }

      const data = await res.json();
      const transcribedText = data.text || '';
      console.log(`[Voice Control] Transcribed output: "${transcribedText}"`);
      
      // Filter out Whisper silent-hallucinations (commonly "감사합니다." or similar when recording snaps/silence only)
      const cleanText = transcribedText.replace(/[.\s]/g, '').trim();
      if (cleanText === '감사합니다' || cleanText === 'thankyou' || cleanText === '감사합니다.') {
        console.log("[Voice Control] Suppressed Whisper hallucination ('감사합니다'). Ignoring query execution.");
        return;
      }

      if (transcribedText.trim()) {
        handleVoiceCommand(transcribedText);
      }
    } catch (err) {
      console.error("[Voice Control] Failed to transcribe audio:", err);
    } finally {
      setLoading(false);
    }
  };

  // Map natural language text to actions
  const handleVoiceCommand = (text: string) => {
    const normalized = text.toLowerCase().trim();
    console.log(`[Voice Control] Parsed command: "${normalized}"`);

    // 0. Direct Slide Navigation commands
    if (normalized.includes('이전') || normalized.includes('뒤로') || normalized.includes('백') || normalized.includes('이전 페이지')) {
      console.log("[Voice Control] Trigger Slide Prev -> Dispatching slide-prev");
      window.dispatchEvent(new CustomEvent('slide-prev'));
      setQuery('');
      return;
    }

    // 1. Pages Routing
    if (normalized.includes('강의') || normalized.includes('렉처') || normalized.includes('수업') || normalized.includes('시연')) {
      console.log("[Voice Control] Navigate -> /lecture");
      router.push('/lecture');
      return;
    }
    if (normalized.includes('에지') || normalized.includes('엣지') || normalized.includes('번들')) {
      console.log("[Voice Control] Navigate -> /edge-bundle");
      router.push('/edge-bundle');
      return;
    }
    if (normalized.includes('메인') || normalized.includes('홈') || normalized.includes('대시보드') || normalized.includes('처음')) {
      console.log("[Voice Control] Navigate -> /");
      router.push('/');
      return;
    }
    if (normalized.includes('테스트')) {
      console.log("[Voice Control] Navigate -> /glass-orb-test");
      router.push('/glass-orb-test');
      return;
    }

    // 2. 3D States Transitions
    if (normalized.includes('기본 구체') || normalized.includes('아이들') || normalized.includes('대기')) {
      console.log("[Voice Control] State -> STATE_IDLE");
      onSetState('STATE_IDLE');
      setQuery('');
      return;
    }
    if (normalized.includes('전체') || normalized.includes('은하') || normalized.includes('지식 그래프') || normalized.includes('갤럭시')) {
      console.log("[Voice Control] State -> STATE_GALAXY_VIEW");
      onSetState('STATE_GALAXY_VIEW');
      setQuery('전체 데이터베이스 구조 보여줘');
      return;
    }
    if (normalized.includes('벤치마크') || normalized.includes('성능') || normalized.includes('비교') || normalized.includes('레이더')) {
      console.log("[Voice Control] State -> STATE_BENCHMARK_RADAR");
      onSetState('STATE_BENCHMARK_RADAR');
      setQuery('벤치마크 성능 수치 보여줘');
      return;
    }
    if (normalized.includes('무단 구조물') || normalized.includes('물권') || normalized.includes('채권') || normalized.includes('트래버설') || normalized.includes('어떻게 해야')) {
      console.log("[Voice Control] State -> STATE_GRAPH_TRAVERSAL & RAG Execution");
      const traversalQuery = '다른 사람이 내 땅에 구조물을 설치했는데 법적으로 어떻게 해야 해?';
      onSetState('STATE_GRAPH_TRAVERSAL');
      setQuery(traversalQuery);
      handleExecuteQuery(traversalQuery);
      return;
    }

    // 3. RAG Fallback Query
    setQuery(text);
    handleExecuteQuery(text);
  };

  const triggerMicActivate = () => {
    setQuery('');
    liveQueryRef.current = '';
    setIsRecording(true);
    console.log("[Voice Control] Recording initiated. Capture stream active.");
  };

  const triggerMicCloseAndQuery = (transcript?: string) => {
    setIsRecording(false);
    console.log("[Voice Control] Recording session finalized.");
    
    const finalVal = transcript ?? '';
    if (finalVal.trim()) {
      const clean = finalVal.replace(/[.\s]/g, '').trim();
      if (clean !== '감사합니다' && clean !== 'thankyou' && clean !== '감사합니다.') {
        setQuery(finalVal);
        liveQueryRef.current = finalVal;
        handleVoiceCommand(finalVal);
      } else {
        setQuery('');
        liveQueryRef.current = '';
      }
    } else {
      setQuery('');
      liveQueryRef.current = '';
    }
  };

  // Manual Mic click handler
  const handleMicButtonClick = () => {
    if (audioManagerRef.current) {
      const state = audioManagerRef.current.getMicState();
      if (state === 'IDLE') {
        audioManagerRef.current.setMicState('LISTENING_SPEECH');
        triggerMicActivate();
      } else if (state === 'LISTENING_SPEECH') {
        audioManagerRef.current.closeMicAndExecuteQuery();
      }
    }
  };

  // Initiate AudioControlManager on client-side mounting
  useEffect(() => {
    let audioManager: AudioControlManager | null = null;
    let isCancelled = false;

    // 1. Initialize AudioControlManager
    audioManager = new AudioControlManager(
      (cmd, data) => {
        if (isCancelled) return;
        switch (cmd) {
          case 'slide-next':
            console.log("[Voice Control] Dispatching slide-next custom event");
            window.dispatchEvent(new CustomEvent('slide-next'));
            break;
          case 'slide-prev':
            console.log("[Voice Control] Dispatching slide-prev custom event");
            window.dispatchEvent(new CustomEvent('slide-prev'));
            break;
          case 'mic-activate':
            triggerMicActivate();
            break;
          case 'mic-closing':
            setIsRecording(false);
            break;
          case 'mic-close-and-query':
            console.log(`[ControlBar] Command 'mic-close-and-query' received transcript: "${data?.transcript || ''}"`);
            triggerMicCloseAndQuery(data?.transcript);
            break;
          case 'acoustic-ripple':
            console.log("[Voice Control] Firing acoustic-ripple event to Three.js");
            window.dispatchEvent(new CustomEvent('acoustic-ripple'));
            break;
        }
      },
      (noiseFloor) => {
        if (isCancelled) return;
        setYamnetStatus('listening');
        setYamnetMsg(`수준: ${noiseFloor.toFixed(4)}`);
      }
    );

    const startManager = async () => {
      try {
        await audioManager.initialize();
        if (isCancelled) {
          audioManager.destroy();
          return;
        }
        audioManagerRef.current = audioManager;
        setYamnetStatus('ready');
        setYamnetMsg('캘리브레이션 완료');
      } catch (err) {
        console.error("[Voice Control] AudioControlManager initialization failed:", err);
        if (!isCancelled) {
          setYamnetStatus('error');
          setYamnetMsg('오디오 초기화 오류');
        }
      }
    };

    startManager();

    // 3. Cleanup on unmount
    return () => {
      isCancelled = true;
      isListeningRef.current = false;
      
      if (audioManagerRef.current) {
        audioManagerRef.current.destroy();
        audioManagerRef.current = null;
      }
      if (audioManager) {
        audioManager.destroy();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort(); // Exception/Force stop: use abort() to scrap query
        } catch (_) {}
      }
    };
  }, []);

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
      <GlassCard className={`w-full p-2 flex items-center gap-2 bg-slate-950/75 shadow-2xl backdrop-blur-2xl transition-all duration-300 border ${
        isRecording 
          ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.25)]' 
          : 'border-cyan-500/20'
      }`}>
        <form onSubmit={handleSubmit} className="flex items-center w-full gap-2">
          <div className="pl-3 text-cyan-400">
            {isRecording ? (
              <Disc className="w-4 h-4 text-red-500 animate-pulse" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={
              isRecording 
                ? "🎙️ 말하는 대로 실시간 입력 중... 완료하려면 다시 스냅을 튕기세요." 
                : "예: 다른 사람이 내 땅에 구조물을 설치했는데 법적으로 어떻게 해야 해?"
            }
            className={`flex-1 bg-transparent border-none outline-none text-sm font-sans tracking-wide transition-colors ${
              isRecording ? 'text-red-300 placeholder-red-500/70 font-semibold animate-pulse' : 'text-slate-100 placeholder-slate-500'
            }`}
            disabled={isRecording}
          />

          {/* Voice Input Indicator Button */}
          <button
            type="button"
            onClick={handleMicButtonClick}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isRecording
                ? 'text-red-400 bg-red-950/40 border border-red-500/40 animate-pulse'
                : yamnetStatus === 'listening'
                ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 hover:text-cyan-200'
                : yamnetStatus === 'error'
                ? 'text-amber-500 bg-amber-950/20 border border-amber-500/30 hover:text-amber-300 hover:bg-amber-900/40'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60'
            }`}
            title={
              yamnetStatus === 'error'
                ? `마이크 연결 오류: ${yamnetMsg} (클릭하여 수동 음성 입력 시도)`
                : `스냅 제어 상태: ${yamnetMsg}`
            }
            disabled={yamnetStatus === 'loading'}
          >
            {yamnetStatus === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading || isRecording}
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
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              yamnetStatus === 'listening' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
            }`} />
            YAMNet Snaps: {yamnetMsg}
          </span>
          <span>•</span>
          <span>60 FPS Fluid Damping</span>
        </div>
        <div className="text-slate-500">
          {isRecording ? "스냅을 다시 튕겨 말하기를 완료하세요" : "손가락 스냅 ➔ 발화 ➔ 스냅으로 사이트 제어"}
        </div>
      </div>
    </div>
  );
}
