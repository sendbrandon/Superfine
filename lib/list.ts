/**
 * SUPERFINE · server-side list operations
 *
 * Reads paid additions from Vercel KV and merges with the curated
 * seed list. Without KV env vars set, the action gracefully
 * degrades — paid additions exist only in memory for the lifetime
 * of the serverless invocation (i.e., they vanish on next request).
 * This is intentional: keeps local dev frictionless. Production
 * requires Vercel KV connection (see README).
 */

import { createClient } from '@vercel/kv';
import { CURATED_ENTRIES, type ListEntry } from './curated-names';

const KV_KEY = 'superfine:guest-list';

function hasKvCredentials(): boolean {
  return !!(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
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

export async function addPaidEntry(name: string): Promise<void> {
  const entry: ListEntry = {
    name: name.trim().slice(0, 80),
    addedAt: Date.now(),
    paid: true,
  };

  const client = kvClient();
  if (!client) {
    memoryAdds.push(entry);
    console.log(`[superfine] (no KV env) added: ${entry.name}`);
    return;
  }

  try {
    await client.rpush(KV_KEY, JSON.stringify(entry));
  } catch (err) {
    console.error('[superfine] kv write error:', err);
    memoryAdds.push(entry); // fall back to memory so user isn't lost
  }
}

function sortKey(name: string): string {
  return name.replace(/^the\s+/i, '').toLowerCase();
}

/** Returns the merged, sorted, deduplicated guest list. */
export async function getMergedList(): Promise<ListEntry[]> {
  const paid = await getPaidEntries();
  const seen = new Set<string>(CURATED_ENTRIES.map((e) => e.name.toLowerCase()));
  const uniquePaid = paid.filter((e) => {
    const key = e.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return [...CURATED_ENTRIES, ...uniquePaid].sort((a, b) =>
    sortKey(a.name).localeCompare(sortKey(b.name))
  );
}
