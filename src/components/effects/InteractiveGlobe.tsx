"use client";
import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    onResize();
    window.addEventListener("resize", onResize);

    const size = widthRef.current * 2;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size,
      height: size,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [0.05, 0.05, 0.05],
      markerColor: [0, 1, 0.53],
      glowColor: [0, 0.3, 0.15],
      markers: [
        { location: [28.6139, 77.209], size: 0.08 },    // New Delhi
        { location: [37.7749, -122.4194], size: 0.05 },  // San Francisco
        { location: [51.5074, -0.1278], size: 0.05 },    // London
        { location: [1.3521, 103.8198], size: 0.04 },     // Singapore
        { location: [35.6762, 139.6503], size: 0.04 },    // Tokyo
        { location: [52.52, 13.405], size: 0.04 },        // Berlin
        { location: [12.9716, 77.5946], size: 0.06 },     // Bangalore
        { location: [-33.8688, 151.2093], size: 0.03 },   // Sydney
        { location: [40.7128, -74.006], size: 0.05 },     // New York
        { location: [25.2048, 55.2708], size: 0.04 },     // Dubai
      ],
    });

    // Animation loop — auto-rotate + mouse interaction
    let raf: number;
    function animate() {
      phiRef.current += 0.003;
      phiRef.current += pointerRef.current.x * 0.01;

      const currentSize = widthRef.current * 2;
      globe.update({
        phi: phiRef.current,
        theta: 0.3 + pointerRef.current.y * 0.2,
        width: currentSize,
        height: currentSize,
      });

      raf = requestAnimationFrame(animate);
    }
    animate();

    // Mouse drag interaction
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    const canvas = canvasRef.current;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        pointerRef.current = {
          x: deltaX * 0.005,
          y: deltaY * 0.005,
        };
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      pointerRef.current = { x: 0, y: 0 };
    };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const deltaX = e.touches[0].clientX - lastX;
        const deltaY = e.touches[0].clientY - lastY;
        pointerRef.current = {
          x: deltaX * 0.005,
          y: deltaY * 0.005,
        };
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    // Fade in
    setTimeout(() => {
      if (canvas) canvas.style.opacity = "1";
    }, 100);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [onResize]);

  return (
    <div className="relative w-full aspect-square max-w-[520px]">
      {/* Glow rings */}
      <div className="absolute inset-[10%] rounded-full bg-green/[0.03] blur-3xl" />
      <div className="absolute inset-[20%] rounded-full border border-green/10" />
      <div className="absolute inset-[30%] rounded-full border border-green/[0.05]" />

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-1000"
        style={{
          opacity: 0,
          contain: "layout paint size",
          aspectRatio: "1",
        }}
      />

      {/* Labels */}
      <div className="absolute top-[12%] right-[8%] text-[0.5rem] text-green/50 tracking-[2px] font-mono">
        GLOBAL REACH
      </div>
      <div className="absolute bottom-[12%] left-[8%] text-[0.5rem] text-text-dim tracking-[2px] font-mono flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green animate-[pulse-dot_2s_infinite]" />
        INTERACTIVE
      </div>
    </div>
  );
}
