import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14110f",
          color: "#f3efe7",
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: -2,
        }}
      >
        MA
      </div>
    ),
    { ...size }
  );
}
