import { ImageResponse } from "@vercel/og";
import {
  formatEntryNumber,
  getCount,
  getNeighbors,
  isTier,
  type Tier
} from "@/lib/list";
import { normalizeSubmittedName } from "@/lib/moderate";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const tinosBold = fetch(
  new URL("../ticket/fonts/Tinos-Bold.ttf", import.meta.url)
).then((response) => response.arrayBuffer());
const tinosItalic = fetch(
  new URL("../ticket/fonts/Tinos-Italic.ttf", import.meta.url)
).then((response) => response.arrayBuffer());

const TIER_LABEL: Record<Tier, string> = {
  seat: "TAKE A SEAT",
  ribbon: "THE RIBBON",
  patron: "PATRON"
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = normalizeSubmittedName(url.searchParams.get("name") || "");
  const tierValue = url.searchParams.get("tier") || "seat";
  const tier: Tier = isTier(tierValue) ? tierValue : "seat";
  const count = await getCount();
  const neighbors = name ? await getNeighbors(name) : null;

  const displayName = neighbors?.current?.name || name;
  const previous = neighbors?.previous?.name || "FREDERICK DOUGLASS";
  const next = neighbors?.next?.name || "LEWIS HAMILTON";
  const entryNumber = formatEntryNumber(neighbors?.current?.entryNumber);
  const footerLabel = displayName
    ? entryNumber
      ? `${entryNumber} — ${TIER_LABEL[tier]}`
      : TIER_LABEL[tier]
    : "ADD YOURSELF, $1";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
          color: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Tinos"
        }}
      >
        <div
          style={{
            width: 306,
            height: 544,
            background: "#FFFFFF",
            border: "12px solid #FF6B00",
            display: "flex",
            flexDirection: "column",
            padding: 28
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2.4
            }}
          >
            <span>SUPERFINE</span>
            <span>DROP 002</span>
          </div>

          <div
            style={{
              marginTop: 74,
              fontSize: 18,
              fontStyle: "italic"
            }}
          >
            THE GUEST LIST
          </div>
          <div
            style={{
              marginTop: 12,
              width: "100%",
              height: 1,
              background: "#000000"
            }}
          />

          {displayName ? (
            <div
              style={{
                marginTop: 58,
                display: "flex",
                flexDirection: "column",
                gap: 14
              }}
            >
              <span style={{ fontSize: 16, fontStyle: "italic" }}>
                {previous}
              </span>
              <span
                style={{
                  color: "#FF6B00",
                  fontSize: 34,
                  lineHeight: 0.9,
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}
              >
                {displayName}
              </span>
              <span style={{ fontSize: 16, fontStyle: "italic" }}>{next}</span>
            </div>
          ) : (
            <div
              style={{
                marginTop: 58,
                display: "flex",
                flexDirection: "column",
                gap: 14
              }}
            >
              <span
                style={{
                  color: "#FF6B00",
                  fontSize: 44,
                  lineHeight: 0.82,
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}
              >
                THE GUEST LIST
              </span>
              <span
                style={{
                  fontSize: 16,
                  lineHeight: 1,
                  fontStyle: "italic"
                }}
              >
                The only invitation list more exclusive than the one Anna keeps.
              </span>
            </div>
          )}

          <div style={{ flex: 1 }} />
          <div
            style={{
              borderTop: "1px solid #000000",
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2.4
            }}
          >
            <span>{footerLabel}</span>
            <span>{count.total.toLocaleString("en-US")} NAMES</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 74,
            top: 62,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 7
          }}
        >
          SUPERFINE
        </div>
        <div
          style={{
            position: "absolute",
            right: 74,
            bottom: 58,
            width: 382,
            fontSize: 34,
            lineHeight: 0.95,
            textAlign: "right",
            fontStyle: "italic"
          }}
        >
          The only invitation list more exclusive than the one Anna keeps.
        </div>
        <div
          style={{
            position: "absolute",
            left: 74,
            bottom: 60,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: 5
          }}
        >
          <span>DROP 002</span>
          <span>MET GALA 2026</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Tinos",
          data: await tinosBold,
          weight: 700,
          style: "normal"
        },
        {
          name: "Tinos",
          data: await tinosItalic,
          weight: 400,
          style: "italic"
        }
      ]
    }
  );
}
