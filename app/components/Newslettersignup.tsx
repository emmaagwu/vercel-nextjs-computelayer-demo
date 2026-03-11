"use client";

/**
 * Client component that calls our Serverless Function (/api/subscribe).
 * 'use client' means this component ships JavaScript to the browser
 * and can use useState, useEffect, event handlers, etc.
 */

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [debugData, setDebugData] = useState<any>(null);

  async function handleSubmit() {
    if (!email) return;

    setStatus("loading");
    setDebugData(null);

    try {
      // This calls our Serverless Function
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setDebugData(data.debug);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error);
        setDebugData(data.debug);
      }
    } catch {
      setStatus("error");
      setMessage("Network error — check console");
    }
  }

  return (
    <div className="card" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
      <div style={{ marginBottom: "16px" }}>
        <span className="badge badge-server" style={{ marginBottom: "12px" }}>
          <span className="badge-dot" />
          Serverless Function — Node.js
        </span>
        <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
          📬 Newsletter Signup
        </h3>
        <p style={{ color: "#6b6b80", fontSize: "13px", marginTop: "6px" }}>
          Calls POST /api/subscribe — runs as a Node.js serverless function
          with full DB + email access.
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="you@example.com"
          style={{
            flex: 1,
            background: "#080810",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "#e8e8f0",
            fontSize: "14px",
            fontFamily: "var(--font-display)",
            outline: "none",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || !email}
          className="btn btn-server"
          style={{ opacity: status === "loading" || !email ? 0.5 : 1 }}
        >
          {status === "loading" ? "Sending..." : "Subscribe →"}
        </button>
      </div>

      {/* Status message */}
      {message && (
        <div style={{
          padding: "10px 14px",
          borderRadius: "8px",
          fontSize: "13px",
          background: status === "success" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${status === "success" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
          color: status === "success" ? "#10b981" : "#ef4444",
          marginBottom: "12px",
        }}>
          {status === "success" ? "✅ " : "❌ "}{message}
        </div>
      )}

      {/* Debug data — shows what the serverless function returned */}
      {debugData && (
        <div style={{
          background: "#080810",
          border: "1px solid #2a2a3a",
          borderRadius: "8px",
          padding: "14px",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            color: "#4a4a6a",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "10px",
          }}>
            Serverless Function Response Debug
          </p>
          {Object.entries(debugData).map(([key, value]) => (
            <div key={key} className="info-row" style={{ fontSize: "12px" }}>
              <span className="info-label">{key}</span>
              <span style={{
                color: "#6366f1",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                maxWidth: "60%",
                textAlign: "right",
                wordBreak: "break-all",
              }}>
                {Array.isArray(value) ? value.join(", ") : String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}