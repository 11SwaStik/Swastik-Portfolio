"use client";
import { useEffect, useRef } from "react";

type Marker = { lat: number; lng: number; size: number };

const MARKERS: Marker[] = [
  { lat: 28.6139, lng: 77.209, size: 1.4 },      // Delhi
  { lat: 37.7749, lng: -122.4194, size: 1.0 },   // San Francisco
  { lat: 51.5074, lng: -0.1278, size: 1.0 },     // London
  { lat: 1.3521, lng: 103.8198, size: 0.9 },     // Singapore
  { lat: 35.6762, lng: 139.6503, size: 0.9 },    // Tokyo
  { lat: 52.52, lng: 13.405, size: 0.9 },        // Berlin
  { lat: 12.9716, lng: 77.5946, size: 1.2 },     // Bangalore
  { lat: -33.8688, lng: 151.2093, size: 0.8 },   // Sydney
  { lat: 40.7128, lng: -74.006, size: 1.0 },     // New York
  { lat: 25.2048, lng: 55.2708, size: 0.9 },     // Dubai
];

// Great-circle links between nodes (by index into MARKERS)
const LINKS: [number, number][] = [
  [0, 2], // DEL - LON
  [0, 4], // DEL - TYO
  [1, 8], // SFO - NYC
  [2, 8], // LON - NYC
  [6, 3], // BLR - SGP
  [6, 9], // BLR - DXB
  [2, 5], // LON - BER
  [7, 4], // SYD - TYO
];

type Vec3 = [number, number, number];

function latLngToVec3(lat: number, lng: number): Vec3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180;
  return [
    Math.cos(phi) * Math.cos(theta),
    Math.sin(phi),
    Math.cos(phi) * Math.sin(theta),
  ];
}

function rotate([x, y, z]: Vec3, ry: number, rx: number): Vec3 {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const y2 = y * cx - z1 * sx;
  const z2 = y * sx + z1 * cx;
  return [x1, y2, z2];
}

// Squared 3D chord length — used to skip wrap-around segments.
function chord2(a: Vec3, b: Vec3) {
  const dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef = useRef(0);
  const rotXRef = useRef(-0.25);
  const dragVelYRef = useRef(0);
  const dragVelXRef = useRef(0);
  const autoSpinRef = useRef(0.0025);
  const landRingsRef = useRef<Vec3[][] | null>(null);

  // Load continents once
  useEffect(() => {
    let cancelled = false;
    fetch("/earth-land.json")
      .then((r) => r.json())
      .then((rings: [number, number][][]) => {
        if (cancelled) return;
        landRingsRef.current = rings.map((ring) =>
          ring.map(([lng, lat]) => latLngToVec3(lat, lng))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0, cx = 0, cy = 0, radius = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      cy = height / 2;
      radius = Math.min(width, height) * 0.38;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Perspective projection. Camera at z = +d, looking at origin.
    const PERSPECTIVE = 2.2;
    const project = (v: Vec3) => {
      const scale = PERSPECTIVE / (PERSPECTIVE - v[2]);
      return {
        sx: cx + v[0] * radius * scale,
        sy: cy - v[1] * radius * scale,
        z: v[2],
        scale,
      };
    };

    // Precompute grid — latitude parallels + longitude meridians.
    const LAT_STEPS = 9;
    const LNG_STEPS = 12;
    const SEGMENTS = 72;

    const latLines: Vec3[][] = [];
    for (let i = 1; i < LAT_STEPS; i++) {
      const lat = -90 + (180 / LAT_STEPS) * i;
      const line: Vec3[] = [];
      for (let j = 0; j <= SEGMENTS; j++) {
        line.push(latLngToVec3(lat, -180 + (360 / SEGMENTS) * j));
      }
      latLines.push(line);
    }

    const lngLines: Vec3[][] = [];
    for (let i = 0; i < LNG_STEPS; i++) {
      const lng = -180 + (360 / LNG_STEPS) * i;
      const line: Vec3[] = [];
      for (let j = 0; j <= SEGMENTS; j++) {
        line.push(latLngToVec3(-90 + (180 / SEGMENTS) * j, lng));
      }
      lngLines.push(line);
    }

    const markerVecs = MARKERS.map((m) => latLngToVec3(m.lat, m.lng));

    // Sample great-circle arcs between linked nodes via slerp.
    const arcPoints: Vec3[][] = LINKS.map(([a, b]) => {
      const va = markerVecs[a], vb = markerVecs[b];
      const dot = Math.max(-1, Math.min(1, va[0]*vb[0] + va[1]*vb[1] + va[2]*vb[2]));
      const omega = Math.acos(dot);
      const sinO = Math.sin(omega);
      const pts: Vec3[] = [];
      const steps = 48;
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        if (sinO < 1e-6) { pts.push(va); continue; }
        const s1 = Math.sin((1 - t) * omega) / sinO;
        const s2 = Math.sin(t * omega) / sinO;
        pts.push([
          va[0]*s1 + vb[0]*s2,
          va[1]*s1 + vb[1]*s2,
          va[2]*s1 + vb[2]*s2,
        ]);
      }
      return pts;
    });

    let raf = 0;

    const draw = (now: number) => {
      rotYRef.current += dragVelYRef.current + autoSpinRef.current;
      rotXRef.current += dragVelXRef.current;
      rotXRef.current = Math.max(-1.1, Math.min(1.1, rotXRef.current));
      dragVelYRef.current *= 0.9;
      dragVelXRef.current *= 0.9;

      const ry = rotYRef.current;
      const rx = rotXRef.current;

      ctx.clearRect(0, 0, width, height);

      // Soft outer halo
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.45);
      halo.addColorStop(0, "rgba(0, 255, 135, 0.09)");
      halo.addColorStop(1, "rgba(0, 255, 135, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // Grid lines — dim, depth-faded
      const drawGridLine = (line: Vec3[]) => {
        const rotated = line.map((v) => rotate(v, ry, rx));
        for (let i = 0; i < rotated.length - 1; i++) {
          const a = rotated[i];
          const b = rotated[i + 1];
          const zAvg = (a[2] + b[2]) * 0.5;
          const front = (zAvg + 1) * 0.5;
          const pa = project(a);
          const pb = project(b);
          ctx.strokeStyle = `rgba(0, 255, 135, ${(0.04 + front * 0.18).toFixed(3)})`;
          ctx.lineWidth = 0.5 + front * 0.3;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      };
      latLines.forEach(drawGridLine);
      lngLines.forEach(drawGridLine);

      // Continents — brighter than the grid, clipped to the front hemisphere
      const landRings = landRingsRef.current;
      if (landRings) {
        for (const ring of landRings) {
          const rotated = ring.map((v) => rotate(v, ry, rx));
          for (let i = 0; i < rotated.length - 1; i++) {
            const a = rotated[i];
            const b = rotated[i + 1];
            const zAvg = (a[2] + b[2]) * 0.5;
            if (zAvg < -0.1) continue; // hide back-facing coastline
            if (chord2(a, b) > 0.16) continue; // skip wrap-around segments
            const front = (zAvg + 1) * 0.5;
            const pa = project(a);
            const pb = project(b);
            ctx.strokeStyle = `rgba(0, 255, 135, ${(0.25 + front * 0.55).toFixed(3)})`;
            ctx.lineWidth = 0.7 + front * 0.5;
            ctx.beginPath();
            ctx.moveTo(pa.sx, pa.sy);
            ctx.lineTo(pb.sx, pb.sy);
            ctx.stroke();
          }
        }
      }

      // Silhouette — crisp edge
      ctx.strokeStyle = "rgba(0, 255, 135, 0.28)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Arcs with a traveling pulse
      const tSec = now / 1000;
      arcPoints.forEach((arc, idx) => {
        const rotated = arc.map((v) => rotate(v, ry, rx));
        const pulsePos = (tSec * 0.3 + idx * 0.17) % 1;
        for (let i = 0; i < rotated.length - 1; i++) {
          const a = rotated[i];
          const b = rotated[i + 1];
          const zAvg = (a[2] + b[2]) * 0.5;
          if (zAvg < -0.15) continue;
          const front = (zAvg + 1) * 0.5;
          const tPos = i / (rotated.length - 1);
          const glow = Math.max(0, 1 - Math.abs(tPos - pulsePos) * 7);
          const pa = project(a);
          const pb = project(b);
          const alpha = Math.min(1, 0.12 + front * 0.28 + glow * 0.7);
          ctx.strokeStyle = `rgba(0, 255, 135, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.8 + glow * 1.8;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      });

      // Markers — front-facing only, with pulse
      markerVecs.forEach((v, i) => {
        const r = rotate(v, ry, rx);
        if (r[2] < -0.05) return;
        const p = project(r);
        const front = (r[2] + 1) * 0.5;
        const pulse = 0.5 + 0.5 * Math.sin(tSec * 2 + i * 0.7);
        const size = MARKERS[i].size * (1.6 + pulse * 1.1) * p.scale;
        ctx.fillStyle = `rgba(0, 255, 135, ${(0.12 + front * 0.2).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(200, 255, 220, ${(0.55 + front * 0.4).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // Drag-to-rotate
    let dragging = false;
    let lastX = 0, lastY = 0;

    const down = (px: number, py: number) => {
      dragging = true;
      lastX = px;
      lastY = py;
      autoSpinRef.current = 0;
    };
    const move = (px: number, py: number) => {
      if (!dragging) return;
      dragVelYRef.current = (px - lastX) * 0.005;
      dragVelXRef.current = -(py - lastY) * 0.005;
      lastX = px;
      lastY = py;
    };
    const up = () => {
      dragging = false;
      autoSpinRef.current = 0.0025;
    };

    const onMouseDown = (e: MouseEvent) => down(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => down(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => move(e.touches[0].clientX, e.touches[0].clientY);

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", up);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", up);

    canvas.style.opacity = "0";
    requestAnimationFrame(() => {
      canvas.style.transition = "opacity 900ms ease";
      canvas.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", up);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[440px]">
      <div className="absolute inset-[10%] rounded-full bg-green/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute inset-[20%] rounded-full border border-green/10 pointer-events-none" />
      <div className="absolute inset-[30%] rounded-full border border-green/[0.05] pointer-events-none" />

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      <div className="absolute top-[12%] right-[8%] text-[0.5rem] text-green/50 tracking-[2px] font-mono pointer-events-none">
        GLOBAL REACH
      </div>
      <div className="absolute bottom-[12%] left-[8%] text-[0.5rem] text-text-dim tracking-[2px] font-mono flex items-center gap-2 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-green animate-[pulse-dot_2s_infinite]" />
        INTERACTIVE
      </div>
    </div>
  );
}
