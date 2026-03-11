/**
 * ============================================================
 * COMPUTE LAYER: EDGE FUNCTION
 * ============================================================
 * This file IS the Edge Function. It runs on Vercel's global
 * edge network — NOT in Node.js, but in a V8 isolate.
 *
 * WHY EDGE (not Serverless)?
 *  ✅ Sub-millisecond cold start (vs 100-500ms for serverless)
 *  ✅ Runs BEFORE the cache — can redirect before any compute
 *  ✅ Has access to request geo data (country, city, region)
 *  ✅ Lightweight — just header inspection + redirects/rewrites
 *  ❌ No Node.js APIs (no fs, no TCP, no direct DB access)
 *  ❌ No npm packages that use Node internals
 *
 * WHAT THIS DOES:
 *  1. Auth guard — redirects unauthenticated users from /dashboard
 *  2. Geo detection — stamps country on every request header
 *  3. A/B testing — splits /news traffic between two variants
 *  4. Bot detection — blocks obvious bot user agents
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

// This config tells Vercel WHICH paths this middleware runs on.
// It does NOT run on _next/static, _next/image, favicon, etc.
// Being selective here is critical — don't run middleware on every
// static asset or you'll add latency to every image/font/CSS file.
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─────────────────────────────────────────────────────────
  // TASK 1: AUTH GUARD
  // Protect /dashboard — redirect to /login if no auth cookie.
  // This runs at the EDGE, so the redirect happens before
  // the serverless function for /dashboard ever executes.
  // This saves compute costs AND is faster for the user.
  // ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    const authToken = request.cookies.get("auth-token");

    if (!authToken) {
      // Redirect to login, preserving the original destination
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);

      console.log(`[EDGE] Auth guard: No token, redirecting to /login`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ─────────────────────────────────────────────────────────
  // TASK 2: GEO DETECTION
  // Vercel injects geo data into every edge request for FREE.
  // We stamp it as a request header so our pages/APIs can read it.
  // This data is available at request.geo in the middleware.
  // ─────────────────────────────────────────────────────────
  const country = request.geo?.country || "US";
  const city = request.geo?.city || "Unknown";
  const region = request.geo?.region || "Unknown";

  const response = NextResponse.next();

  // Pass geo data downstream as custom headers
  // Our React Server Components can read these via headers() API
  response.headers.set("x-user-country", country);
  response.headers.set("x-user-city", city);
  response.headers.set("x-user-region", region);
  response.headers.set("x-compute-layer", "edge-middleware");

  // ─────────────────────────────────────────────────────────
  // TASK 3: A/B TESTING
  // Split /news traffic between variant A and B.
  // We use a cookie to "stick" users to their variant
  // so they don't switch between page loads.
  //
  // This is done at the EDGE — the rewrite happens before
  // any rendering, with zero impact on the URL the user sees.
  // ─────────────────────────────────────────────────────────
  if (pathname === "/news") {
    const abCookie = request.cookies.get("ab-variant");
    let variant = abCookie?.value;

    if (!variant) {
      // Assign a variant randomly (50/50 split)
      variant = Math.random() < 0.5 ? "a" : "b";
      response.cookies.set("ab-variant", variant, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
      });
    }

    // Rewrite the URL internally — user sees /news but gets /news/variant-a or /news/variant-b
    // NOTE: You would create app/news/variant-a/page.tsx and app/news/variant-b/page.tsx
    // For this demo, we just stamp a header instead
    response.headers.set("x-ab-variant", variant);
    console.log(`[EDGE] A/B test: assigned variant ${variant}`);
  }

  // ─────────────────────────────────────────────────────────
  // TASK 4: BOT DETECTION (simplified)
  // Block obvious scrapers before they reach your app.
  // A real implementation would use Vercel's BotID product.
  // ─────────────────────────────────────────────────────────
  const userAgent = request.headers.get("user-agent") || "";
  const botPatterns = ["Scrapy", "python-requests", "curl/", "wget/"];
  const isBot = botPatterns.some((pattern) => userAgent.includes(pattern));

  if (isBot && pathname.startsWith("/api/")) {
    console.log(`[EDGE] Bot detected: ${userAgent}`);
    return new NextResponse(JSON.stringify({ error: "Access denied" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return response;
}