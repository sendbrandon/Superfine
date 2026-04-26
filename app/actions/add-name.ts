'use server';

import Stripe from 'stripe';
import { moderateName } from '@/lib/moderate';
import type { Tier } from '@/lib/curated-names';

export interface AddNameResult {
  ok: boolean;
  url?: string;
  message?: string;
}

const PRICES: Record<Tier, number> = {
  seat: 1,
  ribbon: 25,
  patron: 100,
};

const TIER_LABELS: Record<Tier, string> = {
  seat: 'Take a seat',
  ribbon: 'The Ribbon',
  patron: 'Patron',
};

function isValidTier(t: string): t is Tier {
  return t === 'seat' || t === 'ribbon' || t === 'patron';
}

/**
 * Server action: create a Stripe Checkout session for the chosen tier.
 *
 * - $1 seat — name in the alphabetical scroll
 * - $25 ribbon — name in the scroll with an oxblood ribbon glyph
 * - $100 patron — name in the Patrons block at the top + dedication line
 *
 * Without STRIPE_SECRET_KEY, the action gracefully degrades — returns
 * a mock success URL so the UX flow demos locally.
 */
export async function addName(formData: FormData): Promise<AddNameResult> {
  const rawName = String(formData.get('name') ?? '');
  const rawTier = String(formData.get('tier') ?? 'seat');
  const rawDedication = String(formData.get('dedication') ?? '');

  if (!isValidTier(rawTier)) {
    return { ok: false, message: 'Pick a tier.' };
  }
  const tier: Tier = rawTier;

  const moderation = moderateName(rawName);
  if (!moderation.ok) {
    return { ok: false, message: moderation.reason };
  }
  const name = rawName.normalize('NFKC').trim();

  // Dedication is optional, only honored on patron tier
  const dedication =
    tier === 'patron'
      ? rawDedication.normalize('NFKC').trim().slice(0, 240) || undefined
      : undefined;

  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  // Build return-URL params once
  const returnParams = new URLSearchParams({
    name,
    tier,
    ...(dedication ? { dedication } : {}),
  });

  if (!apiKey) {
    console.log(`[superfine] (no Stripe env) would add: ${name} (${tier}${dedication ? ', dedication' : ''})`);
    returnParams.set('mock', '1');
    return {
      ok: true,
      url: `${baseUrl}/api/confirm?${returnParams.toString()}`,
    };
  }

  try {
    const stripe = new Stripe(apiKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: PRICES[tier] * 100,
            product_data: {
              name: `SUPERFINE · ${TIER_LABELS[tier]}`,
              description: `Add ${name} to the Superfine Guest List, permanently.`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/api/confirm?session_id={CHECKOUT_SESSION_ID}&${returnParams.toString()}`,
      cancel_url: `${baseUrl}/?cancelled=1`,
      metadata: {
        name,
        tier,
        dedication: dedication ?? '',
        source: 'superfine-guest-list',
      },
    });

    if (!session.url) {
      return { ok: false, message: 'Stripe returned no checkout URL. Try again.' };
    }
    return { ok: true, url: session.url };
  } catch (err) {
    let message = 'Stripe error. Try again.';
    if (err instanceof Stripe.errors.StripeError) {
      message = `Stripe: ${err.message}`;
    } else if (err instanceof Error) {
      message = err.message;
    }
    console.error('[superfine] add-name error:', err);
    return { ok: false, message };
  }
}
