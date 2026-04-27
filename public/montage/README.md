# Hero Montage Clips

8 short MP4s (`01.mp4`–`08.mp4`) hard-cut at ~1.6s intervals behind Anna.

## Current source

Public-domain archival footage from the Internet Archive, on theme with **Black Dandyism / Met Gala 2026: Superfine**:

- `01–04.mp4` — **Hi-De-Ho** (1947), Cab Calloway musical — `https://archive.org/details/hi_de_ho`
- `05–08.mp4` — **Harlem Is Heaven** (1932), Bill Robinson Harlem nightclub — `https://archive.org/details/harlem-is-heaven-1932`

Both films are public domain. Clips are 2.6s, scaled to 1280×720, H.264 baseline, no audio, faststart, ~150–250KB each.

## Re-clipping

```sh
ffmpeg -y -ss 00:08:30 -t 2.6 \
  -i "https://archive.org/download/hi_de_ho/Hi-De-Ho_512kb.mp4" \
  -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24" \
  -c:v libx264 -crf 30 -preset fast -profile:v baseline -level 3.1 -pix_fmt yuv420p \
  -an -movflags +faststart 01.mp4
```

Adjust `-ss` to find better moments. Aim for: well-dressed faces in close-up, dance hall moments, hands tying ties, mirror shots, doormen / coat-checks.

## Other on-theme PD sources

- **Miracle in Harlem** (1948) — `archive.org/details/miracle-in-harlem-1948`
- **Cab Calloway shorts** — `archive.org/search?query=Cab+Calloway+AND+mediatype:movies`
- **Prelinger NYC** — `archive.org/details/prelinger` (filter for "Harlem", "fashion", "1940s")

## Customizing in code

Pass your own list to `<HeroMontage clips={[...]} beatMs={1600} />` in `app/components/GuestList.tsx`.
