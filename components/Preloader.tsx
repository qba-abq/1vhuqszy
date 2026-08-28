"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { gsap } from "@/lib/animacje";
import { oznaczStart } from "@/lib/start";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

const KLUCZ_SESJI = "huk-intro-pokazane";

/** Poszarpana krawędź „rozdarcia" — dwie połowy odjeżdżają na boki. */
const KLIP_LEWA =
  "polygon(0 0, 52% 0, 48% 9%, 53% 18%, 47% 27%, 52% 38%, 46% 47%, 53% 57%, 47% 66%, 52% 77%, 46% 86%, 51% 94%, 47% 100%, 0 100%)";
const KLIP_PRAWA =
  "polygon(52% 0, 100% 0, 100% 100%, 47% 100%, 51% 94%, 46% 86%, 52% 77%, 47% 66%, 53% 57%, 46% 47%, 52% 38%, 47% 27%, 53% 18%, 48% 9%)";

export default function Preloader() {
  const [aktywny, setAktywny] = useState(true);
  const [procent, setProcent] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const lewa = useRef<HTMLDivElement>(null);
  const prawa = useRef<HTMLDivElement>(null);
  const tresc = useRef<HTMLDivElement>(null);
  const pasek = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Druga wizyta w tej samej sesji — bez intro.
    if (sessionStorage.getItem(KLUCZ_SESJI) || ruchOgraniczony()) {
      setAktywny(false);
      oznaczStart();
      return;
    }
    sessionStorage.setItem(KLUCZ_SESJI, "1");
    document.body.style.overflow = "hidden";

    const MIN_MS = 850; // minimalny czas ekranu, żeby licznik nie mrugnął
    // Uwaga: każda milisekunda intro wydłuża LCP — strona jest zasłonięta.
    const wszystkie = 2; // fonty + reszta zasobów strony
    let zrobione = 0;
    const podbij = () => {
      zrobione += 1;
    };

    // Realny postęp: fonty + zdarzenie load (grafika hero ma `priority`,
    // więc przeglądarka pobiera ją równolegle — nie duplikujemy requestu).
    document.fonts.ready.then(podbij);
    if (document.readyState === "complete") podbij();
    else window.addEventListener("load", podbij, { once: true });

    const tl = gsap.timeline({ paused: true });

    // Licznik = wolniejsze z dwóch: postęp pobierania i upływ czasu.
    // Dzięki temu 100% oznacza „naprawdę wczytane", a ekran nie znika w mgnieniu.
    let biezacy = 0;
    let raf = 0;
    const poczatek = performance.now();

    const petla = () => {
      const cel = Math.min(zrobione / wszystkie, (performance.now() - poczatek) / MIN_MS);
      biezacy += (cel - biezacy) * 0.12;

      const pokaz = cel >= 1 && biezacy > 0.995 ? 1 : biezacy;
      setProcent(Math.round(pokaz * 100));
      if (pasek.current) pasek.current.style.transform = `scaleX(${pokaz})`;

      if (pokaz === 1) {
        tl.play();
        return;
      }
      raf = requestAnimationFrame(petla);
    };
    raf = requestAnimationFrame(petla);

    // Wyjście: błysk → rozdarcie → odsłonięcie strony
    tl.to(tresc.current, { opacity: 0, scale: 1.12, duration: 0.26, ease: "power2.in", delay: 0.08 })
      .to(root.current, { backgroundColor: site.kolory.akcent, duration: 0.07 }, "<0.08")
      .to(root.current, { backgroundColor: "#050505", duration: 0.1 })
      .to(lewa.current, { xPercent: -108, duration: 0.62, ease: "expo.inOut" }, "rozdarcie")
      .to(prawa.current, { xPercent: 108, duration: 0.62, ease: "expo.inOut" }, "rozdarcie")
      .add(() => {
        document.body.style.overflow = "";
        oznaczStart();
      }, "rozdarcie+=0.15")
      .add(() => setAktywny(false));

    return () => {
      cancelAnimationFrame(raf);
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (!aktywny) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-hidden="true">
      {/* dwie połowy rozdzieranej kurtyny */}
      <div
        ref={lewa}
        className="absolute inset-0 bg-huk-ink"
        style={{ clipPath: KLIP_LEWA, WebkitClipPath: KLIP_LEWA }}
      />
      <div
        ref={prawa}
        className="absolute inset-0 bg-huk-ink"
        style={{ clipPath: KLIP_PRAWA, WebkitClipPath: KLIP_PRAWA }}
      />

      {/* czerwona łuna od dołu */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_srgb,var(--akcent)_38%,transparent),transparent_70%)]" />
      <div className="halftone pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-20" />

      <div
        ref={tresc}
        className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6"
      >
        <p className="podtytul text-huk-red">wchodzisz na kanał</p>

        <h1 className="tekst-metal swiecacy-tekst text-center text-[clamp(3rem,16vw,11rem)] leading-none">
          {site.nick}
        </h1>

        <div className="w-full max-w-sm">
          <div className="h-[3px] w-full overflow-hidden bg-white/10">
            <div
              ref={pasek}
              className="h-full w-full origin-left scale-x-0 bg-huk-red shadow-neon"
            />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="podtytul text-white/65">ładowanie</span>
            <span className="font-display text-3xl text-huk-white tabular-nums">
              {procent}
              <span className="text-huk-red">%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
