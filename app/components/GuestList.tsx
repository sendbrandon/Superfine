'use client';

import { useEffect, useRef, useState } from 'react';
import type { ListEntry, Tier } from '@/lib/curated-names';
import { addName, type AddNameResult } from '../actions/add-name';
import { LiveCounter } from './LiveCounter';
import { TicketReveal } from './TicketReveal';

interface Props {
  patrons: ListEntry[];
  alphabetical: ListEntry[];
  totalCount: number;
  highlight?: string;
  highlightTier?: Tier;
}

const TIERS: { id: Tier; price: number; label: string; sub: string }[] = [
  { id: 'seat', price: 1, label: 'Take a seat', sub: 'your name in the scroll' },
  { id: 'ribbon', price: 25, label: 'The Ribbon', sub: 'your name with an oxblood ribbon' },
  { id: 'patron', price: 100, label: 'Patron', sub: 'your name at the top, with a dedication' },
];

export function GuestList({
  patrons,
  alphabetical,
  totalCount,
  highlight,
  highlightTier,
}: Props) {
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Tier>('seat');
  const [dedication, setDedication] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const highlightRef = useRef<HTMLLIElement>(null);

  // Open ticket modal automatically on first paint after a successful add
  useEffect(() => {
    if (highlight) {
      setShowTicket(true);
      const t = setTimeout(() => {
        highlightRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 400);
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
    fd.set('tier', tier);
    if (tier === 'patron' && dedication) fd.set('dedication', dedication);

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
        <LiveCounter initialCount={totalCount} />
      </header>

      <section className="add">
        <form onSubmit={handleSubmit} className="add-form">
          <label className="add-label">Add yourself</label>

          <div className="tier-tiles">
            {TIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`tier-tile${tier === t.id ? ' active' : ''}${t.id === 'patron' ? ' patron-tier' : ''}${t.id === 'ribbon' ? ' ribbon-tier' : ''}`}
                onClick={() => setTier(t.id)}
              >
                <span className="tier-price">${t.price}</span>
                <span className="tier-name">{t.label}</span>
                <span className="tier-sub">— {t.sub}</span>
              </button>
            ))}
          </div>

          <input
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

          {tier === 'patron' && (
            <textarea
              className="add-dedication"
              placeholder="optional dedication — e.g., in memoriam, Eleanor Harris, 1922\u20132018"
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              maxLength={240}
              rows={2}
              disabled={pending}
            />
          )}

          <button type="submit" className="add-submit" disabled={pending}>
            {pending ? 'sending…' : `pay $${TIERS.find((t) => t.id === tier)!.price} \u00b7 add me`}
          </button>

          {error && <div className="add-error">{error}</div>}

          <div className="add-fineprint">
            One-time payment, charged once. Your name appears in the list,
            permanently. Secured by Stripe. No refunds.
          </div>
        </form>
      </section>

      {patrons.length > 0 && (
        <section className="patrons">
          <h2 className="patrons-title">Patrons</h2>
          <ol className="patrons-list">
            {patrons.map((p) => (
              <li key={`${p.name}-${p.addedAt}`} className="patron-item">
                <div className="patron-name">{p.name}</div>
                {p.dedication && (
                  <div className="patron-dedication">{p.dedication}</div>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <ol className="list">
        {alphabetical.map((entry) => {
          const isHighlight =
            highlight && entry.name.toLowerCase() === highlight.toLowerCase();
          const cls = [
            'item',
            entry.paid ? 'paid' : '',
            entry.tier === 'ribbon' ? 'ribbon' : '',
            isHighlight ? 'highlight' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <li
              key={`${entry.name}-${entry.addedAt}`}
              ref={isHighlight ? highlightRef : null}
              className={cls}
            >
              {entry.tier === 'ribbon' && <span className="ribbon-glyph">▎</span>}
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

      {showTicket && highlight && (
        <TicketReveal
          name={highlight}
          tier={highlightTier ?? 'seat'}
          onClose={() => setShowTicket(false)}
        />
      )}
    </main>
  );
}
