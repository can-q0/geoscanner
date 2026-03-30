import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #06080f 0%, #0b0f1a 50%, #06080f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Subtle grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, display: "flex",
          backgroundImage: "linear-gradient(rgba(14,244,197,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,244,197,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px" }} />

        {/* Glow */}
        <div style={{ position: "absolute", top: "-20%", width: "80%", height: "60%", display: "flex",
          background: "radial-gradient(ellipse at center, rgba(14,244,197,0.15) 0%, transparent 70%)" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid rgba(14,244,197,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#0ef4c5" }} />
            </div>
            <span style={{ fontSize: "48px", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
              <span style={{ color: "#0ef4c5" }}>GEO</span> Scanner
            </span>
          </div>

          <p style={{ fontSize: "24px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", textAlign: "center", lineHeight: 1.5 }}>
            AI Search Visibility Analyzer
          </p>

          <div style={{ display: "flex", gap: "24px", marginTop: "16px" }}>
            {["ChatGPT", "Perplexity", "Google AIO", "Gemini", "Copilot"].map((p) => (
              <span key={p} style={{ fontSize: "14px", color: "rgba(14,244,197,0.5)", padding: "6px 14px", border: "1px solid rgba(14,244,197,0.15)", borderRadius: "6px", letterSpacing: "0.05em" }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
