"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import { gsap, SplitText } from "@/lib/animacje";
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
  const logo = useRef<HTMLHeadingElement>(null);
  const nad = useRef<HTMLParagraphElement>(null);
  const dol = useRef<HTMLDivElement>(null);
  const pasek = useRef<HTMLDivElement>(null);
  const szew = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Bez intro, gdy: druga wizyta w sesji, prośba o mniej ruchu, albo wejście
    // z linku do konkretnej sekcji (np. .../#harmonogram) — kto zna cel, ten
    // nie ma ochoty czekać na kurtynę.
    if (sessionStorage.getItem(KLUCZ_SESJI) || ruchOgraniczony() || window.location.hash) {
      setAktywny(false);
      oznaczStart();
      return;
    }
    sessionStorage.setItem(KLUCZ_SESJI, "1");
    document.body.style.overflow = "hidden";

    // Na telefonie intro jest krótsze — patrz komentarz w site.config.ts.
    const naTelefonie = window.matchMedia("(max-width: 767px)").matches;
    const MIN_MS = naTelefonie
      ? site.wydajnosc.dlugoscIntroMobileMs
      : site.wydajnosc.dlugoscIntroMs;
    const wszystkie = 2; // fonty + reszta zasobów strony
    let zrobione = 0;
    const podbij = () => {
      zrobione += 1;
    };

    document.fonts.ready.then(podbij);
    if (document.readyState === "complete") podbij();
    else window.addEventListener("load", podbij, { once: true });

    const ctx = gsap.context(() => {
      /* —— 1. wejście: nadtytuł, litery logo, pasek —— */
      const podzial = SplitText.create(logo.current, {
        type: "chars",
        mask: "chars",
        charsClass: "maska-znak",
      });

      const wejscie = gsap.timeline();
      wejscie
        .from(nad.current, { opacity: 0, letterSpacing: "1.2em", duration: 0.9, ease: "power3.out" })
        .from(
          podzial.chars,
          { yPercent: 120, duration: 0.9, stagger: 0.075, ease: "expo.out" },
          "-=0.55",
        )
        .from(dol.current, { opacity: 0, y: 18, duration: 0.6, ease: "power2.out" }, "-=0.45");

      /* —— 2. wyjście: drganie, błysk, rozdarcie —— */
      const wyjscie = gsap.timeline({ paused: true, timeScale: naTelefonie ? 1.9 : 1 });
      wyjscie
        // krótkie drganie „zaraz pęknie"
        .to(tresc.current, {
          x: () => gsap.utils.random(-7, 7),
          skewX: () => gsap.utils.random(-2.5, 2.5),
          duration: 0.06,
          repeat: 7,
          ease: "none",
        })
        .set(tresc.current, { x: 0, skewX: 0 })
        // szew rozświetla się na linii pęknięcia
        .fromTo(
          szew.current,
          { opacity: 0, scaleY: 0.2 },
          { opacity: 1, scaleY: 1, duration: 0.22, ease: "power2.out" },
        )
        .to(tresc.current, { opacity: 0, scale: 1.14, duration: 0.4, ease: "power2.in" }, "-=0.12")
        .to(root.current, { backgroundColor: site.kolory.akcent, duration: 0.07 }, "-=0.1")
        .to(root.current, { backgroundColor: "#050505", duration: 0.14 })
        .addLabel("rozdarcie")
        .to(szew.current, { opacity: 0, duration: 0.5 }, "rozdarcie")
        .to(
          lewa.current,
          { xPercent: -110, rotation: -1.5, duration: 1.15, ease: "expo.inOut" },
          "rozdarcie",
        )
        .to(
          prawa.current,
          { xPercent: 110, rotation: 1.5, duration: 1.15, ease: "expo.inOut" },
          "rozdarcie",
        )
        .add(() => {
          document.body.style.overflow = "";
          oznaczStart();
        }, "rozdarcie+=0.3")
        .add(() => setAktywny(false));

      /* —— licznik: wolniejsze z dwóch (pobieranie vs upływ czasu) —— */
      let biezacy = 0;
      let raf = 0;
      const poczatek = performance.now();

      const petla = () => {
        const cel = Math.min(zrobione / wszystkie, (performance.now() - poczatek) / MIN_MS);
        biezacy += (cel - biezacy) * 0.09;

        const pokaz = cel >= 1 && biezacy > 0.995 ? 1 : biezacy;
        setProcent(Math.round(pokaz * 100));
        if (pasek.current) pasek.current.style.transform = `scaleX(${pokaz})`;

        if (pokaz === 1) {
          wyjscie.play();
          return;
        }
        raf = requestAnimationFrame(petla);
      };
      raf = requestAnimationFrame(petla);

      return () => cancelAnimationFrame(raf);
    }, root);

    return () => {
      ctx.revert();
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

      {/* rozświetlony szew w miejscu pęknięcia */}
      <div
        ref={szew}
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-huk-red opacity-0 shadow-neon-mocny"
      />

      {/* czerwona łuna od dołu */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,color-mix(in_srgb,var(--akcent)_38%,transparent),transparent_70%)]" />
      <div className="halftone pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-20" />
      <div className="halftone pointer-events-none absolute bottom-0 left-0 h-40 w-40 opacity-20" />

      <div
        ref={tresc}
        className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6"
      >
        <p ref={nad} className="podtytul text-huk-red">
          wchodzisz na kanał
        </p>

        <h1
          ref={logo}
          className="tekst-metal swiecacy-tekst text-center text-[clamp(3rem,16vw,11rem)] leading-none"
        >
          {site.nick}
        </h1>

        <div ref={dol} className="w-full max-w-sm">
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
