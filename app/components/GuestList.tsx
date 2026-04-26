"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { addNameAction } from "../actions/add-name";
import LiveCounter from "./LiveCounter";
import TicketReveal from "./TicketReveal";
import type { GuestEntry, PaidEntry, Tier } from "@/lib/list";

type GuestListProps = {
  entries: GuestEntry[];
  patrons: PaidEntry[];
  initialPaid: number;
  initialTotal: number;
  addedName: string;
  addedTier: Tier;
  mockMode: boolean;
  error: string;
};

const TIERS: Array<{
  id: Tier;
  label: string;
  price: string;
  detail: string;
}> = [
  {
    id: "seat",
    label: "TAKE A SEAT",
    price: "$1",
    detail: "NAME IN THE SCROLL"
  },
  {
    id: "ribbon",
    label: "THE RIBBON",
    price: "$25",
    detail: "OXBLOOD GLYPH"
  },
  {
    id: "patron",
    label: "PATRON",
    price: "$100",
    detail: "PATRONS BLOCK"
  }
];

export default function GuestList({
  entries,
  patrons,
  initialPaid,
  initialTotal,
  addedName,
  addedTier,
  mockMode,
  error
}: GuestListProps) {
  const [tier, setTier] = useState<Tier>(addedTier || "seat");
  const [message, setMessage] = useState(error ? errorForCode(error) : "");
  const [isPending, startTransition] = useTransition();
  const [ticketOpen, setTicketOpen] = useState(Boolean(addedName));
  const formRef = useRef<HTMLFormElement>(null);

  const highlightedKey = useMemo(
    () => addedName.trim().toLocaleLowerCase("en-US"),
    [addedName]
  );

  useEffect(() => {
    if (!highlightedKey) {
      return;
    }

    const target = document.querySelector<HTMLElement>(
      `[data-name-key="${window.CSS.escape(highlightedKey)}"]`
    );
    target?.scrollIntoView({ block: "center" });
  }, [highlightedKey]);

  function submit(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const result = await addNameAction(formData);
      if (result.error) {
        setMessage(result.error);
        return;
      }

      if (result.redirectTo) {
        window.location.href = result.redirectTo;
      }
    });
  }

  return (
    <main className="page-shell">
      <header className="artifact-header" aria-labelledby="page-title">
        <div className="technical-row">
          <span>SUPERFINE</span>
          <span>DROP 002</span>
          <span>MET GALA 2026</span>
        </div>

        <h1 id="page-title" className="wordmark">
          THE GUEST LIST
        </h1>

        <div className="lede-row">
          <p>
            The only invitation list more exclusive than the one Anna keeps —
            this one already includes the dead.
          </p>
          <LiveCounter initialPaid={initialPaid} initialTotal={initialTotal} />
        </div>
      </header>

      <section className="entry-panel" aria-label="Add yourself">
        <form
          ref={formRef}
          action={submit}
          className="entry-form"
          aria-describedby={message ? "form-message" : undefined}
        >
          <input type="hidden" name="tier" value={tier} />

          <label className="field-label" htmlFor="name">
            ADD YOURSELF, $1
          </label>
          <div className="name-line">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="YOUR NAME"
              required
              minLength={2}
              maxLength={80}
            />
            <button type="submit" disabled={isPending}>
              {isPending ? "OPENING" : "ENTER"}
            </button>
          </div>

          {tier === "patron" ? (
            <input
              className="dedication-input"
              name="dedication"
              type="text"
              placeholder="DEDICATION LINE"
              maxLength={120}
            />
          ) : null}

          {message ? (
            <p id="form-message" className="form-message">
              {message}
            </p>
          ) : null}
          {mockMode ? (
            <p className="fineprint">
              LOCAL MOCK PATH — PERSISTENCE VANISHES WHEN THE SERVER DOES.
            </p>
          ) : null}
        </form>

        <div className="tier-grid" aria-label="Tiers">
          {TIERS.map((item) => (
            <button
              key={item.id}
              className={tier === item.id ? "tier-tile selected" : "tier-tile"}
              type="button"
              onClick={() => setTier(item.id)}
              aria-pressed={tier === item.id}
            >
              <span>{item.label}</span>
              <span>{item.price}</span>
              <span>{item.detail}</span>
            </button>
          ))}
        </div>
      </section>

      {patrons.length ? (
        <section className="patrons" aria-labelledby="patrons-title">
          <h2 id="patrons-title">PATRONS</h2>
          <ol>
            {patrons.map((patron) => (
              <li key={patron.id}>
                <span>{patron.name}</span>
                {patron.dedication ? <em>{patron.dedication}</em> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <ol className="guest-list" aria-label="Alphabetical guest list">
        {entries.map((entry) => {
          const key = entry.name.toLocaleLowerCase("en-US");
          const isHighlighted = highlightedKey && key === highlightedKey;
          return (
            <li
              key={entry.id}
              className={isHighlighted ? "guest-row highlight" : "guest-row"}
              data-name-key={key}
            >
              <span className="guest-name">{entry.name}</span>
              {entry.tier === "ribbon" ? (
                <span className="ribbon-mark" aria-label="Ribbon">
                  ▎
                </span>
              ) : null}
              {entry.tier === "patron" ? (
                <span className="patron-mark">PATRON</span>
              ) : null}
            </li>
          );
        })}
      </ol>

      <footer className="site-footer">
        <span>BLACK DANDYISM AND THE STYLING OF BLACK DIASPORIC IDENTITY.</span>
        <span>ONE DOLLAR AT THE DOOR.</span>
      </footer>

      <TicketReveal
        open={ticketOpen}
        onClose={() => setTicketOpen(false)}
        name={addedName}
        tier={addedTier}
      />
    </main>
  );
}

function errorForCode(code: string) {
  if (code === "cancelled") {
    return "CHECKOUT CLOSED.";
  }
  if (code === "rejected") {
    return "NAME REJECTED.";
  }
  if (code === "unpaid") {
    return "PAYMENT NOT CONFIRMED.";
  }
  return "THE DOOR DID NOT OPEN.";
}
