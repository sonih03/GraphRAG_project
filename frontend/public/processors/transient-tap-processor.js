class TransientTapProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.targetSampleRate = 16000;
    this.sourceSampleRate = sampleRate || 48000;
    this.resampleRatio = this.sourceSampleRate / this.targetSampleRate;
    this.resamplePhase = 0;
    this.noiseFloor = 0.005;
    this.alphaUp = 0.998;
    this.alphaDown = 0.85;

    this.dtMs = (128 / 16000) * 1000.0; // ~8.0ms
    this.lastTapFrame = -9999;
    this.frameCounter = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0] || input[0].length === 0) return true;

    const inChannel = input[0];
    const inLen = inChannel.length;

    let sumRaw = 0;
    let sumSqRaw = 0;
    let peakRaw = 0;
    let maxDiff = 0;
    let satCount = 0;

    for (let i = 0; i < inLen; i++) {
      const x = inChannel[i];
      const absX = Math.abs(x);
      
      if (absX > peakRaw) peakRaw = absX;
      sumRaw += x;
      sumSqRaw += x * x;

      if (absX >= 0.90) satCount++;

      if (i > 0) {
        const diff = Math.abs(absX - Math.abs(inChannel[i - 1]));
        if (diff > maxDiff) maxDiff = diff;
      }
    }

    const rmsRaw = Math.sqrt(sumSqRaw / inLen);
    const dcOffset = Math.abs(sumRaw / inLen);
    const satRatio = satCount / inLen;

    // 동결 게이트 노이즈 추적
    const isFreeze = (maxDiff > 0.15) || (peakRaw > 3.0 * this.noiseFloor);
    if (!isFreeze) {
      if (rmsRaw > this.noiseFloor) {
        this.noiseFloor = this.alphaUp * this.noiseFloor + (1 - this.alphaUp) * rmsRaw;
      } else {
        this.noiseFloor = this.alphaDown * this.noiseFloor + (1 - this.alphaDown) * rmsRaw;
      }
    }

    this.frameCounter++;
    const timeSinceLastTapMs = (this.frameCounter - this.lastTapFrame) * this.dtMs;

    // 복합 교차 검증 게이트
    const passesSoftTap = (maxDiff >= 0.25) && (dcOffset >= 0.040);
    const passesHardTap = (maxDiff >= 0.18) && (satRatio >= 0.030);
    const isTapCandidate = passesSoftTap || passesHardTap;
    let isTapDetected = false;

    // 80ms 절대 불응기
    if (timeSinceLastTapMs > 80.0 && isTapCandidate) {
      isTapDetected = true;
      this.lastTapFrame = this.frameCounter;
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

    // 메인 스레드로 결과 포스팅 (YAMNet pcm16k 버퍼 및 타격 정보)
    if (resampledBlock.length > 0) {
      this.port.postMessage({
        type: 'AUDIO_FRAME',
        pcm16k: new Float32Array(resampledBlock),
        peak: peakRaw,
        rawPeak: peakRaw,
        rms: rmsRaw,
        maxDiff: maxDiff,
        dcOffset: dcOffset,
        satRatio: satRatio,
        isTransient: isTapDetected
      });
    }

    return true;
  }
}

registerProcessor('transient-tap-processor', TransientTapProcessor);
