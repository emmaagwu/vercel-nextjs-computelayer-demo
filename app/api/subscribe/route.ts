/**
 * ============================================================
 * COMPUTE LAYER: SERVERLESS FUNCTION
 * ============================================================
 * This is a full Node.js serverless function.
 *
 * WHY SERVERLESS (not Edge) for this?
 *  ✅ We need to write to a database (Vercel Postgres / Prisma)
 *  ✅ We need to send emails (Nodemailer / Resend SDK)
 *  ✅ We need to hash passwords (bcrypt — Node.js only)
 *  ✅ We need error handling with full stack traces
 *  ✅ We can run for up to 15 seconds (Pro) or 900s (Enterprise)
 *
 * Edge Functions CANNOT:
 *  ❌ Open TCP connections (no direct DB)
 *  ❌ Use Node.js built-ins (no crypto, fs, path)
 *  ❌ Use heavy npm packages
 *
 * HOW VERCEL RUNS THIS:
 *  - On first request → cold start: ~100-500ms (container spins up)
 *  - Subsequent requests within keep-alive window → warm: ~10ms
 *  - After inactivity → scales to zero (next request gets cold start)
 *  - Under high load → Vercel auto-scales (spins up more containers)
 *  - You're billed for ACTIVE CPU TIME only (Fluid Compute model)
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

// In a real app, this would be:
// import { db } from '@/lib/db'; // Vercel Postgres / Prisma
// import { Resend } from 'resend'; // Email service
// const resend = new Resend(process.env.RESEND_API_KEY);

// Simulated in-memory "database" for demo purposes
// In production: Vercel Postgres, PlanetScale, Supabase, etc.
const subscribers: Array<{
  email: string;
  subscribedAt: string;
  country?: string;
}> = [];

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ─── 1. Parse & Validate Input ────────────────────────
    // Full Node.js — we can use any parsing/validation library
    // e.g., zod, yup, joi
    const body = await request.json();
    const { email, country } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          error: "Email is required",
          debug: {
            computeLayer: "serverless-function",
            region: process.env.VERCEL_REGION || "local",
          },
        },
        { status: 400 }
      );
    }

    // Basic email validation (in production: use zod or validator.js)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ─── 2. Check for duplicates ───────────────────────────
    // In production: SELECT * FROM subscribers WHERE email = $1
    const existing = subscribers.find((s) => s.email === email);
    if (existing) {
      return NextResponse.json(
        {
          error: "Already subscribed",
          subscribedAt: existing.subscribedAt,
        },
        { status: 409 }
      );
    }

    // ─── 3. Write to "Database" ────────────────────────────
    // This is where Node.js shines — full TCP support for real DBs
    // In production:
    // await db.execute(
    //   'INSERT INTO subscribers (email, country) VALUES (?, ?)',
    //   [email, country]
    // );
    const subscriber = {
      email,
      subscribedAt: new Date().toISOString(),
      country: country || "Unknown",
    };
    subscribers.push(subscriber);

    // Simulate DB write latency (real Postgres ~5-20ms)
    await new Promise((resolve) => setTimeout(resolve, 50));

    // ─── 4. Send Welcome Email ─────────────────────────────
    // Only possible in Node.js — Edge can't use Nodemailer/Resend SDK
    // In production:
    // await resend.emails.send({
    //   from: 'TechPulse <hello@techpulse.dev>',
    //   to: email,
    //   subject: 'Welcome to TechPulse!',
    //   react: <WelcomeEmail name={email} />,
    // });

    // Simulate email API latency (real Resend ~100-200ms)
    await new Promise((resolve) => setTimeout(resolve, 80));

    const executionTime = Date.now() - startTime;

    // ─── 5. Return Success ─────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: `${email} subscribed successfully!`,
        debug: {
          // These fields prove this ran as a Serverless Function
          computeLayer: "serverless-function",
          runtime: "nodejs",
          region: process.env.VERCEL_REGION || "iad1 (simulated)",
          executionTimeMs: executionTime,
          totalSubscribers: subscribers.length,
          note:
            "This ran as a Node.js serverless function. " +
            "It has full TCP access (real DB), can use bcrypt, " +
            "send emails, and run for up to 15 seconds.",
          // What an Edge Function COULDN'T do here:
          wouldFailOnEdge: [
            "Direct Postgres connection (TCP not supported in V8 isolates)",
            "Nodemailer (uses Node.js net module)",
            "bcrypt (C++ bindings not available in Edge runtime)",
          ],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SERVERLESS] Subscribe error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        debug: {
          computeLayer: "serverless-function",
          errorType: error instanceof Error ? error.constructor.name : "Unknown",
        },
      },
      { status: 500 }
    );
  }
}

// GET — list subscribers (for demo purposes only)
export async function GET() {
  return NextResponse.json({
    totalSubscribers: subscribers.length,
    subscribers: subscribers.map((s) => ({ ...s, email: s.email.replace(/(.{2})(.*)(@.*)/, "$1***$3") })),
    debug: {
      computeLayer: "serverless-function",
      runtime: "nodejs",
      region: process.env.VERCEL_REGION || "iad1 (simulated)",
      note: "Serverless Functions have full Node.js. No restrictions.",
    },
  });
}