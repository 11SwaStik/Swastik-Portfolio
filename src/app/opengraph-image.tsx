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
          position: "relative",
        }}
      >
        {/* Top-right portfolio mark */}
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 72,
            fontSize: 20,
            color: "#666",
            letterSpacing: 6,
            fontFamily: "monospace",
            display: "flex",
          }}
        >
          {"// PORTFOLIO"}
        </div>

        <div
          style={{
            fontSize: 124,
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
            marginTop: 32,
            fontSize: 30,
            color: "#00ff87",
            letterSpacing: 4,
            fontFamily: "monospace",
            display: "flex",
          }}
        >
          Cybersecurity engineer.
        </div>
      </div>
    ),
    { ...size }
  );
}
