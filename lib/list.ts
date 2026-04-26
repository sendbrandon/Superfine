/**
 * SUPERFINE · server-side list operations
 *
 * Reads paid additions from Vercel KV (Upstash Redis backend) and
 * merges with the curated seed. Without KV env vars set, the action
 * gracefully degrades — paid additions exist only in memory for the
 * lifetime of the serverless invocation. Production requires KV.
 */

import { createClient } from '@vercel/kv';
import { CURATED_ENTRIES, type ListEntry, type Tier } from './curated-names';

const KV_KEY = 'superfine:guest-list';

function hasKvCredentials(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function kvClient() {
  if (!hasKvCredentials()) return null;
  return createClient({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

/** In-memory dev fallback — only persists for one serverless lifetime */
let memoryAdds: ListEntry[] = [];

export async function getPaidEntries(): Promise<ListEntry[]> {
  const client = kvClient();
  if (!client) return memoryAdds;

  try {
    const raw = await client.lrange<string>(KV_KEY, 0, -1);
    return raw
      .map((item) => {
        try {
          return JSON.parse(item) as ListEntry;
        } catch {
          return null;
        }
      })
      .filter((x): x is ListEntry => x !== null);
  } catch (err) {
    console.error('[superfine] kv read error:', err);
    return memoryAdds;
  }
}

export interface AddEntryArgs {
  name: string;
  tier: Tier;
  dedication?: string;
}

export async function addPaidEntry({ name, tier, dedication }: AddEntryArgs): Promise<void> {
  const entry: ListEntry = {
    name: name.trim().slice(0, 80),
    addedAt: Date.now(),
    paid: true,
    tier,
    dedication: dedication ? dedication.trim().slice(0, 240) : undefined,
  };

  const client = kvClient();
  if (!client) {
    memoryAdds.push(entry);
    console.log(`[superfine] (no KV env) added: ${entry.name} (${tier})`);
    return;
  }

  try {
    await client.rpush(KV_KEY, JSON.stringify(entry));
  } catch (err) {
    console.error('[superfine] kv write error:', err);
    memoryAdds.push(entry);
  }
}

function sortKey(name: string): string {
  return name.replace(/^the\s+/i, '').toLowerCase();
}

export interface MergedList {
  patrons: ListEntry[];
  alphabetical: ListEntry[];
  totalCount: number;
}

/** Returns the merged, sorted, deduplicated guest list, split by tier. */
export async function getMergedList(): Promise<MergedList> {
  const paid = await getPaidEntries();

  // Patrons appear in their own block at the top. Most-recent first
  // (so the highest-status, most recent commitment is most visible).
  const patrons = paid
    .filter((e) => e.tier === 'patron')
    .sort((a, b) => b.addedAt - a.addedAt);

  // Everyone else (seats, ribbons, curated) goes alphabetical.
  const seen = new Set<string>(CURATED_ENTRIES.map((e) => e.name.toLowerCase()));
  const seenPatrons = new Set<string>(patrons.map((e) => e.name.toLowerCase()));

  const uniquePaid = paid.filter((e) => {
    if (e.tier === 'patron') return false; // already in patrons block
    const key = e.name.toLowerCase();
    if (seen.has(key) || seenPatrons.has(key)) return false;
    seen.add(key);
    return true;
  });

  const alphabetical = [...CURATED_ENTRIES, ...uniquePaid].sort((a, b) =>
    sortKey(a.name).localeCompare(sortKey(b.name))
  );

  return {
    patrons,
    alphabetical,
    totalCount: alphabetical.length + patrons.length,
  };
}

/** Returns just the count of paid additions (curated + paid). */
export async function getCount(): Promise<{ paid: number; total: number }> {
  const paid = await getPaidEntries();
  return {
    paid: paid.length,
    total: CURATED_ENTRIES.length + paid.length,
  };
}

/** Find a name's neighbors in the alphabetical list (for ticket lineage). */
export async function getNeighbors(name: string): Promise<{ before?: string; after?: string; position: number }> {
  const merged = await getMergedList();
  const idx = merged.alphabetical.findIndex(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
  if (idx === -1) return { position: -1 };
  return {
    before: merged.alphabetical[idx - 1]?.name,
    after: merged.alphabetical[idx + 1]?.name,
    position: idx + 1,
  };
}
