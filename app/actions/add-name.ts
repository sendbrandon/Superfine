'use server';

import Stripe from 'stripe';

export interface AddNameResult {
  ok: boolean;
  url?: string;
  message?: string;
}

const PRICE_USD = 1;

function sanitize(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[\r\n\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

/**
 * Server action: create a Stripe Checkout session for one $1 add-name
 * payment. The name is stored in the session metadata and persisted
 * to Vercel KV by the /api/confirm route after successful payment.
 *
 * Without STRIPE_SECRET_KEY, the action gracefully degrades — returns
 * a mock success URL so the UX flow demos locally. Set the env on
 * Vercel to flip on real charging.
 */
export async function addName(formData: FormData): Promise<AddNameResult> {
  const rawName = String(formData.get('name') ?? '');
  const name = sanitize(rawName);

  if (!name || name.length < 2) {
    return { ok: false, message: 'Add a name (at least 2 characters).' };
  }

  if (name.length > 80) {
    return { ok: false, message: 'Name is too long (80 characters max).' };
  }

  const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  if (!apiKey) {
    console.log(`[superfine] (no Stripe env) would add: ${name}`);
    return {
      ok: true,
      url: `${baseUrl}/?added=${encodeURIComponent(name)}&mock=1`,
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
            unit_amount: PRICE_USD * 100,
            product_data: {
              name: 'SUPERFINE · The Guest List',
              description: `Add ${name} to the Superfine Guest List, permanently.`,
            },
          },
          quantity: 1,
        },
      ],
      // Pass the name through both metadata (for the webhook later)
      // and the success URL query (for the immediate confirm route).
      success_url: `${baseUrl}/api/confirm?session_id={CHECKOUT_SESSION_ID}&name=${encodeURIComponent(name)}`,
      cancel_url: `${baseUrl}/?cancelled=1`,
      metadata: {
        name,
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
