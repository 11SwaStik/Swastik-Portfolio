"use client";
import { useEffect, useState } from "react";
import type { Threat } from "@/data/types";

interface ThreatMonitorProps {
  threats: Threat[];
}

const severityDot: Record<string, string> = {
  low: "bg-green",
  warning: "bg-yellow animate-[pulse-dot_2s_infinite]",
  critical: "bg-red animate-[pulse-dot_1.1s_infinite]",
};

const statusColor: Record<string, string> = {
  BLOCKED: "text-green",
  LOGGED: "text-yellow",
  ALERT: "text-red",
};

export default function ThreatMonitor({ threats }: ThreatMonitorProps) {
  const [items, setItems] = useState<Threat[]>(threats.slice(0, 6));
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      const threat = threats[idx % threats.length];
      idx++;
      setItems((prev) => [threat, ...prev.slice(0, 5)]);
      setEventCount((c) => c + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [threats]);

  return (
    <div className="bg-surface border border-border-2 overflow-hidden">
      <div className="bg-border px-4 py-3 flex justify-between items-center text-[0.6rem] tracking-[2px]">
        <span className="text-green">LIVE THREAT MONITOR</span>
        <span className="text-text-muted">{eventCount} EVENTS</span>
      </div>
      <div>
        {items.map((threat, i) => (
          <div
            key={`${threat.name}-${i}`}
            className="flex items-center gap-4 px-4 py-3 border-b border-border text-[0.66rem] transition-colors duration-200 hover:bg-green/[0.025] last:border-b-0"
            style={{
              animation: i === 0 ? "log-in 0.3s ease" : undefined,
            }}
          >
            <div
              className={`w-[5px] h-[5px] rounded-full shrink-0 ${severityDot[threat.severity]}`}
            />
            <span className="flex-1 text-text">{threat.name}</span>
            <span
              className={`text-[0.58rem] tracking-[1px] ${statusColor[threat.status]}`}
            >
              {threat.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
