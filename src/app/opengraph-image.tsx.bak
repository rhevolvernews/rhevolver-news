import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rhevolver.news — Información que revoluciona";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 82px",
          color: "white",
          background:
            "radial-gradient(circle at 15% 10%, rgba(37,99,235,.6), transparent 38%), radial-gradient(circle at 88% 78%, rgba(219,39,119,.62), transparent 42%), #05060a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 28,
              background: "#ffd400",
              color: "#111827",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 66,
              fontWeight: 900,
            }}
          >
            R<span style={{ color: "#db2777" }}>.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: "-4px" }}>
              Rhevolver<span style={{ color: "#db2777" }}>.news</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 23, letterSpacing: "8px", color: "#a1a1aa" }}>
              CASA EDITORIAL DIGITAL
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.08 }}>Información que revoluciona.</div>
          <div style={{ marginTop: 18, fontSize: 25, color: "#d4d4d8" }}>Noticias de Iguala, Guerrero, México y el mundo.</div>
        </div>
      </div>
    ),
    size
  );
}
