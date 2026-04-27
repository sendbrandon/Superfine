"use client";

import { useEffect, useRef, useState } from "react";

type HeroMontageProps = {
  src?: string;
};

export default function HeroMontage({ src = "/anna_hero.mp4" }: HeroMontageProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    if (reduced || saver) return;

    const idle =
      (window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
      }).requestIdleCallback || ((cb: () => void) => window.setTimeout(cb, 400));
    const handle = idle(() => setEnabled(true));
    return () => {
      if (typeof handle === "number") window.clearTimeout(handle);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    ref.current?.play().catch(() => {});
  }, [enabled]);

  return (
    <div className="hero-montage" aria-hidden="true">
      <div className="hero-montage-frame">
        {enabled ? (
          <video
            ref={ref}
            src={src}
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
            className="is-active"
          />
        ) : null}
      </div>
      <div className="hero-montage-grain" />
      <div className="hero-montage-veil" />
    </div>
  );
}
