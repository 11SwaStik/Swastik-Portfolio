"use client";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { playCommand } from "@/lib/uiSound";

interface Line {
  html: string;
  delay: number;
}

interface TerminalBoxProps {
  lines: Line[];
  interactive?: boolean;
}

interface CommandEntry {
  input: string;
  output: string[];
}

function escapeHtml(s: string): string {
  const map: Record<string, string> = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return s.replace(/[<>&"']/g, (c) => map[c] ?? c);
}

// Returns the output lines as HTML strings, or "CLEAR" sentinel.
function runCommand(rawInput: string): string[] | "CLEAR" {
  const cmd = rawInput.trim().toLowerCase();
  switch (cmd) {
    case "":
      return [];
    case "help":
      return [
        '<span class="text-text-dim">available commands:</span>',
        '  <span class="text-green">help</span>          show this list',
        '  <span class="text-green">whoami</span>        identity',
        '  <span class="text-green">scan</span>          portfolio scan',
        '  <span class="text-green">clear</span>         clear output',
        '  <span class="text-green">sudo hire-me</span>  contact',
      ];
    case "whoami":
      return ["swastik · cybersec engineer · sme @ scaler"];
    case "scan":
      return [
        '<span class="text-text-dim">[ SCAN INITIATED ]</span>',
        '<span class="text-text-dim">target: portfolio.local</span>',
        '<span class="text-green">[ OK ]</span>   open ports: 80, 443',
        '<span class="text-green">[ OK ]</span>   firewall: active',
        '<span class="text-yellow">[ WARN ]</span> anomaly detected',
        '<span class="text-text-dim">scan complete.</span>',
      ];
    case "clear":
      return "CLEAR";
    case "sudo hire-me":
      return [
        '<span class="text-green">permission granted.</span>',
        '→ <a href="mailto:11swastiksharma@gmail.com" class="text-green underline underline-offset-2">11swastiksharma@gmail.com</a>',
      ];
    default:
      return [
        `<span class="text-red">command not found:</span> ${escapeHtml(rawInput.trim())}. try <span class="text-green">help</span>.`,
      ];
  }
}

export default function TerminalBox({ lines, interactive = false }: TerminalBoxProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [history, setHistory] = useState<CommandEntry[]>([]);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          lines.forEach((line) => {
            setTimeout(() => {
              setVisibleLines((prev) => [...prev, line.html]);
            }, line.delay);
          });
          if (interactive) {
            const maxDelay = lines.length
              ? Math.max(...lines.map((l) => l.delay))
              : 0;
            setTimeout(() => setBootDone(true), maxDelay + 60);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lines, interactive]);

  // Keep the latest output in view.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [history, visibleLines, bootDone]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim().length > 0) playCommand();
    const result = runCommand(input);
    if (result === "CLEAR") {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, { input, output: result }]);
    }
    setInput("");
    setHistoryIndex(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (history.length === 0) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx =
        historyIndex === null
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(history[idx].input);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(idx);
        setInput(history[idx].input);
      }
    }
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div ref={containerRef} className="bg-bg border border-border overflow-hidden">
      {/* Title bar */}
      <div className="bg-border px-4 py-2 flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>
      {/* Content */}
      <div
        ref={scrollerRef}
        className={`p-5 text-[0.74rem] leading-[2.1] min-h-[190px] ${
          interactive ? "max-h-[420px] overflow-y-auto cursor-text" : ""
        }`}
        onClick={interactive ? focusInput : undefined}
      >
        {visibleLines.map((html, i) => (
          <span
            key={i}
            className="block"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}

        {interactive && bootDone && (
          <>
            {history.length === 0 && (
              <span className="block text-text-dim italic mt-1 text-[0.66rem]">
                ▸ tip: type{" "}
                <span className="text-green not-italic">help</span>
              </span>
            )}

            {history.map((entry, i) => (
              <div key={i}>
                <span className="block">
                  <span className="text-green">root@kirmada:~# </span>
                  <span className="text-text">{entry.input}</span>
                </span>
                {entry.output.map((html, j) => (
                  <span
                    key={j}
                    className="block"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-baseline">
              <span className="text-green shrink-0">root@kirmada:~&nbsp;#&nbsp;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="terminal input"
                className="flex-1 bg-transparent border-none outline-none text-text font-mono text-[0.74rem] caret-green min-w-0"
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
