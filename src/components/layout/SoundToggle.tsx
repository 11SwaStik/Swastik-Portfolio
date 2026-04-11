"use client";
import { useSound } from "@/lib/hooks/useSound";

export default function SoundToggle() {
  const { enabled, toggle } = useSound();

  return (
    <button
      onClick={toggle}
      title="Toggle sound"
      className={`fixed bottom-8 right-8 z-[5000] bg-surface border w-11 h-11 flex items-center justify-center cursor-pointer transition-colors duration-200 font-mono text-[0.68rem] ${
        enabled
          ? "border-green text-green"
          : "border-border-2 text-text-dim hover:border-green hover:text-green"
      }`}
    >
      {enabled ? "ON" : "OFF"}
    </button>
  );
}
