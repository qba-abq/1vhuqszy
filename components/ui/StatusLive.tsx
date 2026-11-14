"use client";

import { site } from "@/site.config";
import { useStatusLive } from "@/lib/useStatusLive";

const SKOS = "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

/**
 * Plakietka LIVE / OFFLINE z prawdziwym stanem kanału na Twitchu
 * (lib/useStatusLive.ts). Gdy jest live, cała plakietka prowadzi do streama.
 */
export default function StatusLive({ klasa = "" }: { klasa?: string }) {
  const status = useStatusLive();
  const czyLive = status.stan === "live";

  const tresc = (
    <>
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {czyLive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-huk-live opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            czyLive ? "bg-huk-live shadow-[0_0_8px_var(--live)]" : status.stan === "sprawdzam" ? "animate-pulse bg-white/20" : "bg-white/30"
          }`}
        />
      </span>

      <span className={`podtytul ${czyLive ? "text-huk-live" : "text-huk-t2"}`}>
        {czyLive ? "live teraz" : status.stan === "sprawdzam" ? "sprawdzam…" : "offline"}
      </span>

      {status.stan === "live" && (
        <span className="max-w-[16ch] truncate border-l border-huk-linia2 pl-3 text-xs text-huk-t2 sm:max-w-[42ch]">
          {status.gra}
          <span className="text-huk-t3"> · od {status.od}</span>
          <span className="hidden sm:inline"> · {status.tytul}</span>
        </span>
      )}
    </>
  );

  const wyglad = `inline-flex items-center gap-3 border px-4 py-2 ${
    czyLive
      ? // zielony = aktywny teraz; to jedyne miejsce na stronie z tym kolorem
        "border-huk-live/60 bg-huk-live/10 shadow-[0_0_14px_color-mix(in_srgb,var(--live)_35%,transparent)] transition-colors hover:bg-huk-live/20"
      : "border-huk-linia2 bg-huk-p2/60"
  } ${klasa}`;

  // aria-live: czytnik ekranu ogłosi zmianę offline -> live bez przeładowania
  return czyLive ? (
    <a
      href={site.linki.twitch}
      target="_blank"
      rel="noopener noreferrer"
      className={wyglad}
      style={{ clipPath: SKOS }}
      aria-live="polite"
      aria-label={`Hukszy jest teraz na żywo: ${status.gra}. Oglądaj na Twitchu`}
    >
      {tresc}
    </a>
  ) : (
    <div className={wyglad} style={{ clipPath: SKOS }} aria-live="polite">
      {tresc}
    </div>
  );
}
