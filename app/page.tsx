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
