import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addPaidEntry } from '@/lib/list';
import type { Tier } from '@/lib/curated-names';

function isValidTier(t: string | null | undefined): t is Tier {
  return t === 'seat' || t === 'ribbon' || t === 'patron';
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  const name = url.searchParams.get('name');
  const tierParam = url.searchParams.get('tier');
  const dedicationParam = url.searchParams.get('dedication');
  const mock = url.searchParams.get('mock') === '1';

  if (!name) {
    return NextResponse.redirect(new URL('/?error=missing_name', req.url));
  }
  if (!isValidTier(tierParam)) {
    return NextResponse.redirect(new URL('/?error=missing_tier', req.url));
  }
  const tier: Tier = tierParam;

  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();

  // Mock / no-Stripe path — trust the URL, persist, redirect
  if (!apiKey || mock) {
    await addPaidEntry({
      name,
      tier,
      dedication: dedicationParam ?? undefined,
    });
    return NextResponse.redirect(
      new URL(`/?added=${encodeURIComponent(name)}&tier=${tier}`, req.url)
    );
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

    // Trust session metadata over URL params (URL can be spoofed)
    const trustedName = session.metadata?.name?.trim() || name;
    const trustedTierStr = session.metadata?.tier?.trim() || tier;
    const trustedTier: Tier = isValidTier(trustedTierStr) ? trustedTierStr : tier;
    const trustedDedication =
      trustedTier === 'patron'
        ? session.metadata?.dedication?.trim() || undefined
        : undefined;

    await addPaidEntry({
      name: trustedName,
      tier: trustedTier,
      dedication: trustedDedication,
    });

    return NextResponse.redirect(
      new URL(
        `/?added=${encodeURIComponent(trustedName)}&tier=${trustedTier}`,
        req.url
      )
    );
  } catch (err) {
    console.error('[superfine] confirm error:', err);
    return NextResponse.redirect(new URL('/?error=server', req.url));
  }
}
