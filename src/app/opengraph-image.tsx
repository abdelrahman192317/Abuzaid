import { ImageResponse } from "next/og";

export const alt = "Mo7ammed Abuzaid — Photographer & Director";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#14110f",
          color: "#f3efe7",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          <span>Mo7ammed Abuzaid</span>
          <span>Studio</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 760,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 96,
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: -4,
              }}
            >
              <span>Photographer</span>
              <span>& Director.</span>
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 28,
                opacity: 0.7,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Editorial, brand and documentary — image-led brand worlds.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 200,
              height: 200,
              borderRadius: 20,
              border: "2px solid #f3efe7",
              fontSize: 110,
              fontWeight: 700,
              letterSpacing: -6,
            }}
          >
            MA
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
