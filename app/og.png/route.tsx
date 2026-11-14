import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/site.config";

/**
 * Obrazek podglądu linku (Messenger, Discord, X, WhatsApp...).
 *
 * Route handler zamiast konwencji `opengraph-image.tsx`: przy eksporcie
 * statycznym tamta zapisywała plik BEZ rozszerzenia, GitHub Pages podawał go
 * jako application/octet-stream i komunikatory nie pokazywały miniatury.
 * Ten plik eksportuje się jako `og.png` i idzie jako image/png.
 * Adres w metadanych ustawia app/layout.tsx.
 */
export const dynamic = "force-static";

const ROZMIAR = { width: 1200, height: 630 };

export async function GET() {
  // prawdziwy logotyp kanału (baner z Twitcha, 1201×480)
  const logo = await readFile(join(process.cwd(), "public", site.assety.logoBaner), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: site.kolory.pow0,
          backgroundImage:
            "radial-gradient(ellipse at 50% 115%, rgba(225,6,0,0.6), transparent 62%), radial-gradient(ellipse at 0% 0%, rgba(225,6,0,0.25), transparent 55%)",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: "2px solid rgba(225,6,0,0.5)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 12,
            color: "#FF3B30",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          streamer · twitch · kick
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renderuje tylko <img> */}
        <img
          src={`data:image/png;base64,${logo}`}
          width={840}
          height={336}
          style={{ marginTop: 6 }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            marginTop: 4,
            fontSize: 34,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            background: "#E10600",
            color: "#fff",
            padding: "14px 36px",
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          twitch.tv/hukszy
        </div>
      </div>
    ),
    ROZMIAR,
  );
}
