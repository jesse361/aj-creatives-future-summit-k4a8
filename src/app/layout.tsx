import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { brand } from "@/config/brand";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-cormorant", display: "swap" });
const siteUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: brand.seoTitle, template: "%s · Ahene Fia" },
  description: brand.seoDescription,
  applicationName: brand.name,
  openGraph: {
    title: brand.seoTitle,
    description: brand.seoDescription,
    siteName: brand.name,
    type: "website",
    images: [{ url: "/images/hero.jpg", width: 1800, height: 1200, alt: "Illustrative photograph of a conference audience. Not a confirmed Ahene Fia event." }],
  },
  twitter: { card: "summary_large_image", title: brand.name, description: brand.tagline, images: ["/images/hero.jpg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink">{children}</body>
    </html>
  );
}
