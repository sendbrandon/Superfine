import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE GUEST LIST — SUPERFINE",
  description:
    "Add a name to the public guest list for $1. We make the ticket. You share the proof.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "THE GUEST LIST — SUPERFINE",
    description:
      "Add a name to the public guest list for $1. We make the ticket. You share the proof.",
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
      "Add a name to the public guest list for $1. We make the ticket. You share the proof.",
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
