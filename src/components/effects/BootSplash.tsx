"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { playAuthClick } from "@/lib/clickSound";
import { splitGraphemes } from "@/lib/graphemes";

const SESSION_KEY = "kirmada_intro_seen";
const NAME = "स्वस्तिक";
const NAME_CHARS = splitGraphemes(NAME);

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

export default function BootSplash() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [progress, setProgress] = useState({ line: 0, char: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const unlock = useCallback(() => {
    setPhase((current) => {
      if (current !== "ready") return current;
      playAuthClick();

      const chars = charsRef.current.filter(Boolean);
      const N = chars.length;
      const radius =
        Math.max(window.innerWidth, window.innerHeight) * 0.55;
      const angleOffset = -Math.PI / 2; // first char flies upward

      const tl = gsap.timeline({
        onComplete: () => setPhase("done"),
      });
      tlRef.current = tl;

      // Devanagari chars spiral outward — radial position via trig,
      // each one rotates a full turn during travel so the burst feels
      // like a controlled spin, not a scatter.
      tl.to(
        chars,
        {
          x: (i) =>
            Math.cos(angleOffset + (i / N) * Math.PI * 2) * radius,
          y: (i) =>
            Math.sin(angleOffset + (i / N) * Math.PI * 2) * radius,
          rotation: (i) => 360 + i * 40,
          scale: 1.4,
          opacity: 0,
          duration: 1.05,
          ease: "power2.out",
          stagger: 0.06,
        },
        0
      );

      // Everything else (caption, boot lines, button, skip link) fades up
      // and out together — quieter than the spiral so it stays the focus.
      tl.to(
        ".boot-rest",
        {
          opacity: 0,
          y: -8,
          duration: 0.45,
          ease: "power1.in",
        },
        0.15
      );

      // Final container wash to clean transition into the page.
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power1.in",
        },
        0.7
      );

      return "unlocking";
    });
  }, []);

  // Drive the typing of boot lines via rAF — single setState only when
  // the visible character count changes, so we're not re-rendering at 60fps
  // for nothing.
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

  // Keyboard shortcut once the splash is ready.
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

  // Kill any in-flight GSAP timeline if the component unmounts mid-transition.
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center font-mono"
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
        className="boot-rest absolute top-6 right-6 text-[0.55rem] text-text-dim tracking-[2px] hover:text-green transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
    </div>
  );
}

interface DevanagariNameProps {
  charsRef: React.RefObject<HTMLSpanElement[]>;
}

function DevanagariName({ charsRef }: DevanagariNameProps) {
  return (
    <div
      className="text-transparent bg-clip-text bg-gradient-to-br from-green via-cyan to-violet text-[clamp(2.6rem,7vw,4.4rem)] leading-none tracking-wider"
      style={{
        fontFamily: "var(--font-devanagari)",
        animation: "boot-reveal 900ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        paddingBottom: "0.15em",
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
