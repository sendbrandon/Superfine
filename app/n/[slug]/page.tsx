import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuestList from "@/app/components/GuestList";
import {
  getCount,
  getMergedList,
  getPaidEntryBySlug,
  getPatrons,
  getRecentPaidEntries
} from "@/lib/list";

type NamePageProps = {
  params: {
    slug: string;
  };
};

const SHARE_DESCRIPTION =
  "The only invitation list more exclusive than the one Anna keeps — this one already includes the dead.";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: NamePageProps): Promise<Metadata> {
  const entry = await getPaidEntryBySlug(params.slug);
  if (!entry) {
    return {
      title: "THE GUEST LIST — SUPERFINE",
      description: SHARE_DESCRIPTION
    };
  }

  const title = `${entry.name} was seated in THE GUEST LIST`;
  const imageParams = new URLSearchParams({
    name: entry.name,
    tier: entry.tier
  });
  if (entry.seatedBy) {
    imageParams.set("seatedBy", entry.seatedBy);
  }

  return {
    title,
    description: SHARE_DESCRIPTION,
    openGraph: {
      title,
      description: SHARE_DESCRIPTION,
      type: "website",
      url: `/n/${entry.slug || params.slug}`,
      images: [
        {
          url: `/api/share?${imageParams}`,
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
      images: [`/api/share?${imageParams}`]
    }
  };
}

export default async function NamePage({ params }: NamePageProps) {
  const entry = await getPaidEntryBySlug(params.slug);
  if (!entry) {
    notFound();
  }

  const [entries, patrons, count, recentEntries] = await Promise.all([
    getMergedList(),
    getPatrons(),
    getCount(),
    getRecentPaidEntries()
  ]);

  return (
    <GuestList
      entries={entries}
      patrons={patrons}
      recentEntries={recentEntries}
      initialPaid={count.paid}
      initialTotal={count.total}
      addedName={entry.name}
      addedTier={entry.tier}
      mockMode={false}
      error=""
    />
  );
}
