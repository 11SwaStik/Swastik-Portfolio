"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W: number, H: number;
    let pts: Particle[] = [];
    let px: number, py: number;
    let raf: number;

    function init() {
      W = cv!.width = cv!.offsetWidth;
      H = cv!.height = cv!.offsetHeight;
      px = W / 2;
      py = H / 2;
      pts = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.1 + 0.3,
      }));
    }
    init();

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    const onMouse = (e: MouseEvent) => {
      const r = cv!.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    cv.addEventListener("mousemove", onMouse);

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Update + draw particles
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(0,255,135,0.3)";
        ctx!.fill();
      });

      // Draw connections between particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 110) {
            ctx!.beginPath();
            ctx!.moveTo(pts[i].x, pts[i].y);
            ctx!.lineTo(pts[j].x, pts[j].y);
            ctx!.strokeStyle = `rgba(0,255,135,${0.1 * (1 - d / 110)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      // Mouse connections
      pts.forEach((p) => {
        const d = Math.hypot(p.x - px, p.y - py);
        if (d < 140) {
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(px, py);
          ctx!.strokeStyle = `rgba(0,255,135,${0.05 * (1 - d / 140)})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      cv.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "auto" }}
    />
  );
}
