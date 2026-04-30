// Edit these to match what you're actually exploring — these are
// plausible defaults for a security engineer leaning into ML.
const WATCHLIST: { label: string; note: string }[] = [
  { label: "Anomaly detection on Zeek logs", note: "side project" },
  { label: "Adversarial ML for IDS", note: "reading" },
  { label: "Embedding-based alert clustering", note: "exploring" },
  { label: "TryHackMe — AI Red Team", note: "in progress" },
];

/**
 * Companion to HighlightModule — shows what's currently being explored
 * at the AI · security intersection. Same compact card style and cyan
 * accent so the two modules read as a paired "emerging" column.
 */
export default function Watchlist() {
  return (
    <div className="bg-bg p-8 transition-colors duration-200 hover:bg-surface">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="text-[0.58rem] text-cyan tracking-[4px]">
          MODULE: WATCHLIST
        </div>
        <span className="flex items-center gap-1.5 text-[0.5rem] text-cyan/80 tracking-[2px] shrink-0">
          <span className="w-1 h-1 rounded-full bg-cyan" />
          ACTIVE
        </span>
      </div>

      <p className="text-[0.66rem] text-text-muted leading-[1.7] mb-4">
        Currently exploring at the AI · security intersection.
      </p>

      <ul className="flex flex-col gap-2">
        {WATCHLIST.map((item) => (
          <li
            key={item.label}
            className="flex items-baseline gap-2 text-[0.66rem] leading-[1.5]"
          >
            <span className="text-cyan/60 shrink-0">→</span>
            <span className="text-text">{item.label}</span>
            <span className="text-text-dim text-[0.55rem] font-mono shrink-0">
              — {item.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
