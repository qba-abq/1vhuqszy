"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { site } from "@/site.config";
import { gsap, animujWejscie, paralaksa, maskaTekstu } from "@/lib/animacje";
import NaglowekSekcji from "@/components/ui/NaglowekSekcji";
import Licznik from "@/components/ui/Licznik";

export default function OMnie() {
  const sekcja = useRef<HTMLElement>(null);
  const portret = useRef<HTMLDivElement>(null);
  const tekst = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      paralaksa(portret.current, 0.16, el);
      tekst.current?.querySelectorAll("p").forEach((p, i) => maskaTekstu(p, { opoznienie: i * 0.08 }));
      animujWejscie("[data-stat]", { trigger: el, y: 30, start: "top 80%" });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sekcja}
      id="o-mnie"
      className="relative overflow-hidden bg-huk-ink px-6 py-24 sm:py-32"
      aria-label="O mnie"
    >
      {/* czerwona łuna z lewej + rastr */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--akcent)_16%,transparent),transparent_65%)]" />
      <div className="halftone pointer-events-none absolute right-6 top-10 h-28 w-28 opacity-20" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
        {/* ——— portret ——— */}
        <div ref={portret} className="relative mx-auto w-full max-w-sm lg:mx-0">
          <div className="absolute inset-x-6 bottom-0 top-10 border border-huk-red/40 shadow-neon" />
          <div className="halftone absolute -bottom-4 -left-4 h-24 w-24 opacity-30" />
          <Image
            src={site.assety.portret}
            alt={`${site.nick} — portret`}
            width={900}
            height={1200}
            sizes="(max-width: 1024px) 80vw, 380px"
            className="relative z-10 w-full object-contain drop-shadow-[0_0_40px_rgba(225,6,0,0.35)]"
          />
        </div>

        {/* ——— treść ——— */}
        <div>
          <NaglowekSekcji nadtytul={`kim jest ${site.handle}`}>
            Głośno,
            <br />
            szybko,
            <br />
            bez ściemy
          </NaglowekSekcji>

          <div ref={tekst} className="mt-8 space-y-5">
            {site.bio.map((akapit, i) => (
              <p key={i} className="max-w-prose text-sm leading-relaxed text-white/60 sm:text-base" style={{ opacity: 0 }}>
                {akapit}
              </p>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {site.statystyki.map((s) => (
              <div key={s.etykieta} data-stat style={{ opacity: 0 }}>
                <Licznik wartosc={s.wartosc} sufiks={s.sufiks} etykieta={s.etykieta} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
