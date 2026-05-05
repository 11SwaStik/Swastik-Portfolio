import { ImageResponse } from "next/og";

export const alt = "Swastik Sharma — Cybersecurity Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#080808",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <YantraMark size={84} />

        <div
          style={{
            marginTop: 52,
            fontSize: 112,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: -2,
            lineHeight: 1,
            fontFamily: "sans-serif",
            display: "flex",
          }}
        >
          SWASTIK SHARMA
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            color: "#00ff87",
            letterSpacing: 4,
            fontFamily: "monospace",
            display: "flex",
          }}
        >
          Cybersecurity engineer · Scaler.
        </div>
      </div>
    ),
    { ...size }
  );
}

function YantraMark({ size = 84 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="og-yantra" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff87" />
          <stop offset="55%" stopColor="#5df2ff" />
          <stop offset="100%" stopColor="#c38bff" />
        </linearGradient>
      </defs>
      <polygon
        points="50,8 86,29 86,71 50,92 14,71 14,29"
        fill="none"
        stroke="url(#og-yantra)"
        strokeWidth="2.2"
      />
      <path d="M50,30 L46.5,38 L53.5,38 Z" fill="url(#og-yantra)" />
      <path d="M70,50 L62,46.5 L62,53.5 Z" fill="url(#og-yantra)" />
      <path d="M50,70 L46.5,62 L53.5,62 Z" fill="url(#og-yantra)" />
      <path d="M30,50 L38,46.5 L38,53.5 Z" fill="url(#og-yantra)" />
      <circle cx="50" cy="50" r="3.4" fill="url(#og-yantra)" />
    </svg>
  );
}
