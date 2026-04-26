import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://superfine.vercel.app'),
  title: 'SUPERFINE — The Guest List',
  description:
    'The only invitation list more exclusive than the one Anna keeps — this one already includes the dead. Met Gala 2026 · Tailoring Black Style.',
  keywords: [
    'met gala 2026',
    'tailoring black style',
    'superfine',
    'black dandyism',
    'monica miller',
  ],
  openGraph: {
    type: 'website',
    title: 'SUPERFINE — The Guest List',
    description:
      'Met Gala 2026 · The only invite list that already includes the dead.',
    siteName: 'SUPERFINE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUPERFINE — The Guest List',
    description:
      'Met Gala 2026 · The only invite list that already includes the dead.',
  },
};

export const viewport: Viewport = {
  themeColor: '#F5EDD8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
