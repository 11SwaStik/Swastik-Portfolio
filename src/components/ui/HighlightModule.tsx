const CAPABILITIES = ["Anomaly Detection", "Pattern Recognition", "ML Filtering"];

/**
 * Compact "emerging capability" cell that slots into the regular skills
 * grid alongside the four category cards. Matches their padding and
 * background; the only differences are a cyan accent (instead of green)
 * for the label, a small pulsing EMERGING tag, and a one-line
 * "confidence: building" footnote — enough to read as distinct without
 * dominating the grid.
 */
export default function HighlightModule() {
  return (
    <div className="bg-bg p-8 transition-colors duration-200 hover:bg-surface">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="text-[0.58rem] text-cyan tracking-[4px]">
          MODULE: AI-SECURITY
        </div>
        <span className="flex items-center gap-1.5 text-[0.5rem] text-cyan/80 tracking-[2px] shrink-0">
          <span className="w-1 h-1 rounded-full bg-cyan animate-[highlight-pulse_3.5s_ease-in-out_infinite]" />
          EMERGING
        </span>
      </div>

      <p className="text-[0.66rem] text-text-muted leading-[1.7] mb-4">
        ML-driven anomaly detection and pattern recognition for traffic and threat triage.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {CAPABILITIES.map((tag) => (
          <span
            key={tag}
            className="text-[0.63rem] py-1 px-3 border border-border-2 text-text-dim tracking-[0.5px] cursor-default hover:border-cyan/60 hover:text-cyan"
            data-hover
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="text-[0.55rem] text-text-dim tracking-[2px] font-mono">
        confidence: <span className="text-cyan">building</span>
      </div>
    </div>
  );
}
