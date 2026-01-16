import { useEffect, useRef } from "react";

export default function CursorTrail({
  color = "#5df2ff",
  glowColor = "#ffb6c1",
  trailLength = 20,
  thickness = 2
}) {
  const canvasRef = useRef(null);
  const points = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      points.current.push({ x: e.clientX, y: e.clientY });
      if (points.current.length > trailLength) {
        points.current.shift();
      }
    };

    window.addEventListener("mousemove", onMove);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (points.current.length > 1) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Glow
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = thickness * 4;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        points.current.forEach((p, i) => {
          if (i
