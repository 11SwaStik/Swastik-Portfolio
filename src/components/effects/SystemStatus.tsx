interface SystemStatusProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const POSITION: Record<NonNullable<SystemStatusProps["position"]>, string> = {
  "top-left": "top-20 left-6",
  "top-right": "top-20 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-right": "bottom-6 right-6",
};

const ROWS = [
  { label: "SYSTEM", value: "ACTIVE" },
  { label: "USER", value: "AUTHENTICATED" },
  { label: "ACCESS", value: "GRANTED" },
];

/**
 * Tiny HUD-style identity readout fixed in a corner of the viewport.
 * Three rows: SYSTEM / USER / ACCESS. Each row has a small green dot
 * and the value text in green; labels are dim. Briefly flickers in
 * on mount, then sits static at ~0.7 opacity. Hidden on mobile.
 */
export default function SystemStatus({
  position = "top-right",
}: SystemStatusProps) {
  return (
    <div
      aria-hidden
      className={`fixed ${POSITION[position]} z-30 pointer-events-none font-mono text-[0.55rem] tracking-[2px] hidden md:block`}
      style={{ animation: "status-flicker-in 600ms ease-out both" }}
    >
      {ROWS.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-4 leading-[1.9]">
          <span className="text-text-dim w-[64px]">{label}</span>
          <span className="flex items-center gap-1.5 text-green">
            <span className="w-1 h-1 rounded-full bg-green" />
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
