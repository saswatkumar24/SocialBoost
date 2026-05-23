import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SocialBoost — AI LinkedIn Growth on Autopilot",
  description:
    "SocialBoost connects to your LinkedIn, writes high-performing posts in your voice, and publishes on a schedule — so your audience grows while you focus on real work.",
  keywords: [
    "LinkedIn automation",
    "AI content",
    "LinkedIn growth",
    "personal branding",
    "AI ghostwriter",
    "social media automation",
  ],
  authors: [{ name: "SocialBoost" }],
  openGraph: {
    title: "SocialBoost — AI LinkedIn Growth on Autopilot",
    description:
      "Connect LinkedIn. Train your AI voice. Publish high-performing posts on autopilot.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialBoost — AI LinkedIn Growth on Autopilot",
    description:
      "Connect LinkedIn. Train your AI voice. Publish high-performing posts on autopilot.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Cookiebot consent manager. React 19 hoists async <script> tags into
          <head>, dedupes them by src, and runs them once — so we don't need
          next/script for this. Async is fine here because Cookiebot's
          blocking-mode auto handles already-rendered scripts on its own.
        */}
        <script
          async
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="3e4c164a-510c-4473-b5a3-0f6d2279b010"
          data-blockingmode="auto"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-foreground selection:bg-indigo-500/40"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
