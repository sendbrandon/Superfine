import { CURATED_NAMES, toSortKey } from "./curated-names";

export type Tier = "seat" | "ribbon" | "patron";

export type PaidEntry = {
  id: string;
  name: string;
  sortName: string;
  tier: Tier;
  dedication?: string;
  createdAt: string;
  sessionId?: string;
};

export type GuestEntry = {
  id: string;
  name: string;
  sortName: string;
  tier: "curated" | Tier;
  source: "curated" | "paid";
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
    tier: input.tier,
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
    ...paidEntries.map((entry) => ({
      ...entry,
      source: "paid" as const
    }))
  ]);
}

export async function getPatrons(): Promise<PaidEntry[]> {
  const paidEntries = await getPaidEntries();
  return paidEntries
    .filter((entry) => entry.tier === "patron")
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
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
  const mergedList = await getMergedList();
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
    tier: "seat",
    source: "paid"
  };
  const withInserted = sortEntries([...mergedList, inserted]);
  const insertedIndex = withInserted.findIndex((entry) => entry.id === "pending");

  return {
    previous: withInserted[insertedIndex - 1],
    current: inserted,
    next: withInserted[insertedIndex + 1]
  };
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
