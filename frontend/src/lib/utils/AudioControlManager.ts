export type MicControlState = 'IDLE' | 'LISTENING_SPEECH' | 'PROCESSING';
export type SnapControlState = 'IDLE' | 'WAITING_SECOND_TAP';

export type AudioCommand = 
  | 'slide-next' 
  | 'slide-prev' 
  | 'mic-activate' 
  | 'mic-closing'
  | 'mic-close-and-query' 
  | 'acoustic-ripple'
  | 'log';

export class AudioControlManager {
  private audioCtx: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private mediaStream: MediaStream | null = null;
  private boostedSpeechStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private hasSpokenInSession: boolean = false;
  
  private micState: MicControlState = 'IDLE';
  private snapState: SnapControlState = 'IDLE';
  
  private noiseFloor: number = 0.005;
  private calibrationBuffer: number[] = [];
  private isCalibrating: boolean = true;
  
  private lastSnapTime: number = 0;
  private lastSoundTime: number = Date.now();
  private singleSnapTimer: NodeJS.Timeout | null = null;
  private isDestroyed: boolean = false;
  private actionLockoutUntil: number = 0;

  private cooldownMs: number = 150;
  private yamnetThreshold: number = 0.25;

  constructor(
    private onCommand: (cmd: any, data?: any) => void,
    private onNoiseCalibrated?: (noiseFloor: number) => void,
    private onVolumeChange?: (volume: number) => void
  ) {}

  public getMicState(): MicControlState {
    return this.micState;
  }

  public setMicState(state: MicControlState) {
    this.micState = state;
    if (state === 'LISTENING_SPEECH') {
      this.hasSpokenInSession = false; // 발화 플래그 초기화
      this.lastSoundTime = Date.now();
      this.startMediaRecorder();
    }
  }

  public async initialize(): Promise<void> {
    this.isDestroyed = false;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      if (this.audioCtx.state === 'suspended') {
        const resumeCtx = async () => {
          if (this.audioCtx && this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
            console.log("[AudioControlManager] AudioContext resumed via user interaction.");
          }
          window.removeEventListener('click', resumeCtx);
          window.removeEventListener('keydown', resumeCtx);
        };
        window.addEventListener('click', resumeCtx);
        window.addEventListener('keydown', resumeCtx);
      }

      // 1. 하드웨어 전처리 우회 원본 미디어 스트림 수집
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      if (this.isDestroyed) {
        this.cleanUpResources();
        return;
      }

      const rawTrack = this.mediaStream.getAudioTracks()[0];
      if (!rawTrack) {
        throw new Error("No audio tracks found in MediaStream.");
      }

      const tapTrack = rawTrack;
      const speechTrack = rawTrack.clone(); // 트랙 복제를 통한 Muting 방지

      const tapStream = new MediaStream([tapTrack]);
      const speechStream = new MediaStream([speechTrack]);

      // 2. AudioContext Dual-Path 구축
      await this.audioCtx.audioWorklet.addModule('/processors/transient-tap-processor.js');

      if (this.isDestroyed) {
        this.cleanUpResources();
        return;
      }

      // Path A: 타격 파이프라인
      const tapSource = this.audioCtx.createMediaStreamSource(tapStream);
      this.workletNode = new AudioWorkletNode(this.audioCtx, 'transient-tap-processor');
      this.workletNode.port.onmessage = (e: MessageEvent) => this.handleWorkletMessage(e.data);
      tapSource.connect(this.workletNode);

      // Path B: 음성 디지털 증폭 파이프라인 (+18dB Software Boost)
      const speechSource = this.audioCtx.createMediaStreamSource(speechStream);
      const speechFilter = this.audioCtx.createBiquadFilter();
      speechFilter.type = 'bandpass';
      speechFilter.frequency.value = 1850;
      speechFilter.Q.value = 0.85;

      const digitalGainNode = this.audioCtx.createGain();
      digitalGainNode.gain.value = 8.0; // +18dB 디지털 증폭

      const speechDestination = this.audioCtx.createMediaStreamDestination();
      speechSource.connect(speechFilter).connect(digitalGainNode).connect(speechDestination);

      this.boostedSpeechStream = speechDestination.stream;

      // 3초 주변 노이즈 캘리브레이션 유지
      setTimeout(() => {
        if (!this.isDestroyed) {
          this.finalizeCalibration();
        }
      }, 3000);
      
      this.onCommand('log', { type: 'info', message: 'Dual-Path AudioControlManager initialized successfully.' });
      console.log("[AudioControlManager] Dual-Path Mechanical Mic Tap node chain mounted.");
    } catch (err: any) {
      if (!this.isDestroyed) {
        this.onCommand('log', { type: 'error', message: `AudioControlManager init failed: ${err.message}` });
        console.error("[AudioControlManager] Failed to initialize Audio Context:", err);
        throw err;
      }
    }
  }

  private handleWorkletMessage(data: {
    type: string;
    pcm16k?: Float32Array;
    rawPeak?: number;
    peak?: number;
    rms?: number;
    maxDiff?: number;
    dcOffset?: number;
    satRatio?: number;
    isTransient?: boolean;
    peakRaw?: number | string;
    passed?: boolean;
    noiseFloor?: number | string;
  }) {
    if (!data || this.isDestroyed) return;

    // 진단용 타격 수치 실시간 브라우저 콘솔 출력
    if (data.type === 'SNAP_DIAGNOSTIC') {
      console.log(`[Tap Sensor] Peak: ${data.peakRaw} | MaxDiff: ${data.maxDiff} | DC: ${data.dcOffset} | Sat: ${data.satRatio} | Noise: ${data.noiseFloor} => Approved: ${data.passed}`);
      return;
    }

    if (data.type === 'AUDIO_FRAME' || data.type === 'AUDIO_METRICS') {
      const rawPeak = data.rawPeak ?? data.peak ?? 0;
      const isTapDetected = data.isTransient ?? false;
      const now = Date.now();

      if (this.onVolumeChange) {
        this.onVolumeChange(rawPeak);
      }

      if (this.isCalibrating) {
        const rmsVal = data.rms ?? 0.003;
        this.calibrationBuffer.push(rmsVal);
        return;
      }

      // 음성 활성 감지 및 700ms 침묵 자동 닫기 (마이크 수집 중일 때)
      if (this.micState === 'LISTENING_SPEECH') {
        const silenceLimit = this.noiseFloor * 2.0 + 0.004;
        if (rawPeak > silenceLimit) {
          this.hasSpokenInSession = true; // 세션 내 실질 발화 감지 마킹
          this.lastSoundTime = now; // 말소리가 들어오면 침묵 타이머 리셋
        } else if (now - this.lastSoundTime > 700) { // 700ms 침묵 지속 시 즉시 녹음 종료 및 쿼리 실행
          console.log(`[AudioControlManager] 700ms Silence Detected (Peak=${rawPeak.toFixed(4)} < Limit=${silenceLimit.toFixed(4)}). Auto-closing.`);
          this.closeMicAndExecuteQuery();
        }
      }

      // [핵심 가드]: 마이크가 활성화되어 말을 듣는 중이거나 처리 중일 때는 마이크 터치/타격 제스처를 완벽히 무시!
      if (this.micState !== 'IDLE') {
        return;
      }

      // [가드 1]: 동작 실행 후 불응기 대기 시간 동안은 감지 무시
      if (now < this.actionLockoutUntil) {
        return;
      }

      if (isTapDetected) {
        this.handleTapPulse(now);
      }
    }
  }

  private handleTapPulse(now: number) {
    const timeSinceLastTap = now - this.lastSnapTime;

    if (this.snapState === 'WAITING_SECOND_TAP') {
      if (timeSinceLastTap > 400) {
        this.snapState = 'IDLE';
        return;
      }

      // 2차 타격 (90ms ~ 400ms 범위 유입) -> slide-next 실행
      if (timeSinceLastTap >= 90) {
        if (this.singleSnapTimer) {
          clearTimeout(this.singleSnapTimer);
          this.singleSnapTimer = null;
        }

        this.snapState = 'IDLE';
        this.lastSnapTime = now;
        this.actionLockoutUntil = now + 650; // 650ms lockout 적용

        console.log('⚡ [AudioControlManager] DOUBLE TAP EXECUTE -> slide-next (Lockout 650ms)');
        this.onCommand('slide-next');
        return;
      }
    }

    if (this.snapState === 'IDLE') {
      this.snapState = 'WAITING_SECOND_TAP';
      this.lastSnapTime = now;

      // 380ms 단발 타격 확정 예약
      this.singleSnapTimer = setTimeout(() => {
        if (this.snapState === 'WAITING_SECOND_TAP') {
          this.snapState = 'IDLE';
          this.triggerSingleSnapAction();
        }
      }, 380);
    }
  }

  private triggerSingleSnapAction() {
    if (this.micState === 'IDLE' && this.boostedSpeechStream) {
      const now = Date.now();
      this.actionLockoutUntil = now + 500; // 500ms lockout 적용
      this.hasSpokenInSession = false; // 세션 내 실질 발화 감지 플래그 리셋
      this.micState = 'LISTENING_SPEECH';
      this.lastSoundTime = now;

      // MediaRecorder를 통한 증폭 오디오 스트림 수집 개시
      this.startMediaRecorder();
      this.onCommand('mic-activate');
    }
  }

  private async startMediaRecorder() {
    if (!this.boostedSpeechStream) return;
    this.audioChunks = [];

    if (this.audioCtx) {
      console.log(`[AudioControlManager] Current audioCtx state: ${this.audioCtx.state}`);
      if (this.audioCtx.state === 'suspended') {
        console.log("[AudioControlManager] AudioContext suspended inside startMediaRecorder. Resuming...");
        await this.audioCtx.resume();
        console.log(`[AudioControlManager] AudioContext state after resume: ${this.audioCtx.state}`);
      }
    }

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/mp4';

    try {
      this.mediaRecorder = new MediaRecorder(this.boostedSpeechStream, { mimeType });
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };
      this.mediaRecorder.start(100);
      console.log(`[AudioControlManager] MediaRecorder started with mimeType: ${mimeType}`);
    } catch (err) {
      console.error("[AudioControlManager] Failed to start MediaRecorder:", err);
    }
  }

  public async closeMicAndExecuteQuery() {
    if (this.micState !== 'LISTENING_SPEECH') return;

    this.micState = 'PROCESSING';
    this.onCommand('mic-closing');

    // 음성 입력 없이 침묵으로만 닫힌 경우 Whisper API 호출을 거치지 않고 즉시 세션 종료
    if (!this.hasSpokenInSession) {
      console.log('🔇 [AudioControlManager] No speech detected during session. Skipping Whisper API request.');
      this.onCommand('mic-close-and-query', { transcript: '' });
      
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        try {
          this.mediaRecorder.stop();
        } catch (_) {}
      }

      setTimeout(() => {
        this.micState = 'IDLE';
        this.actionLockoutUntil = Date.now() + 500;
      }, 300);
      return;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        console.log(`[AudioControlManager] Audio Blob Created. Size: ${audioBlob.size} bytes | Type: ${audioBlob.type}`);
        
        if (audioBlob.size > 2000) {
          try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'speech.webm');

            const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
            console.log(`[AudioControlManager] Fetching Groq Whisper endpoint: ${BACKEND_URL}/api/v1/audio/transcribe ...`);
            
            // Groq Whisper 백엔드 엔드포인트 전송
            const res = await fetch(`${BACKEND_URL}/api/v1/audio/transcribe`, {
              method: 'POST',
              body: formData
            });
            console.log(`[AudioControlManager] Fetch response status: ${res.status}`);

            if (!res.ok) {
              console.error(`[Whisper API Error] Status: ${res.status} ${res.statusText}`);
              this.onCommand('mic-close-and-query', { transcript: '' });
              return;
            }
            
            const data = await res.json();
            let text = (data.text || '').trim();
            
            // 프론트엔드 2차 환각 문장 검증 필터
            if (
              text.includes("MBC 뉴스") || 
              text.includes("김성현입니다") || 
              text.includes("시청해 주셔서 감사합니다") || 
              text.includes("구독과 좋아요") ||
              text.includes("음성 명령 전사") ||
              text.includes("음성 명령")
            ) {
              console.warn(`⚠️ [AudioControlManager] 2nd-stage Hallucination Filter Triggered: "${text}" -> set to empty string.`);
              text = "";
            }
            
            console.log(`[AudioControlManager] Whisper transcription text returned: "${text}"`);
            this.onCommand('mic-close-and-query', { transcript: text });
          } catch (err) {
            console.error('Whisper Transcribe Error:', err);
            this.onCommand('mic-close-and-query', { transcript: '' });
          }
        } else {
          console.warn("[AudioControlManager] Recorded audio blob is too small. Skipping Whisper transcription.");
          this.onCommand('mic-close-and-query', { transcript: '' });
        }

        setTimeout(() => {
          this.micState = 'IDLE';
          this.actionLockoutUntil = Date.now() + 500;
        }, 500);
      };

      try {
        this.mediaRecorder.stop();
      } catch (err) {
        console.error("[AudioControlManager] Error stopping MediaRecorder:", err);
        this.micState = 'IDLE';
        this.actionLockoutUntil = Date.now() + 500;
      }
    } else {
      this.micState = 'IDLE';
      this.actionLockoutUntil = Date.now() + 500;
    }
  }

  private finalizeCalibration() {
    if (this.calibrationBuffer.length === 0) return;
    
    this.calibrationBuffer.sort((a, b) => a - b);
    const index20 = Math.floor(this.calibrationBuffer.length * 0.2);
    this.noiseFloor = this.calibrationBuffer[index20] || 0.005;
    
    this.yamnetThreshold = Math.min(Math.max(0.05 + 1.5 * this.noiseFloor, 0.05), 0.80);
    this.cooldownMs = 150 + Math.min(Math.max(500 * this.noiseFloor, 0), 50);
    this.isCalibrating = false;

    console.log(`[AudioControlManager] Noise Calibration finalized. NoiseFloor: ${this.noiseFloor.toFixed(4)}, yamnetThreshold: ${this.yamnetThreshold.toFixed(2)}, cooldownMs: ${this.cooldownMs}ms`);

    if (this.workletNode && this.workletNode.port) {
      this.workletNode.port.postMessage({
        type: 'UPDATE_NOISE_FLOOR',
        value: this.noiseFloor
      });
    }

    if (this.onNoiseCalibrated) {
      this.onNoiseCalibrated(this.noiseFloor);
    }
  }

  public destroy(): void {
    console.log("[AudioControlManager] Destroying audio resources...");
    this.isDestroyed = true;
    
    if (this.singleSnapTimer) {
      clearTimeout(this.singleSnapTimer);
      this.singleSnapTimer = null;
    }
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (_) {}
    }

    this.cleanUpResources();
    
    this.micState = 'IDLE';
    this.snapState = 'IDLE';
  }

  private cleanUpResources() {
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(track => track.stop());
      } catch (_) {}
      this.mediaStream = null;
    }

    if (this.boostedSpeechStream) {
      try {
        this.boostedSpeechStream.getTracks().forEach(track => track.stop());
      } catch (_) {}
      this.boostedSpeechStream = null;
    }

    if (this.workletNode) {
      try {
        this.workletNode.disconnect();
      } catch (_) {}
      this.workletNode = null;
    }

    if (this.audioCtx) {
      if (this.audioCtx.state !== 'closed') {
        try {
          this.audioCtx.close();
        } catch (_) {}
      }
      this.audioCtx = null;
    }
  }
}
