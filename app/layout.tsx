import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/app/components/Nav";

export const metadata: Metadata = {
  title: "TechPulse — Vercel Compute Demo",
  description: "Demonstrating all 4 Vercel compute layers in one app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}