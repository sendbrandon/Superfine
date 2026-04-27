"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HeroMontageProps = {
  clips?: string[];
  beatMs?: number;
};

const DEFAULT_CLIPS = [
  "/montage/01.mp4",
  "/montage/02.mp4",
  "/montage/03.mp4",
  "/montage/04.mp4",
  "/montage/05.mp4",
  "/montage/06.mp4",
  "/montage/07.mp4",
  "/montage/08.mp4"
];

export default function HeroMontage({
  clips = DEFAULT_CLIPS,
  beatMs = 520
}: HeroMontageProps) {
  const list = useMemo(() => clips.filter(Boolean), [clips]);
  const [active, setActive] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    if (!list.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    if (reduced || saver) return;

    const idle =
      (window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
      }).requestIdleCallback || ((cb: () => void) => window.setTimeout(cb, 600));
    const handle = idle(() => setEnabled(true));
    return () => {
      if (typeof handle === "number") window.clearTimeout(handle);
    };
  }, [list.length]);

  useEffect(() => {
    if (!enabled || list.length < 2) return;
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % list.length);
    }, beatMs);
    return () => window.clearInterval(id);
  }, [enabled, beatMs, list.length]);

  useEffect(() => {
    if (!enabled) return;
    const node = videoRefs.current[active];
    if (!node) return;
    node.currentTime = 0;
    node.play().catch(() => {});
  }, [active, enabled]);

  if (!list.length) return null;

  return (
    <div className="hero-montage" aria-hidden="true">
      <div className="hero-montage-frame">
        {list.map((src, index) => (
          <video
            key={src}
            ref={(node) => {
              videoRefs.current[index] = node;
            }}
            className={index === active ? "is-active" : ""}
            src={enabled ? src : undefined}
            muted
            playsInline
            loop
            preload="metadata"
            onError={(event) => {
              event.currentTarget.removeAttribute("src");
            }}
          />
        ))}
      </div>
      <div className="hero-montage-grain" />
      <div className="hero-montage-veil" />
    </div>
  );
}
