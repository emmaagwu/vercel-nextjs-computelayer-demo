// components/ComputeExplainer.tsx
// Reusable explainer card for each compute layer

type Layer = "static" | "edge" | "server" | "ai";

interface Props {
  layer: Layer;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  code: string;
}

const layerConfig = {
  static: {
    label: "SSG / ISR",
    color: "#10b981",
    badgeClass: "badge-static",
    icon: "📦",
  },
  edge: {
    label: "Edge Function",
    color: "#f59e0b",
    badgeClass: "badge-edge",
    icon: "⚡",
  },
  server: {
    label: "Serverless Function",
    color: "#6366f1",
    badgeClass: "badge-server",
    icon: "🖥️",
  },
  ai: {
    label: "Fluid Compute (AI)",
    color: "#ec4899",
    badgeClass: "badge-ai",
    icon: "🤖",
  },
};

export function ComputeExplainer({ layer, title, description, pros, cons, code }: Props) {
  const config = layerConfig[layer];

  return (
    <div style={{
      background: "#111118",
      border: `1px solid ${config.color}30`,
      borderRadius: "16px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: `${config.color}10`,
        borderBottom: `1px solid ${config.color}20`,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <span style={{ fontSize: "28px" }}>{config.icon}</span>
        <div>
          <span
            className={`badge ${config.badgeClass}`}
            style={{ marginBottom: "6px" }}
          >
            {config.label}
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>{title}</h3>
        </div>
      </div>

      <div style={{ padding: "28px" }}>
        <p style={{ color: "#6b6b80", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>
          {description}
        </p>

        <div className="grid-2" style={{ marginBottom: "24px" }}>
          {/* Pros */}
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "#10b981",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
            }}>
              ✅ When to use
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {pros.map((pro, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#a0a0b8",
                }}>
                  <span style={{ color: "#10b981", flexShrink: 0 }}>→</span>
                  <span>{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "#ef4444",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
            }}>
              ⚠️ Limitations
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {cons.map((con, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#a0a0b8",
                }}>
                  <span style={{ color: "#ef4444", flexShrink: 0 }}>→</span>
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code */}
        <div>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "#6b6b80",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "8px",
          }}>
            Code Pattern
          </p>
          <pre style={{
            background: "#080810",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            padding: "20px",
            overflowX: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            lineHeight: 1.7,
            color: "#a0a0b8",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}