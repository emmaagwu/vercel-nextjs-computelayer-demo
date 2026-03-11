/**
 * ============================================================
 * COMPUTE LAYER: SSG (Static Site Generation)
 * ============================================================
 * This page has NO async data fetching, NO dynamic headers,
 * NO cookies — nothing that changes per-request.
 *
 * What Vercel does at BUILD TIME:
 *  1. Renders this React component once on the server
 *  2. Produces a static HTML file
 *  3. Uploads it to the global CDN
 *
 * What happens at REQUEST TIME:
 *  → Vercel serves the pre-built HTML from the nearest CDN edge
 *  → Zero compute. Zero serverless function invocations.
 *  → Response time: ~5-20ms globally
 *  → Cost: essentially zero (CDN bandwidth only)
 *
 * THE VERCEL RULE: If your page doesn't need per-request data,
 * make it static. A CDN-served page is 10-50x cheaper and faster
 * than a serverless function render.
 * ============================================================
 */

// No 'use client' — this is a React Server Component.
// No async — no data fetching needed. This is pure static.

import { ComputeExplainer } from "@/app/components/ComputeExplainer";

export default function HomePage() {
  // This runs ONCE at build time, not on every request.
  const buildTime = new Date().toISOString();

  return (
    <div>
      {/* HERO — 100% static, no dynamic data */}
      <section style={{
        padding: "100px 0 80px",
        borderBottom: "1px solid #2a2a3a",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grid decoration */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          {/* Compute layer badge */}
          <div style={{ marginBottom: "24px" }}>
            <span className="badge badge-static">
              <span className="badge-dot" />
              SSG — Static Site Generation
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 7vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            maxWidth: "800px",
          }}>
            4 Compute Layers.{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              One App.
            </span>
          </h1>

          <p style={{
            fontSize: "18px",
            color: "#6b6b80",
            maxWidth: "560px",
            marginBottom: "40px",
            lineHeight: 1.7,
          }}>
            TechPulse demonstrates every Vercel compute layer in a single
            real-world project. See SSG, ISR, Edge Functions, and Serverless
            Functions working together.
          </p>

          {/* Proof that this is static — build time is baked in */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "8px",
            padding: "10px 18px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "#10b981",
          }}>
            <span>🏗️</span>
            <span>
              Page built at: <strong>{buildTime}</strong>
            </span>
            <span style={{ color: "#4a4a6a" }}>
              — This timestamp never changes. It's baked in at build time.
            </span>
          </div>
        </div>
      </section>

      {/* COMPUTE LAYER EXPLAINER CARDS */}
      <section style={{ padding: "64px 0" }}>
        <div className="container">
          <div style={{ marginBottom: "40px" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "#6b6b80",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "12px",
            }}>
              Navigate the compute layers
            </p>
            <h2 style={{ fontSize: "28px", fontWeight: 700 }}>
              Explore Each Layer →
            </h2>
          </div>

          <div className="grid-2">
            {/* SSG/ISR Card */}
            <a href="/news" style={{ display: "block" }}>
              <div className="card" style={{
                borderColor: "rgba(16,185,129,0.3)",
                transition: "all 0.2s",
                cursor: "pointer",
              }}>
                <span className="badge badge-static" style={{ marginBottom: "16px" }}>
                  <span className="badge-dot" />
                  SSG / ISR
                </span>
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
                  📰 News Page →
                </h3>
                <p style={{ color: "#6b6b80", fontSize: "14px", lineHeight: 1.6 }}>
                  Serves from CDN cache. Rebuilds in background every 60s.
                  Zero compute on cache hits. The fastest possible delivery.
                </p>
                <div style={{
                  marginTop: "16px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "#10b981",
                }}>
                  export const revalidate = 60
                </div>
              </div>
            </a>

            {/* Edge Card */}
            <a href="/dashboard" style={{ display: "block" }}>
              <div className="card" style={{
                borderColor: "rgba(245,158,11,0.3)",
                transition: "all 0.2s",
                cursor: "pointer",
              }}>
                <span className="badge badge-edge" style={{ marginBottom: "16px" }}>
                  <span className="badge-dot" />
                  Edge Function
                </span>
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
                  🌍 Dashboard →
                </h3>
                <p style={{ color: "#6b6b80", fontSize: "14px", lineHeight: 1.6 }}>
                  Protected by Edge Middleware. Geo detection runs before
                  the page renders. Auth redirect happens at the network edge.
                </p>
                <div style={{
                  marginTop: "16px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "#f59e0b",
                }}>
                  middleware.ts → runs at edge
                </div>
              </div>
            </a>

            {/* Serverless Card */}
            <div className="card" style={{ borderColor: "rgba(99,102,241,0.3)" }}>
              <span className="badge badge-server" style={{ marginBottom: "16px" }}>
                <span className="badge-dot" />
                Serverless Function
              </span>
              <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
                📬 /api/subscribe
              </h3>
              <p style={{ color: "#6b6b80", fontSize: "14px", lineHeight: 1.6 }}>
                Full Node.js runtime. Writes to database. Sends emails.
                Runs only when called. Scales from 0 to ∞ automatically.
              </p>
              <div style={{
                marginTop: "16px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#6366f1",
              }}>
                app/api/subscribe/route.ts
              </div>
            </div>

            {/* AI / Fluid Compute Card */}
            <div className="card" style={{ borderColor: "rgba(236,72,153,0.3)" }}>
              <span className="badge badge-ai" style={{ marginBottom: "16px" }}>
                <span className="badge-dot" />
                Fluid Compute (AI)
              </span>
              <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
                🤖 /api/ai-summary
              </h3>
              <p style={{ color: "#6b6b80", fontSize: "14px", lineHeight: 1.6 }}>
                Streams LLM responses. Fluid Compute shares one instance
                across concurrent requests. You pay for CPU time only —
                not the 30s waiting for the AI response.
              </p>
              <div style={{
                marginTop: "16px",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#ec4899",
              }}>
                streamText() → Fluid Compute
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SSG section */}
      <section style={{
        padding: "64px 0",
        borderTop: "1px solid #2a2a3a",
      }}>
        <div className="container">
          <ComputeExplainer
            layer="static"
            title="You're on a Static Page Right Now"
            description="This home page was rendered once at build time and uploaded to Vercel's global CDN. No server ran to serve this to you. The HTML was already there, waiting."
            pros={[
              "Served in ~5-20ms from nearest CDN edge",
              "Zero serverless invocations = zero per-request cost",
              "Handles unlimited concurrent users (it's just file serving)",
              "Perfect Lighthouse scores — no TTFB penalty",
            ]}
            cons={[
              "Data is frozen at build time (stale until next deploy)",
              "Can't show user-specific content",
              "Every data change requires a rebuild",
            ]}
            code={`// app/page.tsx
// No 'async', no data fetching = static by default

export default function HomePage() {
  // This runs ONCE at build time
  const buildTime = new Date().toISOString();

  return <div>Built at: {buildTime}</div>;
  // ^ This timestamp is FROZEN in the HTML.
  //   Requesting this page a million times won't
  //   change it until the next deploy.
}`}
          />
        </div>
      </section>
    </div>
  );
}