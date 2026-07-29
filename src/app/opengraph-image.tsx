import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — Full-Stack Software Engineer`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0c",
          padding: "72px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.08em",
            color: "#7a7a85",
            textTransform: "uppercase",
          }}
        >
          {site.initials}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              letterSpacing: "-0.03em",
              color: "#ededf0",
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              color: "#a0a0aa",
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            Full-Stack Software Engineer
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 3, width: 64, backgroundColor: "#e8e0d2" }} />
          <div style={{ fontSize: 24, color: "#7a7a85" }}>manufigueira.pro</div>
        </div>
      </div>
    ),
    size,
  );
}
