"use client";

interface DroneNodes {
  noise: AudioBufferSourceNode;
  noiseGain: GainNode;
  hum: OscillatorNode;
  humGain: GainNode;
}

class SoundSystem {
  private ctx: AudioContext | null = null;
  private _enabled = false;
  private drone: DroneNodes | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  toggle(): boolean {
    this._enabled = !this._enabled;
    if (this._enabled) {
      this.playClick();
      this.startDrone();
    } else {
      this.stopDrone();
    }
    return this._enabled;
  }

  enable(): void {
    if (!this._enabled) {
      this._enabled = true;
      this.startDrone();
    }
  }

  private tone(f: number, d: number, t: OscillatorType = "sine", v = 0.07): void {
    try {
      const c = this.getCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.type = t;
      o.frequency.value = f;
      g.gain.setValueAtTime(v, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
      o.start();
      o.stop(c.currentTime + d);
    } catch {
      /* audio not available */
    }
  }

  playClick(): void {
    if (!this._enabled) return;
    try {
      const c = this.getCtx();
      const now = c.currentTime;
      const mg = c.createGain();
      mg.gain.value = 0.18;
      mg.connect(c.destination);

      // Low thump
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(180, now);
      o.frequency.exponentialRampToValueAtTime(60, now + 0.08);
      const eg = c.createGain();
      eg.gain.setValueAtTime(1, now);
      eg.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      o.connect(eg);
      eg.connect(mg);
      o.start(now);
      o.stop(now + 0.09);

      // Noise tick
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.04), c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = c.createBufferSource();
      ns.buffer = buf;
      const bpf = c.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.value = 3500;
      bpf.Q.value = 1.5;
      const ng = c.createGain();
      ng.gain.setValueAtTime(0.5, now);
      ng.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      ns.connect(bpf);
      bpf.connect(ng);
      ng.connect(mg);
      ns.start(now);
      ns.stop(now + 0.04);
    } catch {
      /* audio not available */
    }
  }

  playHover(): void {
    if (!this._enabled) return;
    try {
      const c = this.getCtx();
      const now = c.currentTime;
      const o = c.createOscillator();
      o.type = "square";
      o.frequency.setValueAtTime(2200, now);
      o.frequency.exponentialRampToValueAtTime(1800, now + 0.025);
      const g = c.createGain();
      g.gain.setValueAtTime(0.07, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      const hpf = c.createBiquadFilter();
      hpf.type = "highpass";
      hpf.frequency.value = 1800;
      o.connect(hpf);
      hpf.connect(g);
      g.connect(c.destination);
      o.start(now);
      o.stop(now + 0.025);
    } catch {
      /* audio not available */
    }
  }

  playBoot(): void {
    if (!this._enabled) return;
    try {
      const c = this.getCtx();
      const now = c.currentTime;
      const mg = c.createGain();
      mg.gain.value = 0.26;
      mg.connect(c.destination);

      // Sweep
      const sw = c.createOscillator();
      sw.type = "sawtooth";
      sw.frequency.setValueAtTime(40, now);
      sw.frequency.exponentialRampToValueAtTime(900, now + 1.2);
      const se = c.createGain();
      se.gain.setValueAtTime(0.4, now);
      se.gain.linearRampToValueAtTime(0.1, now + 1.2);
      const lpf = c.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 1200;
      sw.connect(lpf);
      lpf.connect(se);
      se.connect(mg);
      sw.start(now);
      sw.stop(now + 1.2);

      // Data burst
      const bb = c.createBuffer(1, Math.floor(c.sampleRate * 0.8), c.sampleRate);
      const bd = bb.getChannelData(0);
      for (let i = 0; i < bd.length; i++) bd[i] = (Math.random() * 2 - 1) * (i % 1200 < 600 ? 1 : 0);
      const bs = c.createBufferSource();
      bs.buffer = bb;
      const bpf2 = c.createBiquadFilter();
      bpf2.type = "bandpass";
      bpf2.frequency.value = 4000;
      bpf2.Q.value = 0.8;
      const be = c.createGain();
      be.gain.setValueAtTime(0, now + 0.8);
      be.gain.linearRampToValueAtTime(0.3, now + 1.0);
      be.gain.linearRampToValueAtTime(0, now + 1.6);
      bs.connect(bpf2);
      bpf2.connect(be);
      be.connect(mg);
      bs.start(now + 0.8);
      bs.stop(now + 1.6);

      // Chime
      [0, 0.12].forEach((dl, i) => {
        const f = [880, 1320][i];
        const ch = c.createOscillator();
        ch.type = "sine";
        ch.frequency.value = f;
        const ce = c.createGain();
        ce.gain.setValueAtTime(0, now + 1.5 + dl);
        ce.gain.linearRampToValueAtTime(0.35, now + 1.52 + dl);
        ce.gain.exponentialRampToValueAtTime(0.001, now + 1.9 + dl);
        ch.connect(ce);
        ce.connect(mg);
        ch.start(now + 1.5 + dl);
        ch.stop(now + 1.9 + dl);
      });
    } catch {
      /* audio not available */
    }
  }

  playSuccess(): void {
    if (!this._enabled) return;
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => this.tone(f, 0.12, "sine", 0.06), i * 75)
    );
  }

  playFail(): void {
    if (!this._enabled) return;
    this.tone(180, 0.13, "sawtooth", 0.055);
    setTimeout(() => this.tone(120, 0.28, "sawtooth", 0.045), 130);
  }

  playAlert(): void {
    if (!this._enabled) return;
    this.tone(440, 0.07, "square", 0.035);
    setTimeout(() => this.tone(440, 0.07, "square", 0.035), 130);
  }

  private lastMouseSound = 0;
  playMouseTexture(): void {
    if (!this._enabled) return;
    const now = Date.now();
    if (now - this.lastMouseSound > 120) {
      this.tone(1100 + Math.random() * 200, 0.016, "sine", 0.003);
      this.lastMouseSound = now;
    }
  }

  startDrone(): void {
    if (this.drone) return;
    try {
      const c = this.getCtx();
      const bufSz = c.sampleRate * 2;
      const nb = c.createBuffer(1, bufSz, c.sampleRate);
      const nd = nb.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufSz; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02;
        nd[i] = last * 3.5;
      }
      const ns = c.createBufferSource();
      ns.buffer = nb;
      ns.loop = true;
      const lpf = c.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 200;
      const ag = c.createGain();
      ag.gain.setValueAtTime(0, c.currentTime);
      ag.gain.linearRampToValueAtTime(0.035, c.currentTime + 3);
      ns.connect(lpf);
      lpf.connect(ag);
      ag.connect(c.destination);
      ns.start();

      const hum = c.createOscillator();
      hum.type = "sine";
      hum.frequency.value = 60;
      const hg = c.createGain();
      hg.gain.value = 0.03;
      hum.connect(hg);
      hg.connect(c.destination);
      hum.start();

      this.drone = { noise: ns, noiseGain: ag, hum, humGain: hg };
    } catch {
      /* audio not available */
    }
  }

  stopDrone(): void {
    if (!this.drone) return;
    try {
      const c = this.getCtx();
      const now = c.currentTime;
      this.drone.noiseGain.gain.linearRampToValueAtTime(0, now + 0.8);
      this.drone.humGain.gain.linearRampToValueAtTime(0, now + 0.8);
      const d = this.drone;
      setTimeout(() => {
        try {
          d.noise.stop();
          d.hum.stop();
        } catch {
          /* already stopped */
        }
      }, 900);
    } catch {
      /* audio not available */
    }
    this.drone = null;
  }
}

export const sound = new SoundSystem();
