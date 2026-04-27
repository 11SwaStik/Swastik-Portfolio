// Cinematic "system unlock" cue — a rising tonal sweep mixed with a
// band-pass-filtered noise whoosh. Generated via Web Audio API, no asset
// to ship. AudioContext is created lazily on the first user gesture
// (browsers gate autoplay otherwise).

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

export function playUnlockSound(): void {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") void audio.resume();
  const t = audio.currentTime;

  // Tonal sweep — triangle rising 220 → 880 Hz, ~700ms decay.
  const osc = audio.createOscillator();
  const oscGain = audio.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.55);
  oscGain.gain.setValueAtTime(0, t);
  oscGain.gain.linearRampToValueAtTime(0.13, t + 0.04);
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
  osc.connect(oscGain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.72);

  // Noise whoosh — band-passed white noise, filter sweeps 400 → 3500 Hz.
  const dur = 0.85;
  const bufferSize = Math.floor(audio.sampleRate * dur);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const noise = audio.createBufferSource();
  noise.buffer = buffer;

  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.4;
  filter.frequency.setValueAtTime(400, t);
  filter.frequency.exponentialRampToValueAtTime(3500, t + 0.6);

  const noiseGain = audio.createGain();
  noiseGain.gain.setValueAtTime(0, t);
  noiseGain.gain.linearRampToValueAtTime(0.16, t + 0.08);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.78);

  noise.connect(filter).connect(noiseGain).connect(audio.destination);
  noise.start(t);
  noise.stop(t + dur);
}
