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
      className="relative overflow-hidden bg-huk-p2/95 px-6 py-24 sm:py-32"
      aria-label="Sklep z merchem"
    >
      {/* bursztynowe krawędzie + łuna: sygnał „to jest sklep" */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-huk-amber/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-huk-amber/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--akcent2)_13%,transparent),transparent_70%)]" />
      <div className="halftone pointer-events-none absolute right-8 top-14 h-28 w-28 opacity-15" />

      <div className="mx-auto max-w-6xl">
        <NaglowekSekcji nadtytul="reprezentuj ekipę" srodek akcent="bursztyn">
          Merch
        </NaglowekSekcji>

        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-huk-t2">
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
                  className="spotlight group relative block overflow-hidden border border-huk-linia bg-huk-p1 shadow-karta transition-all duration-300 hover:-translate-y-1.5 hover:border-huk-amber/60 hover:shadow-karta-hover"
                  style={{ clipPath: SKOS }}
                >
                  {p.znaczek && (
                    <span
                      className={`absolute left-3 top-3 z-10 px-2.5 py-1 text-[0.55rem] font-extrabold uppercase tracking-[0.2em] ${
                        p.znaczek === "Bestseller"
                          ? "bg-huk-amber text-huk-p0 shadow-bursztyn"
                          : "bg-huk-p3 text-huk-t1"
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
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-huk-p1 to-transparent" />
                  </div>

                  <div className="flex items-end justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg leading-tight text-huk-white sm:text-xl">
                        {p.nazwa}
                      </h3>
                      <p className="mt-1 truncate text-[0.68rem] uppercase tracking-[0.14em] text-huk-t3">
                        {p.opis}
                      </p>
                    </div>
                    <div className="shrink-0 font-display text-2xl leading-none text-huk-amber sm:text-3xl">
                      {p.cena} <span className="text-sm text-huk-amber/70">zł</span>
                    </div>
                  </div>
                </Link>
              </KartaTilt>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          {!site.sklep.linkSklepu && (
            <p className="text-center text-xs text-huk-t2">
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
