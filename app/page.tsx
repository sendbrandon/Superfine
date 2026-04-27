import type { Metadata } from "next";
import GuestList from "./components/GuestList";
import {
  getCount,
  getMergedList,
  getPatrons,
  getRecentPaidEntries,
  isTier,
  type Tier
} from "@/lib/list";

type PageProps = {
  searchParams?: {
    added?: string;
    tier?: string;
    seatedBy?: string;
    mock?: string;
    error?: string;
  };
};

export const dynamic = "force-dynamic";

const SHARE_DESCRIPTION =
  "Add a name to the public guest list for $1. We make the ticket. You share the proof.";

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const addedName = searchParams?.added || "";
  const addedTier: Tier = isTier(searchParams?.tier) ? searchParams.tier : "seat";
  const seatedBy = searchParams?.seatedBy || "";
  const title = addedName
    ? seatedBy
      ? `${addedName} was seated in THE GUEST LIST by ${seatedBy}`
      : `${addedName} was seated in THE GUEST LIST`
    : "THE GUEST LIST — SUPERFINE";
  const shareParams = new URLSearchParams();
  if (addedName) {
    shareParams.set("name", addedName);
    shareParams.set("tier", addedTier);
    if (seatedBy) {
      shareParams.set("seatedBy", seatedBy);
    }
  }
  const imageUrl = `/api/share${shareParams.toString() ? `?${shareParams}` : ""}`;
  const pageParams = new URLSearchParams();
  if (addedName) {
    pageParams.set("added", addedName);
    pageParams.set("tier", addedTier);
    if (seatedBy) {
      pageParams.set("seatedBy", seatedBy);
    }
  }
  const pageUrl = `/${pageParams.toString() ? `?${pageParams}` : ""}`;

  return {
    title,
    description: SHARE_DESCRIPTION,
    openGraph: {
      title,
      description: SHARE_DESCRIPTION,
      type: "website",
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: SHARE_DESCRIPTION,
      images: [imageUrl]
    }
  };
}

export default async function Page({ searchParams }: PageProps) {
  const [entries, patrons, count, recentEntries] = await Promise.all([
    getMergedList(),
    getPatrons(),
    getCount(),
    getRecentPaidEntries()
  ]);

  const addedName = searchParams?.added || "";
  const addedTier: Tier = isTier(searchParams?.tier) ? searchParams.tier : "seat";

  return (
    <GuestList
      entries={entries}
      patrons={patrons}
      recentEntries={recentEntries}
      initialPaid={count.paid}
      initialTotal={count.total}
      addedName={addedName}
      addedTier={addedTier}
      mockMode={searchParams?.mock === "1"}
      error={searchParams?.error || ""}
    />
  );
}
