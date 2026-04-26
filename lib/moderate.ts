/**
 * Basic name-input moderation.
 *
 * Open enrollment + $1 entry guarantees someone tries to add a slur,
 * a Nazi reference, an HTML payload, a URL, or hate-speech adjacent
 * content. This filter handles the obvious ~90%; the remaining ~10%
 * gets a manual remove via the (forthcoming) report-and-remove flow.
 *
 * Approach: hard reject if the name contains any of a small list of
 * unambiguous hate terms / slurs. Strip HTML and URLs. Reject if
 * mostly punctuation. Cap length.
 *
 * Deliberately NOT a content-policy committee — this is a one-line
 * gate to keep the most obviously corrupting entries off the public
 * list. Edge cases get triaged by report.
 */

// Unambiguous terms that should never appear in a name.
// Kept short — every false positive costs a real user. Length grows
// with abuse patterns, not preemptively.
const BANNED_TERMS = [
  // racial slurs (n-word + variants)
  'nigger', 'nigga', 'niggr',
  // anti-semitic
  'kike', 'heeb', 'sieg heil',
  // anti-asian
  'chink', 'gook',
  // homophobic
  'faggot', 'fagot',
  // anti-trans
  'tranny',
  // fascist references
  'hitler', 'goebbels', 'himmler', 'mein kampf', 'heil',
  // generic hate signals
  'kkk', '14/88', '1488', 'white power', 'sieg',
];

const URL_REGEX = /https?:\/\/|www\.|\.(com|org|net|io|app|xyz|co)\b/i;
const HTML_REGEX = /<[^>]+>/;
const REPEATED_CHAR_REGEX = /(.)\1{4,}/; // aaaaa, !!!!!, etc.

export interface ModerationResult {
  ok: boolean;
  reason?: string;
}

export function moderateName(input: string): ModerationResult {
  const name = String(input ?? '').normalize('NFKC').trim();

  if (!name) return { ok: false, reason: 'Add a name.' };

  if (name.length < 2) return { ok: false, reason: 'A name needs more than one letter.' };
  if (name.length > 80) return { ok: false, reason: 'Name is too long (80 characters max).' };

  if (HTML_REGEX.test(name)) {
    return { ok: false, reason: 'Just a name — no HTML.' };
  }
  if (URL_REGEX.test(name)) {
    return { ok: false, reason: 'Just a name — no links.' };
  }
  if (REPEATED_CHAR_REGEX.test(name)) {
    return { ok: false, reason: 'That doesn\u2019t look like a real name.' };
  }

  // Letter content check — at least 2 actual alphabetic characters
  const letterCount = (name.match(/[a-zA-Z]/g) ?? []).length;
  if (letterCount < 2) {
    return { ok: false, reason: 'A name needs letters.' };
  }

  // Banned-term check (case- and space-insensitive)
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const term of BANNED_TERMS) {
    const termNormalized = term.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized.includes(termNormalized)) {
      return { ok: false, reason: 'That name was rejected.' };
    }
  }

  return { ok: true };
}
