"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Tier } from "@/lib/list";

type TicketRevealProps = {
  open: boolean;
  onClose: () => void;
  name: string;
  tier: Tier;
};

export default function TicketReveal({
  open,
  onClose,
  name,
  tier
}: TicketRevealProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const ticketUrl = useMemo(() => {
    const params = new URLSearchParams({ name, tier });
    return `/api/ticket?${params.toString()}`;
  }, [name, tier]);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  if (!open || !name) {
    return null;
  }

  async function saveTicket() {
    const response = await fetch(ticketUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-guest-list.png`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  async function shareNative() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    await navigator.share({
      title: "THE GUEST LIST",
      text: `${name} entered THE GUEST LIST.`,
      url: shareUrl || window.location.href
    });
  }

  const shareText = encodeURIComponent(`${name} entered THE GUEST LIST.`);
  const encodedShareUrl = encodeURIComponent(shareUrl);

  return (
    <div className="modal-plane" role="dialog" aria-modal="true">
      <div className="ticket-shell">
        <button className="modal-close" type="button" onClick={onClose}>
          CLOSE
        </button>
        <Image
          src={ticketUrl}
          alt={`${name} ticket for THE GUEST LIST`}
          width={1080}
          height={1920}
          unoptimized
          priority
        />
        <div className="ticket-actions">
          <button type="button" onClick={saveTicket}>
            SAVE
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedShareUrl}`}
            rel="noreferrer"
            target="_blank"
          >
            TWITTER
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`}
            rel="noreferrer"
            target="_blank"
          >
            FACEBOOK
          </a>
          <button type="button" onClick={shareNative}>
            SHARE
          </button>
          <button type="button" onClick={copyLink}>
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
      </div>
    </div>
  );
}
