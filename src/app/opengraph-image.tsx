import { ImageResponse } from "next/og";

export const alt = "Swastik Sharma — Cybersecurity Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRAD = "linear-gradient(135deg, #00ff87 0%, #5df2ff 55%, #c38bff 100%)";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#080808",
          color: "#e8e8e8",
          display: "flex",
          flexDirection: "column",
          padding: "72px 88px",
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        {/* Top status row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: 6,
            color: "#666",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#00ff87",
              }}
            />
            <span style={{ color: "#00ff87" }}>ONLINE</span>
          </div>
          <span>{"// PORTFOLIO"}</span>
        </div>

        {/* Center block — yantra mark, identity row, name, tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {/* Yantra mark + small identity tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              marginBottom: 28,
            }}
          >
            <YantraMark size={68} />
            <div
              style={{
                fontSize: 20,
                letterSpacing: 8,
                color: "#666",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              swastik · sharma
            </div>
          </div>

          {/* Big name — single block, two lines */}
          <div
            style={{
              fontSize: 134,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 0.95,
              letterSpacing: -3,
              display: "flex",
              flexDirection: "column",
              fontFamily: "sans-serif",
            }}
          >
            <span>SWASTIK</span>
            <span>SHARMA</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: 36,
              fontSize: 26,
              color: "#00ff87",
              letterSpacing: 3,
              display: "flex",
            }}
          >
            Cybersecurity engineer · building secure systems at scale.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: 4,
            color: "#444",
          }}
        >
          <span>CYBERSECURITY · AWS · DEVSECOPS</span>
          <span style={{ color: "#888" }}>SME · SCALER</span>
        </div>

        {/* Right-edge gradient accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 6,
            height: "100%",
            background: GRAD,
            opacity: 0.4,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

function YantraMark({ size = 68 }: { size?: number }) {
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
      <polygon
        points="50,24 70,36 70,64 50,76 30,64 30,36"
        fill="none"
        stroke="url(#og-yantra)"
        strokeWidth="1.4"
        opacity="0.45"
      />
      <path d="M50,30 L46.5,38 L53.5,38 Z" fill="url(#og-yantra)" />
      <path d="M70,50 L62,46.5 L62,53.5 Z" fill="url(#og-yantra)" />
      <path d="M50,70 L46.5,62 L53.5,62 Z" fill="url(#og-yantra)" />
      <path d="M30,50 L38,46.5 L38,53.5 Z" fill="url(#og-yantra)" />
      <circle
        cx="50"
        cy="50"
        r="6.5"
        fill="none"
        stroke="url(#og-yantra)"
        strokeWidth="1.4"
      />
      <circle cx="50" cy="50" r="3.2" fill="url(#og-yantra)" />
    </svg>
  );
}
