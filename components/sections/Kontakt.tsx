"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { site } from "@/site.config";
import { gsap, animujWejscie } from "@/lib/animacje";
import NaglowekSekcji from "@/components/ui/NaglowekSekcji";
import PrzyciskCTA from "@/components/ui/PrzyciskCTA";
import {
  IkonaTwitch,
  IkonaYouTube,
  IkonaInstagram,
  IkonaTikTok,
  IkonaDiscord,
  IkonaSerce,
  IkonaMail,
} from "@/components/ui/Ikony";

const SKOS =
  "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)";

const KANALY = [
  { nazwa: "Twitch", opis: "streamy na żywo", href: site.linki.twitch, Ikona: IkonaTwitch },
  { nazwa: "Discord", opis: "społeczność i powiadomienia", href: site.linki.discord, Ikona: IkonaDiscord },
  { nazwa: "Instagram", opis: "kulisy i updaty", href: site.linki.instagram, Ikona: IkonaInstagram },
  { nazwa: "YouTube", opis: "pełne odcinki", href: site.linki.youtube, Ikona: IkonaYouTube },
  { nazwa: "TikTok", opis: "krótkie klipy", href: site.linki.tiktok, Ikona: IkonaTikTok },
] as const;

export default function Kontakt() {
  const sekcja = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animujWejscie("[data-kanal]", { trigger: el, y: 34, odstep: 0.06, start: "top 82%" });
      animujWejscie("[data-wsparcie]", { trigger: el, y: 40, start: "top 70%" });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sekcja}
      id="kontakt"
      className="relative overflow-hidden bg-huk-black/60 px-6 pb-0 pt-24 sm:pt-32"
      aria-label="Social media i kontakt"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-huk-red/60 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[30rem] w-[46rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_srgb,var(--akcent)_18%,transparent),transparent_70%)]" />

      <div className="mx-auto max-w-6xl">
        <NaglowekSekcji nadtytul="nie zgub mnie z oczu" srodek>
          Dołącz do ekipy
        </NaglowekSekcji>

        {/* ——— kanały ——— */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {KANALY.map(({ nazwa, opis, href, Ikona }) => (
            <Link
              key={nazwa}
              data-kanal
              style={{ opacity: 0, clipPath: SKOS }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="panel-hud group flex flex-col items-center gap-3 px-4 py-7 transition-all duration-300 hover:-translate-y-1 hover:border-huk-red hover:shadow-neon"
            >
              <Ikona className="h-9 w-9 text-white/55 transition-all duration-300 group-hover:scale-110 group-hover:text-huk-red group-hover:drop-shadow-[0_0_12px_rgba(225,6,0,0.8)]" />
              <span className="font-display text-lg leading-none text-huk-white">{nazwa}</span>
              <span className="text-center text-[0.65rem] uppercase tracking-[0.16em] text-white/60 transition-colors duration-300 group-hover:text-huk-red">
                {opis}
              </span>
            </Link>
          ))}
        </div>

        {/* ——— wsparcie ——— */}
        <div
          data-wsparcie
          style={{ opacity: 0, clipPath: SKOS }}
          className="panel-hud mt-6 flex flex-col items-center gap-6 px-6 py-10 text-center sm:mt-8 sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex items-center gap-5">
            <span className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <span className="absolute inset-0 animate-pulse rounded-full bg-huk-red/20 blur-xl" />
              <IkonaSerce className="relative h-10 w-10 text-huk-red drop-shadow-[0_0_14px_rgba(225,6,0,0.9)]" />
            </span>
            <div>
              <h3 className="font-display text-2xl text-huk-white sm:text-3xl">Wesprzyj kanał</h3>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-white/65 sm:text-sm">
                Sprzęt, gry i lepsze streamy. Każda złotówka wraca do was w jakości.
              </p>
            </div>
          </div>

          <PrzyciskCTA href={site.linki.donate}>Postaw kawę</PrzyciskCTA>
        </div>

        {/* ——— kontakt ——— */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <span className="podtytul text-white/60">współpraca</span>
          <Link
            href={`mailto:${site.linki.email}`}
            className="group inline-flex items-center gap-3 font-display text-xl text-huk-white transition-colors hover:text-huk-red sm:text-2xl"
          >
            <IkonaMail className="h-5 w-5 text-huk-red transition-transform duration-300 group-hover:-translate-y-0.5" />
            {site.linki.email}
          </Link>
        </div>
      </div>

      {/* ——— stopka ——— */}
      <footer className="mx-auto mt-20 max-w-6xl border-t border-white/8 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="tekst-metal font-display text-2xl leading-none">{site.nick}</span>
          <p className="text-center text-[0.65rem] uppercase tracking-[0.18em] text-white/55">
            © {new Date().getFullYear()} {site.handle} · wszystkie prawa zastrzeżone
          </p>
          <div className="flex gap-4">
            {KANALY.map(({ nazwa, href, Ikona }) => (
              <Link
                key={nazwa}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={nazwa}
                className="text-white/55 transition-colors hover:text-huk-red"
              >
                <Ikona className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </section>
  );
}
