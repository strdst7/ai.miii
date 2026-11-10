import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Silkscreen } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixel",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#d4c8f0",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "miii.ai — Nur Amirah Mohd Kamil (Mia) | Self-Learning & AI Engineering",
  description:
    "I am building my own self-learning path, jumping between fundamentals, software development, AI engineering, and actually building things. Personal lab, roadmap, verified credentials, and projects by Nur Amirah Mohd Kamil (Mia).",
  keywords: [
    "miii.ai",
    "Nur Amirah Mohd Kamil",
    "Mia",
    "MI4 Inc",
    "AI Engineering",
    "Agentic AI",
    "Self-Learning Roadmap",
    "AI-OS",
    "Ready Tensor",
  ],
  openGraph: {
    title: "miii.ai — Self-Learning, AI Engineering & Building Real Systems",
    description:
      "Personal self-learning roadmap, verified credentials, free resources, and shipped AI systems by Nur Amirah Mohd Kamil (Mia).",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${silkscreen.variable}`}
    >
      <body className="font-sans antialiased selection:bg-[#1e0f32] selection:text-white">
        {children}
      </body>
    </html>
  );
}
