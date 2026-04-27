"use client";

import { useEffect, useState } from "react";

type FilmLeaderProps = {
  reel?: string;
  cam?: string;
};

export default function FilmLeader({
  reel = "REEL 002 · SUPERFINE · 24 FPS · GATE 04",
  cam = "NORTH ENTRANCE · CAM 02"
}: FilmLeaderProps) {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    function tick() {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      setNow(`${date} ${time} EST`);
    }
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="film-leader" aria-hidden="true">
      <div className="film-sprockets film-sprockets-top" />
      <div className="film-sprockets film-sprockets-bottom" />
      <div className="film-leader-tag film-leader-tag-tl">{reel}</div>
      <div className="film-leader-tag film-leader-tag-tr">
        <span>{now || "\u00a0"}</span>
        <span>{cam}</span>
      </div>
    </div>
  );
}
