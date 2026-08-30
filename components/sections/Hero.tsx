"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { site } from "@/site.config";
import { gsap, ScrollTrigger, EASE } from "@/lib/animacje";
import { postepHero } from "@/lib/postepHero";
import { naStart } from "@/lib/start";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";
import StatusLive from "@/components/ui/StatusLive";
import PrzyciskCTA from "@/components/ui/PrzyciskCTA";

/** Scena 3D ładowana dopiero w przeglądarce — nie blokuje pierwszego renderu. */
const HeroScena = dynamic(() => import("@/components/three/HeroScena"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const sekcja = useRef<HTMLElement>(null);
  const [scena3D, setScena3D] = useState(false);
  const tlo = useRef<HTMLDivElement>(null);
  const tresc = useRef<HTMLDivElement>(null);
  const nick = useRef<HTMLHeadingElement>(null);
  const wskaznik = useRef<HTMLDivElement>(null);

  /* —— scena 3D dociąga się dopiero, gdy przeglądarka ma wolną chwilę ——
     three.js waży ~140 KB i potrafi zająć wątek główny na sekundy; ładowany
     od razu psuł LCP i TBT na telefonach. Na bardzo słabym sprzęcie i przy
     „oszczędzaniu danych" nie ładuje się wcale — tło i tekst wystarczą. */
  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const slabySprzet =
      (nav.hardwareConcurrency ?? 8) <= 2 ||
      (nav.deviceMemory ?? 8) < 2 ||
      nav.connection?.saveData === true;
    if (slabySprzet) return;

    const zaWaskiEkran =
      !site.wydajnosc.scena3DnaMobile &&
      window.matchMedia(`(max-width: ${site.wydajnosc.prog3D - 1}px)`).matches;
    if (zaWaskiEkran) return;

    const odpal = () => setScena3D(true);
    const bezczynnosc = window.requestIdleCallback;
    const zaplanuj = () =>
      bezczynnosc ? bezczynnosc(odpal, { timeout: 2500 }) : window.setTimeout(odpal, 900);

    if (document.readyState === "complete") zaplanuj();
    else window.addEventListener("load", zaplanuj, { once: true });
  }, []);

  /* —— ruch myszy → scena 3D (poza Reactem, bez re-renderów) —— */
  useEffect(() => {
    if (ruchOgraniczony()) return;
    const ruch = (e: PointerEvent) => {
      postepHero.myszX = (e.clientX / window.innerWidth) * 2 - 1;
      postepHero.myszY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", ruch, { passive: true });
    return () => window.removeEventListener("pointermove", ruch);
  }, []);

  /* —— wejście po intro —— */
  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const doAnimacji = gsap.utils.toArray<HTMLElement>("[data-wejscie]", el);

      if (ruchOgraniczony()) {
        gsap.set(doAnimacji, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(doAnimacji, { opacity: 0, y: 34 });
      // UWAGA: nagłówek z nickiem celowo NIE jest animowany.
      // To element LCP — każda zmiana jego wyglądu po hydratacji (opacity,
      // scale, filter) tworzy nowego kandydata LCP i przesuwa metrykę o czas
      // trwania animacji (mierzone: +3 s na telefonie). Dramaturgię robi
      // rozdarcie preloadera i wejście elementów wokół tytułu.

      naStart(() => {
        gsap.to(doAnimacji, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: EASE.wejscie,
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  /* —— glitch tytułu: krótkie serie co kilka sekund —— */
  useEffect(() => {
    const el = nick.current;
    if (!el || ruchOgraniczony()) return;

    let timer = 0;
    const seria = () => {
      el.classList.add("glitch-on");
      window.setTimeout(() => el.classList.remove("glitch-on"), 280 + Math.random() * 260);
      timer = window.setTimeout(seria, 2600 + Math.random() * 3200);
    };
    timer = window.setTimeout(seria, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  /* —— scroll: przypięcie sekcji + parallaks warstw + postęp sceny 3D —— */
  useEffect(() => {
    const el = sekcja.current;
    if (!el || ruchOgraniczony()) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=110%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          postepHero.scroll = self.progress;
        },
      });

      // treść odjeżdża w górę i gaśnie
      gsap.to(tresc.current, {
        yPercent: -22,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "+=70%", scrub: true },
      });

      // tło zostaje w tyle
      gsap.to(tlo.current, {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "+=110%", scrub: true },
      });

      gsap.to(wskaznik.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "+=15%", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sekcja}
      id="hero"
      className="relative h-dvh w-full overflow-hidden"
      aria-label="Strona główna"
    >
      {/* ——— warstwa tła ——— */}
      <div ref={tlo} className="absolute inset-0">
        <Image
          src={site.assety.tloHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60 md:opacity-40"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_82%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-huk-ink to-transparent" />
        {/* wyciszenie tła pod sceną — kryształ ma być najjaśniejszym elementem kadru */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_48%_at_center,rgba(5,5,5,0.72),rgba(5,5,5,0.4)_62%,rgba(5,5,5,0.15))] md:bg-[radial-gradient(ellipse_58%_48%_at_center,rgba(5,5,5,0.9),rgba(5,5,5,0.5)_62%,rgba(5,5,5,0.2))]" />
      </div>

      {/* ——— scena 3D ——— */}
      <div className="absolute inset-0">{scena3D && <HeroScena />}</div>

      {/* ——— rastr w rogach (jak na panelach kanału) ——— */}
      <div className="halftone pointer-events-none absolute left-0 top-0 h-32 w-32 opacity-25 sm:h-48 sm:w-48" />
      <div className="halftone pointer-events-none absolute bottom-0 right-0 h-32 w-32 opacity-25 sm:h-48 sm:w-48" />

      {/* ——— treść ——— */}
      <div
        ref={tresc}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <div data-wejscie className="kreski mb-6 justify-center">
          <span className="linia-akcent h-px w-10 sm:w-16" />
          <span className="podtytul text-huk-red">streamer · twitch + kick</span>
          <span className="linia-akcent h-px w-10 sm:w-16" />
        </div>

        <h1
          ref={nick}
          data-tekst={site.nick}
          className="glitch tekst-metal swiecacy-tekst text-[clamp(3.5rem,17vw,15rem)] leading-[0.85]"
        >
          {site.nick}
        </h1>

        <p
          data-wejscie
          className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-white/75 [text-shadow:0_2px_18px_#000,0_0_40px_#000] sm:mt-6 sm:text-base"
        >
          {site.opis}
        </p>

        <div data-wejscie className="mt-6 sm:mt-8">
          <StatusLive />
        </div>

        <div data-wejscie className="mt-6 flex flex-wrap sm:mt-8 items-center justify-center gap-4">
          <PrzyciskCTA href={site.linki.twitch}>Oglądaj live</PrzyciskCTA>
          <PrzyciskCTA href="#harmonogram" wariant="obrys" zewnetrzny={false}>
            Harmonogram
          </PrzyciskCTA>
        </div>
      </div>

      {/* ——— wskaźnik scrolla ——— */}
      <div
        ref={wskaznik}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden flex-col items-center gap-2 [@media(min-height:700px)]:flex"
      >
        <span className="podtytul text-white/60">scrolluj</span>
        <span className="h-10 w-px bg-gradient-to-b from-huk-red to-transparent" />
      </div>
    </section>
  );
}
