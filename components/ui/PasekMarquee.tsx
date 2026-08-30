"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/animacje";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

type Props = {
  /** Elementy pasa; zapętlamy je 4x, więc wystarczy krótka lista. */
  slowa: string[];
  /** Kierunek bazowy: 1 = w lewo, -1 = w prawo. */
  kierunek?: 1 | -1;
  klasa?: string;
};

/**
 * Pas przewijanego tekstu reagujący na scroll: im szybciej scrollujesz,
 * tym szybciej leci (i zmienia kierunek przy scrollu w górę).
 * Klasyk stron z awwwards, tani w renderze: jeden transform na klatkę.
 */
export default function PasekMarquee({ slowa, kierunek = 1, klasa = "" }: Props) {
  const tor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tor.current;
    if (!el || ruchOgraniczony()) return;

    const ctx = gsap.context(() => {
      // przesuwamy o 50% (dwie identyczne polowy) w petli
      const tw = gsap.to(el, {
        xPercent: -50 * kierunek,
        duration: 26,
        ease: "none",
        repeat: -1,
        // modulo utrzymuje plynna petle takze przy ujemnym timeScale
        modifiers: {
          xPercent: (v) => `${(((parseFloat(v) % 50) + 50) % 50) * -1 * kierunek + (kierunek === 1 ? 0 : 0)}`,
        },
      });

      // scroll podkreca tempo; znak predkosci odwraca kierunek
      let wygaszanie: gsap.core.Tween | null = null;
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-9, 9, self.getVelocity() / 220);
          if (Math.abs(v) > 1) {
            tw.timeScale(v);
            wygaszanie?.kill();
            wygaszanie = gsap.to(tw, { timeScale: v < 0 ? -1 : 1, duration: 1.2, ease: "power2.out" });
          }
        },
      });
    });

    return () => ctx.revert();
  }, [kierunek]);

  const polowa = [...slowa, ...slowa];

  return (
    <div
      className={`pointer-events-none relative z-10 select-none overflow-hidden border-y border-huk-red/25 bg-huk-p1/70 py-4 backdrop-blur-[2px] sm:py-5 ${klasa}`}
      aria-hidden="true"
    >
      <div ref={tor} role="presentation" className="flex w-max items-center gap-8 whitespace-nowrap pr-8 sm:gap-12 sm:pr-12">
        {[...polowa, ...polowa].map((slowo, i) => (
          <span
            key={i}
            className={`font-display text-3xl uppercase leading-none tracking-wide sm:text-5xl ${
              i % 2 === 0 ? "tekst-metal" : "marquee-obrys"
            }`}
          >
            {slowo}
            <span className="ml-8 inline-block h-2 w-2 rotate-45 bg-huk-red align-middle shadow-neon sm:ml-12" />
          </span>
        ))}
      </div>
    </div>
  );
}
