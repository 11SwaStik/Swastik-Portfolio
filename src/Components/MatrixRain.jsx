// src/components/MatrixRain.jsx
import { useEffect, useRef } from "react";

export default function MatrixRain({
  color = "rgba(93, 242, 255, 0.6)", // subtle cyan
  fontSize = 16,
  fadeSpeed = 0.08,
  idleTimeout = 1200 // ms after mouse stops
}) {
  const canvasRef = useRef(null);
  const lastMove = useRef(Date.now());
  const active = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(0).map(() => Math.random() * canvas.height);

    const chars = "01ABCDEF#@$%&*";

    function draw() {
      const now = Date.now();
      active.current = now - lastMove.current < idleTimeout;

      ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (active.current) {
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = color;

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(char, i * fontSize, drops[i]);

          drops[i] += fontSize;
          if (drops[i] > canvas.height) drops[i] = 0;
        }
      }

      requestAnimationFrame(draw);
    }

    draw();

    const onMove = () => {
      lastMove.current = Date.now();
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [color, fontSize, fadeSpeed, idleTimeout]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.5
      }}
    />
  );
}
