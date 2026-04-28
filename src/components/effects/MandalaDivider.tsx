"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * A half-mandala divider that sits between two sections. The flat
 * (cropped) edge runs horizontally across the divider line at the
 * boundary between sections; the petals fan downward into the next
 * section. Sized to span the full viewport width — this is the wide
 * "screen-spanning" placement, not an edge ornament.
 *
 * Opacity is driven by GSAP ScrollTrigger as the user scrolls across
 * the divider — invisible far away, peaks ~0.4 mid-cross, fades back.
 */
export default function MandalaDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    gsap.set(svg, { opacity: 0, scale: 0.94 });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        const t = self.progress;
        const bell = Math.sin(t * Math.PI);
        const opacity = Math.pow(bell, 1.5) * 0.4;
        const scale = 0.94 + bell * 0.06;
        gsap.set(svg, { opacity, scale });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-40 w-full pointer-events-none"
      aria-hidden
    >
      {/* The SVG is anchored to the divider midline (top:50%) and blooms
          downward — the flat edge of the half-mandala IS the section
          boundary. Bleeds into the top of the next section by design. */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full flex justify-center">
        <svg
          ref={svgRef}
          viewBox="-150 0 300 160"
          preserveAspectRatio="xMidYMin meet"
          className="w-screen max-w-[1600px]"
          style={{
            opacity: 0,
            overflow: "visible",
            filter:
              "drop-shadow(0 0 8px rgba(93, 242, 255, 0.32)) drop-shadow(0 0 18px rgba(195, 139, 255, 0.15))",
          }}
        >
          <HalfMandalaDown />
        </svg>
      </div>
    </div>
  );
}

// All elements anchored to (0, 0) — the cropped flat edge runs along
// y=0, mandala extends down into positive y.
function HalfMandalaDown() {
  return (
    <g>
      {/* Outer rim — semicircle facing down */}
      <path
        d="M -140,0 A 140,140 0 0 0 140,0"
        fill="none"
        stroke="#5df2ff"
        strokeWidth="0.6"
      />

      {/* Outer 7 leaf petals fanning across the lower semicircle.
          Petal path is for one pointing right; rotate around (0,0). */}
      <g fill="none" stroke="#5df2ff" strokeWidth="0.5">
        {[18, 45, 72, 90, 108, 135, 162].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path d="M 32,0 Q 76,-10 122,0 Q 76,10 32,0 Z" />
          </g>
        ))}
      </g>

      {/* Mid rim semicircle */}
      <path
        d="M -80,0 A 80,80 0 0 0 80,0"
        fill="none"
        stroke="#5df2ff"
        strokeWidth="0.5"
      />

      {/* Mid 6 smaller petals offset 13.5° to interlock with outer */}
      <g fill="none" stroke="#c38bff" strokeWidth="0.45">
        {[31.5, 58.5, 81, 99, 121.5, 148.5].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path d="M 18,0 Q 40,-7 62,0 Q 40,7 18,0 Z" />
          </g>
        ))}
      </g>

      {/* Inner rim semicircle */}
      <path
        d="M -32,0 A 32,32 0 0 0 32,0"
        fill="none"
        stroke="#c38bff"
        strokeWidth="0.4"
      />

      {/* Inner 5 small rosette petals */}
      <g fill="none" stroke="#00ff87" strokeWidth="0.45">
        {[36, 60, 90, 120, 144].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path d="M 6,0 Q 16,-3 26,0 Q 16,3 6,0 Z" />
          </g>
        ))}
      </g>

      {/* Outer rim dots — fanning along the lower semicircle */}
      <g fill="#00ff87">
        {[8, 30, 55, 80, 100, 125, 150, 172].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x = Math.cos(rad) * 132;
          const y = Math.sin(rad) * 132;
          return <circle key={deg} cx={x} cy={y} r="1" />;
        })}
      </g>

      {/* Tiny half-ring + bindu sitting on the flat edge */}
      <path
        d="M -10,0 A 10,10 0 0 0 10,0"
        fill="none"
        stroke="#00ff87"
        strokeWidth="0.5"
      />
      <circle cx="0" cy="0" r="2.6" fill="#00ff87" />
    </g>
  );
}
