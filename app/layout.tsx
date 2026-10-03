import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Global AI Assistance", description: "Free, privacy-first AI assistance for everyone." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="bn"><body>{children}</body></html>; }
