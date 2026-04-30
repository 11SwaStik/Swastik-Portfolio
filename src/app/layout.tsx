import type { Metadata } from "next";
import { Share_Tech_Mono, Syne, Tiro_Devanagari_Sanskrit } from "next/font/google";
import BootSplash from "@/components/effects/BootSplash";
import AudioToggle from "@/components/effects/AudioToggle";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const tiroDevanagari = Tiro_Devanagari_Sanskrit({
  weight: "400",
  variable: "--font-tiro-devanagari",
  subsets: ["devanagari", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Swastik Sharma — Cybersecurity Engineer",
  description:
    "Security engineer building real infrastructure — AWS, firewalls, DevSecOps pipelines, and security tooling that ships.",
  openGraph: {
    title: "Swastik Sharma — Cybersecurity Engineer",
    description:
      "Security engineer building real infrastructure — AWS, firewalls, DevSecOps pipelines, and security tooling that ships.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${shareTechMono.variable} ${syne.variable} ${tiroDevanagari.variable}`}
    >
      <body>
        <BootSplash />
        {children}
        <AudioToggle />
      </body>
    </html>
  );
}
