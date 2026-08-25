class TransientResamplerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
    this.sourceSampleRate = sampleRate || 48000;
    this.resampleRatio = this.sourceSampleRate / this.targetSampleRate;
    this.resamplePhase = 0;

    // 2.1kHz Biquad Bandpass Filter
    this.initBPF(2100, 1.5);
    this.x1 = 0; this.x2 = 0; this.y1 = 0; this.y2 = 0;

    this.sta = 0.0;
    this.lta = 0.0;
    this.alphaSTA = 0.3; // 더 빠른 반응속도
    this.alphaLTA = 0.005;

    this.noiseFloor = 0.003;
    this.alphaUp = 0.998;
    this.alphaDown = 0.85;

    this.envThreshold = 0.005;
    this.tauDecay = 45.0; // 엔벨로프 감쇄 보정
    this.dtMs = (128 / 16000) * 1000.0;
    this.decayFactor = Math.exp(-this.dtMs / this.tauDecay);

    this.lastSnapFrame = -9999;
    this.frameCounter = 0;

    this.port.onmessage = (e) => {
      if (e.data.type === 'UPDATE_NOISE_FLOOR') {
        this.noiseFloor = e.data.value || 0.003;
      }
    };
  }

  initBPF(frequency, Q) {
    const w0 = 2 * Math.PI * frequency / this.sourceSampleRate;
    const alpha = Math.sin(w0) / (2 * Q);
    
    const b0 = alpha;
    const b1 = 0;
    const b2 = -alpha;
    const a0 = 1 + alpha;
    const a1 = -2 * Math.cos(w0);
    const a2 = 1 - alpha;

    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = a1 / a0;
    this.a2 = a2 / a0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0] || input[0].length === 0) return true;

    const inChannel = input[0];
    const inLen = inChannel.length;

    let sumSqRaw = 0, sumSqBpf = 0;
    let peakRaw = 0, peakBpf = 0;

    for (let i = 0; i < inLen; i++) {
      const x = inChannel[i];
      const absX = Math.abs(x);
      if (absX > peakRaw) peakRaw = absX;
      sumSqRaw += x * x;

      const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
      this.x2 = this.x1; this.x1 = x;
      this.y2 = this.y1; this.y1 = y;

      const absY = Math.abs(y);
      if (absY > peakBpf) peakBpf = absY;
      sumSqBpf += y * y;
    }

    const rmsRaw = Math.sqrt(sumSqRaw / inLen);
    const rmsBpf = Math.sqrt(sumSqBpf / inLen);

    let cfDb = 0;
    if (rmsBpf > 1e-6) {
      const ratio = peakBpf / (rmsBpf + 1e-9);
      cfDb = 20 * Math.log10(ratio);
      if (!isFinite(cfDb) || cfDb < 0) cfDb = 0;
    }

    const bpfPower = rmsBpf * rmsBpf;
    this.sta = this.alphaSTA * bpfPower + (1 - this.alphaSTA) * this.sta;
    this.lta = this.alphaLTA * bpfPower + (1 - this.alphaLTA) * this.lta;
    const staLtaRatio = this.sta / (this.lta + 1e-9);

    // 노이즈 플로어 가동
    const isFreeze = (cfDb > 8.0) || (peakRaw > 3.0 * this.noiseFloor);
    if (!isFreeze) {
      if (rmsRaw > this.noiseFloor) {
        this.noiseFloor = this.alphaUp * this.noiseFloor + (1 - this.alphaUp) * rmsRaw;
      } else {
        this.noiseFloor = this.alphaDown * this.noiseFloor + (1 - this.alphaDown) * rmsRaw;
      }
    }

    this.envThreshold = Math.max(this.noiseFloor * 1.5, this.envThreshold * this.decayFactor);

    this.frameCounter++;
    const timeSinceLastSnapMs = (this.frameCounter - this.lastSnapFrame) * this.dtMs;

    // [피크 유입 감지 및 BPF 진폭 비율 산출]
    const isPeakCandidate = peakRaw > (this.noiseFloor * 1.8 + 0.005);
    const bpfRatio = peakRaw > 1e-6 ? (peakBpf / peakRaw) : 0;
    let isSnapDetected = false;

    // 100ms 절대 불응기 통과 검사
    if (timeSinceLastSnapMs > 100.0 && isPeakCandidate) {
      // 이어폰/노트북 마이크 현실적 조건: Crest Factor 9.0dB 이상, STA/LTA 3.0 이상, bpfRatio > 0.22 (책상 짚기 차단)
      const passesCrestFactor = cfDb > 9.0;
      const passesStaLta = staLtaRatio > 3.0;
      const passesBpfRatio = bpfRatio > 0.22; // 저주파 키보드/책상 충격음 방지 필터

      if (passesCrestFactor && passesStaLta && passesBpfRatio) {
        isSnapDetected = true;
      }

      // [디버그 로그 포스팅]: 스냅 후보 피크가 유입될 때마다 실제 연산 수치 출력
      if (isPeakCandidate) {
        this.port.postMessage({
          type: 'SNAP_DIAGNOSTIC',
          peakRaw: peakRaw.toFixed(4),
          cfDb: cfDb.toFixed(1),
          staLta: staLtaRatio.toFixed(1),
          bpfRatio: bpfRatio.toFixed(2),
          noiseFloor: this.noiseFloor.toFixed(4),
          passed: isSnapDetected
        });
      }
    }

    if (isSnapDetected) {
      this.lastSnapFrame = this.frameCounter;
      this.envThreshold = Math.max(this.envThreshold, peakBpf * 0.5, 0.01);
    }

    // 16kHz 무손실 리샘플링 다운샘플러 복원
    const resampledBlock = [];
    while (this.resamplePhase < inLen) {
      const index0 = Math.floor(this.resamplePhase);
      const index1 = Math.min(index0 + 1, inLen - 1);
      const fraction = this.resamplePhase - index0;
      const interpolated = inChannel[index0] + fraction * (inChannel[index1] - inChannel[index0]);
      resampledBlock.push(interpolated);
      this.resamplePhase += this.resampleRatio;
    }
    this.resamplePhase -= inLen;

    // 메인 스레드로 결과 포스팅 (YAMNet pcm16k 버퍼 전송 포함)
    if (resampledBlock.length > 0) {
      this.port.postMessage({
        type: 'AUDIO_FRAME',
        pcm16k: new Float32Array(resampledBlock),
        peak: peakRaw,
        rawPeak: peakRaw,
        rms: rmsRaw,
        crestFactorDB: cfDb,
        isTransient: isSnapDetected
      });
    }

    return true;
  }
}

registerProcessor('transient-resampler-processor', TransientResamplerProcessor);
