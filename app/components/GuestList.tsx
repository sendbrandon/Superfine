"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { addNameAction } from "../actions/add-name";
import FilmLeader from "./FilmLeader";
import HeroMontage from "./HeroMontage";
import TicketReveal from "./TicketReveal";
import type { GuestEntry, PaidEntry, Tier } from "@/lib/list";

type GuestListProps = {
  entries: GuestEntry[];
  patrons: PaidEntry[];
  recentEntries: PaidEntry[];
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
    detail: "ORANGE GLYPH"
  },
  {
    id: "patron",
    label: "PATRON",
    price: "$100",
    detail: "PATRONS BLOCK"
  }
];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LIVING_SEAT_LIMIT = 400;

export default function GuestList({
  entries,
  patrons,
  recentEntries,
  initialPaid,
  initialTotal,
  addedName,
  addedTier,
  mockMode,
  error
}: GuestListProps) {
  const [tier, setTier] = useState<Tier>(addedTier || "seat");
  const [seatMode, setSeatMode] = useState<"self" | "gift">("self");
  const [nameValue, setNameValue] = useState("");
  const [seatedByValue, setSeatedByValue] = useState("");
  const [message, setMessage] = useState(error ? errorForCode(error) : "");
  const [isPending, startTransition] = useTransition();
  const [ticketOpen, setTicketOpen] = useState(Boolean(addedName));
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const highlightedKey = useMemo(
    () => addedName.trim().toLocaleLowerCase("en-US"),
    [addedName]
  );
  const activeEntry = entries[activeIndex] || entries[0];
  const previousActiveEntry = entries[activeIndex - 1];
  const nextActiveEntry = entries[activeIndex + 1];
  const activeLetter = getIndexLetter(activeEntry?.sortName || activeEntry?.name);
  const activeLetterIndex = Math.max(0, ALPHABET.indexOf(activeLetter));
  const activeEntryNumber =
    activeEntry?.entryNumber ? formatEntryNumber(activeEntry.entryNumber) : "INDEX";
  const livingSeatsLeft = Math.max(0, LIVING_SEAT_LIMIT - initialPaid);
  const addedEntry = useMemo(() => {
    if (!highlightedKey) {
      return null;
    }

    return (
      entries.find(
        (entry) =>
          entry.source === "paid" &&
          entry.name.toLocaleLowerCase("en-US") === highlightedKey
      ) || null
    );
  }, [entries, highlightedKey]);
  const lineagePreview = useMemo(() => {
    const name = nameValue.trim();
    if (name.replace(/[^\p{L}\p{N}]/gu, "").length < 2) {
      return null;
    }

    const pending = {
      id: "preview",
      name,
      sortName: sortKeyForClient(name)
    };
    const sortedEntries = [
      ...entries.map((entry) => ({
        id: entry.id,
        name: entry.name,
        sortName: entry.sortName || sortKeyForClient(entry.name)
      })),
      pending
    ].sort((left, right) => {
      const sortResult = left.sortName.localeCompare(right.sortName, "en", {
        sensitivity: "base"
      });
      if (sortResult !== 0) {
        return sortResult;
      }

      return left.name.localeCompare(right.name, "en", { sensitivity: "base" });
    });
    const index = sortedEntries.findIndex((entry) => entry.id === pending.id);

    return {
      previous: sortedEntries[index - 1]?.name || "THE DOOR",
      current: name,
      next: sortedEntries[index + 1]?.name || "THE END",
      entryNumber: initialTotal + 1
    };
  }, [entries, initialTotal, nameValue]);

  useEffect(() => {
    if (!highlightedKey) {
      return;
    }

    const target = document.querySelector<HTMLElement>(
      `[data-name-key="${window.CSS.escape(highlightedKey)}"]`
    );
    target?.scrollIntoView({ block: "center" });
  }, [highlightedKey]);

  useEffect(() => {
    let frame = 0;

    function updateActiveIndex() {
      frame = 0;
      const rows = Array.from(
        document.querySelectorAll<HTMLElement>("[data-guest-index]")
      );
      if (!rows.length) {
        return;
      }

      const targetLine = window.innerHeight * 0.42;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - targetLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = Number(row.dataset.guestIndex || 0);
        }
      });

      setActiveIndex((currentIndex) =>
        currentIndex === closestIndex ? currentIndex : closestIndex
      );
    }

    function scheduleUpdate() {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(updateActiveIndex);
    }

    updateActiveIndex();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [entries.length]);

  function submit(formData: FormData) {
    setMessage("");
    const trimmed = String(formData.get("name") || "").trim();
    if (trimmed.replace(/[^\p{L}\p{N}]/gu, "").length < 2) {
      setMessage("ENTER A NAME.");
      return;
    }
    if (seatMode === "gift") {
      const giftedBy = String(formData.get("seatedBy") || "").trim();
      if (giftedBy.replace(/[^\p{L}\p{N}]/gu, "").length < 2) {
        setMessage("ADD WHO IS SEATING THEM.");
        return;
      }
      setSeatedByValue(giftedBy);
    } else {
      setSeatedByValue("");
    }
    setNameValue(trimmed);
    setPreviewOpen(true);
  }

  function confirmPay() {
    if (!formRef.current) return;
    setMessage("");
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const result = await addNameAction(formData);
      if (result.error) {
        setMessage(result.error);
        setPreviewOpen(false);
        return;
      }

      if (result.redirectTo) {
        window.location.href = result.redirectTo;
      }
    });
  }

  return (
    <main className="page-shell">
      {activeEntry ? (
        <aside className="rotary-index" aria-hidden="true">
          <div className="rotary-dial-shell">
            <div
              className="rotary-dial"
              style={{
                transform: `rotate(${-activeLetterIndex * (360 / ALPHABET.length)}deg)`
              }}
            >
              {ALPHABET.map((letter, index) => (
                <span
                  key={letter}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${
                      index * (360 / ALPHABET.length)
                    }deg) translateY(-55px)`
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <div className="rotary-aperture">{activeLetter}</div>
          </div>
          <div className="rotary-readout">
            <span>{activeEntryNumber}</span>
            <div className="rotary-slot">
              <em>{previousActiveEntry?.name || "THE DOOR"}</em>
              <strong>{activeEntry.name}</strong>
              <em>{nextActiveEntry?.name || "THE END"}</em>
            </div>
          </div>
        </aside>
      ) : null}

      <header className="artifact-header" aria-labelledby="page-title">
        <div className="technical-row">
          <span>SUPERFINE</span>
          <span>DROP 002</span>
          <span>MET GALA 2026</span>
        </div>

        <div className="hero-stage">
          <div className="hero-visual">
            <HeroMontage />
            <FilmLeader />
            <div className="hero-stat" aria-label="Living seats remaining">
              <strong>{livingSeatsLeft.toString().padStart(3, "0")}</strong>
              <em>LIVING SEATS REMAINING</em>
            </div>
          </div>
          <div className="hero-copy">
            <div className="hero-title-lockup">
              <h1 id="page-title" className="wordmark">
                THE GUEST LIST
              </h1>
              <p className="hero-question">WHO SHOULD HAVE BEEN INVITED?</p>
            </div>
          </div>
        </div>

        <nav className="hero-doors" aria-label="Primary actions">
          <a href="#entry" className="hero-door hero-door-primary">
            ADD A NAME, $1
          </a>
          <a href="#guest-list" className="hero-door hero-door-secondary">
            SEE THE LIST
          </a>
        </nav>
      </header>

      <section id="entry" className="entry-panel" aria-label="Buy a seat">
        <form
          ref={formRef}
          action={submit}
          className="entry-form"
          aria-describedby={message ? "form-message" : undefined}
        >
          <input type="hidden" name="tier" value={tier} />
          <input type="hidden" name="seatMode" value={seatMode} />

          <div className="seat-mode" aria-label="Seat mode">
            <button
              className={seatMode === "self" ? "selected" : ""}
              type="button"
              onClick={() => setSeatMode("self")}
              aria-pressed={seatMode === "self"}
            >
              SEAT YOURSELF
            </button>
            <button
              className={seatMode === "gift" ? "selected" : ""}
              type="button"
              onClick={() => setSeatMode("gift")}
              aria-pressed={seatMode === "gift"}
            >
              SEAT SOMEONE ELSE
            </button>
          </div>

          <label className="field-label" htmlFor="name">
            {seatMode === "gift" ? "WHO SHOULD BE ON THE LIST, $1" : "ADD A NAME, $1"}
          </label>
          <div className="name-line">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={seatMode === "gift" ? "THEIR NAME" : "YOUR NAME"}
              required
              minLength={2}
              maxLength={80}
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
            />
            <button type="submit" disabled={isPending}>
              {isPending ? "OPENING" : "ADD NAME"}
            </button>
          </div>

          {seatMode === "gift" ? (
            <input
              className="seated-by-input"
              name="seatedBy"
              type="text"
              autoComplete="name"
              placeholder="SEATED BY YOUR NAME"
              required
              minLength={2}
              maxLength={80}
            />
          ) : null}

          {lineagePreview ? (
            <div className="lineage-preview" aria-live="polite">
              <span>LINEAGE PREVIEW</span>
              <em>{lineagePreview.previous}</em>
              <strong>{lineagePreview.current}</strong>
              <em>{lineagePreview.next}</em>
              <span>{formatEntryNumber(lineagePreview.entryNumber)}</span>
            </div>
          ) : null}

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

      {addedName ? (
        <section className="index-stamp" aria-label="Index stamp">
          <span>{addedEntry?.seatedBy ? "PUBLICLY SEATED" : "CUT INTO THE INDEX"}</span>
          <strong>{addedName}</strong>
          <em>
            {addedEntry?.entryNumber
              ? formatEntryNumber(addedEntry.entryNumber)
              : "AWAITING TICKET"}
          </em>
          {addedEntry?.seatedBy ? (
            <small>SEATED BY {addedEntry.seatedBy}</small>
          ) : null}
        </section>
      ) : null}

      {recentEntries.length ? (
        <section className="public-ledger" aria-labelledby="ledger-title">
          <div className="section-rule">
            <h2 id="ledger-title">RECENTLY SEATED</h2>
            <span>PUBLIC TICKETS</span>
          </div>
          <ol>
            {recentEntries.map((entry) => (
              <li key={entry.id}>
                <span>
                  {entry.entryNumber ? formatEntryNumber(entry.entryNumber) : "PENDING"}
                </span>
                <a href={`/n/${entry.slug || ""}`}>{entry.name}</a>
                <em>
                  {entry.seatedBy ? `SEATED BY ${entry.seatedBy}` : "SELF-SEATED"}
                </em>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

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

      <ol id="guest-list" className="guest-list" aria-label="Alphabetical guest list">
        {entries.map((entry, index) => {
          const key = entry.name.toLocaleLowerCase("en-US");
          const isHighlighted = highlightedKey && key === highlightedKey;
          return (
            <li
              key={entry.id}
              className={isHighlighted ? "guest-row highlight" : "guest-row"}
              data-name-key={key}
              data-guest-index={index}
            >
              {entry.source === "paid" && entry.slug ? (
                <a className="guest-name" href={`/n/${entry.slug}`}>
                  {entry.name}
                </a>
              ) : (
                <span className="guest-name">{entry.name}</span>
              )}
              <span className="guest-flags">
                {entry.entryNumber ? (
                  <span className="entry-number">
                    {formatEntryNumber(entry.entryNumber)}
                  </span>
                ) : null}
                {entry.tier === "ribbon" ? (
                  <span className="ribbon-mark" aria-label="Ribbon">
                    ▎
                  </span>
                ) : null}
                {entry.tier === "patron" ? (
                  <span className="patron-mark">PATRON</span>
                ) : null}
              </span>
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
        seatedBy={addedEntry?.seatedBy}
        mode="official"
      />

      <TicketReveal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        name={nameValue}
        tier={tier}
        seatedBy={seatedByValue}
        mode="preview"
        onConfirmPay={confirmPay}
        isPending={isPending}
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

function sortKeyForClient(name: string) {
  return name
    .normalize("NFKD")
    .replace(/^(a|an|the)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatEntryNumber(entryNumber: number) {
  return `N° ${entryNumber.toString().padStart(6, "0")}`;
}

function getIndexLetter(value = "") {
  const letter = value
    .replace(/^(a|an|the)\s+/i, "")
    .trim()
    .charAt(0)
    .toLocaleUpperCase("en-US");

  return /^[A-Z]$/.test(letter) ? letter : "A";
}
