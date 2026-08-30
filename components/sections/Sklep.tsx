"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import { gsap, animujWejscie } from "@/lib/animacje";
import NaglowekSekcji from "@/components/ui/NaglowekSekcji";
import KartaTilt from "@/components/ui/KartaTilt";
import PrzyciskCTA from "@/components/ui/PrzyciskCTA";

const SKOS =
  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

/** Pozycja kursora -> zmienne CSS --sx/--sy czytane przez .spotlight. */
function ustawSwiatlo(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
}

export default function Sklep() {
  const sekcja = useRef<HTMLElement>(null);
  const doSklepu = site.sklep.linkSklepu || site.linki.donate;

  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animujWejscie("[data-produkt]", { trigger: el, y: 46, odstep: 0.09, start: "top 80%" });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sekcja}
      id="sklep"
      className="relative overflow-hidden bg-huk-black/60 px-6 py-24 sm:py-32"
      aria-label="Sklep z merchem"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-huk-red/60 to-transparent" />
      <div className="halftone pointer-events-none absolute right-8 top-14 h-28 w-28 opacity-15" />

      <div className="mx-auto max-w-6xl">
        <NaglowekSekcji nadtytul="reprezentuj ekipę" srodek>
          Merch
        </NaglowekSekcji>

        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-white/60">
          Kolekcja prosto ze streamów: habanero challenge, kuchenny chaos i paliwo na
          horrory. Noś to, przy czym się darliśmy.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.sklep.produkty.map((p) => (
            <div key={p.id} data-produkt style={{ opacity: 0 }}>
              <KartaTilt sila={7}>
                <Link
                  href={doSklepu}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerMove={ustawSwiatlo}
                  className="spotlight group relative block overflow-hidden border border-white/10 bg-huk-ink transition-colors duration-300 hover:border-huk-red/70"
                  style={{ clipPath: SKOS }}
                >
                  {p.znaczek && (
                    <span
                      className={`absolute left-3 top-3 z-10 px-2.5 py-1 text-[0.55rem] font-extrabold uppercase tracking-[0.2em] text-white ${
                        p.znaczek === "Bestseller" ? "bg-huk-red shadow-neon" : "bg-white/15"
                      }`}
                    >
                      {p.znaczek}
                    </span>
                  )}

                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={p.obraz}
                      alt={p.nazwa}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-huk-ink to-transparent" />
                  </div>

                  <div className="flex items-end justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg leading-tight text-huk-white sm:text-xl">
                        {p.nazwa}
                      </h3>
                      <p className="mt-1 truncate text-[0.68rem] uppercase tracking-[0.14em] text-white/50">
                        {p.opis}
                      </p>
                    </div>
                    <div className="shrink-0 font-display text-xl text-huk-red sm:text-2xl">
                      {p.cena} <span className="text-sm">zł</span>
                    </div>
                  </div>
                </Link>
              </KartaTilt>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          {!site.sklep.linkSklepu && (
            <p className="text-center text-xs text-white/60">
              Sklep startuje niebawem. Chcesz coś z tej listy? Daj znać na Discordzie,
              a na razie możesz po prostu wesprzeć kanał.
            </p>
          )}
          <PrzyciskCTA href={doSklepu}>
            {site.sklep.linkSklepu ? "Zobacz cały sklep" : "Wesprzyj kanał"}
          </PrzyciskCTA>
        </div>
      </div>
    </section>
  );
}
