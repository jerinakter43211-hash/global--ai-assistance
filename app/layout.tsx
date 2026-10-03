import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global AI Assistance",
  description: "AI-powered everyday assistance, education, skills, career guidance and safety information.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bn"><body>{children}</body></html>;
}
