import { NextResponse } from "next/server";
import Stripe from "stripe";
import { addPaidEntry, isTier } from "@/lib/list";
import { moderateName, normalizeSubmittedName } from "@/lib/moderate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId || !process.env.STRIPE_SECRET_KEY) {
    return redirectHome(request.url, "missing-session");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return redirectHome(request.url, "unpaid");
  }

  const name = normalizeSubmittedName(session.metadata?.name || "");
  const tier = isTier(session.metadata?.tier) ? session.metadata.tier : "seat";
  const dedication =
    tier === "patron"
      ? normalizeSubmittedName(session.metadata?.dedication || "").slice(0, 120)
      : undefined;

  const moderation = moderateName(name);
  if (!moderation.ok) {
    return redirectHome(request.url, "rejected");
  }

  await addPaidEntry({
    name,
    tier,
    dedication,
    sessionId
  });

  const destination = new URL("/", request.url);
  destination.searchParams.set("added", name);
  destination.searchParams.set("tier", tier);
  return NextResponse.redirect(destination);
}

function redirectHome(requestUrl: string, error: string) {
  const destination = new URL("/", requestUrl);
  destination.searchParams.set("error", error);
  return NextResponse.redirect(destination);
}
