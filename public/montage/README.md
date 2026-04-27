# Hero Montage Clips

Drop 6–8 short MP4 clips here named `01.mp4` through `08.mp4`. The hero hard-cuts through them every ~520ms behind Anna.

## Sourcing (all CC0, free for commercial use)

- **Pexels** — https://www.pexels.com/videos/ (search: doorman, velvet rope, champagne, taxi, subway)
- **Mixkit** — https://mixkit.co/free-stock-video/ (download → host locally)
- **Coverr** — https://coverr.co (download → host locally)
- **Pixabay** — https://pixabay.com/videos/

## Picking clips

Door imagery beats street imagery. Look for:

1. Doorman gloves opening a door
2. Velvet rope close-up
3. Black town car door slamming
4. Hand stamping a wrist
5. Champagne pour into a flute
6. Taxi meter ticking
7. NYC subway tile / mosaic
8. Marquee bulbs flickering

Vertical motion + tight framing > establishing shots. The viewer sees these for ~½ second each.

## Encoding

Compress hard — these play under heavy filtering at 18% opacity, so quality matters less than file size:

```sh
ffmpeg -i input.mov -t 3 -vf "scale=1280:-2,crop=ih*0.75:ih" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart 01.mp4
```

Target: **<400 KB per clip**, 2–3 sec, no audio, H.264.

## Customizing

Pass your own list to `<HeroMontage clips={[...]} beatMs={520} />` in `app/components/GuestList.tsx`. Beat = milliseconds per cut.
