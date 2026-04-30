"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/sounds/the_mountain-space-133254.mp3";
const STORAGE_KEY = "kirmada_audio_on";
const TARGET_VOLUME = 0.2;
const FADE_MS = 500;

// Per-bar animation tuning — mixed durations + delays so the bars don't
// move in lockstep. Reads as an organic waveform rather than a metronome.
const BARS: { duration: number; delay: number; rest: number }[] = [
  { duration: 920, delay: 0, rest: 28 },
  { duration: 720, delay: 140, rest: 46 },
  { duration: 1080, delay: 260, rest: 62 },
  { duration: 840, delay: 380, rest: 38 },
  { duration: 960, delay: 520, rest: 30 },
];

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const fadeVolume = useCallback(
    (from: number, to: number, onDone?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (fadeRafRef.current !== null) {
        cancelAnimationFrame(fadeRafRef.current);
      }

      const start = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - start) / FADE_MS);
        const eased = t * t * (3 - 2 * t);
        audio.volume = Math.max(0, Math.min(1, from + (to - from) * eased));
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick);
        } else {
          fadeRafRef.current = null;
          onDone?.();
        }
      };
      fadeRafRef.current = requestAnimationFrame(tick);
    },
    []
  );

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "metadata";
    audioRef.current = audio;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gates render until audio element exists
    setHydrated(true);

    // Restore preference. Browsers may still block autoplay until first
    // gesture; the catch handles that silently.
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      audio
        .play()
        .then(() => {
          fadeVolume(0, TARGET_VOLUME);
          setPlaying(true);
        })
        .catch(() => {
          /* autoplay blocked — wait for click */
        });
    }

    return () => {
      if (fadeRafRef.current !== null) cancelAnimationFrame(fadeRafRef.current);
      audio.pause();
      audio.src = "";
    };
  }, [fadeVolume]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      fadeVolume(audio.volume, 0, () => audio.pause());
      setPlaying(false);
      try {
        localStorage.setItem(STORAGE_KEY, "0");
      } catch {
        /* private mode */
      }
      return;
    }

    audio.volume = 0;
    try {
      await audio.play();
      fadeVolume(0, TARGET_VOLUME);
      setPlaying(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode */
      }
    } catch {
      /* play failed — leave state as-is */
    }
  }, [playing, fadeVolume]);

  if (!hydrated) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause ambient audio" : "Play ambient audio"}
      aria-pressed={playing}
      className="fixed bottom-6 right-6 z-40 group flex items-end justify-center gap-[3px] h-9 w-11 px-2 py-2 bg-bg/40 backdrop-blur-sm border border-border-2 hover:border-green/60 transition-colors cursor-pointer"
      data-hover
    >
      {BARS.map((bar, i) => (
        <span
          key={i}
          className={`audio-bar ${playing ? "audio-bar-on" : ""} bg-green/70 group-hover:bg-green w-[2px] block`}
          style={
            playing
              ? {
                  animationDuration: `${bar.duration}ms`,
                  animationDelay: `${bar.delay}ms`,
                }
              : { height: `${bar.rest}%` }
          }
        />
      ))}
    </button>
  );
}
