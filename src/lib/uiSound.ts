// UI interaction sounds — three short cues synthesized via Web Audio API
// (no asset to ship). Each sound is gated on the ambient-audio preference:
// if the visitor has the background music ON, UI sounds are suppressed
// so they don't fight for attention.

const AMBIENT_KEY = "kirmada_audio_on";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const W = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  const Ctor = W.AudioContext ?? W.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
}

function isAmbientOn(): boolean {
  try {
    return localStorage.getItem(AMBIENT_KEY) === "1";
  } catch {
    return false;
  }
}

// Random offset for repetition variety. Default ±half the range.
function jitter(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

// Per-sound throttle so accidental rapid double-fires don't stack.
const lastPlayed: Record<string, number> = {};
const THROTTLE_MS = 60;

function shouldPlay(key: string): boolean {
  if (typeof window === "undefined") return false;
  if (isAmbientOn()) return false;
  const now = performance.now();
  const last = lastPlayed[key] ?? 0;
  if (now - last < THROTTLE_MS) return false;
  lastPlayed[key] = now;
  return true;
}

function ensureRunning(audio: AudioContext): void {
  if (audio.state === "suspended") void audio.resume();
}

/**
 * Soft rising swell — for a panel/drawer opening.
 * Sine sweep 220 → 660 Hz over 180ms. ~250ms total.
 */
export function playOpen(): void {
  if (!shouldPlay("open")) return;
  const audio = getCtx();
  if (!audio) return;
  ensureRunning(audio);
  const t = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(jitter(220, 20), t);
  osc.frequency.exponentialRampToValueAtTime(jitter(660, 40), t + 0.18);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.1, t + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.25);
}

/**
 * Sharp digital tick — for a button or card click.
 * Triangle wave, high pitch dropping fast. ~50ms.
 */
export function playClick(): void {
  if (!shouldPlay("click")) return;
  const audio = getCtx();
  if (!audio) return;
  ensureRunning(audio);
  const t = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "triangle";
  const baseFreq = jitter(2200, 280);
  osc.frequency.setValueAtTime(baseFreq, t);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, t + 0.04);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(jitter(0.1, 0.02), t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.07);
}

/**
 * Mid-pitch blip — for a terminal command being executed.
 * Triangle wave 880 → 440 Hz over 60ms. ~100ms total.
 */
export function playCommand(): void {
  if (!shouldPlay("command")) return;
  const audio = getCtx();
  if (!audio) return;
  ensureRunning(audio);
  const t = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(jitter(880, 90), t);
  osc.frequency.linearRampToValueAtTime(jitter(440, 50), t + 0.06);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.12, t + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.12);
}
