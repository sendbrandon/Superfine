import { GuestList } from './components/GuestList';
import { getMergedList } from '@/lib/list';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { added?: string; cancelled?: string; error?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const entries = await getMergedList();
  const highlight = searchParams.added;
  return <GuestList entries={entries} highlight={highlight} />;
}
