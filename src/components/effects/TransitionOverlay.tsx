"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TOTAL_MS = 1000;

/**
 * Brief "switching module…" overlay that flashes whenever the route
 * changes. Single CSS keyframe handles fade-in (200ms) → hold (~500ms)
 * → fade-out (300ms). pointer-events: none so it can't trap clicks.
 */
export default function TransitionOverlay() {
  const pathname = usePathname();
  const [showing, setShowing] = useState(false);
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip the initial mount — only fire on actual route changes.
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- routing-driven UI flash
    setShowing(true);
    const t = setTimeout(() => setShowing(false), TOTAL_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!showing) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9000] bg-bg flex items-center justify-center pointer-events-none font-mono"
      style={{
        animation: `transition-overlay ${TOTAL_MS}ms ease-out forwards`,
      }}
    >
      <div className="text-[0.78rem] md:text-[0.85rem] text-green tracking-[3px]">
        switching module
        <span
          aria-hidden
          className="inline-block ml-2 w-[7px] h-[13px] bg-green align-middle animate-[blink-cursor_.55s_step-end_infinite]"
        />
      </div>
    </div>
  );
}
