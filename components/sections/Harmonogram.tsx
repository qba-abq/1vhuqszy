"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/site.config";
import { gsap, animujWejscie } from "@/lib/animacje";
import NaglowekSekcji from "@/components/ui/NaglowekSekcji";
import PrzyciskCTA from "@/components/ui/PrzyciskCTA";

/** Indeks dnia w site.config.harmonogram (0 = poniedziałek). */
function indeksDzisiaj() {
  return (new Date().getDay() + 6) % 7;
}

/** „17:00" + „20:00" → „3 h". Godziny po północy liczone jako 24:00. */
function dlugosc(od: string, doG: string) {
  const na = (t: string) => {
    const [g, m] = t.split(":").map(Number);
    return g * 60 + m;
  };
  const minuty = na(doG) - na(od);
  const godziny = Math.round((minuty / 60) * 10) / 10;
  return `${String(godziny).replace(".", ",")} h`;
}

export default function Harmonogram() {
  const sekcja = useRef<HTMLElement>(null);
  // liczone po montażu — SSR i klient mogłyby być w różnych dobach
  const [dzis, setDzis] = useState<number | null>(null);

  useEffect(() => setDzis(indeksDzisiaj()), []);

  const dniZeStreamem = useMemo(
    () => site.harmonogram.map((d, i) => ({ ...d, i })).filter((d) => d.godziny !== null),
    [],
  );
  const dniWolne = useMemo(() => site.harmonogram.filter((d) => d.godziny === null), []);

  /** Najbliższy stream liczony od dzisiaj (w przód, z zawijaniem tygodnia). */
  const najblizszy = useMemo(() => {
    if (dzis === null) return null;
    const posortowane = [...dniZeStreamem].sort(
      (a, b) => ((a.i - dzis + 7) % 7) - ((b.i - dzis + 7) % 7),
    );
    return posortowane[0]?.i ?? null;
  }, [dzis, dniZeStreamem]);

  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animujWejscie("[data-wiersz]", {
        trigger: el,
        y: 44,
        odstep: 0.14,
        czas: 1,
        start: "top 78%",
      });
      animujWejscie("[data-wolne]", { trigger: el, y: 20, czas: 0.8, start: "top 70%" });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sekcja}
      id="harmonogram"
      className="relative overflow-hidden bg-huk-black px-6 py-24 sm:py-32"
      aria-label="Harmonogram streamów"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-huk-red/60 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--akcent)_12%,transparent),transparent_70%)]" />

      <div className="mx-auto max-w-4xl">
        <NaglowekSekcji nadtytul="kiedy jestem na live" srodek>
          Harmonogram
        </NaglowekSekcji>

        {/* ——— agenda: jeden wiersz = jeden stream ——— */}
        <ul className="mt-14 flex flex-col gap-3">
          {dniZeStreamem.map((d) => {
            const dzisiaj = dzis === d.i;
            const kolejny = !dzisiaj && najblizszy === d.i;

            return (
              <li key={d.skrot} data-wiersz style={{ opacity: 0 }}>
                <article
                  className={`group relative flex items-center gap-4 border-y border-r bg-gradient-to-r py-5 pl-5 pr-4 transition-all duration-300 sm:gap-7 sm:pl-7 ${
                    dzisiaj
                      ? "border-huk-red/45 from-huk-red/[0.14] to-transparent"
                      : "border-white/8 from-white/[0.035] to-transparent hover:border-huk-red/35 hover:from-huk-red/[0.09]"
                  }`}
                >
                  {/* pionowy akcent po lewej */}
                  <span
                    className={`absolute left-0 top-0 h-full w-[3px] transition-all duration-300 ${
                      dzisiaj
                        ? "bg-huk-red shadow-neon"
                        : "bg-huk-red/35 group-hover:bg-huk-red group-hover:shadow-neon"
                    }`}
                  />

                  {/* dzień */}
                  <div className="w-14 shrink-0 sm:w-20">
                    <div
                      className={`font-display text-3xl leading-none sm:text-4xl ${
                        dzisiaj ? "text-huk-red" : "text-huk-white"
                      }`}
                    >
                      {d.skrot}
                    </div>
                    <div className="mt-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-white/50">
                      {d.dzien}
                    </div>
                  </div>

                  {/* godziny */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-5">
                    <div className="flex items-center gap-2 font-display text-xl leading-none tabular-nums text-huk-white sm:gap-3 sm:text-2xl">
                      <span>{d.godziny!.od}</span>
                      <span className="text-huk-red" aria-hidden="true">
                        →
                      </span>
                      <span>{d.godziny!.do}</span>
                    </div>

                    {"opis" in d && d.opis && (
                      <p className="truncate text-xs text-white/60 sm:text-sm">{d.opis}</p>
                    )}
                  </div>

                  {/* prawa kolumna: znacznik albo długość */}
                  <div className="shrink-0 text-right">
                    {dzisiaj ? (
                      <span className="inline-block bg-huk-red px-2.5 py-1 text-[0.55rem] font-extrabold uppercase tracking-[0.2em] text-white shadow-neon">
                        dziś
                      </span>
                    ) : kolejny ? (
                      <span className="inline-block border border-huk-red/60 px-2.5 py-1 text-[0.55rem] font-extrabold uppercase tracking-[0.2em] text-huk-red">
                        najbliższy
                      </span>
                    ) : (
                      <span className="text-[0.65rem] tracking-[0.16em] text-white/45">
                        {dlugosc(d.godziny!.od, d.godziny!.do)}
                      </span>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* ——— dni wolne: jedna linijka zamiast pustych kafelków ——— */}
        <div
          data-wolne
          style={{ opacity: 0 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.65rem] uppercase tracking-[0.18em] text-white/40"
        >
          <span className="text-white/55">wolne:</span>
          {dniWolne.map((d, i) => (
            <span key={d.skrot} className="text-white/40">
              {i > 0 && <span className="mr-3 text-huk-red/60">·</span>}
              {d.dzien}
            </span>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-center text-xs text-white/60">
            Godziny potrafią się przesunąć. O zmianach informuję na Discordzie i Instagramie.
          </p>
          <PrzyciskCTA href={site.linki.twitch}>Wbijaj na Twitcha</PrzyciskCTA>
        </div>
      </div>
    </section>
  );
}
