"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { playUnlockSound } from "@/lib/clickSound";
import { splitGraphemes } from "@/lib/graphemes";

const SESSION_KEY = "kirmada_intro_seen";
const NAME = "स्वस्तिक";
const NAME_CHARS = splitGraphemes(NAME);
const PARTICLE_COUNT = 72;

type Line = {
  ts: string;
  prefix: string;
  prefixColor: "green" | "bright";
  body: string;
};

const LINES: Line[] = [
  { ts: "04:47:21", prefix: ">", prefixColor: "green", body: " booting kirmada.os" },
  { ts: "04:47:22", prefix: "[ OK ]", prefixColor: "green", body: "  kernel: secure" },
  { ts: "04:47:22", prefix: "[ OK ]", prefixColor: "green", body: "  modules: 12/12 loaded" },
  { ts: "04:47:23", prefix: "[READY]", prefixColor: "bright", body: "  awaiting auth..." },
];

const LOGO_HOLD_MS = 700;
const CHAR_MS = 16;
const LINE_PAUSE_MS = 180;
const READY_PAUSE_MS = 220;

type Phase = "intro" | "ready" | "unlocking" | "done";

// Deterministic per-particle params so behavior is stable across runs and
// no Math.random is needed at runtime (also avoids hydration concerns).
type ParticleParam = {
  baseAngle: number;
  radiusMul: number;
  spiralTurns: number;
  delay: number;
  size: number;
};

// Particles get a baseline delay so the Devanagari chars lead the motion —
// the vortex visually emanates from the text rather than racing alongside it.
const PARTICLE_PARAMS: ParticleParam[] = Array.from(
  { length: PARTICLE_COUNT },
  (_, i) => ({
    baseAngle: (i / PARTICLE_COUNT) * Math.PI * 2 + ((i % 7) * 0.13),
    radiusMul: 1.0 + ((i * 17) % 100) / 100 * 1.4,
    spiralTurns: 1.1 + ((i * 23) % 100) / 100 * 1.6,
    delay: 0.18 + ((i * 11) % 28) / 100,
    size: 0.6 + ((i * 13) % 100) / 100 * 1.4,
  })
);

export default function BootSplash() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [progress, setProgress] = useState({ line: 0, char: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const particlesRef = useRef<HTMLSpanElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isUnlockingRef = useRef(false);

  const unlock = useCallback(() => {
    if (isUnlockingRef.current) return;
    isUnlockingRef.current = true;

    // Audio must run inside the user-gesture sync path or browsers
    // refuse to start the AudioContext.
    playUnlockSound();

    const chars = charsRef.current.filter(Boolean);
    const particles = particlesRef.current.filter(Boolean);
    const container = containerRef.current;
    const flash = flashRef.current;
    if (chars.length === 0 || !container) {
      setPhase("done");
      return;
    }

    setPhase("unlocking");

    // Spiral spans the viewport diagonal so particles fly off-screen.
    const MAX_R = Math.hypot(window.innerWidth, window.innerHeight) * 0.85;

    const charParams = chars.map((_, i) => ({
      baseAngle: (i / chars.length) * Math.PI * 2 - Math.PI / 2,
    }));

    // One driver tween — onUpdate computes spiral positions for all chars
    // and particles from a single 0→1 progress value. This keeps motion
    // perfectly synced and avoids spawning ~120 individual tweens.
    const driver = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => setPhase("done") });
    tlRef.current = tl;

    tl.to(driver, {
      v: 1,
      duration: 1.55,
      ease: "none",
      onUpdate: () => {
        const t = driver.v;

        // Chars expand outward in sync with the vortex — they need to
        // clearly cross the viewport, not stay near where the word sat.
        // Travel past the edges (1.15× radius), scale up dramatically,
        // and stay visible until the last ~25% so the motion reads as
        // "screen-filling expansion" instead of a localized burst.
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          const local = Math.min(1, t / 0.95);
          const eased = 1 - Math.pow(1 - local, 2.2);
          const angle = charParams[i].baseAngle + eased * Math.PI * 0.8;
          const r = eased * MAX_R * 1.15;
          const rot = eased * 200;
          const scale = 1 + eased * 2.6;
          const opacity =
            local < 0.75 ? 1 : Math.max(0, 1 - (local - 0.75) / 0.25);
          c.style.transform = `translate(${Math.cos(angle) * r}px, ${
            Math.sin(angle) * r
          }px) rotate(${rot}deg) scale(${scale})`;
          c.style.opacity = String(opacity);
        }

        // Particles — staggered start, cubic ease-out, more turns + variable radius.
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const params = PARTICLE_PARAMS[i];
          const local =
            (t - params.delay) / Math.max(0.01, 1 - params.delay);
          if (local <= 0) {
            p.style.opacity = "0";
            continue;
          }
          const clamped = Math.min(1, local);
          const eased = 1 - Math.pow(1 - clamped, 3);
          const angle = params.baseAngle + eased * Math.PI * params.spiralTurns;
          const r = eased * MAX_R * params.radiusMul;
          const scale = params.size * (0.8 + clamped * 0.7);
          const fadeIn = Math.min(1, clamped * 4);
          const fadeOut =
            clamped > 0.65 ? Math.max(0, 1 - (clamped - 0.65) / 0.35) : 1;
          p.style.transform = `translate(${Math.cos(angle) * r}px, ${
            Math.sin(angle) * r
          }px) scale(${scale})`;
          p.style.opacity = String(fadeIn * fadeOut);
        }
      },
    }, 0);

    // Boot UI fades quickly so it doesn't compete with the vortex.
    tl.to(
      ".boot-rest",
      { opacity: 0, y: -8, duration: 0.4, ease: "power1.in" },
      0.05
    );

    // Center bloom — radial flash that grows past the viewport at peak.
    if (flash) {
      tl.fromTo(
        flash,
        { opacity: 0, scale: 0.35 },
        { opacity: 0.95, scale: 1.5, duration: 0.35, ease: "power2.out" },
        0.55
      ).to(
        flash,
        { opacity: 0, scale: 2.2, duration: 0.5, ease: "power2.in" },
        0.92
      );
    }

    // Final container wash for clean handoff to the page underneath.
    tl.to(
      container,
      { opacity: 0, duration: 0.35, ease: "power1.in" },
      1.18
    );
  }, []);

  // Drive the typing of boot lines via a single rAF loop.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe session-replay check
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    const startTime = performance.now();
    const lineStartTimes: number[] = [];
    let acc = LOGO_HOLD_MS;
    for (const line of LINES) {
      lineStartTimes.push(acc);
      acc += line.body.length * CHAR_MS + line.prefix.length * CHAR_MS + LINE_PAUSE_MS;
    }
    const readyAt = acc + READY_PAUSE_MS;

    let raf = 0;
    let lastLine = -1, lastChar = -1;

    const tick = () => {
      const t = performance.now() - startTime;
      let lineIdx = 0;
      let charIdx = 0;
      for (let i = 0; i < LINES.length; i++) {
        if (t >= lineStartTimes[i]) {
          lineIdx = i;
          const localT = t - lineStartTimes[i];
          const fullLen = LINES[i].prefix.length + LINES[i].body.length;
          charIdx = Math.min(fullLen, Math.floor(localT / CHAR_MS));
        }
      }
      if (lineIdx !== lastLine || charIdx !== lastChar) {
        lastLine = lineIdx;
        lastChar = charIdx;
        setProgress({ line: lineIdx, char: charIdx });
      }
      if (t >= readyAt) {
        setPhase("ready");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    buttonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        unlock();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, unlock]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center font-mono overflow-hidden"
      role="dialog"
      aria-label="Loading"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, #00ff87 2px, #00ff87 3px)",
        }}
      />

      <button
        onClick={unlock}
        disabled={phase !== "ready"}
        className="boot-rest absolute top-6 right-6 text-[0.55rem] text-text-dim tracking-[2px] hover:text-green transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
      >
        {"// SKIP"}
      </button>

      <DevanagariName charsRef={charsRef} />

      <div
        className="boot-rest text-[0.55rem] text-text-dim tracking-[6px] mt-2 font-mono"
        style={{ animation: "boot-fade-up 500ms 700ms ease-out both" }}
      >
        SWASTIK · KIRMADA
      </div>

      <div className="boot-rest mt-10 w-[min(560px,90vw)] text-[0.74rem] leading-[2.1] px-4">
        {LINES.map((line, i) => {
          if (i > progress.line) return <div key={i} className="min-h-[1.7em]" />;
          const fullLen = line.prefix.length + line.body.length;
          const revealed = i < progress.line ? fullLen : progress.char;
          const prefixShown = line.prefix.slice(0, Math.min(revealed, line.prefix.length));
          const bodyShown =
            revealed > line.prefix.length
              ? line.body.slice(0, revealed - line.prefix.length)
              : "";
          const isTyping = i === progress.line && revealed < fullLen;

          return (
            <div key={i} className="flex gap-3 items-baseline min-h-[1.7em]">
              <span className="text-text-dim shrink-0">[{line.ts}]</span>
              <span className="whitespace-pre">
                <span
                  className={
                    line.prefixColor === "bright"
                      ? "text-green font-bold"
                      : "text-green"
                  }
                >
                  {prefixShown}
                </span>
                <span className="text-text-muted">{bodyShown}</span>
                {isTyping && (
                  <span className="inline-block w-[6px] h-[12px] bg-green align-middle ml-px animate-[blink-cursor_.6s_step-end_infinite]" />
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="boot-rest mt-14 h-16 flex flex-col items-center">
        {phase === "ready" && (
          <>
            <button
              ref={buttonRef}
              onClick={unlock}
              className="auth-btn relative px-9 py-3 border-2 border-green bg-bg text-green text-[0.7rem] tracking-[3px] font-bold hover:bg-green hover:text-black transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              style={{ animation: "boot-fade-up 360ms ease-out both" }}
            >
              [ AUTHENTICATE ]
            </button>
            <div
              className="text-[0.55rem] text-text-dim mt-4 tracking-[2px]"
              style={{ animation: "boot-fade-up 360ms 120ms ease-out both" }}
            >
              press ENTER or click
            </div>
          </>
        )}
      </div>

      {/* Particle vortex layer — positioned at viewport center, particles
          start clustered there and fly outward via GSAP transforms. */}
      <div className="absolute top-1/2 left-1/2 pointer-events-none">
        {PARTICLE_PARAMS.map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) particlesRef.current[i] = el;
            }}
            className="absolute w-[6px] h-[6px] rounded-full bg-green -ml-[3px] -mt-[3px]"
            style={{
              boxShadow:
                "0 0 6px #00ff87, 0 0 14px rgba(0, 255, 135, 0.55), 0 0 28px rgba(93, 242, 255, 0.25)",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* Center bloom — full-screen radial flash that grows at peak. */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0, 255, 135, 0.6) 0%, rgba(93, 242, 255, 0.25) 25%, transparent 60%)",
          opacity: 0,
          mixBlendMode: "screen",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}

interface DevanagariNameProps {
  charsRef: React.RefObject<HTMLSpanElement[]>;
}

function DevanagariName({ charsRef }: DevanagariNameProps) {
  return (
    <div
      className="text-[clamp(2.6rem,7vw,4.4rem)] leading-none tracking-wider relative z-[1]"
      style={{
        fontFamily: "var(--font-devanagari)",
        animation: "boot-reveal 900ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        paddingBottom: "0.15em",
        filter: "drop-shadow(0 0 22px rgba(0, 255, 135, 0.55)) drop-shadow(0 0 44px rgba(93, 242, 255, 0.25))",
      }}
    >
      {NAME_CHARS.map((c, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) charsRef.current[i] = el;
          }}
          className="inline-block bg-clip-text text-transparent bg-gradient-to-br from-green via-cyan to-violet"
          style={{ willChange: "transform, opacity" }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
