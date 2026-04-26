# SUPERFINE — THE GUEST LIST

A single-page Next.js artifact for the Met Gala 2026 counter-event.

## Run

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
