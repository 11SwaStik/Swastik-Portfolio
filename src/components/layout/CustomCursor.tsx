"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    let raf: number;
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.11;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.11;
      ringEl.style.left = `${ring.current.x}px`;
      ringEl.style.top = `${ring.current.y}px`;
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onHoverIn = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a,button,[data-hover],.tag,.pstage,.ctplat,.prow")) {
        dot.style.transform = "translate(-50%,-50%) scale(2.4)";
        ringEl.style.width = "48px";
        ringEl.style.height = "48px";
      }
    };

    const onHoverOut = () => {
      dot.style.transform = "translate(-50%,-50%)";
      ringEl.style.width = "28px";
      ringEl.style.height = "28px";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onHoverIn);
    document.addEventListener("mouseout", onHoverOut);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onHoverIn);
      document.removeEventListener("mouseout", onHoverOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-green pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 hidden md:block"
      />
      <div
        ref={ringRef}
        className="fixed w-7 h-7 border border-green/40 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-150 hidden md:block"
      />
    </>
  );
}
