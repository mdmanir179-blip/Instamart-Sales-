/**
 * Web Audio API based sound synthesizer with immediate user-gesture unlock and fallback.
 * Generates an upbeat multi-harmonic celebratory music chime.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('im02_sound_muted') === 'true';
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('im02_sound_muted', muted ? 'true' : 'false');
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Initializes and un-suspends AudioContext on user interaction
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext creation error:', e);
      return null;
    }
  }

  /**
   * Plays a celebratory music arpeggio (C5 -> E5 -> G5 -> C6 -> E6)
   */
  public playVictoryChime(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // High-energy, crisp frequencies
      const sequence = [
        { freq: 523.25, time: 0.00, dur: 0.18, type: 'triangle' as OscillatorType }, // C5
        { freq: 659.25, time: 0.10, dur: 0.18, type: 'triangle' as OscillatorType }, // E5
        { freq: 783.99, time: 0.20, dur: 0.22, type: 'sine' as OscillatorType },     // G5
        { freq: 1046.50, time: 0.30, dur: 0.35, type: 'sine' as OscillatorType },    // C6
        { freq: 1318.51, time: 0.42, dur: 0.50, type: 'sine' as OscillatorType },    // E6
        { freq: 1567.98, time: 0.54, dur: 0.70, type: 'triangle' as OscillatorType },// G6
      ];

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.4, now);
      master.connect(ctx.destination);

      sequence.forEach(({ freq, time, dur, type }) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + time);

        // Natural exponential attack & decay
        noteGain.gain.setValueAtTime(0.0001, now + time);
        noteGain.gain.linearRampToValueAtTime(0.35, now + time + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(noteGain);
        noteGain.connect(master);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch (err) {
      console.error('Audio playback error:', err);
    }
  }

  /**
   * Quick pleasant feedback click tone
   */
  public playClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new SoundEngine();
