'use client';

import { useState, useEffect, useRef } from 'react';
import { AudioControlManager, AudioCommand } from '@/lib/utils/AudioControlManager';
import { Mic, Disc, Loader2, Volume2, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import Link from 'next/link';

export default function VoiceTestPage() {
  const [yamnetStatus, setYamnetStatus] = useState<'loading' | 'ready' | 'listening' | 'error'>('loading');
  const [yamnetMsg, setYamnetMsg] = useState('Initializing MediaPipe YAMNet...');
  const [isRecording, setIsRecording] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(0);
  
  // Speech output states
  const [liveText, setLiveText] = useState(''); // Real-time interim results
  const [transcriptions, setTranscriptions] = useState<{ time: string; text: string }[]>([]);
  const [eventLogs, setEventLogs] = useState<{ time: string; msg: string; type: 'info' | 'success' | 'warning' }[]>([]);

  const audioManagerRef = useRef<AudioControlManager | null>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const liveQueryRef = useRef('');

  // Helper to add log dynamically
  const addLog = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const timeStr = new Date().toLocaleTimeString();
    setEventLogs((prev) => [{ time: timeStr, msg, type }, ...prev].slice(0, 50));
  };

  const triggerMicActivate = () => {
    setLiveText('');
    liveQueryRef.current = '';
    setIsRecording(true);
    addLog("Speech recording session initiated.", "info");
  };

  const triggerMicCloseAndQuery = (transcript?: string) => {
    setIsRecording(false);
    addLog("Recording session stopped. Processing Whisper transcription...", "info");

    const finalVal = transcript ?? '';
    if (finalVal.trim()) {
      const cleanText = finalVal.replace(/[.\s]/g, '').trim();
      if (cleanText === '감사합니다' || cleanText === 'thankyou' || cleanText === '감사합니다.') {
        addLog(`[Filter] Suppressed Whisper hallucination ('감사합니다')`, "warning");
        setLiveText('');
        return;
      }

      const timeStr = new Date().toLocaleTimeString();
      setTranscriptions((prev) => [{ time: timeStr, text: finalVal }, ...prev]);
      addLog(`Speech Transcribed: "${finalVal}"`, "success");
      setLiveText(finalVal);
    } else {
      addLog("Speech transcription resulted in empty string.", "warning");
      setLiveText('');
    }
  };

  // Manual Trigger Button click
  const handleManualMicClick = () => {
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

  // Auto-initiate AudioControlManager on client-side mounting
  useEffect(() => {
    let audioManager: AudioControlManager | null = null;
    let isCancelled = false;

    // 1. Initialize AudioControlManager
    audioManager = new AudioControlManager(
      (cmd: AudioCommand, data?: any) => {
        if (isCancelled) return;
        switch (cmd) {
          case 'slide-next':
            addLog("Double Snap Event Recognized! (Trigger -> slide-next)", "success");
            window.dispatchEvent(new CustomEvent('slide-next'));
            break;
          case 'slide-prev':
            addLog("Speech command Triggered -> slide-prev", "success");
            window.dispatchEvent(new CustomEvent('slide-prev'));
            break;
          case 'mic-activate':
            addLog("Transient Snap -> Activating Mic Session", "success");
            triggerMicActivate();
            break;
          case 'mic-closing':
            addLog("Silence Detected -> Processing Recording", "info");
            setIsRecording(false);
            break;
          case 'mic-close-and-query':
            console.log(`[page.tsx] Command 'mic-close-and-query' received transcript: "${data?.transcript || ''}"`);
            addLog(`Transcription received from Whisper API`, "success");
            triggerMicCloseAndQuery(data?.transcript);
            break;
          case 'acoustic-ripple':
            addLog("Transient Impulsive Peak Detected -> Firing acoustic-ripple visual pulse", "info");
            window.dispatchEvent(new CustomEvent('acoustic-ripple'));
            break;
        }
      },
      (noiseFloor: number) => {
        if (isCancelled) return;
        setYamnetStatus('listening');
        setYamnetMsg(`캘리브레이션 완료. 잡음 수준: ${noiseFloor.toFixed(4)}`);
        addLog(`Calibrated Noise Floor: ${noiseFloor.toFixed(4)}`, "info");
      },
      (volume: number) => {
        if (isCancelled) return;
        setCurrentVolume(Math.min(100, Math.round(volume * 200)));
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
        addLog("AudioWorklet Node mounted successfully.", "info");
      } catch (err) {
        addLog("Failed to launch AudioControlManager node chain", "warning");
      }
    };

    startManager();

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
    };
  }, []);

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans p-6 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
              VOICE CONTROL & SNAP TESTER
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Isolated diagnostic sandbox. Zero routing hooks.</p>
          </div>
        </div>

        {/* Diagnostic Quick Reset */}
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Sandbox</span>
        </button>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Detector Status Card */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/50 backdrop-blur-xl flex flex-col gap-5">
            <h2 className="text-sm font-mono text-slate-400 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>SENSOR STATE</span>
            </h2>

            {/* Status indicators */}
            <div className="flex flex-col gap-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="text-xs font-mono text-slate-500">YAMNet Class</span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono tracking-widest ${
                  yamnetStatus === 'listening' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/20' :
                  yamnetStatus === 'ready' ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/20' :
                  yamnetStatus === 'error' ? 'bg-amber-950 text-amber-500 border border-amber-500/20' :
                  'bg-slate-950 text-slate-500 border border-slate-800'
                }`}>
                  {yamnetStatus.toUpperCase()}
                </span>
              </div>

              {/* Status Message */}
              <p className="text-xs text-slate-400 font-sans leading-relaxed px-1">
                {yamnetMsg}
              </p>

              {/* Microphone Level Visualizer */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-500" />
                    Mic Input Amplitude
                  </span>
                  <span>{currentVolume}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-sky-500 transition-all duration-75"
                    style={{ width: `${currentVolume}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Mic Toggle Button */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/50 backdrop-blur-xl flex flex-col items-center gap-4">
            <button
              onClick={handleManualMicClick}
              disabled={yamnetStatus === 'loading'}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative border ${
                isRecording 
                  ? 'bg-red-500/10 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)] animate-pulse text-red-500' 
                  : 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-cyan-400'
              }`}
            >
              {isRecording ? (
                <Disc className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
            <div className="text-center">
              <span className="text-xs font-mono text-slate-400 block">
                {isRecording ? "RECORDING ACTIVE" : "MICROPHONE IDLE"}
              </span>
              <span className="text-[10px] text-slate-600 block mt-1">
                {isRecording ? "Snap / clap to stop" : "Snap / clap to start"}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Column: Voice command / Transcription results */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/50 backdrop-blur-xl flex flex-col gap-4">
          <h2 className="text-sm font-mono text-slate-400 tracking-wider flex items-center justify-between">
            <span>TRANSCRIPTIONS</span>
          </h2>

          <div className="flex-1 min-h-[350px] max-h-[500px] overflow-y-auto bg-slate-950/60 border border-slate-800/40 rounded-xl p-4 flex flex-col gap-3 scrollbar-none">
            {/* Real-time Streaming Interim Output Box */}
            {isRecording && (
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex flex-col gap-1 text-cyan-400 animate-pulse">
                <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Streaming Live STT
                </span>
                <p className="text-sm italic font-medium">
                  {liveText || "Listening to speech..."}
                </p>
              </div>
            )}

            {transcriptions.length === 0 && !isRecording ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-center gap-2 p-6">
                <Mic className="w-8 h-8 opacity-40" />
                <span className="text-xs">No voices transcribed yet.</span>
                <span className="text-[10px] max-w-[200px]">Speak after snap activation and snap again to trigger translation.</span>
              </div>
            ) : (
              transcriptions.map((t, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/60 flex flex-col gap-1.5 transition-all hover:border-slate-700/60">
                  <span className="text-[9px] font-mono text-slate-600">{t.time}</span>
                  <p className="text-sm text-cyan-300 font-medium">"{t.text}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Sensors & DSP Logs */}
        <div className="md:col-span-1 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/50 backdrop-blur-xl flex flex-col gap-4">
          <h2 className="text-sm font-mono text-slate-400 tracking-wider flex items-center justify-between">
            <span>DIAGNOSTIC EVENTS</span>
            <span className="text-[10px] text-slate-600 font-mono">{eventLogs.length} events</span>
          </h2>

          <div className="flex-1 min-h-[350px] max-h-[500px] overflow-y-auto bg-slate-950/60 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-2 font-mono text-xs scrollbar-none">
            {eventLogs.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-700 text-center p-6">
                <span className="text-xs">Listening for sensor triggers...</span>
              </div>
            ) : (
              eventLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start py-1 border-b border-slate-900/40">
                  <span className="text-slate-600 text-[10px] select-none">{log.time}</span>
                  <span className={`flex-1 ${
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warning' ? 'text-amber-500' :
                    'text-slate-400'
                  }`}>
                    {log.msg}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
