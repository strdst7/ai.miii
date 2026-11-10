import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const viewport: Viewport = { themeColor: "#d4c8f0", width: "device-width", initialScale: 1 };
export const metadata: Metadata = { title: "miii.ai — Nur Amirah Mohd Kamil | Learning & Building", description: "A personal journal on self-learning, software development and AI engineering by Nur Amirah Mohd Kamil (Mia)." };
export default function RootLayout({ children }: {children: ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
