// src/components/MatrixRain.jsx
import { useEffect, useRef } from "react";

export default function MatrixRain({
  colorPalette = ["#ff69b4", "#5df2ff", "#c38bff"],
  fontSize = 16
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const columns = Math.floor(w / fontSize);
    const drops = Array(columns).fill(1);

    const chars = "01ABCDEF#$%&*/+abcdefghijklmnopqrstuvwxyz";

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        ctx.fillStyle = color;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [colorPalette, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
