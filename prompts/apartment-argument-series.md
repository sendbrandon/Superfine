# [SERIES NAME] — Prompt Template

Working doc for turning the DoorDash argument clip into a repeatable series.
Everything the source clip did right is locked below. A new episode is a
one-line concept run through the ASSEMBLY RULES and dropped into the OUTPUT
FORMAT. The prompt that comes out has three parts that change per episode
(SCENE, THE BEEF, SHOTS). Everything else pastes verbatim.

## How to use this

1. Paste the STYLE LOCK verbatim. Never edit it per episode.
2. Fill CAST from the roster cards. Attach the matching reference images in the same order as the `@Image` tags.
3. Fill EPISODE INPUTS from the concept.
4. Run the concept through the ASSEMBLY RULES.
5. Fill the OUTPUT FORMAT. Attach refs. Generate.

Or hand this file plus a one-line concept to Claude: "Run this through the template and give me the prompt."

Reference syntax: `@Image1`, `@Image2` is Dreamina / Seedance 2.0. Swap for your tool's syntax if you generate elsewhere.

---

## 1. What the source clip actually did

Reverse-engineered from the frames. These are choices the model made that the
original prompt never asked for, and they are most of why the clip works.

- **Format.** 9:16 vertical, 15 seconds, six shots, about two and a half seconds each. Quick cut, not frantic.
- **Camera grammar.** Extreme close-ups played straight into the lens. She points into the camera, he stares into it. The lens is the other person. The viewer is standing inside the argument. One wide profile two-shot in the middle resets the room, then it goes back to faces. Wide-ish lens up close, so the pointing finger distorts big. Shallow depth of field. Slight handheld shake.
- **Edit shape.** ECU her, ECU him, WIDE, MED him, ECU him, ECU her. Prosecutor opens, defendant answers, room, escalation, button.
- **Lighting.** One frosted-glass dome pendant bulb. That is the only light. Warm tungsten top-light, deep falloff, teal-green shadows, muted color, fine grain, slight halation. The single bulb IS the light-bill joke, visualized.
- **Set dressing as evidence.** Peeling teal-grey paint, a filthy enamel double sink, stacks of unopened bills on the counter and the floor, a chip bag and crumbs on the tile. The room testifies against both of them.
- **Wardrobe as character.** Her polka-dot silk neckerchief is the one nice thing in the apartment. His faded canvas work jacket says he thinks he is the practical one. Both are signatures worth locking.
- **Performance.** Dead serious at full volume. Nobody winks. Her face does the comedy (saucer eyes, mouth pops). His does stillness, then teeth.

Audio was not reviewed (frames only). Sound is set as a default in the STYLE LOCK. Adjust if the source clip had music you want to keep.

---

## 2. STYLE LOCK (paste verbatim, every episode)

> Photoreal live-action, 9:16 vertical, 15 seconds, one scene cut into six quick shots. Handheld with slight micro-shake. Extreme close-ups played straight into the lens: each character plays INTO the camera as if the lens is the other person's face, wide-ish lens so pointing hands and faces distort big in the foreground, shallow depth of field. One wide profile two-shot in the middle to reset the room. Lit by a single practical light only, warm tungsten, deep falloff, teal-green shadows, muted color, fine film grain, slight halation on the source. No music, no captions, no titles, room tone and dialogue only. Tone: Rick and Morty meets Larry David meets Patrice O'Neal. Raw, vulgar, cutting comedy played dead serious at full intensity. Nobody winks.

---

## 3. WORLD LOCK (the apartment)

One apartment, several rooms. Rule: **one practical light per room, always.**
That rule is the premise.

| Room | Practical | Dressing |
|---|---|---|
| Kitchen (default) | frosted-glass dome pendant bulb overhead | peeling teal-grey paint over brown plaster, filthy white enamel double sink, stacks of unopened bills on the counter spilling to the floor, chip bag and crumbs on the tile, grimy cream cabinets |
| Living room | one floor lamp, shade missing | sagging couch, milk-crate coffee table, a TV that is just a black rectangle, a nest of extension cords |
| Bathroom | one bare bulb over the mirror | cracked tile, a shower curtain with a bin liner where a panel should be, the one towel |
| Front door | hallway light through the cracked door | chain lock, shut-off notices taped to the inside of the door, an aspirational doormat |

Add rooms as the series needs them. Keep the rule.

---

## 4. ROSTER (character cards)

Fill one card per character. The VISUAL LOCK and WARDROBE LOCK get pasted into
every prompt so the reference image has text backing it up.

```
NAME:
REF: @ImageN
VISUAL LOCK (one line the model can't get wrong):
WARDROBE LOCK (their uniform, same every episode):
HOW THEY FIGHT (physical):
HOW THEY TALK (verbal):
THEIR THING (the flaw the series keeps prosecuting):
```

Two example cards, filled from the source clip. Replace with the attached characters.

**Card A**
- NAME: [fill]
- REF: @Image1
- VISUAL LOCK: late-20s woman, long platinum-blonde center-parted hair, pale pink-flushed skin, pale blue eyes, heavy brow, huge expressive eyes and mouth.
- WARDROBE LOCK: cream silk neckerchief with red polka dots knotted at the throat (never comes off, it is the one nice thing she owns), dark navy crewneck sweatshirt, khaki trousers.
- HOW THEY FIGHT: leans into the lens, finger in your face, eyes go saucer-wide, mouth pops into a silent "ooh" of disbelief between lines.
- HOW THEY TALK: prosecutor. Fast, incredulous, repeats your own words back to you with disgust.
- THEIR THING: outraged on principle, guilty of the same crime.

**Card B**
- NAME: [fill]
- REF: @Image2
- VISUAL LOCK: late-20s man, buzzed strawberry-blond head, ginger mustache and chin scruff, ruddy freckled sun-flushed skin, blue eyes.
- WARDROBE LOCK: faded tan duck-canvas hooded work jacket over a white ribbed tank, baggy light-wash jeans.
- HOW THEY FIGHT: arms crossed, leans on the counter, dead stillness, then a sudden teeth-bared eruption straight into the lens.
- HOW THEY TALK: defendant with a philosophy. Deadpan and slow, then explodes. Explains why the crime was actually the responsible choice.
- THEIR THING: has a four-second economic theory for everything.

---

## 5. EPISODE INPUTS (what changes)

```
CONCEPT (one line):
THE BEEF (the petty thing):
THE STAKES (the survival thing it is set against):
CAST + ROLES: [name] prosecutes / [name] defends / [name] witness (optional)
THE PRINCIPLE each side is defending:
EVIDENCE PROP (a physical object, visible in the wide):
ROOM (kitchen default):
THE BUTTON (last line or last look):
DIALS (see section 7):
```

---

## 6. ASSEMBLY RULES (the filter)

Run every concept through these, in order.

1. **Petty beef, survival stakes.** Every episode sets a small luxury against a basic need. If the concept arrives without stakes, add the bill.
2. **Nobody argues about the thing.** They argue about the principle behind the thing, and the principle becomes a worldview inside four seconds. (Rick and Morty.)
3. **Every insult is a diagnosis.** It is about the other person's habits, history, and body of work in this apartment. If it could be said to a stranger, cut it. (Patrice O'Neal.)
4. **Evidence in frame.** The crime is a physical object, and the wide shot shows it.
5. **Dead serious.** Nobody knows it is funny. No smirks, no winks, no bits.
6. **End on a face.** The last shot is an ECU. The button is a flip (the prosecutor is guilty of the same crime) or a worse crime revealed. (Larry David.) Optional series sting: the light goes out on the last face.
7. **Density.** Four to eight exchanges. Lines under ten words. Interruptions welcome. One line can be one word.
8. **Three or more characters is still a two-hander.** Extras are witnesses in the wide (eating, scrolling, not helping) and get at most one line, usually the button.

---

## 7. DIALS (subtle tweaks, per episode)

| Dial | Options | Default |
|---|---|---|
| Cuts | 5 (slower, meaner) / 6 / 8 (frantic) | 6 |
| Intensity | simmer-to-boil / boil from frame one | boil from frame one |
| Profanity | "vulgar" alone gives the register; "fucking" in the beef line gives more | as the beef line reads |
| Dialogue | improv (give the shape, model writes lines) / scripted (4 to 6 lines in quotes, model performs them) | improv |
| Button owner | prosecutor / defendant / witness | prosecutor |
| Ending | face / flip / light goes out | face |
| Room | see WORLD LOCK | kitchen |

Change one dial per episode at most. The sameness is the show.

---

## 8. OUTPUT FORMAT (the prompt skeleton)

```
[STYLE LOCK, verbatim]

CAST. @Image1 is [NAME]: [visual lock], [wardrobe lock]. @Image2 is [NAME]: [visual lock], [wardrobe lock].

SCENE. The [room] of their broken-down apartment: [dressing]. The only light is [practical].

THE BEEF. [prosecutor] is going at [defendant] about [petty thing] when [stakes]. [Defendant] insists [principle]. [Prosecutor] insists [principle]. [Evidence prop] sits [where].

SHOTS.
1. ECU [prosecutor] direct to lens, [physical action], the opening accusation.
2. ECU [defendant] direct to lens, [physical action], the defense.
3. WIDE profile two-shot under [practical], [blocking], [evidence prop] visible.
4. ECU [defendant], the theory escalates: [the worldview].
5. ECU [prosecutor], the insult that lands: [the diagnosis].
6. ECU [button owner], the button: [flip / worse crime / light out].

DIALOGUE. Rapid, overlapping, interrupting, four to eight short exchanges. Every insult is specific to the other person's habits and history, vulgar and cutting, done with taste, not overdone. No one is aware they're funny.
```

---

## 9. Worked example A: the DoorDash episode, rebuilt

The validated concept, run through the template. Generate this against the
source clip to A/B the format. The one new element is the ending (the bulb
dies). Delete the second half of shot 6 to end on her face like the original.

```
Photoreal live-action, 9:16 vertical, 15 seconds, one scene cut into six quick shots. Handheld with slight micro-shake. Extreme close-ups played straight into the lens: each character plays INTO the camera as if the lens is the other person's face, wide-ish lens so pointing hands and faces distort big in the foreground, shallow depth of field. One wide profile two-shot in the middle to reset the room. Lit by a single practical light only, warm tungsten, deep falloff, teal-green shadows, muted color, fine film grain, slight halation on the source. No music, no captions, no titles, room tone and dialogue only. Tone: Rick and Morty meets Larry David meets Patrice O'Neal. Raw, vulgar, cutting comedy played dead serious at full intensity. Nobody winks.

CAST. @Image1 is [NAME 1]: late-20s woman, long platinum-blonde center-parted hair, pale pink-flushed skin, huge expressive eyes and mouth, cream silk neckerchief with red polka dots knotted at her throat, dark navy sweatshirt, khaki trousers. @Image2 is [NAME 2]: late-20s man, buzzed strawberry-blond head, ginger mustache and chin scruff, ruddy freckled skin, faded tan canvas hooded work jacket over a white ribbed tank, baggy light-wash jeans.

SCENE. The kitchen of their broken-down apartment: peeling teal-grey paint over brown plaster, a filthy white enamel double sink, stacks of unopened bills on the counter spilling onto the floor, an open bag of chips and crumbs on the tile, grimy cream cabinets. The only light is one frosted-glass dome pendant bulb overhead.

THE BEEF. [NAME 1] is going at [NAME 2] about who the fuck orders DoorDash when they can't even afford the light bill. He insists delivery is the fiscally responsible move: it saves gas, time, and the emotional damage of the grocery store. She insists that bulb over their heads is the only thing between them and the dark and he just spent it on a $19 burrito. The DoorDash bag sits on the counter on top of the bills.

SHOTS.
1. ECU [NAME 1] direct to lens, finger jabbing at the camera, the opening accusation.
2. ECU [NAME 2] direct to lens, arms crossed, dead calm, the defense.
3. WIDE profile two-shot under the bulb, her on the left, him leaning on the sink on the right, the bills and the DoorDash bag between them.
4. ECU [NAME 2], the theory escalates and he bares his teeth: the burrito is an investment, the grocery store is a psy-op, the light bill is a subscription nobody agreed to.
5. ECU [NAME 1], eyes saucer-wide, the insult that lands: he has DashPass and no dental.
6. ECU [NAME 1] mid-scream, the bulb overhead dies and the frame drops to black.

DIALOGUE. Rapid, overlapping, interrupting, four to eight short exchanges. Every insult is specific to the other person's habits and history, vulgar and cutting, done with taste, not overdone. No one is aware they're funny.
```

---

## 10. Worked example B: a fresh concept through the filter

Concept in: **"She bought a $40 candle the week the power gets cut."**

Filter: petty beef (candle) against stakes (power shut-off). Roles flip, he
prosecutes. Her principle: it is infrastructure, a light source, cheaper per
hour than the bulb. His principle: a mood does not keep the fridge cold.
Evidence: the candle, lit, on the shut-off notice. Room: kitchen, and the
candle is the practical (the bulb died in example A, continuity). Button: flip,
he sniffs it.

Only SCENE, THE BEEF, and SHOTS change:

```
[STYLE LOCK, verbatim]

[CAST, verbatim from the roster]

SCENE. The same kitchen, but the pendant bulb is dead. The only light is a fat $40 candle burning on the counter, warm flicker from below, everything past arm's reach falls into black.

THE BEEF. [NAME 2] is going at [NAME 1] about spending forty fucking dollars on a candle the week the power gets cut. She insists it isn't a candle, it's infrastructure: a light source, cheaper per hour than the bulb, and it's Tobacco Vanille so it's also a mood. He insists a mood doesn't keep the fridge cold. The candle sits on the counter on top of the shut-off notice.

SHOTS.
1. ECU [NAME 2] direct to lens, lit from below by the flame, holding the receipt up to the camera, the opening accusation.
2. ECU [NAME 1] direct to lens, serene, chin up, the defense: it's infrastructure.
3. WIDE profile two-shot, the candle the only light between them, the shut-off notice under it, the dead bulb hanging dark above.
4. ECU [NAME 1], the theory escalates into a worldview: the grid is a scam, candles are the future, Edison was a landlord.
5. ECU [NAME 2], teeth bared, the insult that lands: she didn't buy a candle, she bought a personality.
6. ECU [NAME 2], mid-rant he takes an involuntary sniff, his eyes close for half a second because it smells incredible, then he's furious again. Cut.

DIALOGUE. [verbatim]
```

---

## 11. Concept bank (untested)

One-liners ready for the filter.

- Someone renewed the Costco membership. They do not have a car.
- A $200 video doorbell on a door that does not lock.
- Who ate the birthday cake. Whose birthday it was is disputed.
- The eviction notice is being used as a coaster.
- One of them has been paying for a gym in another state.
- A budgeting app subscription. Monthly. Premium tier.
- Ring lights. For the podcast. There is no podcast.
