"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { gsap, animujWejscie } from "@/lib/animacje";
import NaglowekSekcji from "@/components/ui/NaglowekSekcji";
import KartaTilt from "@/components/ui/KartaTilt";
import PrzyciskCTA from "@/components/ui/PrzyciskCTA";

/** Dzień tygodnia wg indeksu w site.config (0 = poniedziałek). */
function indeksDzisiaj() {
  const d = new Date().getDay(); // 0 = niedziela
  return (d + 6) % 7;
}

export default function Harmonogram() {
  const sekcja = useRef<HTMLElement>(null);
  // liczone po montażu — inaczej SSR i klient mogłyby się rozjechać
  const [dzis, setDzis] = useState<number | null>(null);

  useEffect(() => setDzis(indeksDzisiaj()), []);

  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animujWejscie("[data-dzien]", { trigger: el, y: 40, odstep: 0.07, start: "top 78%" });
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
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--akcent)_14%,transparent),transparent_70%)]" />

      <div className="mx-auto max-w-6xl">
        <NaglowekSekcji nadtytul="kiedy jestem na live" srodek>
          Harmonogram
        </NaglowekSekcji>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7 lg:gap-4">
          {site.harmonogram.map((d, i) => {
            const gra = d.godziny !== null;
            const dzisiaj = dzis === i;

            return (
              <div key={d.skrot} data-dzien style={{ opacity: 0 }} className={gra ? "lg:row-span-1" : ""}>
                <KartaTilt sila={gra ? 10 : 4}>
                  <article
                    className={`panel-hud relative flex h-full min-h-[9.5rem] flex-col justify-between p-4 transition-all duration-300 lg:min-h-[12rem] ${
                      gra
                        ? "border-huk-red/55 hover:border-huk-red hover:shadow-neon-mocny"
                        : "border-white/8 opacity-45 hover:opacity-70"
                    }`}
                    style={{
                      clipPath:
                        "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
                    }}
                  >
                    {dzisiaj && (
                      <span className="absolute right-3 top-3 bg-huk-red px-2 py-0.5 text-[0.55rem] font-extrabold uppercase tracking-[0.2em] text-white">
                        dziś
                      </span>
                    )}

                    <div>
                      <div
                        className={`font-display text-4xl leading-none lg:text-5xl ${
                          gra ? "text-huk-red" : "text-white/55"
                        }`}
                      >
                        {d.skrot}
                      </div>
                      <div className="podtytul mt-2 text-white/60">{d.dzien}</div>
                    </div>

                    {gra ? (
                      <div className="mt-6">
                        <div className="font-display text-xl leading-none text-huk-white tabular-nums lg:text-2xl">
                          {d.godziny.od}
                        </div>
                        <div className="my-1 h-px w-8 bg-huk-red" />
                        <div className="font-display text-xl leading-none text-white/70 tabular-nums lg:text-2xl">
                          {d.godziny.do}
                        </div>
                        {"opis" in d && d.opis && (
                          <p className="mt-3 text-[0.7rem] leading-tight text-white/60">{d.opis}</p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-white/55">
                        dzień wolny
                      </p>
                    )}
                  </article>
                </KartaTilt>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-center text-xs text-white/60">
            Godziny mogą się przesunąć — o zmianach informuję na Discordzie i Instagramie.
          </p>
          <PrzyciskCTA href={site.linki.twitch}>Wbijaj na Twitcha</PrzyciskCTA>
        </div>
      </div>
    </section>
  );
}
