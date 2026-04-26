# SUPERFINE — Vibe Brief

This is the aesthetic + decision-making prior. **Read this BEFORE writing any code.** Every commit, every component, every prop default should pass the principles below.

## The mental model

We are operating in the MSCHF / Kanye lineage:

- **MSCHF** drops cultural artifacts on a 1–2 week cycle. They have conviction + speed + audacity. They DON'T market-test. They ship.
- **Kanye-restraint principle**: ONE color + ONE typeface + brutal rigor. Removal-as-luxury, not accumulation-as-quality. Sunday Service merch, Donda, Jesus Is King — strip until the artifact can't be stripped further.
- **Cultural-parallax**: when sourcing visual references, name them hyperspecifically. Not "luxury orange" but "Pantone 1655 C, the Hermès saddlery box color, 1942–present." Not "tailored serif" but "Times New Roman, Stanley Morison's 1932 cut for The Times of London." Specificity is the antidote to genericness.

## The aesthetic principles (locked)

### One typeface, three styles

**Times New Roman.** That's it. No pairing. No display face. No sans substitute. Variants:

- **All caps** — the wordmark, eyebrows, button labels
- **Italic** — body copy, names in the list, kicker, fineprint, lede
- **Roman** — technical chrome, prices, counters

For dynamic OG image rendering at the Edge runtime, we bundle **Tinos** (Times-metric Apache-licensed clone) locally because `@vercel/og` can't access system fonts.

### One color + cream + black

| Role | Hex | Notes |
|------|-----|-------|
| Ground | `#F5EDD8` | Ivory parchment, Sunday Service merch beige |
| Ink | `#000000` | Pure black for type and borders |
| Accent | `#8B1A2F` | Oxblood — currently. May shift to Hermès Orange `#FF6B00` if we ship the new logo |

That's it. No teals, no golds, no grays beyond `rgba(0,0,0,0.X)`. A new color enters only with deliberate cultural argument.

### Brutal rigor

- **No drop shadows** on chrome
- **No gradients** anywhere except subtle texture overlays (saddle-leather grain in the logo, nothing else)
- **No rounded corners**. Everything is hard 90°
- **Hairline borders** (1px) or thicker (2px) ink. Nothing in between.
- **No animations beyond subtle fade-in for the highlight flash**. The site is still. Stillness is luxury.

### Generous negative space

The page is mostly empty. The list breathes. The header has 72px of margin. The wordmark fills 70%+ of viewport width. Don't fight the empty space. **The empty space IS part of the artifact.**

## Copy voice

- **Italic Times for sentences. Times caps for labels. Times caps smaller-tracked-tighter for technical chrome.**
- Em dashes ` — ` between phrases, not commas. Em dashes are the vibe.
- Single-sentence paragraphs are okay. Often correct.
- Periods land hard. Don't over-qualify.
- The brand voice is **somewhere between Old Testament and a Stax Records record sleeve.** Reverent + sweaty + diasporic. Not marketing-speak. Not startup-speak. Not designer-friendly.
- **Specific, not vague**. "the widow's mite" — not "small donation." "the Power Plant, Chicago, 1983" — not "vintage vibes." Specificity is the artifact.

## Anti-patterns — never do these

- ❌ **Tailwind.** Plain CSS only. Tailwind class soup hides intent. The CSS file should READ like a design specification. If you find yourself reaching for utility classes, write a semantic class instead.
- ❌ **UI component libraries** (shadcn, Radix, MUI, Chakra). All chrome should be hand-built. The artifact is custom and the custom-ness shows.
- ❌ **Pairing typefaces.** It's Times. Period.
- ❌ **Adding a third or fourth color.** The accent palette is locked. New color = new artifact.
- ❌ **Animation that announces itself.** Spinning, bouncing, parallax, "delight" microinteractions. We are post-Apple-microinteraction. Stillness instead.
- ❌ **Shadows on chrome.** A drop shadow on a button is 2014 Material Design. We are pre-CSS3.
- ❌ **Corner-radius > 0.** Hard edges only. Even 2px rounded reads as slightly-too-friendly.
- ❌ **Decorative serifs** — Bodoni, Didot, didone families with high thick/thin contrast. The Recraft AI loves to generate these for "elegant" wordmarks. Reject every time.
- ❌ **Sans-serif fonts.** Inter, Geist, Helvetica, Akzidenz — all wrong. Times only.
- ❌ **Soft language.** "Try," "perhaps," "consider," "maybe." Hard periods. Hard claims. The artifact has conviction.
- ❌ **Apologizing for transgression.** The donation question was asked and answered: NO. Don't add disclaimers. Don't add "in honor of." Don't add donation buttons. The artifact is raw.

## Decisions to push back on, even if requested

If asked to add any of these, push back with the principle:

- "Add a hero image" — no, the type is the hero
- "Add a sign-up newsletter form" — only if it serves the artifact AS the artifact
- "Soften the copy so it doesn't offend" — the offense IS the artifact
- "Use Tailwind for speed" — speed lies; rigor reads
- "Add a logo with a swoosh / star / sun ray" — no decoration; type + one symbol max
- "Add testimonials" — the dead are the testimonials
- "Add an animated background" — stillness is the brand
- "Add a 'how it works' section" — explanations dilute the artifact; if it needs explaining, the cultural argument is weak

## Test for any decision

Before merging any commit, ask the four MSCHF questions:

1. **The 3-second test** — Can a stranger describe this in 3 seconds and feel something? If they have to read for 30 seconds, kill it.
2. **The screenshot test** — Would a stranger screenshot any frame of this and post it? If not, it's not done.
3. **The Kanye removal test** — Can we remove anything else? Until removing the next thing breaks the artifact, keep removing.
4. **The transgression test** — What line does this cross? If it crosses no line, we made a brand asset, not an artifact.

## When to break these rules

Almost never. The list of rules above is the result of 2,000+ deliberate decisions across the project. Breaking one should be a deliberate cultural argument, not a convenience. **If you're not sure, the rule wins.**
