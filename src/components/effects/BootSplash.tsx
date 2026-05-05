"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { playUnlockSound } from "@/lib/clickSound";

const SESSION_KEY = "kirmada_intro_seen";
const READY_DELAY_MS = 700;
const EXIT_MS = 600;

type Phase = "intro" | "ready" | "exiting" | "done";

export default function BootSplash() {
  const [phase, setPhase] = useState<Phase>("intro");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isUnlockingRef = useRef(false);

  const unlock = useCallback(() => {
    if (isUnlockingRef.current) return;
    isUnlockingRef.current = true;
    playUnlockSound();
    // Ride the same user gesture to start ambient audio.
    window.dispatchEvent(new CustomEvent("kirmada:audio-start"));
    setPhase("exiting");
    setTimeout(() => setPhase("done"), EXIT_MS);
  }, []);

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

  if (phase === "done") return null;

  const exiting = phase === "exiting";

  return (
    <div
      className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center font-mono overflow-hidden transition-opacity ease-out"
      style={{
        transitionDuration: `${EXIT_MS}ms`,
        opacity: exiting ? 0 : 1,
      }}
      role="dialog"
      aria-label="Loading"
    >
      {/* Subtle scanline texture */}
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
        className="absolute top-6 right-6 text-[0.55rem] text-text-dim tracking-[2px] hover:text-green transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
      >
        {"// SKIP"}
      </button>

      <div className="relative z-[1] flex flex-col items-center gap-y-10 px-6">
        <div className="flex flex-col items-center gap-y-3">
          <div
            className="text-white text-[clamp(2.8rem,8vw,5.2rem)] leading-[1.1] tracking-wide font-medium"
            style={{
              fontFamily: "var(--font-devanagari)",
              animation: "boot-reveal 1000ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
              clipPath: "inset(0 100% 0 0)",
              opacity: 0,
              paddingBottom: "0.12em",
              filter:
                "drop-shadow(0 0 16px rgba(0, 255, 135, 0.18)) drop-shadow(0 0 40px rgba(0, 255, 135, 0.08))",
            }}
          >
            स्वस्तिक
          </div>
          <div
            className="text-[0.58rem] text-text-dim tracking-[6px] font-mono"
            style={{ animation: "boot-fade-up 500ms 700ms ease-out both" }}
          >
            SWASTIK · KIRMADA
          </div>
        </div>

        <div className="h-12 flex flex-col items-center gap-y-3">
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
    </div>
  );
}
