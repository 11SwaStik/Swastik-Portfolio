"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface MandalaDividerProps {
  /** Which side of the screen the half-mandala anchors to. */
  align?: "left" | "right";
}

/**
 * A half-mandala that pins to the left or right edge of the viewport
 * exactly between two sections. As the user scrolls across the divider,
 * a ScrollTrigger drives a bell-curve opacity — invisible far away,
 * peaks at ~0.4 when the divider is at the viewport center, fades out
 * again as it leaves.
 *
 * Lives in the page flow (not a fixed overlay), so each instance is
 * naturally tied to one section boundary. Insert one between each
 * pair of sections and alternate `align` if you want the eye to drift.
 */
export default function MandalaDivider({ align = "left" }: MandalaDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    gsap.set(svg, { opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        // Bell curve — 0 at start/end, 1 at midpoint. Powered up so the
        // visible window is short and the fade-in/out edges feel quick.
        const bell = Math.sin(self.progress * Math.PI);
        gsap.set(svg, { opacity: Math.pow(bell, 1.6) * 0.4 });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-32 pointer-events-none"
      aria-hidden
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          align === "left" ? "left-0" : "right-0"
        }`}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 130 260"
          className={`w-auto h-[clamp(220px,38vh,400px)] ${
            align === "right" ? "scale-x-[-1]" : ""
          }`}
          style={{
            opacity: 0,
            overflow: "visible",
            filter: "drop-shadow(0 0 6px rgba(93, 242, 255, 0.32))",
          }}
        >
          <HalfMandala />
        </svg>
      </div>
    </div>
  );
}

// All elements anchored to (0, 130) — the cropped edge of the half-mandala.
function HalfMandala() {
  return (
    <g>
      {/* Outer arc — semicircle, the rim of the mandala */}
      <path
        d="M 0,5 A 125,125 0 0 1 0,255"
        fill="none"
        stroke="#5df2ff"
        strokeWidth="0.5"
      />

      {/* Outer 7 leaf petals fanning across the right semicircle */}
      <g
        transform="translate(0 130)"
        fill="none"
        stroke="#5df2ff"
        strokeWidth="0.45"
      >
        <g transform="rotate(-75)">
          <path d="M 24,0 Q 56,-9 90,0 Q 56,9 24,0 Z" />
        </g>
        <g transform="rotate(-50)">
          <path d="M 24,0 Q 56,-9 90,0 Q 56,9 24,0 Z" />
        </g>
        <g transform="rotate(-25)">
          <path d="M 24,0 Q 56,-9 90,0 Q 56,9 24,0 Z" />
        </g>
        <g transform="rotate(0)">
          <path d="M 24,0 Q 56,-9 90,0 Q 56,9 24,0 Z" />
        </g>
        <g transform="rotate(25)">
          <path d="M 24,0 Q 56,-9 90,0 Q 56,9 24,0 Z" />
        </g>
        <g transform="rotate(50)">
          <path d="M 24,0 Q 56,-9 90,0 Q 56,9 24,0 Z" />
        </g>
        <g transform="rotate(75)">
          <path d="M 24,0 Q 56,-9 90,0 Q 56,9 24,0 Z" />
        </g>
      </g>

      {/* Mid arc */}
      <path
        d="M 0,55 A 75,75 0 0 1 0,205"
        fill="none"
        stroke="#5df2ff"
        strokeWidth="0.45"
      />

      {/* Mid 6 smaller petals offset 12.5° between the outer ones */}
      <g
        transform="translate(0 130)"
        fill="none"
        stroke="#c38bff"
        strokeWidth="0.4"
      >
        <g transform="rotate(-62.5)">
          <path d="M 12,0 Q 28,-5 44,0 Q 28,5 12,0 Z" />
        </g>
        <g transform="rotate(-37.5)">
          <path d="M 12,0 Q 28,-5 44,0 Q 28,5 12,0 Z" />
        </g>
        <g transform="rotate(-12.5)">
          <path d="M 12,0 Q 28,-5 44,0 Q 28,5 12,0 Z" />
        </g>
        <g transform="rotate(12.5)">
          <path d="M 12,0 Q 28,-5 44,0 Q 28,5 12,0 Z" />
        </g>
        <g transform="rotate(37.5)">
          <path d="M 12,0 Q 28,-5 44,0 Q 28,5 12,0 Z" />
        </g>
        <g transform="rotate(62.5)">
          <path d="M 12,0 Q 28,-5 44,0 Q 28,5 12,0 Z" />
        </g>
      </g>

      {/* Outer perimeter dots */}
      <g transform="translate(0 130)" fill="#00ff87">
        {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <circle cx="118" cy="0" r="0.9" />
          </g>
        ))}
      </g>

      {/* Inner ring + bindu */}
      <circle cx="0" cy="130" r="8" fill="none" stroke="#00ff87" strokeWidth="0.4" />
      <circle cx="0" cy="130" r="2.5" fill="#00ff87" />
    </g>
  );
}
