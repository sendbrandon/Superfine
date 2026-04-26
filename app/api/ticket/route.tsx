import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getNeighbors } from '@/lib/list';

export const runtime = 'edge';

const PAPER = '#F5EDD8';
const INK = '#000000';
const OXBLOOD = '#8B1A2F';

/**
 * Personalized share-card image for someone who's been added to the list.
 * 1080×1920 (Instagram Story). PNG.
 *
 * URL: /api/ticket?name=Frederick%20Douglass[&tier=seat|ribbon|patron]
 *
 * The card includes the user's name, their position in line, and the
 * names directly above and below them — the lineage they're now part of.
 * That positional context is the moment.
 *
 * Note: Satori (the @vercel/og engine) requires display:flex on every
 * div that has more than one child. We set it everywhere defensively.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const name = url.searchParams.get('name')?.trim();
  const tier = (url.searchParams.get('tier') ?? 'seat') as 'seat' | 'ribbon' | 'patron';

  if (!name) {
    return new Response('missing name', { status: 400 });
  }

  const { before, after, position } = await getNeighbors(name);

  const tinosBold = await fetch(
    new URL('./fonts/Tinos-Bold.ttf', import.meta.url)
  ).then((r) => r.arrayBuffer());

  const tinosItalic = await fetch(
    new URL('./fonts/Tinos-Italic.ttf', import.meta.url)
  ).then((r) => r.arrayBuffer());

  const tierLabel =
    tier === 'patron' ? 'PATRON' : tier === 'ribbon' ? 'RIBBON' : 'GUEST';
  const positionStr = position > 0 ? position.toLocaleString() : '—';
  const tierLine = `${tierLabel} · #${positionStr}`;
  const beforeName = before ?? '';
  const afterName = after ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          background: PAPER,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '120px 80px',
          fontFamily: 'Tinos',
        }}
      >
        {/* TOP — wordmark + tagline + tier line */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 90,
              fontWeight: 700,
              letterSpacing: '-2px',
              color: INK,
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            SUPERFINE
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              fontStyle: 'italic',
              color: INK,
              opacity: 0.7,
              marginTop: 16,
            }}
          >
            — the guest list.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontStyle: 'italic',
              color: OXBLOOD,
              marginTop: 32,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            {tierLine}
          </div>
        </div>

        {/* MIDDLE — lineage stack */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            paddingTop: 60,
            paddingBottom: 60,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 38,
              fontStyle: 'italic',
              color: INK,
              opacity: 0.45,
              marginBottom: 24,
              minHeight: 50,
            }}
          >
            {beforeName}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '32px 16px',
              borderTop: `2px solid ${OXBLOOD}`,
              borderBottom: `2px solid ${OXBLOOD}`,
              maxWidth: '92%',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: name.length > 24 ? 76 : 96,
                fontStyle: 'italic',
                fontWeight: 700,
                color: INK,
                lineHeight: 1.05,
                letterSpacing: '-1px',
                textAlign: 'center',
              }}
            >
              {name}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 38,
              fontStyle: 'italic',
              color: INK,
              opacity: 0.45,
              marginTop: 24,
              minHeight: 50,
            }}
          >
            {afterName}
          </div>
        </div>

        {/* BOTTOM — event meta */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 700,
              color: INK,
              letterSpacing: '6px',
              textTransform: 'uppercase',
            }}
          >
            MET GALA · 4 MAY 2026
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontStyle: 'italic',
              color: INK,
              opacity: 0.65,
              marginTop: 14,
              textAlign: 'center',
              maxWidth: '85%',
            }}
          >
            the only invitation list that already includes the dead.
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
      fonts: [
        {
          name: 'Tinos',
          data: tinosBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Tinos',
          data: tinosItalic,
          style: 'italic',
          weight: 400,
        },
      ],
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    }
  );
}
