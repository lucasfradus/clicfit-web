import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 28,
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FBFA3F",
          fontFamily: "sans-serif",
          fontWeight: 900,
          letterSpacing: "-0.02em",
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
