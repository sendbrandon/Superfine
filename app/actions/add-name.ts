"use server";

import Stripe from "stripe";
import { addPaidEntry, isSeatMode, isTier, type Tier } from "@/lib/list";
import { moderateName, normalizeSubmittedName } from "@/lib/moderate";

type AddNameResult = {
  error?: string;
  redirectTo?: string;
};

const TIER_PRICE: Record<Tier, { label: string; cents: number }> = {
  seat: { label: "Take a seat", cents: 100 },
  ribbon: { label: "The Ribbon", cents: 2500 },
  patron: { label: "Patron", cents: 10000 }
};

export async function addNameAction(formData: FormData): Promise<AddNameResult> {
  const name = normalizeSubmittedName(String(formData.get("name") || ""));
  const tierValue = String(formData.get("tier") || "seat");
  const seatModeValue = String(formData.get("seatMode") || "self");
  const seatMode = isSeatMode(seatModeValue) ? seatModeValue : "self";
  const seatedBy = normalizeSubmittedName(String(formData.get("seatedBy") || ""));
  const dedicationRaw = String(formData.get("dedication") || "");
  const dedication = normalizeSubmittedName(dedicationRaw).slice(0, 120);
  const tier: Tier = isTier(tierValue) ? tierValue : "seat";

  const moderation = moderateName(name);
  if (!moderation.ok) {
    return { error: moderation.reason };
  }

  if (seatMode === "gift") {
    const seatedByModeration = moderateName(seatedBy);
    if (!seatedByModeration.ok) {
      return { error: `SEATED BY: ${seatedByModeration.reason}` };
    }
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!stripeKey || !baseUrl) {
    await addPaidEntry({
      name,
      tier,
      seatMode,
      seatedBy: seatMode === "gift" ? seatedBy : undefined,
      dedication: tier === "patron" ? dedication : undefined
    });

    const params = new URLSearchParams({
      added: name,
      tier,
      mock: "1"
    });
    if (seatMode === "gift") {
      params.set("seatedBy", seatedBy);
    }

    return {
      redirectTo: `/?${params.toString()}`
    };
  }

  const stripe = new Stripe(stripeKey);
  const price = TIER_PRICE[tier];
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: price.cents,
          product_data: {
            name: `THE GUEST LIST — ${price.label}`
          }
        }
      }
    ],
    metadata: {
      name,
      tier,
      seatMode,
      seatedBy: seatMode === "gift" ? seatedBy : "",
      dedication: tier === "patron" ? dedication : ""
    },
    success_url: `${baseUrl}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/?error=cancelled`
  });

  if (!session.url) {
    return { error: "Stripe did not return a checkout URL." };
  }

  return { redirectTo: session.url };
}
