import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "PestGuard AI - Intelligent Pest Detection & Management",
  description:
    "AI-powered pest detection and management platform for sustainable agriculture. Identify pests instantly, get treatment recommendations, and protect your crops with real-time community alerts.",
  keywords: [
    "pest detection",
    "AI agriculture",
    "crop protection",
    "plant disease",
    "smart farming",
    "pest management",
    "sustainable agriculture",
  ],
  authors: [{ name: "PestGuard AI" }],
  openGraph: {
    title: "PestGuard AI - Intelligent Pest Detection",
    description:
      "Protect your crops with AI-powered pest detection and real-time community alerts.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10B981" },
    { media: "(prefers-color-scheme: dark)", color: "#059669" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="min-h-screen font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
