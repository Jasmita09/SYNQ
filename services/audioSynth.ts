/**
 * Web Audio API synthesizer for concert beats, haptics, and audio alerts.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Deep 808 Sub-bass kick for tempo & beat pulses
  public playKick(intensity: number = 0.8) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Pitch drop from 140Hz down to 45Hz
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);

      gain.gain.setValueAtTime(0.35 * intensity, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // Audio context may not be permitted before user gesture
    }
  }

  // Giant Sub-Bass Beat Drop
  public playBeatDrop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Sweep down oscillator
      const sweepOsc = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweepOsc.type = 'sawtooth';
      sweepOsc.frequency.setValueAtTime(220, t);
      sweepOsc.frequency.exponentialRampToValueAtTime(32, t + 0.6);

      // Low pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t);
      filter.frequency.exponentialRampToValueAtTime(120, t + 0.6);

      sweepGain.gain.setValueAtTime(0.4, t);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

      sweepOsc.connect(filter);
      filter.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);

      sweepOsc.start(t);
      sweepOsc.stop(t + 0.9);

      // Deep sub impact
      this.playKick(1.2);
    } catch {
      // Ignore
    }
  }

  // Rhythm target tap feedback (crisp percussion click)
  public playTap() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.08);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch {
      // Ignore
    }
  }

  // SOS Emergency Alert siren
  public playSOS() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(660, t + 0.1);
      osc.frequency.setValueAtTime(880, t + 0.2);
      osc.frequency.setValueAtTime(660, t + 0.3);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.45);
    } catch {
      // Ignore
    }
  }

  // Bump to Connect Chime
  public playBump() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.04);
        gain.gain.setValueAtTime(0.18, t + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + i * 0.04);
        osc.stop(t + i * 0.04 + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  // Vibrate phone/device haptic if supported
  public triggerHaptic(pattern: number[] = [80, 50, 80]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore
      }
    }
  }
}

export const audioSynth = new AudioSynthesizer();
