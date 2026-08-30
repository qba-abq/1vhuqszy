"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/animacje";
import { stanTla } from "@/lib/stanTla";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

/** Pełnostronicowa scena 3D dociągana leniwie po bezczynności. */
const TloScena = dynamic(() => import("@/components/three/TloScena"), {
  ssr: false,
  loading: () => null,
});

/**
 * Żywe tło całej strony, identyczne na desktopie i telefonie (1:1):
 * - pioruny/korzenie rosnące w dół razem ze scrollem (GSAP scrub),
 * - losowe BŁYSKI pojedynczych wyładowań + rozbłysk ekranu,
 * - dryfujące odłamki 3D przez całą stronę.
 * Jedyne różnice na telefonie: 3 pioruny zamiast 4 (węższy ekran)
 * i mniej cząsteczek w hero — gęstość, nie obecność efektów.
 */

function losowacz(ziarno: number) {
  let a = ziarno;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Sciezka = { d: string; poziom: number };

function galaz(
  rand: () => number,
  x: number,
  y: number,
  kierunek: number,
  dlugosc: number,
  poziom: number,
  out: Sciezka[],
) {
  let d = `M ${x.toFixed(2)} ${y.toFixed(2)}`;
  let cx = x;
  let cy = y;
  const kroki = Math.max(2, Math.round(dlugosc / 6));

  for (let i = 0; i < kroki; i++) {
    cy += 5 + rand() * 4;
    cx += kierunek * rand() * 2.6 + (rand() - 0.5) * 6;
    d += ` L ${cx.toFixed(2)} ${cy.toFixed(2)}`;
    if (poziom < 2 && cy < 86 && rand() < 0.3) {
      galaz(rand, cx, cy, rand() < 0.5 ? -1 : 1, dlugosc * 0.38, poziom + 1, out);
    }
    if (cy > 104) break;
  }

  out.push({ d, poziom });
}

function zbudujSiec(ziarno: number, ile: number): Sciezka[] {
  const rand = losowacz(ziarno);
  const out: Sciezka[] = [];
  for (let i = 0; i < ile; i++) {
    const x = ((i + 0.5) / ile) * 100 + (rand() - 0.5) * 14;
    galaz(rand, x, -4, rand() < 0.5 ? -1 : 1, 108, 0, out);
  }
  return out;
}

const GRUBOSC = [0.42, 0.24, 0.14];
const PRZEZROCZYSTOSC = [1, 0.72, 0.5];

export default function TloZywe() {
  const svg = useRef<SVGSVGElement>(null);
  const blysk = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const [scena3D, setScena3D] = useState(false);

  useEffect(() => {
    setDesktop(window.matchMedia("(min-width: 768px)").matches);
  }, []);

  const sciezki = useMemo(
    () => zbudujSiec(20260828, desktop === false ? 3 : 4),
    [desktop],
  );

  /* —— pełnostronicowa scena 3D: po bezczynności (desktop i telefon) —— */
  useEffect(() => {
    if (desktop === null || ruchOgraniczony()) return;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    if (
      (nav.hardwareConcurrency ?? 8) <= 2 ||
      (nav.deviceMemory ?? 8) < 2 ||
      nav.connection?.saveData
    )
      return;

    const odpal = () => setScena3D(true);
    const bezczynnosc = window.requestIdleCallback;
    const zaplanuj = () =>
      bezczynnosc ? bezczynnosc(odpal, { timeout: 3500 }) : window.setTimeout(odpal, 1400);
    if (document.readyState === "complete") zaplanuj();
    else window.addEventListener("load", zaplanuj, { once: true });
  }, [desktop]);

  /* —— stan scrolla/myszy dla parallaxu 3D —— */
  useEffect(() => {
    if (ruchOgraniczony()) return;

    const naScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      stanTla.scroll = max > 0 ? window.scrollY / max : 0;
    };
    const naMysz = (e: PointerEvent) => {
      stanTla.myszX = (e.clientX / window.innerWidth) * 2 - 1;
      stanTla.myszY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    naScroll();
    window.addEventListener("scroll", naScroll, { passive: true });
    window.addEventListener("pointermove", naMysz, { passive: true });
    return () => {
      window.removeEventListener("scroll", naScroll);
      window.removeEventListener("pointermove", naMysz);
    };
  }, [desktop]);

  /* —— rysunek scrubowany scrollem + losowe błyski (1:1 na telefonie) —— */
  useEffect(() => {
    const el = svg.current;
    if (!el || desktop === null) return;

    const rdzenie = el.querySelectorAll<SVGPathElement>("path[data-rdzen]");
    const wszystkie = el.querySelectorAll<SVGPathElement>("path");

    if (ruchOgraniczony()) {
      gsap.set(wszystkie, { strokeDashoffset: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(wszystkie, { strokeDashoffset: 0.84 });
      gsap.to(wszystkie, {
        strokeDashoffset: 0,
        ease: "none",
        // amount (nie each): cały rozrzut mieści się w 40% przebiegu,
        // więc każdy piorun zdąży urosnąć zanim dojedziesz do stopki
        stagger: { amount: 0.4, from: "random" },
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      /* Błyskawica: co 1.4–3.5 s losowy piorun rozbłyskuje serią mignięć,
         a przy mocniejszych uderzeniach cały ekran dostaje krótki poblask. */
      const rand = gsap.utils.random;
      const uderzenie = () => {
        const cel = rdzenie[Math.floor(rand(0, rdzenie.length))];
        if (!cel) return;
        const mocne = rand(0, 1) > 0.6;

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.delayedCall(rand(1.4, 3.5), uderzenie);
          },
        });
        // seria nierównych mignięć jak przy prawdziwym wyładowaniu
        tl.to(cel, { opacity: 1, duration: 0.05 })
          .to(cel, { opacity: 0.35, duration: 0.06 })
          .to(cel, { opacity: 1, duration: 0.04 })
          .to(cel, { opacity: 0.5, duration: 0.09 })
          .to(cel, { opacity: 1, duration: 0.05 })
          .to(cel, { opacity: 0.62, duration: 0.7, ease: "power2.out" });

        if (mocne && blysk.current) {
          tl.to(blysk.current, { opacity: 0.16, duration: 0.06 }, 0).to(
            blysk.current,
            { opacity: 0, duration: 0.5, ease: "power2.out" },
            0.1,
          );
        }
      };
      gsap.delayedCall(1.2, uderzenie);
      gsap.delayedCall(2.1, uderzenie);
    });

    return () => ctx.revert();
  }, [sciezki, desktop]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* dryfujące odłamki 3D przez całą stronę */}
      {scena3D && (
        <div className="absolute inset-0">
          <TloScena />
        </div>
      )}

      {/* poświata pełzająca w dół */}
      <div className="tlo-peleza absolute inset-x-0 h-[45vh] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--akcent)_16%,transparent),transparent_70%)]" />

      <svg
        ref={svg}
        className="tlo-miga absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {sciezki.map((s, i) => (
          <path
            key={`glow-${i}`}
            d={s.d}
            pathLength={1}
            fill="none"
            stroke="var(--akcent)"
            strokeWidth={GRUBOSC[s.poziom] * 8}
            strokeOpacity={PRZEZROCZYSTOSC[s.poziom] * 0.38}
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            vectorEffect="non-scaling-stroke"
            style={{ animationDelay: `${(i % 7) * -1.7}s` }}
          />
        ))}
        {sciezki.map((s, i) => (
          <path
            key={`rdzen-${i}`}
            data-rdzen
            d={s.d}
            pathLength={1}
            fill="none"
            stroke="var(--akcent-jasny)"
            strokeWidth={GRUBOSC[s.poziom]}
            strokeOpacity={PRZEZROCZYSTOSC[s.poziom] * 0.85}
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            vectorEffect="non-scaling-stroke"
            style={{ opacity: 0.62, animationDelay: `${(i % 7) * -1.7}s` }}
          />
        ))}
      </svg>

      {/* rozbłysk całego ekranu przy mocnym uderzeniu */}
      <div
        ref={blysk}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,color-mix(in_srgb,var(--akcent-jasny)_55%,white_10%),transparent_65%)] opacity-0"
      />

      {/* wygaszenie góry i dołu */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-huk-p0 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-huk-p0 to-transparent" />
    </div>
  );
}
