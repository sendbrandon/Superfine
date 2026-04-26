"use client";

import { useEffect, useState } from "react";

type CountPayload = {
  paid: number;
  total: number;
};

type LiveCounterProps = {
  initialPaid: number;
  initialTotal: number;
};

export default function LiveCounter({
  initialPaid,
  initialTotal
}: LiveCounterProps) {
  const [count, setCount] = useState<CountPayload>({
    paid: initialPaid,
    total: initialTotal
  });

  useEffect(() => {
    let live = true;

    async function poll() {
      try {
        const response = await fetch("/api/count", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const nextCount = (await response.json()) as CountPayload;
        if (live) {
          setCount(nextCount);
        }
      } catch {
        return;
      }
    }

    const interval = window.setInterval(poll, 30000);
    return () => {
      live = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="live-counter" aria-live="polite">
      <span>{count.total.toLocaleString("en-US")} NAMES</span>
      <span>{count.paid.toLocaleString("en-US")} PAID</span>
    </div>
  );
}
