"use client";

/**
 * The page users land on when Edge Middleware blocks /dashboard.
 * This page lets you set/clear the auth cookie to test the middleware.
 */
import { useState } from "react";

export default function LoginPage() {
  const [hasCookie, setHasCookie] = useState(
    typeof document !== "undefined" && document.cookie.includes("auth-token")
  );

  function login() {
    // Set a mock auth cookie (in production, this would be a real JWT)
    document.cookie = "auth-token=demo-token-12345; path=/; max-age=3600";
    setHasCookie(true);
  }

  function logout() {
    document.cookie = "auth-token=; path=/; max-age=0";
    setHasCookie(false);
  }

  return (
    <div className="container" style={{ maxWidth: "480px", padding: "80px 24px" }}>
      <span className="badge badge-edge" style={{ marginBottom: "20px" }}>
        <span className="badge-dot" />
        Edge Middleware Demo
      </span>

      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "12px" }}>
        {hasCookie ? "✅ You're Logged In" : "🔒 Login Required"}
      </h1>

      <p style={{ color: "#6b6b80", fontSize: "15px", marginBottom: "32px", lineHeight: 1.7 }}>
        {hasCookie
          ? "You have an auth cookie set. The Edge Middleware will now let you through to /dashboard."
          : "You were redirected here by the Edge Middleware in middleware.ts. It checked for an auth-token cookie and found none, so it redirected you before the dashboard page even loaded."}
      </p>

      {/* How it works */}
      <div style={{
        background: "#080810",
        border: "1px solid #2a2a3a",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        lineHeight: 1.7,
        color: "#6b6b80",
      }}>
        <p style={{ color: "#f59e0b", marginBottom: "8px" }}>// middleware.ts (Edge Function)</p>
        <p>if (pathname.startsWith({`'/dashboard'`})) {"{"}</p>
        <p>  const token = request.cookies.get({`'auth-token'`});</p>
        <p>  if (!token) {"{"}</p>
        <p>    <span style={{ color: "#ec4899" }}>return NextResponse.redirect({`'/login'`});</span></p>
        <p>    <span style={{ color: "#4a4a6a" }}>// ↑ This redirect cost 0 serverless invocations</span></p>
        <p>    <span style={{ color: "#4a4a6a" }}>// The /dashboard function never ran</span></p>
        <p>  {"}"}</p>
        <p>{"}"}</p>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        {!hasCookie ? (
          <button onClick={login} className="btn btn-edge" style={{ flex: 1, justifyContent: "center" }}>
            Set Auth Cookie → Login
          </button>
        ) : (
          <>
            <a href="/dashboard" className="btn btn-edge" style={{ flex: 1, textAlign: "center", justifyContent: "center" }}>
              Go to Dashboard →
            </a>
            <button onClick={logout} className="btn" style={{
              color: "#6b6b80",
              borderColor: "#2a2a3a",
            }}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}