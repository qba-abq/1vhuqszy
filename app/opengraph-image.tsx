import { ImageResponse } from "next/og";
import { site } from "@/site.config";

// Wymagane przy output: "export" — obrazek generuje się raz, podczas builda.
export const dynamic = "force-static";

export const alt = site.seo.tytul;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Obrazek podglądu linku generowany automatycznie.
 * Chcesz własną grafikę? Wrzuć /public/assets/og/og.jpg i skasuj ten plik —
 * wtedy Next weźmie obrazek wskazany w metadanych.
 */
export default function OG() {
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
            "radial-gradient(ellipse at 50% 120%, rgba(225,6,0,0.55), transparent 60%), radial-gradient(ellipse at 0% 0%, rgba(225,6,0,0.22), transparent 55%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            border: "2px solid rgba(225,6,0,0.55)",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 14,
            color: "#E10600",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          streamer · {site.handle}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 190,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: 4,
            lineHeight: 1,
            marginTop: 12,
          }}
        >
          {site.nick}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 30,
            color: "rgba(255,255,255,0.62)",
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            background: "#E10600",
            color: "#fff",
            padding: "14px 34px",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          twitch.tv/hukszy
        </div>
      </div>
    ),
    size,
  );
}
