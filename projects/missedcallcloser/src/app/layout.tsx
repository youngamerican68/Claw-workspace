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
  title: "MissedCallCloser - Never Lose Another Lead",
  description: "AI-powered callback system that calls back your missed leads within 60 seconds. Perfect for plumbers, HVAC, dentists, and local service businesses.",
  keywords: ["missed call", "AI callback", "lead generation", "local business", "twilio", "voice AI"],
  authors: [{ name: "MissedCallCloser" }],
  openGraph: {
    title: "MissedCallCloser - Never Lose Another Lead",
    description: "AI calls back your missed leads in 60 seconds. Stop losing $500+ per missed call.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MissedCallCloser - Never Lose Another Lead",
    description: "AI calls back your missed leads in 60 seconds. Stop losing $500+ per missed call.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
