"use client";
import { useState, useCallback, useEffect } from "react";

type BootState = "idle" | "loading" | "complete" | "hidden";

const BOOT_LOGS = [
  "> Establishing secure channel...",
  "> Loading kernel modules [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 100%",
  "> Decrypting identity matrix...",
  "> Mounting /sys/portfolio...",
  "> Injecting KIRMADA runtime...",
  "> Firewall active. Threat level: LOW",
  "> SYSTEM READY",
];

export function useBootSequence() {
  const [state, setState] = useState<BootState>("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [shouldSkip, setShouldSkip] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("booted")) {
      setShouldSkip(true);
      setState("hidden");
    }
  }, []);

  const startBoot = useCallback(() => {
    setState("loading");

    // Progress animation
    const DURATION = 2500;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / DURATION, 1);
      setProgress(p * 100);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setState("complete");
        sessionStorage.setItem("booted", "1");
        setTimeout(() => setState("hidden"), 1000);
      }
    }
    requestAnimationFrame(tick);

    // Staggered logs
    BOOT_LOGS.forEach((log, i) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, i * 320);
    });
  }, []);

  return { state, progress, logs, startBoot, shouldSkip };
}
