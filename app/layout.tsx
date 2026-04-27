import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE GUEST LIST — SUPERFINE",
  description:
    "A one-dollar counter-institution for the Black dandyism lineage.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "THE GUEST LIST — SUPERFINE",
    description:
      "The only invitation list more exclusive than the one Anna keeps — this one already includes the dead.",
    type: "website",
    url: "/",
    siteName: "SUPERFINE",
    images: [
      {
        url: "/api/share",
        width: 1200,
        height: 630,
        alt: "THE GUEST LIST — SUPERFINE"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "THE GUEST LIST — SUPERFINE",
    description:
      "The only invitation list more exclusive than the one Anna keeps — this one already includes the dead.",
    images: ["/api/share"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
