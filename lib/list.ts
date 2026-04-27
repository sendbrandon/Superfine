import { CURATED_NAMES, toSortKey } from "./curated-names";

export type Tier = "seat" | "ribbon" | "patron";
export type SeatMode = "self" | "gift";

export type PaidEntry = {
  id: string;
  name: string;
  sortName: string;
  slug?: string;
  tier: Tier;
  seatMode?: SeatMode;
  seatedBy?: string;
  entryNumber?: number;
  dedication?: string;
  createdAt: string;
  sessionId?: string;
};

export type GuestEntry = {
  id: string;
  name: string;
  sortName: string;
  slug?: string;
  tier: "curated" | Tier;
  source: "curated" | "paid";
  seatMode?: SeatMode;
  seatedBy?: string;
  entryNumber?: number;
  dedication?: string;
  createdAt?: string;
};

type Count = {
  paid: number;
  total: number;
};

type VercelKv = typeof import("@vercel/kv").kv;

const KV_KEY = "superfine:guest-list";
const MEMORY_SYMBOL = Symbol.for("superfine.guest-list.memory");

export function isTier(value: unknown): value is Tier {
  return value === "seat" || value === "ribbon" || value === "patron";
}

export function isSeatMode(value: unknown): value is SeatMode {
  return value === "self" || value === "gift";
}

export function toNameSlug(name: string) {
  return toSortKey(name)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatEntryNumber(entryNumber?: number) {
  if (!entryNumber) {
    return "";
  }

  return `N° ${entryNumber.toString().padStart(6, "0")}`;
}

export async function getPaidEntries(): Promise<PaidEntry[]> {
  const kv = await getKv();
  if (!kv) {
    return memoryStore();
  }

  const entries = await kv.lrange<PaidEntry>(KV_KEY, 0, -1);
  return entries.filter(isPaidEntry);
}

export async function addPaidEntry(input: {
  name: string;
  tier: Tier;
  seatMode?: SeatMode;
  seatedBy?: string;
  dedication?: string;
  sessionId?: string;
}): Promise<PaidEntry> {
  const paidEntries = await getPaidEntries();
  const duplicate = input.sessionId
    ? paidEntries.find((entry) => entry.sessionId === input.sessionId)
    : undefined;

  if (duplicate) {
    return duplicate;
  }

  const entry: PaidEntry = {
    id: input.sessionId || crypto.randomUUID(),
    name: input.name,
    sortName: toSortKey(input.name),
    slug: toNameSlug(input.name),
    tier: input.tier,
    seatMode: input.seatMode || "self",
    seatedBy: input.seatedBy || undefined,
    entryNumber: CURATED_NAMES.length + paidEntries.length + 1,
    dedication: input.dedication || undefined,
    createdAt: new Date().toISOString(),
    sessionId: input.sessionId
  };

  const kv = await getKv();
  if (!kv) {
    memoryStore().push(entry);
    return entry;
  }

  await kv.rpush(KV_KEY, entry);
  return entry;
}

export async function getMergedList(): Promise<GuestEntry[]> {
  const paidEntries = await getPaidEntries();
  const curatedEntries: GuestEntry[] = CURATED_NAMES.map((entry) => ({
    id: `curated:${entry.name}`,
    name: entry.name,
    sortName: toSortKey(entry.name),
    tier: "curated",
    source: "curated"
  }));

  return sortEntries([
    ...curatedEntries,
    ...numberPaidEntries(paidEntries).map((entry) => ({
      ...entry,
      source: "paid" as const
    }))
  ]);
}

export async function getPatrons(): Promise<PaidEntry[]> {
  const paidEntries = await getPaidEntries();
  return numberPaidEntries(paidEntries)
    .filter((entry) => entry.tier === "patron")
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getRecentPaidEntries(limit = 12): Promise<PaidEntry[]> {
  const paidEntries = numberPaidEntries(await getPaidEntries());
  return [...paidEntries]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, limit);
}

export async function getCount(): Promise<Count> {
  const paidEntries = await getPaidEntries();
  return {
    paid: paidEntries.length,
    total: CURATED_NAMES.length + paidEntries.length
  };
}

export async function getNeighbors(name: string): Promise<{
  previous?: GuestEntry;
  current?: GuestEntry;
  next?: GuestEntry;
}> {
  const [mergedList, paidEntries] = await Promise.all([
    getMergedList(),
    getPaidEntries()
  ]);
  const normalizedName = name.trim().toLocaleLowerCase("en-US");
  const exactIndex = mergedList.findIndex(
    (entry) => entry.name.toLocaleLowerCase("en-US") === normalizedName
  );

  if (exactIndex >= 0) {
    return {
      previous: mergedList[exactIndex - 1],
      current: mergedList[exactIndex],
      next: mergedList[exactIndex + 1]
    };
  }

  const inserted: GuestEntry = {
    id: "pending",
    name,
    sortName: toSortKey(name),
    slug: toNameSlug(name),
    tier: "seat",
    source: "paid",
    entryNumber: CURATED_NAMES.length + paidEntries.length + 1
  };
  const withInserted = sortEntries([...mergedList, inserted]);
  const insertedIndex = withInserted.findIndex((entry) => entry.id === "pending");

  return {
    previous: withInserted[insertedIndex - 1],
    current: inserted,
    next: withInserted[insertedIndex + 1]
  };
}

export async function getPaidEntryBySlug(slug: string): Promise<PaidEntry | null> {
  const paidEntries = numberPaidEntries(await getPaidEntries());
  const normalizedSlug = slug.trim().toLocaleLowerCase("en-US");

  return (
    [...paidEntries]
      .reverse()
      .find((entry) => (entry.slug || toNameSlug(entry.name)) === normalizedSlug) ||
    null
  );
}

function sortEntries<T extends { sortName: string; name: string }>(entries: T[]) {
  return [...entries].sort((left, right) => {
    const sortResult = left.sortName.localeCompare(right.sortName, "en", {
      sensitivity: "base"
    });
    if (sortResult !== 0) {
      return sortResult;
    }
    return left.name.localeCompare(right.name, "en", { sensitivity: "base" });
  });
}

function numberPaidEntries(entries: PaidEntry[]) {
  return entries.map((entry, index) => ({
    ...entry,
    slug: entry.slug || toNameSlug(entry.name),
    entryNumber: entry.entryNumber || CURATED_NAMES.length + index + 1
  }));
}

async function getKv(): Promise<VercelKv | null> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }

  const { kv } = await import("@vercel/kv");
  return kv;
}

function memoryStore(): PaidEntry[] {
  const store = globalThis as typeof globalThis & {
    [MEMORY_SYMBOL]?: PaidEntry[];
  };

  store[MEMORY_SYMBOL] ||= [];
  return store[MEMORY_SYMBOL];
}

function isPaidEntry(value: unknown): value is PaidEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<PaidEntry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.name === "string" &&
    typeof entry.sortName === "string" &&
    isTier(entry.tier) &&
    typeof entry.createdAt === "string"
  );
}
