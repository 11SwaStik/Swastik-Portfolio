// src/components/MatrixRain.jsx
import { useEffect, useRef } from "react";

export default function MatrixRain({
  colorPalette = ["#ff69b4", "#5df2ff", "#c38bff"],
  fontSize = 14,
  density = 0.08 // fraction of columns filled (0.02 - 0.15 typical)
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Calculate number of columns
    const cols = Math.floor(w / fontSize);
    const drops = new Array(cols).fill(0).map(() => Math.floor(Math.random() * h));

    // Resize handling
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let rafId;
    const draw = () => {
      // translucent black to slowly fade trails
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        // pick a random color per character by palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        ctx.fillStyle = color;

        // random character (hex-like + ascii to look like code)
        const chars = "0123456789ABCDEF#@%&*abcdefghijklmnopqrstuvwxyz";
        const text = chars[Math.floor(Math.random() * chars.length)];

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // randomly reset drop to top after it passes bottom (with randomness)
        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        // advance drop
        drops[i]++;
      }
      rafId = requestAnimationFrame(draw);
    };

    // initialize background as black
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [colorPalette, fontSize, density]);

  // Full-screen canvas positioned behind UI
  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,            // behind the rest of your app (set your UI z-index > 0)
        pointerEvents: "none" // allow clicks through to UI
      }}
    />
  );
}
