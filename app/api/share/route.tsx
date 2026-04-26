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

const tinosBold = fetch(new URL("../ticket/fonts/Tinos-Bold.ttf", import.meta.url)).then(
  (response) => response.arrayBuffer()
);
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5EDD8",
          color: "#000000",
          display: "flex",
          flexDirection: "column",
          padding: "62px 72px",
          fontFamily: "Tinos",
          border: "16px solid #FF6B00"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 5
          }}
        >
          <span>SUPERFINE</span>
          <span>DROP 002</span>
          <span>MET GALA 2026</span>
        </div>

        {displayName ? (
          <div
            style={{
              display: "flex",
              flex: 1,
              gap: 54,
              alignItems: "center"
            }}
          >
            <div
              style={{
                width: 8,
                height: 390,
                background: "#FF6B00"
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 24
              }}
            >
              <span style={{ fontSize: 34, fontStyle: "italic" }}>{previous}</span>
              <span
                style={{
                  color: "#FF6B00",
                  fontSize: 92,
                  lineHeight: 0.88,
                  fontWeight: 700,
                  textTransform: "uppercase"
                }}
              >
                {displayName}
              </span>
              <span style={{ fontSize: 34, fontStyle: "italic" }}>{next}</span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <span
              style={{
                color: "#FF6B00",
                fontSize: 142,
                lineHeight: 0.78,
                fontWeight: 700,
                textTransform: "uppercase"
              }}
            >
              THE GUEST LIST
            </span>
            <span
              style={{
                marginTop: 36,
                width: 920,
                fontSize: 43,
                fontStyle: "italic",
                lineHeight: 0.98
              }}
            >
              The only invitation list more exclusive than the one Anna keeps —
              this one already includes the dead.
            </span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #000000",
            paddingTop: 24,
            fontSize: 25,
            fontWeight: 700,
            letterSpacing: 5
          }}
        >
          <span>
            {displayName
              ? entryNumber
                ? `${entryNumber} — ${TIER_LABEL[tier]}`
                : TIER_LABEL[tier]
              : "ADD YOURSELF, $1"}
          </span>
          <span>{count.total.toLocaleString("en-US")} NAMES</span>
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
