# Superfine: The Guest List

Live demo: [superfine.vercel.app](https://superfine.vercel.app)

Superfine is a single-page cultural commerce prototype built around a fictional Met Gala 2026 counter-event. It is intentionally small, sharp, and opinionated: a visitor can add their name to a guest list, move through a checkout-style flow, and experience a product world with a clear voice.

## Portfolio Signal

This project shows how I use AI-assisted development to turn a cultural idea into a working product surface. The useful part is not only the interface; it is the full product framing, edge-case thinking, moderation path, payment fallback, and README-level explanation that lets someone else understand the system quickly.

## What I Built

- Next.js app with a focused guest-list interaction
- Stripe Checkout path with a local mock mode for demos and development
- Vercel KV-ready persistence with in-memory fallback when env vars are not present
- Basic moderation and curated-name handling for safer public input
- Product copy, visual direction, and launch-ready narrative

## Stack

- Next.js
- TypeScript
- Stripe
- Vercel KV
- CSS

## Run Locally

```bash
npm install
npm run dev
```

Without Stripe and KV environment variables, the add flow uses the local mock path and in-memory persistence.

## Environment

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=https://superfine.vercel.app
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

## Build

```bash
npm run build
```
