/**
 * Brief system-style loader shown for ~250ms between a project click
 * and the detail panel opening. Centered green mono text with a
 * blinking cursor, transparent backdrop. pointer-events: none so it
 * never traps clicks during its short visible window.
 */
export default function SystemLoader({ label = "fetching module" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center pointer-events-none">
      <div className="font-mono text-[0.7rem] text-green tracking-[2.5px]">
        &gt; {label}
        <span
          aria-hidden
          className="inline-block w-[6px] h-[10px] bg-green ml-2 align-middle animate-[blink-cursor_.5s_step-end_infinite]"
        />
      </div>
    </div>
  );
}
