"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { playUnlockSound } from "@/lib/clickSound";
import { splitGraphemes } from "@/lib/graphemes";

const SESSION_KEY = "kirmada_intro_seen";
const NAME = "स्वस्तिक";
const NAME_CHARS = splitGraphemes(NAME);
const PARTICLE_COUNT = 72;
const READY_DELAY_MS = 1100;

type ParticleParam = {
  baseAngle: number;
  radiusMul: number;
  spiralTurns: number;
  delay: number;
  size: number;
};

// Particles trail the chars on unlock — deterministic params for stable behavior.
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

type Phase = "intro" | "ready" | "unlocking" | "done";

export default function BootSplash() {
  const [phase, setPhase] = useState<Phase>("intro");
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
    playUnlockSound();
    // Ride the same user gesture to start the ambient audio. Event is
    // received by AudioToggle, which handles the play + fade-in.
    window.dispatchEvent(new CustomEvent("kirmada:audio-start"));

    const chars = charsRef.current.filter(Boolean);
    const particles = particlesRef.current.filter(Boolean);
    const container = containerRef.current;
    const flash = flashRef.current;
    if (chars.length === 0 || !container) {
      setPhase("done");
      return;
    }

    setPhase("unlocking");

    const MAX_R = Math.hypot(window.innerWidth, window.innerHeight) * 0.85;
    const charParams = chars.map((_, i) => ({
      baseAngle: (i / chars.length) * Math.PI * 2 - Math.PI / 2,
    }));

    const driver = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => setPhase("done") });
    tlRef.current = tl;

    tl.to(driver, {
      v: 1,
      duration: 1.55,
      ease: "none",
      onUpdate: () => {
        const t = driver.v;

        // Devanagari graphemes spiral outward across the viewport.
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

        // Particles trail the chars.
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

    // Boot UI fades out under the spiral.
    tl.to(
      ".boot-rest",
      { opacity: 0, y: -8, duration: 0.4, ease: "power1.in" },
      0.05
    );

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

    tl.to(
      container,
      { opacity: 0, duration: 0.35, ease: "power1.in" },
      1.18
    );
  }, []);

  // Mount: skip splash on second-visit-in-session, otherwise mark seen
  // and arm the button after the title has had time to settle.
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe session-replay check
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    const t = setTimeout(() => setPhase("ready"), READY_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Keyboard: Enter / Space dismisses when ready.
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
      className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center font-mono overflow-hidden"
      role="dialog"
      aria-label="Loading"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
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

      {/* Title block — centered, generous spacing, premium feel */}
      <div className="relative z-[1] flex flex-col items-center gap-y-10 px-6">
        <div className="flex flex-col items-center gap-y-3">
          <DevanagariName charsRef={charsRef} />
          <div
            className="boot-rest text-[0.58rem] text-text-dim tracking-[6px] font-mono"
            style={{ animation: "boot-fade-up 700ms 700ms ease-out both" }}
          >
            SWASTIK · KIRMADA
          </div>
        </div>

        <div className="boot-rest h-12 flex flex-col items-center gap-y-3">
          {phase === "ready" && (
            <>
              <button
                ref={buttonRef}
                onClick={unlock}
                className="auth-btn px-10 py-3 border border-green/40 text-green/85 text-[0.65rem] tracking-[4px] font-medium bg-transparent hover:border-green hover:text-green hover:bg-green/[0.04] transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-green/60 focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
                style={{ animation: "boot-fade-up 500ms ease-out both" }}
              >
                [ AUTHENTICATE ]
              </button>
              <div
                className="text-[0.5rem] text-text-dim tracking-[3px]"
                style={{ animation: "boot-fade-up 500ms 200ms ease-out both" }}
              >
                press ENTER or click
              </div>
            </>
          )}
        </div>
      </div>

      {/* Particle vortex layer */}
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

      {/* Center bloom — full-screen radial flash at unlock peak */}
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
  const [revealed, setRevealed] = useState(false);

  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-devanagari)",
    paddingBottom: "0.12em",
    // Soft green halo — replaces the previous rainbow drop-shadow.
    // Two layers: tight inner glow + wider ambient halo.
    filter:
      "drop-shadow(0 0 16px rgba(0, 255, 135, 0.18)) drop-shadow(0 0 40px rgba(0, 255, 135, 0.08))",
  };
  const entryStyle: React.CSSProperties = revealed
    ? {}
    : {
        animation: "boot-reveal 1000ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
      };

  return (
    <div
      // text-white reads as "premium" against the dark bg; the green
      // halo from filter ties it to the rest of the green/cyan theme
      // without screaming.
      className="text-white text-[clamp(2.8rem,8vw,5.2rem)] leading-[1.1] tracking-wide font-medium"
      style={{ ...baseStyle, ...entryStyle }}
      onAnimationEnd={(e) => {
        if (e.animationName === "boot-reveal") setRevealed(true);
      }}
    >
      {NAME_CHARS.map((c, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) charsRef.current[i] = el;
          }}
          className="inline-block"
          style={{ willChange: "transform, opacity" }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
