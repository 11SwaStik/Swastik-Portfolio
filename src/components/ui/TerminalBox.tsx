"use client";
import { useEffect, useRef, useState } from "react";

interface TerminalBoxProps {
  lines: { html: string; delay: number }[];
}

export default function TerminalBox({ lines }: TerminalBoxProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          lines.forEach((line) => {
            setTimeout(() => {
              setVisibleLines((prev) => [...prev, line.html]);
            }, line.delay);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lines]);

  return (
    <div ref={containerRef} className="bg-bg border border-border overflow-hidden">
      {/* Title bar */}
      <div className="bg-border px-4 py-2 flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>
      {/* Content */}
      <div className="p-5 text-[0.74rem] leading-[2.1] min-h-[190px]">
        {visibleLines.map((html, i) => (
          <span
            key={i}
            className="block"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ))}
      </div>
    </div>
  );
}
