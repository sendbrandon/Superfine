'use client';

import { useEffect, useState } from 'react';

interface Props {
  initialCount: number;
}

export function LiveCounter({ initialCount }: Props) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const tick = async () => {
      try {
        const res = await fetch('/api/count', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as { total: number };
        if (typeof json.total === 'number') setCount(json.total);
      } catch {
        /* ignore — keep last good count */
      }
    };

    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="counter">
      <span className="counter-num">{count.toLocaleString()}</span>
      <span className="counter-text"> names on the list · the door is open.</span>
    </p>
  );
}
