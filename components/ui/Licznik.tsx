"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/animacje";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

type Props = {
  wartosc: number;
  sufiks?: string;
  etykieta: string;
};

const formatuj = (n: number) => Math.round(n).toLocaleString("pl-PL");

/** Statystyka z licznikiem odliczającym w górę przy wejściu w kadr. */
export default function Licznik({ wartosc, sufiks = "", etykieta }: Props) {
  const liczba = useRef<HTMLSpanElement>(null);
  const karta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = liczba.current;
    if (!el) return;

    if (ruchOgraniczony()) {
      el.textContent = formatuj(wartosc);
      return;
    }

    const stan = { n: 0 };
    const tw = gsap.to(stan, {
      n: wartosc,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatuj(stan.n);
      },
      scrollTrigger: { trigger: karta.current, start: "top 88%", once: true },
    });

    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, [wartosc]);

  return (
    <div
      ref={karta}
      className="panel-hud group relative overflow-hidden px-4 py-6 text-center transition-colors duration-300 hover:border-huk-red/70"
      style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
    >
      <div className="font-display text-[clamp(1.6rem,4.2vw,3rem)] leading-none text-huk-white tabular-nums">
        <span ref={liczba}>0</span>
        <span className="text-huk-red">{sufiks}</span>
      </div>
      <div className="podtytul mt-3 text-[0.6rem] leading-tight text-white/65 transition-colors duration-300 group-hover:text-white/80">
        {etykieta}
      </div>
    </div>
  );
}
