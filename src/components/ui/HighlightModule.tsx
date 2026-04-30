const CAPABILITIES = [
  "Anomaly Detection",
  "Pattern Recognition",
  "ML-based Filtering",
  "Threat Triage",
];

const CONFIDENCE_PERCENT = 42;

/**
 * Featured "emerging capability" module. Visually distinct from the
 * regular skill cards via a gradient hairline border, a faint cyan
 * radial glow in the top-right corner, and a slow-pulsing status dot.
 * Confidence bar honestly signals that this is an in-progress focus
 * area rather than a claimed expertise.
 */
export default function HighlightModule() {
  return (
    <div className="relative p-px bg-gradient-to-br from-green/35 via-cyan/40 to-violet/35 shadow-[0_0_40px_rgba(93,242,255,0.05)]">
      <div className="bg-bg p-6 md:p-8 relative overflow-hidden">
        {/* Faint cyan radial glow in the corner — gives the module a soft
            "active" feel without being a flashy effect. */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 92% 8%, #5df2ff 0%, transparent 55%)",
          }}
          aria-hidden
        />

        {/* Status row */}
        <div className="relative flex items-center justify-between mb-5 font-mono text-[0.55rem] tracking-[2.5px]">
          <span className="flex items-center gap-2 text-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-[highlight-pulse_3.2s_ease-in-out_infinite]" />
            EMERGING
          </span>
          <span className="text-text-dim">{"// AI · SEC"}</span>
        </div>

        {/* Title */}
        <h3 className="relative font-sans text-[1.45rem] md:text-[1.8rem] font-extrabold tracking-tight leading-tight text-white mb-3">
          AI{" "}
          <span className="text-text-dim font-normal">·</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-cyan to-violet">
            SECURITY
          </span>
        </h3>

        {/* Description */}
        <p className="relative text-[0.78rem] md:text-[0.85rem] text-text-muted leading-[1.7] mb-6 max-w-[640px]">
          Applying machine learning to defense — anomaly detection,
          pattern recognition, and ML-based filtering for traffic and
          threat triage.
        </p>

        {/* Capability tags */}
        <div className="relative flex flex-wrap gap-2 mb-6">
          {CAPABILITIES.map((tag) => (
            <span
              key={tag}
              className="text-[0.6rem] py-1 px-3 border border-border-2 text-text-dim tracking-[0.5px] font-mono cursor-default hover:border-cyan/60 hover:text-cyan"
              data-hover
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Confidence indicator — honest "still building" signal */}
        <div className="relative flex items-center gap-3 font-mono text-[0.55rem] tracking-[2.5px]">
          <span className="text-text-dim shrink-0">CONFIDENCE</span>
          <div className="flex-1 max-w-[180px] h-[2px] bg-border-2 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-green to-cyan"
              style={{ width: `${CONFIDENCE_PERCENT}%` }}
            />
          </div>
          <span className="text-cyan shrink-0">BUILDING</span>
        </div>
      </div>
    </div>
  );
}
