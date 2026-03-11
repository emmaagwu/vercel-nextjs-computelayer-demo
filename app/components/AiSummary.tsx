"use client";

/**
 * Client component that calls our Fluid Compute AI endpoint.
 * Demonstrates streaming: tokens appear one by one as they arrive,
 * just like ChatGPT's streaming interface.
 */

import { useState } from "react";

export function AiSummary() {
  const [article, setArticle] = useState(
    "Vercel has launched Fluid Compute, a new execution model that allows multiple concurrent requests to share the same compute instance when idle. This is particularly beneficial for AI workloads where functions spend most of their time waiting for LLM responses."
  );
  const [streaming, setStreaming] = useState(false);
  const [tokens, setTokens] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  async function handleSummarize() {
    setStreaming(true);
    setTokens([]);
    setDone(false);
    setDebugData(null);

    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article }),
      });

      if (!res.body) throw new Error("No stream body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Read the SSE stream token by token
      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.token !== undefined) {
              // Append each token as it streams in
              setTokens((prev) => [...prev, data.token]);
            } else if (data.done) {
              setDone(true);
              setDebugData(data.fluidComputeExplanation);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="card" style={{ borderColor: "rgba(236,72,153,0.3)" }}>
      <div style={{ marginBottom: "16px" }}>
        <span className="badge badge-ai" style={{ marginBottom: "12px" }}>
          <span className="badge-dot" />
          Fluid Compute — AI Streaming
        </span>
        <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
          🤖 AI Article Summary
        </h3>
        <p style={{ color: "#6b6b80", fontSize: "13px", marginTop: "6px" }}>
          Calls POST /api/ai-summary — streaming serverless function.
          Tokens appear as they arrive from the LLM.
        </p>
      </div>

      <textarea
        value={article}
        onChange={(e) => setArticle(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          background: "#080810",
          border: "1px solid #2a2a3a",
          borderRadius: "8px",
          padding: "12px 14px",
          color: "#e8e8f0",
          fontSize: "13px",
          fontFamily: "var(--font-display)",
          resize: "vertical",
          marginBottom: "12px",
          outline: "none",
          lineHeight: 1.6,
        }}
        placeholder="Paste an article to summarize..."
      />

      <button
        onClick={handleSummarize}
        disabled={streaming || !article}
        className="btn btn-ai"
        style={{
          width: "100%",
          justifyContent: "center",
          marginBottom: "16px",
          opacity: streaming || !article ? 0.5 : 1,
        }}
      >
        {streaming ? (
          <>
            <span style={{ animation: "pulse-glow 1s infinite" }}>●</span>
            Streaming tokens...
          </>
        ) : (
          "✨ Generate AI Summary →"
        )}
      </button>

      {/* Streaming output */}
      {(tokens.length > 0 || streaming) && (
        <div style={{
          background: "#080810",
          border: "1px solid rgba(236,72,153,0.2)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "12px",
          minHeight: "80px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "#ec4899",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
          }}>
            Streaming output ({tokens.length} tokens received)
          </p>
          <p style={{
            fontSize: "13px",
            color: "#e8e8f0",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}>
            {tokens.join("")}
            {streaming && (
              <span style={{
                display: "inline-block",
                width: "2px",
                height: "14px",
                background: "#ec4899",
                marginLeft: "2px",
                animation: "pulse-glow 0.8s infinite",
                verticalAlign: "text-bottom",
              }} />
            )}
          </p>
        </div>
      )}

      {/* Fluid Compute cost breakdown */}
      {done && debugData && (
        <div style={{
          background: "rgba(236,72,153,0.05)",
          border: "1px solid rgba(236,72,153,0.15)",
          borderRadius: "8px",
          padding: "14px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "#ec4899",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
          }}>
            ⚡ Fluid Compute Cost Analysis
          </p>
          {[
            ["Active CPU time", debugData.activeComputeMs + "ms", "#10b981"],
            ["Waiting on LLM", debugData.waitingMs + "ms", "#f59e0b"],
            ["Traditional serverless cost", debugData.traditionalCost, "#ef4444"],
            ["Fluid Compute cost", debugData.fluidCost, "#10b981"],
            ["Cost savings", debugData.savings, "#10b981"],
          ].map(([label, value, color]) => (
            <div key={label} className="info-row" style={{ fontSize: "12px" }}>
              <span className="info-label">{label}</span>
              <span style={{ color, fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 700 }}>
                {value}
              </span>
            </div>
          ))}
          <p style={{
            fontSize: "11px",
            color: "#4a4a6a",
            marginTop: "10px",
            fontFamily: "var(--font-mono)",
          }}>
            Traditional serverless bills for the full wall-clock time.
            Fluid Compute bills only for active CPU time. For AI apps
            (95% I/O wait), this is transformative.
          </p>
        </div>
      )}
    </div>
  );
}