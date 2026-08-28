"use client";

import { site } from "@/site.config";

/**
 * Plakietka LIVE / OFFLINE.
 *
 * Teraz czyta mocka z site.config.ts (`live`).
 * Podpięcie prawdziwego Twitcha: zrób route `app/api/live/route.ts`, które
 * odpyta Helix `GET /streams?user_login=hukszy` z tokenem aplikacji,
 * i podmień poniższe `site.live` na dane z `useSWR("/api/live")`.
 * Reszta komponentu (i wygląd) zostaje bez zmian.
 */
export default function StatusLive({ klasa = "" }: { klasa?: string }) {
  const { czyLive, tytulStreamu, gra } = site.live;

  return (
    <div
      className={`inline-flex items-center gap-3 border px-4 py-2 ${
        czyLive
          ? "border-huk-red/60 bg-huk-red/10 shadow-neon"
          : "border-white/15 bg-white/[0.03]"
      } ${klasa}`}
      style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {czyLive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-huk-red opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            czyLive ? "bg-huk-red" : "bg-white/30"
          }`}
        />
      </span>

      <span className={`podtytul ${czyLive ? "text-huk-white" : "text-white/60"}`}>
        {czyLive ? "live teraz" : "offline"}
      </span>

      {czyLive && (
        <span className="hidden max-w-[38ch] truncate border-l border-white/15 pl-3 text-xs text-white/60 sm:inline">
          {gra} — {tytulStreamu}
        </span>
      )}
    </div>
  );
}
