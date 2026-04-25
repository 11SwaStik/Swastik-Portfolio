"use client";
import { useState, useCallback, useEffect } from "react";
import SystemLog from "@/components/ui/SystemLog";
import { useCTFProgress } from "@/lib/hooks/useCTFProgress";
import type { CTFChallenge } from "@/data/types";

const CONFETTI_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: 15 + ((i * 73) % 70),
  delayMs: (i * 137) % 250,
}));

interface CTFClientProps {
  challenges: CTFChallenge[];
  platforms: string[];
}

type LogEntry = {
  text: string;
  type: "info" | "success" | "error" | "dim" | "warning";
};

const BOOT_LOGS: LogEntry[] = [
  { text: "[BOOT] System initializing...", type: "info" },
  { text: "[OK]   Secure context established", type: "success" },
  { text: "[CTF]  5 challenges armed", type: "info" },
  { text: "[SYS]  Awaiting first flag...", type: "dim" },
];

export default function CTFClient({ challenges, platforms }: CTFClientProps) {
  const { step, isComplete, progressPercent, advance, hydrated } =
    useCTFProgress(challenges.length);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [confetti, setConfetti] = useState(false);

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

  useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(() => {
      setLogs((prev) => {
        if (prev.some((l) => l.text === "[SYS] Root access granted")) return prev;
        return [
          ...prev,
          { text: "[SYS] Root access granted", type: "success" as const },
        ];
      });
    }, 0);
    return () => clearTimeout(t);
  }, [isComplete]);

  const submit = useCallback(() => {
    if (isComplete) return;
    const val = input.trim().toUpperCase();
    const ans = challenges[step].answer.toUpperCase();

    if (val === ans) {
      setFeedback({
        type: "ok",
        text: `✓ FLAG ACCEPTED — LEVEL ${step + 1} CLEARED`,
      });
      setLogs((prev) => [
        ...prev,
        { text: `[GRANT] Level ${step + 1} accepted`, type: "success" },
      ]);
      setConfetti(true);
      advance();
      setInput("");
      setTimeout(() => {
        setFeedback(null);
        setConfetti(false);
      }, 1200);
    } else {
      setFeedback({ type: "err", text: "✗ WRONG FLAG — TRY AGAIN" });
      setLogs((prev) => [
        ...prev,
        { text: `[DENY]  Invalid flag — level ${step + 1}`, type: "error" },
      ]);
      setTimeout(() => setFeedback(null), 2000);
    }
  }, [input, step, challenges, isComplete, advance]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 md:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[0.63rem] text-green tracking-[2px] whitespace-nowrap">
              {isComplete
                ? "COMPLETE ✓"
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
                Five flags. Cleared. You actually solved them.
                <br />
                <strong className="text-text">Respect.</strong>
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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="FLAG{...}"
                  className="flex-1 bg-surface border border-border-2 text-green font-mono text-[0.7rem] py-2.5 px-3.5 outline-none transition-colors duration-200 focus:border-green"
                />
                <button
                  onClick={submit}
                  className="bg-transparent border border-green text-green font-mono text-[0.62rem] py-2.5 px-4 cursor-pointer tracking-[2px] transition-all duration-200 whitespace-nowrap hover:bg-green hover:text-black"
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
                className="text-[0.56rem] py-1.5 px-3.5 border border-border-2 text-text-dim tracking-[2px] transition-colors duration-200 cursor-default hover:border-green hover:text-green"
              >
                {p}
              </div>
            ))}
          </div>
        </div>

        <div>
          <SystemLog logs={logs} />
        </div>
      </div>
    </div>
  );
}

function ConfettiBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {CONFETTI_PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute text-[9px] text-green"
          style={{
            left: `${p.left}%`,
            top: "20px",
            animation: `confetti-fall 1.3s ease-in forwards`,
            animationDelay: `${p.delayMs}ms`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}
