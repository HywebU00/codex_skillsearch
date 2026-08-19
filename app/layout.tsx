import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codex Skills｜官方技能查詢系統",
  description: "搜尋與探索 Codex 官方 Skills、系統工具與整合。",
  openGraph: {
    title: "Codex Skills｜官方技能查詢系統",
    description: "找到適合任務的 Codex Skill。",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Codex Skills 官方技能查詢系統" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codex Skills｜官方技能查詢系統",
    description: "找到適合任務的 Codex Skill。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
