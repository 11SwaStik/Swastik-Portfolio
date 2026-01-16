import { useEffect, useRef } from "react";

export default function CursorSnake({
  color = "#5df2ff",
  glow = "#ffb6c1",
  maxLength = 20,
  size = 13,
}) {
  const canvasRef = useRef(null);
  const points = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01ABCDEF#@$%";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    const onMove = (e) => {
      points.current.push({
        x: e.clientX,
        y: e.clientY,
        char: chars[Math.floor(Math.random() * chars.length)],
      });

      if (points.current.length > maxLength) {
        points.current.shift();
      }
    };

    window.addEventListener("mousemove", onMove);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${size}px monospace`;

      points.current.forEach((p, i) => {
        const alpha = i / points.current.length;
        ctx.fillStyle = `rgba(93,242,255,${alpha})`;
        ctx.shadowColor = glow;
        ctx.shadowBlur = 15 * alpha;
        ctx.fillText(p.char, p.x, p.y);
      });

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [glow, maxLength, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
