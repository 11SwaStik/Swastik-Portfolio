// Concrete applications being built toward — distinct from Watchlist
// which lists topics being studied.
const APPLIED: { label: string; note: string }[] = [
  { label: "Traffic anomaly detection", note: "design" },
  { label: "Alert pattern recognition", note: "exploring" },
  { label: "Adaptive content filtering", note: "planned" },
  { label: "Threat triage classifier", note: "concept" },
];

/**
 * Compact "emerging capability" cell. Pairs with Watchlist as the
 * cyan column at the bottom of the skills grid: this card lists
 * applied projects in design / planning, Watchlist lists research
 * topics being studied. Same list rhythm so they read as a coherent
 * pair.
 */
export default function HighlightModule() {
  return (
    <div className="bg-bg p-8 transition-colors duration-200 hover:bg-surface">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="text-[0.58rem] text-cyan tracking-[4px]">
          AI-SECURITY
        </div>
        <span className="flex items-center gap-1.5 text-[0.5rem] text-cyan/80 tracking-[2px] shrink-0">
          <span className="w-1 h-1 rounded-full bg-cyan animate-[highlight-pulse_3.5s_ease-in-out_infinite]" />
          EMERGING
        </span>
      </div>

      <p className="text-[0.66rem] text-text-muted leading-[1.7] mb-4">
        Building toward applied ML for defense.
      </p>

      <ul className="flex flex-col gap-2 mb-4">
        {APPLIED.map((item) => (
          <li
            key={item.label}
            className="text-[0.66rem] leading-[1.55] pl-[18px] -indent-[18px]"
          >
            <span className="text-cyan/60 mr-1.5">→</span>
            <span className="text-text">{item.label}</span>
            <span className="text-text-dim text-[0.55rem] font-mono ml-1.5 whitespace-nowrap">
              — {item.note}
            </span>
          </li>
        ))}
      </ul>

      <div className="text-[0.55rem] text-text-dim tracking-[2px] font-mono">
        confidence: <span className="text-cyan">building</span>
      </div>
    </div>
  );
}
