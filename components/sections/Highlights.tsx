"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { site } from "@/site.config";
import { gsap, animujWejscie, paralaksa } from "@/lib/animacje";
import NaglowekSekcji from "@/components/ui/NaglowekSekcji";
import { IkonaPlay } from "@/components/ui/Ikony";

const SKOS =
  "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)";

export default function Highlights() {
  const sekcja = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      animujWejscie("[data-klip]", { trigger: el, y: 56, odstep: 0.08, start: "top 80%" });

      // każdy kafelek płynie z inną prędkością — stąd wrażenie głębi
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((kafel, i) => {
        paralaksa(kafel.querySelector("[data-obraz]"), 0.1 + (i % 3) * 0.06, kafel);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sekcja}
      id="klipy"
      className="relative overflow-hidden bg-huk-ink/60 px-6 py-24 sm:py-32"
      aria-label="Najlepsze klipy"
    >
      <div className="halftone pointer-events-none absolute left-8 top-16 h-32 w-32 opacity-15" />

      <div className="mx-auto max-w-6xl">
        <NaglowekSekcji nadtytul="momenty, które przetrwały" srodek>
          Highlights
        </NaglowekSekcji>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.klipy.map((klip) => {
            const Kafel = klip.link ? "a" : "div";
            return (
              <div key={klip.id} data-klip data-parallax style={{ opacity: 0 }}>
                <Kafel
                  {...(klip.link
                    ? { href: klip.link, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group relative block aspect-video overflow-hidden border border-white/10 transition-colors duration-300 hover:border-huk-red/70"
                  style={{ clipPath: SKOS }}
                >
                  <div data-obraz className="absolute inset-0 scale-[1.18]">
                    <Image
                      src={klip.miniatura}
                      alt={klip.tytul}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* przyciemnienie + czerwony rozbłysk na hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-huk-ink via-huk-ink/25 to-transparent" />
                  <div className="absolute inset-0 bg-huk-red/0 transition-colors duration-300 group-hover:bg-huk-red/15" />

                  {/* play */}
                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full border border-huk-red/70 bg-black/50 text-huk-white opacity-0 backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:shadow-neon">
                    <IkonaPlay className="ml-1 h-5 w-5" />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="podtytul text-huk-red">{klip.opis}</p>
                    <h3 className="mt-1 font-display text-lg leading-tight text-huk-white sm:text-xl">
                      {klip.tytul}
                    </h3>
                  </div>
                </Kafel>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
