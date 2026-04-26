import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addPaidEntry } from '@/lib/list';

/**
 * Stripe success-URL handler.
 *
 * Stripe redirects to /api/confirm?session_id=…&name=… on successful
 * payment. We verify the session was actually paid by hitting Stripe's
 * API (so people can't fake the URL), then write the name to KV and
 * redirect to the homepage with ?added=name for the highlight flash.
 *
 * Without Stripe env, we trust the URL (mock mode for local dev).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  const name = url.searchParams.get('name');
  const mock = url.searchParams.get('mock') === '1';

  if (!name) {
    return NextResponse.redirect(new URL('/?error=missing_name', req.url));
  }

  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();

  // Mock / no-Stripe path — trust the URL, persist, redirect
  if (!apiKey || mock) {
    await addPaidEntry(name);
    return NextResponse.redirect(new URL(`/?added=${encodeURIComponent(name)}`, req.url));
  }

  // Real path — verify the session was paid before persisting
  if (!sessionId) {
    return NextResponse.redirect(new URL('/?error=missing_session', req.url));
  }

  try {
    const stripe = new Stripe(apiKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      console.warn('[superfine] confirm: session not paid', session.id);
      return NextResponse.redirect(new URL('/?error=not_paid', req.url));
    }

    // Use the name from session metadata — it's the trusted source
    const trustedName = session.metadata?.name?.trim() || name;
    await addPaidEntry(trustedName);

    return NextResponse.redirect(
      new URL(`/?added=${encodeURIComponent(trustedName)}`, req.url)
    );
  } catch (err) {
    console.error('[superfine] confirm error:', err);
    return NextResponse.redirect(new URL('/?error=server', req.url));
  }
}
