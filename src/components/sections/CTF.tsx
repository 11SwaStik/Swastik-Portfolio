"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import SystemLog from "@/components/ui/SystemLog";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { useCTFProgress } from "@/lib/hooks/useCTFProgress";
import { sound } from "@/lib/sound";
import type { CTFChallenge } from "@/data/types";

interface CTFProps {
  challenges: CTFChallenge[];
  platforms: string[];
  onComplete: () => void;
}

type LogEntry = { text: string; type: "info" | "success" | "error" | "dim" | "warning" };

const BOOT_LOGS: LogEntry[] = [
  { text: "[BOOT] System initializing...", type: "info" },
  { text: "[OK]   Secure context established", type: "success" },
  { text: "[CTF]  5 challenges armed", type: "info" },
  { text: "[SYS]  Awaiting first flag...", type: "dim" },
];

export default function CTF({ challenges, platforms, onComplete }: CTFProps) {
  const { step, isComplete, progressPercent, advance, hydrated } = useCTFProgress(
    challenges.length
  );
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [confetti, setConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasCompletedRef = useRef(false);

  // Boot logs
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    BOOT_LOGS.forEach((log, i) => {
      timeouts.push(
        setTimeout(() => {
          setLogs((prev) => [...prev, log]);
        }, i * 300 + 600)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Add solved level logs on hydration
  useEffect(() => {
    if (!hydrated || step === 0) return;
    const timeout = setTimeout(() => {
      const solvedLogs: LogEntry[] = [];
      for (let i = 0; i < step; i++) {
        solvedLogs.push({
          text: `[GRANT] Level ${i + 1} cleared`,
          type: "success",
        });
      }
      setLogs((prev) => [...prev, ...solvedLogs]);
    }, BOOT_LOGS.length * 300 + 800);

    return () => clearTimeout(timeout);
  }, [hydrated, step]);

  // Notify parent on completion
  useEffect(() => {
    if (isComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setLogs((prev) => [
        ...prev,
        { text: "[SYS] Root access granted", type: "success" },
      ]);
      onComplete();
    }
  }, [isComplete, onComplete]);

  const submit = useCallback(() => {
    if (isComplete) return;
    const val = input.trim().toUpperCase();
    const ans = challenges[step].answer.toUpperCase();

    if (val === ans) {
      setFeedback({
        type: "ok",
        text: `\u2713 FLAG ACCEPTED \u2014 LEVEL ${step + 1} CLEARED`,
      });
      setLogs((prev) => [
        ...prev,
        { text: `[GRANT] Level ${step + 1} accepted`, type: "success" },
      ]);
      sound.playSuccess();
      setConfetti(true);
      advance();
      setInput("");
      setTimeout(() => {
        setFeedback(null);
        setConfetti(false);
      }, 1200);
    } else {
      setFeedback({ type: "err", text: "\u2717 WRONG FLAG \u2014 TRY AGAIN" });
      setLogs((prev) => [
        ...prev,
        { text: `[DENY]  Invalid flag \u2014 level ${step + 1}`, type: "error" },
      ]);
      sound.playFail();
      setTimeout(() => setFeedback(null), 2000);
    }
  }, [input, step, challenges, isComplete, advance]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <section id="ctf" className="bg-surface py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="05" title="CTF" />
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Challenge */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[0.63rem] text-green tracking-[2px] whitespace-nowrap">
                  {isComplete
                    ? "COMPLETE \u2713"
                    : `LEVEL ${Math.min(step + 1, challenges.length)}/${challenges.length}`}
                </span>
                <div className="flex-1 h-0.5 bg-border-2">
                  <div
                    className="h-full bg-green transition-[width] duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {isComplete ? (
                <div className="bg-bg border border-border-2 p-8 text-center">
                  <div className="font-sans text-[1.1rem] font-extrabold text-green tracking-[2px] mb-2">
                    ALL FLAGS CLEARED
                  </div>
                  <div className="text-[0.66rem] text-text-muted leading-[1.9]">
                    Root access granted.
                    <br />
                    Secret section is now unlocked.
                  </div>
                </div>
              ) : (
                <div className="bg-bg border border-border-2 p-6 relative">
                  {confetti && <ConfettiBurst />}
                  <div className="text-[0.56rem] text-text-muted tracking-[2px] mb-3">
                    CHALLENGE
                  </div>
                  <div className="text-[0.76rem] text-text leading-[1.7] py-3 px-4 bg-green/[0.04] border-l-2 border-green mb-4">
                    {challenges[step]?.question}
                  </div>
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="FLAG{...}"
                      className="flex-1 bg-surface border border-border-2 text-green font-mono text-[0.7rem] py-2.5 px-3.5 outline-none transition-colors duration-200 focus:border-green"
                    />
                    <button
                      onClick={submit}
                      className="bg-transparent border border-green text-green font-mono text-[0.62rem] py-2.5 px-4 cursor-pointer tracking-[2px] transition-all duration-200 whitespace-nowrap hover:bg-green hover:text-black"
                      data-hover
                    >
                      SUBMIT
                    </button>
                  </div>
                  {feedback && (
                    <div
                      className={`text-[0.63rem] mt-2.5 py-1.5 px-2.5 tracking-[1px] ${
                        feedback.type === "ok"
                          ? "text-green bg-green/[0.06] border-l-2 border-green"
                          : "text-red bg-red/[0.06] border-l-2 border-red"
                      }`}
                    >
                      {feedback.text}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2.5 flex-wrap mt-5">
                {platforms.map((p) => (
                  <div
                    key={p}
                    className="ctplat text-[0.56rem] py-1.5 px-3.5 border border-border-2 text-text-dim tracking-[2px] transition-all duration-200 cursor-default hover:border-green hover:text-green"
                    data-hover
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: System Log */}
            <div>
              <SystemLog logs={logs} />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ConfettiBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-[9px] text-green"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: "20px",
            animation: `confetti-fall 1.3s ease-in forwards`,
            animationDelay: `${Math.random() * 0.25}s`,
          }}
        >
          \u2726
        </div>
      ))}
    </div>
  );
}
