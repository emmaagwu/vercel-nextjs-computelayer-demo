/**
 * ============================================================
 * COMPUTE LAYER: ISR (Incremental Static Regeneration)
 * ============================================================
 * ISR = Static speed + Dynamic freshness. The best of both worlds.
 *
 * HOW IT WORKS (the "stale-while-revalidate" model):
 *  1. At build time → page is rendered and cached
 *  2. Request comes in → CDN serves cached page INSTANTLY
 *  3. If page is older than `revalidate` seconds → background
 *     rebuild is triggered (stale page still served to THIS request)
 *  4. Next request gets the fresh page
 *
 * THE KEY INSIGHT: The user who "triggers" a revalidation never
 * waits for the rebuild — they still get the fast cached response.
 * The NEXT user gets the fresh version.
 *
 * VERCEL COST MODEL for ISR:
 *  - CDN cache HIT → Almost free (just bandwidth)
 *  - ISR background rebuild → 1 serverless invocation per revalidation
 *  - So a page with 10,000 req/min + 60s revalidation = 1 serverless
 *    call per minute, not 10,000. Huge cost savings.
 * ============================================================
 */

import { ComputeExplainer } from "@/app/components/ComputeExplainer";

// ✅ THIS IS THE MAGIC LINE
// This single export transforms this page from SSG to ISR.
// Vercel reads this and configures the CDN cache TTL automatically.
// After 60 seconds, the next request triggers a background rebuild.
export const revalidate = 60;

// Simulates fetching news from an external API or CMS
async function fetchLatestNews() {
  // In a real app: const res = await fetch('https://newsapi.org/v2/top-headlines?...')
  // For this demo, we simulate with timestamps to prove ISR is working

  // Simulate network delay (real APIs take 200-500ms)
  await new Promise((resolve) => setTimeout(resolve, 100));

  const fetchedAt = new Date().toISOString();

  return {
    fetchedAt,
    articles: [
      {
        id: 1,
        title: "Vercel Launches Fluid Compute — AI Apps Get 85% Cheaper",
        source: "TechCrunch",
        time: "2 hours ago",
        category: "Infrastructure",
        hot: true,
      },
      {
        id: 2,
        title: "Next.js 15.1 Ships with Partial Prerendering Stable",
        source: "Vercel Blog",
        time: "5 hours ago",
        category: "Framework",
        hot: true,
      },
      {
        id: 3,
        title: "React Server Components Adoption Hits 60% of Next.js Apps",
        source: "State of JS",
        time: "1 day ago",
        category: "Research",
        hot: false,
      },
      {
        id: 4,
        title: "Edge Functions vs Serverless: A 2025 Performance Benchmark",
        source: "Web.dev",
        time: "2 days ago",
        category: "Performance",
        hot: false,
      },
      {
        id: 5,
        title: "Bun 1.2 vs Node.js 23: Runtime Wars Heat Up",
        source: "Dev.to",
        time: "3 days ago",
        category: "Runtimes",
        hot: false,
      },
    ],
  };
}

export default async function NewsPage() {
  // This fetch runs at BUILD TIME and then again every 60s in background.
  // It does NOT run on every request.
  const { fetchedAt, articles } = await fetchLatestNews();

  const categoryColors: Record<string, string> = {
    Infrastructure: "#6366f1",
    Framework: "#10b981",
    Research: "#f59e0b",
    Performance: "#ec4899",
    Runtimes: "#06b6d4",
  };

  return (
    <div>
      <div className="container">
        <div className="page-header">
          <span className="badge badge-static" style={{ marginBottom: "16px" }}>
            <span className="badge-dot" />
            ISR — Incremental Static Regeneration
          </span>
          <h1 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "12px" }}>
            Tech News
          </h1>
          <p style={{ color: "#6b6b80", fontSize: "16px" }}>
            This page is statically cached and rebuilds in the background every{" "}
            <strong style={{ color: "#10b981" }}>60 seconds</strong>.
          </p>
        </div>

        {/* ISR PROOF — The most important educational element */}
        <div style={{
          background: "rgba(16,185,129,0.06)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "40px",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#10b981",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "6px",
              }}>
                🔬 ISR Proof — Watch These Values
              </p>
              <p style={{ fontSize: "14px", color: "#6b6b80", maxWidth: "480px" }}>
                These timestamps are baked into the static HTML at render time.
                Refresh the page rapidly — they{"'"}ll stay the same (serving from cache).
                Wait 60+ seconds and refresh — they{"'"}ll update (ISR rebuild happened).
              </p>
            </div>
            <div style={{
              background: "#080810",
              border: "1px solid #2a2a3a",
              borderRadius: "8px",
              padding: "16px 20px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              minWidth: "300px",
            }}>
              <div className="info-row">
                <span className="info-label">Data fetched at</span>
                <span className="info-value" style={{ color: "#10b981" }}>
                  {fetchedAt}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Revalidation</span>
                <span className="info-value">every 60 seconds</span>
              </div>
              <div className="info-row">
                <span className="info-label">Compute on cache hit</span>
                <span className="info-value" style={{ color: "#10b981" }}>
                  $0.00 (CDN only)
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">export const revalidate</span>
                <span className="info-value" style={{ color: "#6366f1" }}>= 60</span>
              </div>
            </div>
          </div>
        </div>

        {/* News Articles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "64px" }}>
          {articles.map((article) => (
            <div
              key={article.id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                borderColor: article.hot ? "rgba(245,158,11,0.2)" : "#2a2a3a",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  {article.hot && (
                    <span style={{
                      background: "rgba(245,158,11,0.15)",
                      color: "#f59e0b",
                      border: "1px solid rgba(245,158,11,0.3)",
                      borderRadius: "4px",
                      padding: "2px 8px",
                      fontSize: "10px",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}>🔥 HOT</span>
                  )}
                  <span style={{
                    background: `${categoryColors[article.category]}18`,
                    color: categoryColors[article.category],
                    border: `1px solid ${categoryColors[article.category]}40`,
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                  }}>
                    {article.category}
                  </span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>
                  {article.title}
                </h3>
                <span style={{ fontSize: "12px", color: "#6b6b80", fontFamily: "var(--font-mono)" }}>
                  {article.source} · {article.time}
                </span>
              </div>
              <div style={{ fontSize: "20px", flexShrink: 0 }}>→</div>
            </div>
          ))}
        </div>

        {/* Explainer */}
        <ComputeExplainer
          layer="static"
          title="How ISR Works on Vercel"
          description="ISR gives you static performance with dynamic freshness. Vercel handles the cache invalidation and background rebuilds automatically — you just set revalidate."
          pros={[
            "Served from CDN on cache hit — same speed as SSG",
            "Auto-refreshes data without a full redeploy",
            "1 serverless call per revalidation cycle (not per request!)",
            "Scales to millions of requests with minimal compute cost",
          ]}
          cons={[
            "Data can be up to `revalidate` seconds stale",
            "First request after revalidation period triggers rebuild (user still gets stale)",
            "Not suitable for real-time data (use SSR for that)",
          ]}
          code={`// app/news/page.tsx

// ✅ This single line = ISR
export const revalidate = 60; // seconds

async function fetchLatestNews() {
  // This fetch is CACHED by Next.js/Vercel
  const res = await fetch('https://api.news.com/latest');
  return res.json();
}

export default async function NewsPage() {
  // Runs at build time, then every 60s in the background
  const news = await fetchLatestNews();
  
  return <NewsList articles={news.articles} />;
}

// On Vercel this page becomes:
// - Static HTML in CDN (served instantly on cache hit)
// - Serverless rebuild triggered every 60s (background)
// - User NEVER waits for rebuild — they get stale while fresh builds`}
        />
      </div>
    </div>
  );
}