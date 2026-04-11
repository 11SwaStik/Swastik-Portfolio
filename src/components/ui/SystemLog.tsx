"use client";
import { useEffect, useRef } from "react";

interface SystemLogProps {
  logs: { text: string; type: "info" | "success" | "error" | "dim" | "warning" }[];
}

const typeColor: Record<string, string> = {
  info: "text-text-dim",
  success: "text-green",
  error: "text-red",
  dim: "text-text-dim",
  warning: "text-yellow",
};

export default function SystemLog({ logs }: SystemLogProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-bg border border-border-2">
      <div className="bg-border px-4 py-2 text-[0.56rem] text-text-muted tracking-[2px] flex justify-between">
        <span>SYSTEM LOG</span>
        <span>{logs.length} EVENTS</span>
      </div>
      <div
        ref={bodyRef}
        className="px-4 py-3 text-[0.66rem] leading-[2] max-h-[280px] overflow-y-auto scrollbar-thin"
      >
        {logs.map((log, i) => (
          <span
            key={i}
            className={`block animate-[log-in_0.2s_ease] ${typeColor[log.type]}`}
          >
            {log.text}
          </span>
        ))}
      </div>
    </div>
  );
}
