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

      {/* na telefonie szczegóły schodzą do osobnych linii i się zawijają
          (wcześniej ucinało grę po 16 znakach, a tytułu nie było wcale);
          od sm: jedna linia obok „live teraz", długi tytuł z wielokropkiem */}
      {status.stan === "live" && (
        <span className="basis-full text-left text-xs text-huk-t2 sm:max-w-[42ch] sm:basis-auto sm:truncate sm:border-l sm:border-huk-linia2 sm:pl-3">
          <span className="font-semibold text-huk-t1 sm:font-normal sm:text-huk-t2">{status.gra}</span>
          <span className="text-huk-t3"> · od {status.od}</span>
          <span className="mt-0.5 block break-words sm:mt-0 sm:inline">
            <span className="hidden sm:inline"> · </span>
            {status.tytul}
          </span>
        </span>
      )}
    </>
  );

  const wyglad = `inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1.5 border px-4 py-2 sm:flex-nowrap ${
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
