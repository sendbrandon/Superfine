type ModerationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: string;
    };

const BANNED_TERMS = [
  "nigger",
  "nigga",
  "coon",
  "kike",
  "spic",
  "chink",
  "faggot",
  "tranny",
  "retard",
  "hitler",
  "nazi"
];

const URL_PATTERN =
  /(https?:\/\/|www\.|\.com\b|\.net\b|\.org\b|\.io\b|\.gg\b|\.co\b)/i;
const HTML_PATTERN = /(<[^>]*>|&lt;|&gt;|script|onerror|onload)/i;
const REPEATED_CHARACTER_PATTERN = /([\p{L}\p{N}])\1{5,}/iu;
const NAME_CHARACTER_PATTERN = /^[\p{L}\p{M}\p{N}\s.'’,&-]+$/u;

export function normalizeSubmittedName(value: string) {
  return value
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

export function moderateName(name: string): ModerationResult {
  const normalized = normalizeSubmittedName(name);
  const searchable = normalized.toLocaleLowerCase("en-US");
  const lettersAndNumbers = normalized.replace(/[^\p{L}\p{N}]/gu, "");

  if (lettersAndNumbers.length < 2) {
    return { ok: false, reason: "NAME NEEDS TWO LETTERS." };
  }

  if (normalized.length > 80) {
    return { ok: false, reason: "NAME TOO LONG." };
  }

  if (URL_PATTERN.test(normalized) || HTML_PATTERN.test(normalized)) {
    return { ok: false, reason: "NO LINKS. NO HTML." };
  }

  if (REPEATED_CHARACTER_PATTERN.test(normalized)) {
    return { ok: false, reason: "NO SPAM." };
  }

  if (!NAME_CHARACTER_PATTERN.test(normalized)) {
    return { ok: false, reason: "NAME ONLY." };
  }

  if (BANNED_TERMS.some((term) => searchable.includes(term))) {
    return { ok: false, reason: "NAME REJECTED." };
  }

  return { ok: true };
}
