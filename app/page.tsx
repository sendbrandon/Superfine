import { GuestList } from './components/GuestList';
import { getMergedList } from '@/lib/list';
import type { Tier } from '@/lib/curated-names';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    added?: string;
    tier?: string;
    cancelled?: string;
    error?: string;
  };
}

function isValidTier(t: string | undefined): t is Tier {
  return t === 'seat' || t === 'ribbon' || t === 'patron';
}

export default async function Page({ searchParams }: PageProps) {
  const merged = await getMergedList();
  const highlight = searchParams.added;
  const highlightTier = isValidTier(searchParams.tier) ? searchParams.tier : undefined;

  return (
    <GuestList
      patrons={merged.patrons}
      alphabetical={merged.alphabetical}
      totalCount={merged.totalCount}
      highlight={highlight}
      highlightTier={highlightTier}
    />
  );
}
