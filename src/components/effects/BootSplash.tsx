"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "kirmada_intro_seen";

type Line = { ts: string; prefix: string; prefixColor: "green" | "bright"; body: string };

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
const EXIT_MS = 520;

type Phase = "intro" | "ready" | "exiting" | "done";

export default function BootSplash() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [progress, setProgress] = useState({ line: 0, char: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(() => {
    setPhase((p) => (p === "ready" ? "exiting" : p));
  }, []);

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

  // Keyboard: Enter/Space to dismiss when ready
  useEffect(() => {
    if (phase !== "ready") return;
    buttonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, dismiss]);

  // After CRT-off finishes, drop the DOM
  useEffect(() => {
    if (phase !== "exiting") return;
    const t = setTimeout(() => setPhase("done"), EXIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center font-mono"
      style={{
        animation: phase === "exiting" ? `crt-off ${EXIT_MS}ms cubic-bezier(0.7, 0, 0.84, 0) forwards` : undefined,
        transformOrigin: "center",
      }}
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
        onClick={dismiss}
        disabled={phase !== "ready"}
        className="absolute top-6 right-6 text-[0.55rem] text-text-dim tracking-[2px] hover:text-green transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {"// SKIP"}
      </button>

      <Logo />

      <div className="mt-12 w-[min(560px,90vw)] text-[0.74rem] leading-[2.1] px-4">
        {LINES.map((line, i) => {
          if (i > progress.line) return <div key={i} className="min-h-[1.7em]" />;
          const fullLen = line.prefix.length + line.body.length;
          const revealed =
            i < progress.line ? fullLen : progress.char;
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

      <div className="mt-14 h-16 flex flex-col items-center">
        {phase === "ready" && (
          <>
            <button
              ref={buttonRef}
              onClick={dismiss}
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

function Logo() {
  return (
    <svg width="64" height="64" viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id="boot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff87" />
          <stop offset="55%" stopColor="#5df2ff" />
          <stop offset="100%" stopColor="#c38bff" />
        </linearGradient>
        <filter id="boot-glow">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="50,4 90,27 90,73 50,96 10,73 10,27"
        fill="none"
        stroke="url(#boot-grad)"
        strokeWidth="1.5"
        opacity="0.55"
        style={{
          strokeDasharray: 360,
          strokeDashoffset: 360,
          animation: "boot-draw 600ms ease-out forwards",
        }}
      />
      <g
        filter="url(#boot-glow)"
        stroke="url(#boot-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: 700,
          strokeDashoffset: 700,
          animation: "boot-draw 750ms 120ms ease-out forwards",
        }}
      >
        <polygon points="22,30 38,22 50,30 38,38" opacity="0.85" />
        <path d="M50,30 L78,22 L64,50 L78,78 L50,70 L22,78 L36,50 L22,30" />
      </g>
    </svg>
  );
}
