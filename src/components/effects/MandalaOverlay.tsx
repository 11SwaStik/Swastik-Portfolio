"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface MandalaOverlayProps {
  /**
   * Optional list of section ids to watch. If omitted, every <section id>
   * on the page is observed.
   */
  sectionIds?: string[];
  /** Min ms between fires — prevents spam when scrolling fast. */
  cooldownMs?: number;
}

/**
 * Subtle scroll-transition accent. When a section's top or bottom crosses
 * the viewport center line, a faint geometric mandala briefly draws in,
 * holds for ~250ms, and fades out. ~1s total. Below the UI, above the
 * background. pointer-events: none.
 */
export default function MandalaOverlay({
  sectionIds,
  cooldownMs = 1200,
}: MandalaOverlayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const svg = svgRef.current;
    if (!wrapper || !svg) return;

    // Pre-compute path lengths for stroke-draw animation.
    const strokeNodes = Array.from(
      svg.querySelectorAll<SVGGeometryElement>("[data-mandala-stroke]")
    );
    const lengths = strokeNodes.map((n) =>
      typeof n.getTotalLength === "function" ? n.getTotalLength() : 100
    );

    let lastFire = 0;

    const fire = () => {
      const now = performance.now();
      if (now - lastFire < cooldownMs) return;
      lastFire = now;

      tlRef.current?.kill();
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Reset to pre-fire state — wrapper hidden, strokes hidden.
      gsap.set(wrapper, { opacity: 0, scale: 0.88, rotation: -6 });
      strokeNodes.forEach((n, i) => {
        gsap.set(n, {
          strokeDasharray: lengths[i],
          strokeDashoffset: lengths[i],
        });
      });

      // Phase 1 — wrapper fade in + scale + rotation correction.
      tl.to(
        wrapper,
        {
          opacity: 0.22,
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0
      );

      // Phase 1b — strokes draw in, staggered.
      tl.to(
        strokeNodes,
        {
          strokeDashoffset: 0,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.025,
        },
        0
      );

      // Phase 2 — fade out with a small drift outward.
      tl.to(
        wrapper,
        {
          opacity: 0,
          scale: 1.04,
          duration: 0.5,
          ease: "power1.in",
        },
        0.55
      );
    };

    const sections = (
      sectionIds && sectionIds.length > 0
        ? sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el))
        : Array.from(document.querySelectorAll<HTMLElement>("section[id]"))
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) fire();
        }
      },
      // Root collapsed to a single horizontal line at the viewport center.
      // A section is "intersecting" only at the moment its top or bottom
      // crosses that line — exactly once per direction.
      { rootMargin: "-50% 0% -50% 0%", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
      tlRef.current?.kill();
    };
  }, [sectionIds, cooldownMs]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="fixed inset-0 z-[5] pointer-events-none flex items-center justify-center"
      style={{ opacity: 0, willChange: "transform, opacity" }}
    >
      <svg
        ref={svgRef}
        viewBox="-100 -100 200 200"
        className="w-[60vmin] h-[60vmin]"
        style={{
          filter:
            "drop-shadow(0 0 8px rgba(93, 242, 255, 0.35)) drop-shadow(0 0 18px rgba(195, 139, 255, 0.18))",
        }}
      >
        {/* Three concentric rings — fragments-of-mandala feel rather than a busy full mandala. */}
        <circle
          cx="0"
          cy="0"
          r="92"
          fill="none"
          stroke="#5df2ff"
          strokeWidth="0.5"
          data-mandala-stroke
        />
        <circle
          cx="0"
          cy="0"
          r="64"
          fill="none"
          stroke="#5df2ff"
          strokeWidth="0.45"
          data-mandala-stroke
        />
        <circle
          cx="0"
          cy="0"
          r="38"
          fill="none"
          stroke="#5df2ff"
          strokeWidth="0.4"
          data-mandala-stroke
        />

        {/* Eight short radial spokes — bridge the inner ring to the outer ring. */}
        <g stroke="#c38bff" strokeWidth="0.4" strokeLinecap="round">
          <line x1="0" y1="-92" x2="0" y2="-38" data-mandala-stroke />
          <line x1="0" y1="92" x2="0" y2="38" data-mandala-stroke />
          <line x1="-92" y1="0" x2="-38" y2="0" data-mandala-stroke />
          <line x1="92" y1="0" x2="38" y2="0" data-mandala-stroke />
          <line x1="-65.05" y1="-65.05" x2="-26.87" y2="-26.87" data-mandala-stroke />
          <line x1="65.05" y1="-65.05" x2="26.87" y2="-26.87" data-mandala-stroke />
          <line x1="-65.05" y1="65.05" x2="-26.87" y2="26.87" data-mandala-stroke />
          <line x1="65.05" y1="65.05" x2="26.87" y2="26.87" data-mandala-stroke />
        </g>

        {/* Outer perimeter dots — fade with the wrapper opacity. */}
        <g fill="#00ff87">
          <circle cx="0" cy="-96" r="0.9" />
          <circle cx="48" cy="-83.14" r="0.9" />
          <circle cx="83.14" cy="-48" r="0.9" />
          <circle cx="96" cy="0" r="0.9" />
          <circle cx="83.14" cy="48" r="0.9" />
          <circle cx="48" cy="83.14" r="0.9" />
          <circle cx="0" cy="96" r="0.9" />
          <circle cx="-48" cy="83.14" r="0.9" />
          <circle cx="-83.14" cy="48" r="0.9" />
          <circle cx="-96" cy="0" r="0.9" />
          <circle cx="-83.14" cy="-48" r="0.9" />
          <circle cx="-48" cy="-83.14" r="0.9" />
        </g>

        {/* Central bindu — the still point. */}
        <circle cx="0" cy="0" r="1.6" fill="#00ff87" />
      </svg>
    </div>
  );
}
