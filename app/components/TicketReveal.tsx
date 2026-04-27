"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Tier } from "@/lib/list";

type TicketRevealProps = {
  open: boolean;
  onClose: () => void;
  name: string;
  tier: Tier;
  seatedBy?: string;
  mode?: "official" | "preview";
  onConfirmPay?: () => void;
  isPending?: boolean;
};

const TIER_PRICE: Record<Tier, string> = {
  seat: "$1",
  ribbon: "$25",
  patron: "$100"
};

export default function TicketReveal({
  open,
  onClose,
  name,
  tier,
  seatedBy = "",
  mode = "official",
  onConfirmPay,
  isPending = false
}: TicketRevealProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const ticketUrl = useMemo(() => {
    const params = new URLSearchParams({ name, tier });
    if (seatedBy) {
      params.set("seatedBy", seatedBy);
    }
    return `/api/ticket?${params.toString()}`;
  }, [name, seatedBy, tier]);

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
      text: shareCopy(name, seatedBy),
      url: shareUrl || window.location.href
    });
  }

  const shareText = encodeURIComponent(shareCopy(name, seatedBy));
  const encodedShareUrl = encodeURIComponent(shareUrl);

  const isPreview = mode === "preview";

  return (
    <div className="modal-plane" role="dialog" aria-modal="true">
      <div className="ticket-shell">
        <button className="modal-close" type="button" onClick={onClose}>
          CLOSE
        </button>
        {isPreview ? (
          <p className="ticket-preview-banner">PREVIEW · NOT YET SEATED</p>
        ) : null}
        <Image
          src={ticketUrl}
          alt={`${name} ticket for THE GUEST LIST`}
          width={1080}
          height={1920}
          unoptimized
          priority
        />
        {isPreview ? (
          <div className="ticket-actions ticket-actions-preview">
            <button
              type="button"
              className="ticket-pay"
              onClick={onConfirmPay}
              disabled={isPending}
            >
              {isPending ? "OPENING CHECKOUT…" : `PAY ${TIER_PRICE[tier]} TO CONFIRM`}
            </button>
            <button type="button" onClick={onClose}>
              EDIT NAME
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

function shareCopy(name: string, seatedBy: string) {
  return seatedBy
    ? `${name} was seated in THE GUEST LIST by ${seatedBy}.`
    : `${name} was seated in THE GUEST LIST.`;
}
