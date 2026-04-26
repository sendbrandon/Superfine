'use client';

import { useEffect, useRef, useState } from 'react';
import type { ListEntry } from '@/lib/curated-names';
import { addName, type AddNameResult } from '../actions/add-name';

interface Props {
  entries: ListEntry[];
  highlight?: string;
}

export function GuestList({ entries, highlight }: Props) {
  const [name, setName] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const highlightRef = useRef<HTMLLIElement>(null);

  // Scroll to and flash the highlighted entry on first paint.
  useEffect(() => {
    if (highlight && highlightRef.current) {
      const t = setTimeout(() => {
        highlightRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [highlight]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);

    const fd = new FormData();
    fd.set('name', name);
    const result: AddNameResult = await addName(fd);

    if (!result.ok || !result.url) {
      setError(result.message ?? 'Something went wrong.');
      setPending(false);
      return;
    }
    window.location.href = result.url;
  };

  return (
    <main className="superfine">
      <header className="head">
        <h1 className="wordmark">SUPERFINE</h1>
        <p className="kicker">— the guest list.</p>
        <p className="lede">
          Met Gala · 4 May 2026 · <em>Tailoring Black Style.</em><br />
          The only invitation list more exclusive than the one Anna keeps —{' '}
          <em>this one already includes the dead.</em>
        </p>
      </header>

      <section className="add">
        <form onSubmit={handleSubmit} className="add-form">
          <label className="add-label" htmlFor="name">
            Add yourself · $1
          </label>
          <div className="add-row">
            <input
              id="name"
              type="text"
              className="add-input"
              placeholder="your name, exactly as you want it carved"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              disabled={pending}
              autoComplete="name"
            />
            <button type="submit" className="add-submit" disabled={pending}>
              {pending ? 'sending…' : 'add me'}
            </button>
          </div>
          {error && <div className="add-error">{error}</div>}
          <div className="add-fineprint">
            One-time gift, charged once. Your name appears in the list,
            alphabetized, permanently. Secured by Stripe.
          </div>
        </form>
      </section>

      <ol className="list">
        {entries.map((entry) => {
          const isHighlight =
            highlight && entry.name.toLowerCase() === highlight.toLowerCase();
          return (
            <li
              key={`${entry.name}-${entry.addedAt}`}
              ref={isHighlight ? highlightRef : null}
              className={`item${entry.paid ? ' paid' : ''}${isHighlight ? ' highlight' : ''}`}
            >
              {entry.name}
            </li>
          );
        })}
      </ol>

      <footer className="foot">
        <p>SUPERFINE · The Guest List · Met Gala 2026.</p>
        <p className="micro">
          A drop by{' '}
          <a href="https://github.com/sendbrandon" target="_blank" rel="noopener noreferrer">
            VNMSFX
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
