'use client';

import { useState } from 'react';
import type { Tier } from '@/lib/curated-names';

interface Props {
  name: string;
  tier: Tier;
  onClose: () => void;
}

const SITE_URL =
  typeof window !== 'undefined' ? window.location.origin : 'https://superfine.vercel.app';

export function TicketReveal({ name, tier, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const ticketSrc = `/api/ticket?name=${encodeURIComponent(name)}&tier=${tier}`;
  const shareText = `My name is on the SUPERFINE Guest List. The only invitation list more exclusive than the Met Gala — this one already includes the dead.`;
  const shareUrl = SITE_URL;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleNativeShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: 'SUPERFINE — The Guest List',
          text: shareText,
          url: shareUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy();
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(ticketSrc);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `superfine-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(ticketSrc, '_blank');
    }
  };

  return (
    <div className="ticket-overlay" role="dialog" aria-modal="true">
      <div className="ticket-backdrop" onClick={onClose} />
      <div className="ticket-card">
        <button className="ticket-close" onClick={onClose} aria-label="close">×</button>
        <div className="ticket-eyebrow">your seat is confirmed.</div>
        <h2 className="ticket-title">Show them.</h2>
        <p className="ticket-lede">
          Save the card. Post it. Send it. The list grows by who shares.
        </p>

        <div className="ticket-image-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ticketSrc}
            alt={`SUPERFINE ticket for ${name}`}
            className="ticket-image"
          />
        </div>

        <div className="ticket-actions">
          <button className="ticket-btn primary" onClick={handleDownload}>
            Save image
          </button>
          <a
            className="ticket-btn"
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            className="ticket-btn"
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <button className="ticket-btn" onClick={handleNativeShare}>
            More
          </button>
          <button className="ticket-btn" onClick={handleCopy}>
            {copied ? 'Copied.' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
