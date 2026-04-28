"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * A full circular mandala that lives between two sections in the page
 * flow. As the user scrolls across the divider, GSAP ScrollTrigger
 * scrubs a bell-curve opacity — invisible far from the viewport center,
 * peaks at ~0.35 when the divider is mid-screen, fades back to zero on
 * the way out. Sized to the full viewport width so it reads as a
 * screen-spanning transition accent.
 */
export default function MandalaDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    gsap.set(svg, { opacity: 0, rotation: -8, scale: 0.92 });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        const t = self.progress;
        // Bell curve, edges sharpened so the visible window is short.
        const bell = Math.sin(t * Math.PI);
        const opacity = Math.pow(bell, 1.5) * 0.35;
        // Subtle rotation drift + slight scale-in for life.
        const rotation = -8 + t * 16;
        const scale = 0.92 + bell * 0.08;
        gsap.set(svg, { opacity, rotation, scale });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-40 pointer-events-none w-full overflow-visible"
      aria-hidden
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg
          ref={svgRef}
          viewBox="-150 -150 300 300"
          className="w-[100vw] h-[100vw] max-w-[1100px] max-h-[1100px]"
          style={{
            opacity: 0,
            overflow: "visible",
            filter:
              "drop-shadow(0 0 8px rgba(93, 242, 255, 0.32)) drop-shadow(0 0 18px rgba(195, 139, 255, 0.15))",
          }}
        >
          <FullMandala />
        </svg>
      </div>
    </div>
  );
}

function FullMandala() {
  return (
    <g>
      {/* Outermost circle */}
      <circle r="140" fill="none" stroke="#5df2ff" strokeWidth="0.6" />

      {/* 24 perimeter dots */}
      <g fill="#00ff87">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const x = Math.cos(angle) * 132;
          const y = Math.sin(angle) * 132;
          return <circle key={i} cx={x} cy={y} r="1.0" />;
        })}
      </g>

      {/* 12 outer leaf petals */}
      <g fill="none" stroke="#5df2ff" strokeWidth="0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 30})`}>
            <path d="M 40,0 Q 80,-12 120,0 Q 80,12 40,0 Z" />
          </g>
        ))}
      </g>

      {/* Mid circle */}
      <circle r="78" fill="none" stroke="#5df2ff" strokeWidth="0.5" />

      {/* 8 mid petals offset 22.5° to interlock with the outer 12-pattern */}
      <g fill="none" stroke="#c38bff" strokeWidth="0.45">
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 45 + 22.5})`}>
            <path d="M 22,0 Q 48,-8 72,0 Q 48,8 22,0 Z" />
          </g>
        ))}
      </g>

      {/* Inner circle */}
      <circle r="36" fill="none" stroke="#c38bff" strokeWidth="0.4" />

      {/* 6-petal inner rosette */}
      <g fill="none" stroke="#00ff87" strokeWidth="0.45">
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 60})`}>
            <path d="M 10,0 Q 22,-5 34,0 Q 22,5 10,0 Z" />
          </g>
        ))}
      </g>

      {/* Center: ring + bindu */}
      <circle r="9" fill="none" stroke="#00ff87" strokeWidth="0.5" />
      <circle r="2.8" fill="#00ff87" />
    </g>
  );
}
