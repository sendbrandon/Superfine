# SUPERFINE — The Guest List

Drop #002 of the VNMSFX MSCHF-style portfolio.

> The only invitation list more exclusive than the one Anna keeps —
> this one already includes the dead.

A single-page scrolling list of ~150 hand-curated Black dandies through history, alphabetical, set in italic Times New Roman on ivory parchment. One field at the top: **add yourself, $1**. Your name appears in the list, alphabetized, permanently.

Drops on **4 May 2026** to ride Met Gala 2026 — theme **"Superfine: Tailoring Black Style"** (Monica L. Miller, *Slaves to Fashion*).

## Stack

- Next.js 14 (App Router)
- React 18, TypeScript
- Plain CSS (no Tailwind)
- Stripe Checkout for $1 add-name payments
- Vercel KV (Redis-backed) for persistent storage

## Locked design system

- **Ground:** ivory `#F5EDD8`
- **Ink:** black `#000000`
- **Accent:** oxblood `#8B1A2F` — specifically tailoring-coded
- **Type:** Times New Roman, italic for body, caps for the wordmark

## Local dev

```bash
npm install
npm run dev
# open http://localhost:3000
```

Without env vars, the site runs in **mock mode**: clicking "add me" routes through a fake success URL and persists the name in process memory only (vanishes on next request). Useful for design iteration; production needs Stripe + Vercel KV configured.

## Required Vercel env vars (production)

### Stripe — for charging

1. [stripe.com](https://stripe.com) → API keys → copy your **Secret key**
   (`sk_test_…` for test mode, `sk_live_…` once you're ready for real cards)
2. Add to Vercel project → Settings → Environment Variables:
   - `STRIPE_SECRET_KEY` — the secret key
   - `NEXT_PUBLIC_BASE_URL` — your site URL (e.g. `https://superfine.vercel.app`)

Stripe test card for verifying the flow: `4242 4242 4242 4242`, any future expiry, any 3-digit CVC.

### Vercel KV — for persistent storage

Without KV, paid additions vanish at the next deploy. To make them permanent:

1. Vercel project → **Storage** tab → **Create Database** → select **KV**
2. Name it (e.g. `superfine-list`) → Create
3. **Connect Project** → select Superfine → Connect
4. Vercel auto-injects four env vars: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`
5. Redeploy

Once KV is connected, the list survives deploys. Paid additions are `RPUSH`-ed onto a single Redis list under key `superfine:guest-list`.

## Architecture notes

- **Curated seed list** — `lib/curated-names.ts` exports ~150 names as a stable source-of-truth array. To add or remove from the seed, edit the file and redeploy. Names are sorted at module load.
- **Paid additions** — written via the Stripe success URL handler at `/api/confirm`. The handler verifies the Stripe session was actually paid before persisting, so the URL can't be spoofed.
- **Merging + sort** — `lib/list.ts` reads paid entries from KV, merges with curated, deduplicates by lowercase name, sorts alphabetically. Articles ("the") are stripped for the sort key.
- **Highlight flash** — when Stripe redirects back with `?added=Name`, the page scrolls the new entry into view and animates an oxblood flash for ~1.6 seconds.

## Deploy

Push to `main`. Vercel auto-deploys. After Stripe + KV env vars are set, real $1 payments persist into the list permanently.

## Validation logic

By midnight ET on May 4, 2026 — count paid additions.

- 1,000 paid adds = $1,000 + 1,000 distribution events (people screenshot their entry to share)
- 10,000 = $10K + viral propagation
- The site stays live forever as **The Superfine Guest List · 2026**

## Backlog (v1.1+)

- Stripe webhook on `checkout.session.completed` as backstop persistence (in case user closes browser before redirect)
- Filter / search field on the list (200+ entries gets long fast)
- "Recently added" sidebar showing the latest 5–10 paid adds with timestamp
- Per-name dedicated URL (e.g. `/name/frederick-douglass`) for permalink sharing
- Curation expansion to 300+ names
- Optional twin: a B-side print-on-demand "Guest List 2026" book of the entire signed list
