/**
 * COMPUTE LAYER: Pure SSG
 * No data fetching. No dynamic content. Built once, served forever from CDN.
 */
export default function AboutPage() {
  const buildTime = new Date().toISOString();

  const layers = [
    {
      icon: "📦",
      label: "SSG / ISR",
      badge: "badge-static",
      color: "#10b981",
      page: "/ and /news",
      trigger: "export const revalidate = N",
      runtime: "None at request time",
      coldStart: "0ms",
      maxDuration: "∞ (it's a file)",
      cost: "CDN bandwidth only",
      useWhen: "Content that doesn't change per-user",
    },
    {
      icon: "⚡",
      label: "Edge Function",
      badge: "badge-edge",
      color: "#f59e0b",
      page: "middleware.ts",
      trigger: "Automatic — runs before every request",
      runtime: "V8 isolate (not Node.js!)",
      coldStart: "<1ms",
      maxDuration: "25s before first byte",
      cost: "$0.60/million invocations",
      useWhen: "Auth, geo, redirects, A/B tests",
    },
    {
      icon: "🖥️",
      label: "Serverless",
      badge: "badge-server",
      color: "#6366f1",
      page: "/api/subscribe",
      trigger: "On every request (no cache)",
      runtime: "Node.js 20",
      coldStart: "100-500ms",
      maxDuration: "15s (Pro) / 900s (Enterprise)",
      cost: "$5/CPU hour (Active CPU)",
      useWhen: "DB writes, email, heavy Node.js logic",
    },
    {
      icon: "🤖",
      label: "Fluid Compute",
      badge: "badge-ai",
      color: "#ec4899",
      page: "/api/ai-summary",
      trigger: "On every request, shared instances",
      runtime: "Node.js + concurrent sharing",
      coldStart: "100-500ms",
      maxDuration: "15s-900s depending on plan",
      cost: "Active CPU only (~85% less than serverless)",
      useWhen: "AI/LLM workloads with high I/O wait",
    },
  ];

  return (
    <div>
      <div className="container">
        <div className="page-header">
          <span className="badge badge-static" style={{ marginBottom: "16px" }}>
            <span className="badge-dot" />
            SSG — Built at {buildTime.split("T")[0]}
          </span>
          <h1 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "12px" }}>
            The 4 Compute Layers
          </h1>
          <p style={{ color: "#6b6b80", fontSize: "16px", maxWidth: "560px" }}>
            A complete reference for the Vercel Decision Tree. Every page in
            TechPulse maps to one of these four layers.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "64px" }}>
          {layers.map((layer) => (
            <div
              key={layer.label}
              className="card"
              style={{ borderColor: `${layer.color}30` }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "24px",
                flexWrap: "wrap",
              }}>
                <div style={{ flex: 1, minWidth: "250px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "28px" }}>{layer.icon}</span>
                    <span className={`badge ${layer.badge}`}>{layer.label}</span>
                  </div>
                  <p style={{
                    fontSize: "13px",
                    color: "#6b6b80",
                    fontFamily: "var(--font-mono)",
                    marginBottom: "4px",
                  }}>
                    Demo page: <span style={{ color: layer.color }}>{layer.page}</span>
                  </p>
                  <p style={{
                    fontSize: "14px",
                    color: "#a0a0b8",
                    marginTop: "8px",
                  }}>
                    <strong style={{ color: "#e8e8f0" }}>Use when:</strong> {layer.useWhen}
                  </p>
                </div>

                <div style={{
                  background: "#080810",
                  border: "1px solid #2a2a3a",
                  borderRadius: "8px",
                  padding: "16px",
                  minWidth: "280px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                }}>
                  {[
                    ["Runtime", layer.runtime],
                    ["Cold Start", layer.coldStart],
                    ["Max Duration", layer.maxDuration],
                    ["Cost Model", layer.cost],
                  ].map(([k, v]) => (
                    <div key={k} className="info-row">
                      <span className="info-label">{k}</span>
                      <span style={{ color: layer.color, fontSize: "11px" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Decision Tree */}
        <div style={{
          background: "#080810",
          border: "1px solid #2a2a3a",
          borderRadius: "16px",
          padding: "32px",
          fontFamily: "var(--font-mono)",
        }}>
          <p style={{
            fontSize: "11px",
            color: "#6b6b80",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "20px",
          }}>
            The Vercel Decision Tree — apply to every feature you build
          </p>
          {[
            { q: "Can this be static?", a: "→ SSG / ISR", color: "#10b981", example: "/ and /news in this app" },
            { q: "Needs lightweight logic? (auth, geo, redirects)", a: "→ Edge Function", color: "#f59e0b", example: "middleware.ts in this app" },
            { q: "Needs full Node.js? (DB, email, crypto)", a: "→ Serverless Function", color: "#6366f1", example: "/api/subscribe in this app" },
            { q: "AI/LLM workload with I/O wait?", a: "→ Serverless + Fluid Compute", color: "#ec4899", example: "/api/ai-summary in this app" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "14px 0",
              borderBottom: i < 3 ? "1px solid #1a1a24" : "none",
              flexWrap: "wrap",
            }}>
              <span style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "#000",
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <span style={{ color: "#e8e8f0", flex: 1, minWidth: "200px" }}>{item.q}</span>
              <span style={{ color: item.color, fontWeight: 700 }}>{item.a}</span>
              <span style={{ color: "#4a4a6a", fontSize: "11px" }}>{item.example}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}