"use client";
// ─────────────────────────────────────────────────────────────────────────
// components/Nav.tsx — CLIENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────
//
// WHY "use client" IS HERE:
// This directive tells Next.js: "render this component in the BROWSER,
// not on the server." It's required here because of onMouseEnter and
// onMouseLeave — these are event handlers that attach to the DOM.
// The DOM only exists in the browser. The server has no DOM.
//
// HOW THIS CONNECTS TO THE COMPUTE LAYERS YOU LEARNED:
//
//   📦 SSG / ISR page (app/news/page.tsx)
//      → Runs at BUILD TIME on a server. No browser. No DOM.
//      → Cannot use event handlers, useState, or useEffect.
//      → Ships pure HTML to the CDN. Zero JS for the component itself.
//
//   ⚡ Edge Function (middleware.ts)
//      → Runs in a V8 isolate on the Vercel network edge.
//      → No browser, no DOM, no React even. Just raw Request/Response.
//      → Cannot use ANY React — neither server nor client components.
//
//   🖥️ Serverless Function (app/api/subscribe/route.ts)
//      → Runs in Node.js on a server. No browser. No DOM.
//      → Route Handlers are not React at all — they return Response objects.
//
//   🌐 Client Component ("use client")     ← YOU ARE HERE
//      → Code that runs IN THE BROWSER after hydration.
//      → Can use: onClick, onMouseEnter, useState, useEffect, window, etc.
//      → Ships actual JavaScript to the user's browser.
//
// THE MENTAL MODEL:
// Think of "use client" as the boundary where execution moves from
// the server (or CDN) to the browser. Everything above this boundary
// is a Server Component (zero JS shipped). Everything below runs
// in the browser and ships a JS bundle.
//
// THE COST IMPLICATION (ties back to compute layers):
// Server Components → zero client JS bundle cost
// Client Components → JavaScript shipped to browser, hydration cost
// Best practice: push "use client" as deep (leaf-level) as possible.
// A nav with hover effects NEEDS the browser → "use client" is correct here.
// ─────────────────────────────────────────────────────────────────────────

import Link from "next/link";

export function Nav() {
  const links = [
    { href: "/", label: "Home", layer: "static", color: "#10b981" },
    { href: "/news", label: "News (ISR)", layer: "static", color: "#10b981" },
    { href: "/about", label: "About (SSG)", layer: "static", color: "#10b981" },
    { href: "/dashboard", label: "Dashboard", layer: "edge", color: "#f59e0b" },
  ];

  return (
    <nav
      style={{
        borderBottom: "1px solid #2a2a3a",
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "18px",
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <span
            style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            ▲
          </span>
          TechPulse
        </Link>

        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#a0a0b8",
                textDecoration: "none",
                // "transition" works here because this IS the browser.
                // On a Server Component, setting transition would be meaningless
                // — there's no browser to animate anything.
                transition: "all 0.15s",
              }}
              // ↓ These two handlers are WHY "use client" is required.
              // onMouseEnter fires when the user's mouse enters the element.
              // This is a DOM event — it only exists in the browser.
              // Next.js throws an error if you put this in a Server Component
              // because the server has no concept of a mouse or a DOM.
              onMouseEnter={(e) => {
                const el = e.target as HTMLElement;
                el.style.color = link.color;
                el.style.background = `${link.color}15`;
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLElement;
                el.style.color = "#a0a0b8";
                el.style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}