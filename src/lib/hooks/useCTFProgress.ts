"use client";
import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "kirmada3_ctf";

export function useCTFProgress(totalLevels: number) {
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe hydration from localStorage
    setStep(Math.min(saved, totalLevels));
    setHydrated(true);
  }, [totalLevels]);

  const advance = useCallback(() => {
    setStep((prev) => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(0);
  }, []);

  return {
    step,
    isComplete: step >= totalLevels,
    progressPercent: (step / totalLevels) * 100,
    advance,
    reset,
    hydrated,
  };
}
