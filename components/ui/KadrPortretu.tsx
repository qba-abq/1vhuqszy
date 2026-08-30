"use client";

import Image from "next/image";
import { site } from "@/site.config";

const SKOS =
  "polygon(26px 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%, 0 26px)";

/**
 * Kadr na zdjęcie streamera.
 *
 * Bez zdjęcia nie pokazuje żadnej „sylwetki" — zamiast tego jest zamknięty
 * kadr z teksturą marki i sygnetem, który wygląda na skończony element,
 * a nie na dziurę. Po wpisaniu ścieżki w `site.config.ts` → `assety.portret`
 * ten sam kadr wypełnia się zdjęciem.
 */
export default function KadrPortretu() {
  const zdjecie = site.assety.portret;

  return (
    <div className="relative mx-auto w-full max-w-sm lg:mx-0">
      {/* narożne wsporniki */}
      <span className="absolute -right-2 -top-2 z-20 h-10 w-10 border-r-2 border-t-2 border-huk-red" />
      <span className="absolute -bottom-2 -left-2 z-20 h-10 w-10 border-b-2 border-l-2 border-huk-red" />

      <div
        className="relative aspect-[3/4] overflow-hidden border border-huk-red/45 shadow-neon"
        style={{ clipPath: SKOS }}
      >
        {/* tekstura marki jako tło kadru */}
        <Image
          src={site.assety.tloHero}
          alt=""
          fill
          sizes="(max-width: 1024px) 80vw, 380px"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-huk-ink/70 to-huk-ink" />
        <div className="halftone absolute right-3 top-3 h-16 w-16 opacity-25" />

        {zdjecie ? (
          <Image
            src={zdjecie}
            alt={site.nick}
            fill
            sizes="(max-width: 1024px) 80vw, 380px"
            className="object-cover object-top"
          />
        ) : (
          /* bez zdjęcia: prawdziwy awatar kanału */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <div className="relative h-44 w-44 overflow-hidden rounded-full border-2 border-huk-red/70 shadow-neon sm:h-52 sm:w-52">
              <Image
                src={site.assety.awatar}
                alt={`Awatar kanału ${site.nick}`}
                fill
                sizes="208px"
                className="object-cover"
              />
            </div>
            <span className="podtytul text-white/60">{site.handle}</span>
          </div>
        )}

        {/* czerwona poświata od dołu, spina kadr z sekcją */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--akcent)_28%,transparent),transparent)]" />
      </div>
    </div>
  );
}
