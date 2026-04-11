"use client";
import { useEffect, useRef } from "react";

interface MatrixRainProps {
  running: boolean;
}

const GLYPHS = "01ABCDEF><|#@$%!?";

export default function MatrixRain({ running }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W: number, H: number;
    let cols: { x: number; y: number; speed: number; trail: { y: number; ch: string }[] }[] = [];
    let raf: number;

    function resize() {
      W = cv!.width = window.innerWidth;
      H = cv!.height = window.innerHeight;
      const n = Math.floor(W / 18);
      cols = Array.from({ length: n }, (_, i) => ({
        x: i * 18 + 9,
        y: Math.random() * -200,
        speed: 1 + Math.random() * 2.5,
        trail: [],
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx!.fillStyle = "rgba(0,0,0,0.16)";
      ctx!.fillRect(0, 0, W, H);
      ctx!.font = '12px "Courier New",monospace';

      cols.forEach((d) => {
        if (!running) return;
        d.y += d.speed;
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        d.trail.push({ y: d.y, ch });
        if (d.trail.length > 18) d.trail.shift();

        d.trail.forEach((t, i) => {
          const a = i / d.trail.length;
          const isHead = i === d.trail.length - 1;
          ctx!.fillStyle = isHead
            ? `rgba(200,255,220,${a})`
            : `rgba(0,255,135,${a * 0.65})`;
          ctx!.fillText(t.ch, d.x, t.y);
        });

        if (d.y > H + 40) {
          d.y = -20;
          d.trail = [];
        }
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [running]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
