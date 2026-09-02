# Ledger — taste, findings, rotation

The base we write from. Read this before writing anything new. Update it
after every generation.

Files: `series-bible.md` (show, cast, episodes, scene prompts, method),
`asset-prompts.md` (image refs), `eyecandy-vocabulary.md` (techniques as
physics). This file is the memory across all three.

---

## 1. Taste (what we write toward)

- **The crew reacts to the etiquette, never the event.** Bigfoot, an octopus, a riot: the rule is the joke. Nobody says the word for the impossible thing.
- **One impossible thing inside a place you can name in one second.** Austin Powers, Men in Black. Heightened, never off the wall. If it needs explaining, it's too far.
- **Dead serious, full intensity, nobody winks.**
- **Petty principle, survival stakes underneath.**
- **The verdict lands on the wrong person.**
- **Vulgar with taste.** Every insult is a diagnosis of the other person. If it could be said to a stranger, cut it.
- **One light source per scene.** The light is the story. It changes when the location changes.
- **Faces into the lens, quick cuts, one wide to reset, end on a face.** The face at the end is the cut point.
- **One big dynamic element per scene.** Something cinematic happens to the room. The crew doesn't move for it.
- **Numbers, not adjectives.** Before-state, action, after-state, then chain the next beat from the after-state. Say what does not move.
- **No text in frame. No brand logos in image refs.**
- **The prompt is one paragraph in the director's voice.** Situation first, effect and camera as physics, argument, button, tone tail last, verbatim.

## 2. Findings (what generation has taught us)

- Direct-to-lens came from the model on the first clip, unprompted. It's the signature. Keep it.
- "Bigfoot" in an image prompt pulls costume and mascot. Describe the animal: primate anatomy, "hair not fur," skin showing through on face, palms, chest. Flat seamless light reads as fabric; editorial or in-world light with a stated film stock reads as a photograph.
- Brand names in image prompts produce garbage lettering. Write "label illegible."
- Reference order matters. Same four refs, same order, every time. Every video prompt ships with a numbered attach list.
- 30 seconds is available. A crash plus a button needs 30. One argument fits 15.
- The tone tail works verbatim. Keep it at the end so the model reads the situation before the style.
- A technique name alone does nothing for the model. Name it for us, then write the physics.
- (open) Which scenes have been generated, what drifted, what held. Fill in after each run.

## 3. Rotation ledger

Every prompt written. Status: untested / generated / kept / killed.

| ID | Concept | Cast | Location | Light | Techniques | Button | Ending | Status |
|---|---|---|---|---|---|---|---|---|
| E1.1 | DoorDash vs light bill | DOT, CANVAS | kitchen | pendant bulb | house | DOT | face | kept (the source clip) |
| E1.2 | The dark, DAGGER knew | all four | kitchen | phone screens | house | DOT | mouth open | untested |
| E1.3 | The plan, shared grid | all four | living room | streetlight | house | DAGGER | holding cord | untested |
| E1.4 | The cord, three feet short | all four | fire escape | hallway fluorescent | house | FLEECE | calm cracks | untested |
| E1.5 | The bodega, saint candles | all four + owner | bodega | cooler glow | house | DAGGER | scratch-off | untested |
| E1.6 | The verdict, second bag | all four + driver | kitchen | saint candles | house | DOT | cut to black | untested |
| E2.1 | The lava lamp | all four | living room | lava lamp | house | DAGGER | orange blobs on face | untested |
| E2.2 | The fridge | all four | kitchen | open fridge | house | CANVAS | door shut, black | untested |
| E2.3 | The owner, two cords | all four + owner | fire escape | grey daylight | house | owner | doing the math | untested |
| E2.4 | The rate | all four + owner | laundromat | fluorescent, dryer glow | house | owner | palm up | untested |
| E2.5 | The contract, whose outlet | all four | kitchen | clamp work light | house | FLEECE | calm doesn't return | untested |
| E2.6 | The verdict, a deal is a deal | all four | kitchen | work light dimming | house | CANVAS | wallet | untested |
| A1 | Bigfoot, the walk | all four + Bigfoot | theater | projector | Fourth Wall, Silhouette | DAGGER | content | untested |
| A2 | Bigfoot, the chicken | DOT, CANVAS + Bigfoot | theater | EXIT sign | house | DOT | mouth open | untested |
| A3 | Bigfoot, the phone | DOT, CANVAS + Bigfoot | theater | phone glow | house | DOT | on the phone | untested |
| A4 | Bigfoot, the ticket | all four + Bigfoot + usher | theater | flashlight | house | CANVAS | looking back | untested |
| A5 | Bigfoot, the Corvette (30s) | all four + Bigfoot | theater | projector, then headlights | Crash, Pass Through | DAGGER | "He offered" | untested |
| A6 | Generator with seats (30s) | all four + Bigfoot + usher | theater | headlights, then flashlight | Pass Through | usher | "Alright" | untested |
| B1 | The octopus (15s) | DOT, CANVAS | subway | subway fluorescent | Crash Zoom, Transformation, Split Diopter, Speed Ramp, Whip Pan | CANVAS | tentacle on the seat | untested |
| B2 | The DMV (30s) | DOT, CANVAS | DMV | DMV fluorescent | Crash Cut, Whip Pan, Crash Zoom, Bullet Time, Cut-In | DOT | pulls a new number | untested |

### Rotation notes

- **Button count:** DOT 6, DAGGER 5, CANVAS 4, FLEECE 2, guests 3. FLEECE is under-served. The next two buttons go to FLEECE.
- **Retire "mouth open, nothing comes out."** Used twice (E1.2, A2). Find a new DOT stillness.
- **Endings in black:** E1.6, E2.2. Don't use a third in a row.
- **Big elements used:** car through a screen, bullet-time riot, octopus transformation. Next one should not be a vehicle or a creature. Candidates: weather indoors, scale (something huge or tiny), time (a jump cut that skips a year).
- **Light sources used:** pendant bulb, phone screens, streetlight, hallway fluorescent, cooler glow, saint candles, lava lamp, open fridge, grey daylight, laundromat, clamp work light, projector, EXIT sign, phone glow, flashlight, headlights, subway fluorescent, DMV fluorescent. Unused and good: a welding arc, a TV, a police light through a window, a match, a neon sign with no letters.
- **Locations used:** kitchen (7), living room (2), fire escape (2), bodega, laundromat, theater (6), subway, DMV. Unused from the bible: bathroom, landlord's office, the bus.
- **Techniques used:** Crash Zoom (2), Whip Pan (2), Transformation, Split Diopter, Speed Ramp, Bullet Time, Crash Cut, Cut-In, Pass Through. Picks not yet used: Dolly Zoom, Snorricam, Object POV, Freeze Frame, Dutch Angle, Worms-Eye, Match Cut, Scale Shift, Duplication.

## 4. Where each prompt lives

- E1.x: `series-bible.md` section 7
- E2.x: `series-bible.md` section 8
- A1 to A6: `series-bible.md` Appendix A
- B1, B2: `series-bible.md` Appendix B
- Image refs: `asset-prompts.md`
- Method: `series-bible.md` Appendix B, rules 1 to 9
- Techniques: `eyecandy-vocabulary.md`

## 5. Concept bank (pitched, not written)

Five pitched after B2. Rotation applied: no vehicle, no creature, FLEECE
buttons, unused techniques and lights.

- **C1. THE FLOOD.** Kitchen fills with water to the ceiling from the fridge line over 20 seconds while they argue about who left it. They keep arguing underwater. Clamp work light glowing and sparking under the surface is the one light. Underwater, Slow Motion, Fourth Wall. Button FLEECE: "It's not a flood. It's a pool."
- **C2. THE ELEVATOR.** Riding up to the landlord's floor, the elevator shrinks 10 percent per floor until four bodies are pressed into one cubic meter. Doors open on a normal-sized hallway. One fluorescent panel. Scale Shift, Dutch Angle escalating per floor. Argument: elevator etiquette, face the doors, no talking. Button CANVAS, compressed, mid-eruption, cut off by the doors.
- **C3. THE HALLWAY.** Walking to the landlord's door, the building hallway rotates 90 degrees over 6 seconds; they end up walking on the wall with the doors as hatches above them. The landlord opens his door from above and looks down at them like a manhole. First landlord appearance. Hallway fluorescent, now vertical. Camera Roll, Locked-On, Worms-Eye. Argument: which side of the hallway you walk on. Button: the landlord.
- **C4. THE WAIT.** Landlord's waiting room, four chairs, a window. Every cut skips a season: hair grows, the window goes summer to snow, the plant dies, DAGGER's mustache becomes a beard, they never stand up, same $40 argument. The window's changing daylight is the one light. Jump Cut, Match Cut, Fixed Cam. Button FLEECE, old, white curls: "He said five minutes."
- **C5. THE SUBLET.** FLEECE's plan to cover the rate is a subletter. She arrives and she is DOT, identical, same neckerchief. Then another. By the end five DOTs are prosecuting one CANVAS and he has to say which one is real. Kitchen, clamp work light. Duplication, Snorricam on CANVAS walking the line of DOTs. Button: CANVAS picks the wrong one; ends on the real DOT's face.

## 6. Open

- Names for the four. Handles are placeholders.
- Which Bigfoot image version held up (studio vs in-world).
- First generation results for anything past E1.1.
