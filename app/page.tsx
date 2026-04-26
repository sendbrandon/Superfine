import type { Metadata } from "next";
import GuestList from "./components/GuestList";
import { getCount, getMergedList, getPatrons, isTier, type Tier } from "@/lib/list";

type PageProps = {
  searchParams?: {
    added?: string;
    tier?: string;
    mock?: string;
    error?: string;
  };
};

export const dynamic = "force-dynamic";

const SHARE_DESCRIPTION =
  "The only invitation list more exclusive than the one Anna keeps — this one already includes the dead.";

export function generateMetadata({ searchParams }: PageProps): Metadata {
  const addedName = searchParams?.added || "";
  const addedTier: Tier = isTier(searchParams?.tier) ? searchParams.tier : "seat";
  const title = addedName
    ? `${addedName} entered THE GUEST LIST`
    : "THE GUEST LIST — SUPERFINE";
  const shareParams = new URLSearchParams();
  if (addedName) {
    shareParams.set("name", addedName);
    shareParams.set("tier", addedTier);
  }
  const imageUrl = `/api/share${shareParams.toString() ? `?${shareParams}` : ""}`;
  const pageParams = new URLSearchParams();
  if (addedName) {
    pageParams.set("added", addedName);
    pageParams.set("tier", addedTier);
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
  const [entries, patrons, count] = await Promise.all([
    getMergedList(),
    getPatrons(),
    getCount()
  ]);

  const addedName = searchParams?.added || "";
  const addedTier: Tier = isTier(searchParams?.tier) ? searchParams.tier : "seat";

  return (
    <GuestList
      entries={entries}
      patrons={patrons}
      initialPaid={count.paid}
      initialTotal={count.total}
      addedName={addedName}
      addedTier={addedTier}
      mockMode={searchParams?.mock === "1"}
      error={searchParams?.error || ""}
    />
  );
}
