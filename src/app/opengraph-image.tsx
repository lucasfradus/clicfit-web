import { ImageResponse } from "next/og";

export const alt = "CLIC FIT — El lugar donde tus hábitos cambian";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 48,
            fontWeight: 900,
            color: "#f5f1e8",
            letterSpacing: "-0.02em",
          }}
        >
          CLIC<span style={{ color: "#FBFA3F" }}>.</span>FIT
        </div>

        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "#f5f1e8",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>El lugar</div>
          <div>donde tus</div>
          <div
            style={{
              color: "#FBFA3F",
              fontStyle: "italic",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            hábitos
          </div>
          <div>cambian.</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#f5f1e8",
            opacity: 0.7,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          <div>3 sedes · Zona norte</div>
          <div>clicfit.ar</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
