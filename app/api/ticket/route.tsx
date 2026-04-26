import { ImageResponse } from "@vercel/og";
import { formatEntryNumber, getNeighbors, isTier, type Tier } from "@/lib/list";
import { normalizeSubmittedName } from "@/lib/moderate";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const tinosBold = fetch(new URL("./fonts/Tinos-Bold.ttf", import.meta.url)).then(
  (response) => response.arrayBuffer()
);
const tinosItalic = fetch(
  new URL("./fonts/Tinos-Italic.ttf", import.meta.url)
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
  const neighbors = await getNeighbors(name);

  const displayName = neighbors.current?.name || name || "UNNAMED";
  const previous = neighbors.previous?.name || "FREDERICK DOUGLASS";
  const next = neighbors.next?.name || "LEWIS HAMILTON";
  const entryNumber = formatEntryNumber(neighbors.current?.entryNumber);

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
          padding: "88px",
          fontFamily: "Tinos",
          border: "20px solid #FF6B00"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 8
          }}
        >
          <span>SUPERFINE</span>
          <span>DROP 002</span>
        </div>
        <div
          style={{
            marginTop: 170,
            fontSize: 62,
            fontStyle: "italic"
          }}
        >
          THE GUEST LIST
        </div>
        <div
          style={{
            marginTop: 26,
            height: 2,
            background: "#000000",
            width: "100%"
          }}
        />
        <div
          style={{
            marginTop: 135,
            display: "flex",
            flexDirection: "column",
            gap: 38
          }}
        >
          <span style={{ fontSize: 46, fontStyle: "italic" }}>{previous}</span>
          <span
            style={{
              color: "#FF6B00",
              fontSize: 112,
              lineHeight: 0.95,
              fontWeight: 700,
              textTransform: "uppercase"
            }}
          >
            {displayName}
          </span>
          <span style={{ fontSize: 46, fontStyle: "italic" }}>{next}</span>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            borderTop: "2px solid #000000",
            paddingTop: 38,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontWeight: 700,
            letterSpacing: 7,
            fontSize: 32
          }}
        >
          <span>{entryNumber || TIER_LABEL[tier]}</span>
          <span>MET GALA 2026</span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
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
