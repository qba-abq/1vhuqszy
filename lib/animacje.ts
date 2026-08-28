"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ruchOgraniczony } from "./useRuchDozwolony";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };

/** Domyślne easingi projektu — szybkie wejście, miękkie wyhamowanie. */
export const EASE = {
  wejscie: "power3.out",
  wyjscie: "power2.in",
  ostre: "expo.out",
} as const;

type OpcjeWejscia = {
  /** Element wyzwalający (domyślnie: pierwszy z celów). */
  trigger?: Element | null;
  /** Przesunięcie startowe w px. */
  y?: number;
  opoznienie?: number;
  odstep?: number;
  czas?: number;
  start?: string;
};

/**
 * Wejście elementów: fade + slide ze staggerem, wyzwalane scrollem.
 * Przy reduced-motion elementy po prostu są widoczne (bez animacji).
 */
export function animujWejscie(
  cele: gsap.TweenTarget,
  { trigger, y = 48, opoznienie = 0, odstep = 0.13, czas = 1.05, start = "top 85%" }: OpcjeWejscia = {},
) {
  const lista = gsap.utils.toArray<Element>(cele);
  if (!lista.length) return;

  if (ruchOgraniczony()) {
    gsap.set(lista, { opacity: 1, y: 0, clearProps: "transform" });
    return;
  }

  return gsap.fromTo(
    lista,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: czas,
      delay: opoznienie,
      stagger: odstep,
      ease: EASE.wejscie,
      scrollTrigger: { trigger: trigger ?? lista[0], start, once: true },
    },
  );
}

/**
 * Maska tekstowa: linie wyjeżdżają zza krawędzi.
 *
 * `autoSplit` przelicza podział przy zmianie szerokości okna — bez tego linie
 * zostają zawinięte po staremu i po resize tekst potrafi zniknąć.
 * `mask: "lines"` sam robi kontenery z overflow: hidden.
 */
export async function maskaTekstu(
  el: Element | null,
  { opoznienie = 0, odstep = 0.16, start = "top 85%" } = {},
) {
  if (!el) return;

  if (ruchOgraniczony()) {
    gsap.set(el, { opacity: 1 });
    return;
  }

  // Bez tego SplitText policzyłby linie dla fontu zastępczego.
  if (typeof document !== "undefined" && document.fonts) {
    await document.fonts.ready;
  }

  gsap.set(el, { opacity: 1 });

  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    // domyślne "auto" dokleja aria-label, który na <p> jest niedozwolony;
    // tekst i tak zostaje w DOM, więc czytniki ekranu nic nie tracą
    aria: "none",
    linesClass: "maska-linia",
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.25,
        delay: opoznienie,
        stagger: odstep,
        ease: EASE.ostre,
        scrollTrigger: { trigger: el, start, once: true },
      }),
  });
}

/**
 * Parallax: element przesuwa się wolniej/szybciej niż strona.
 * sila > 0 = element „zostaje w tyle".
 */
export function paralaksa(el: Element | null, sila = 0.2, trigger?: Element | null) {
  if (!el || ruchOgraniczony()) return;

  return gsap.fromTo(
    el,
    { yPercent: -sila * 50 },
    {
      yPercent: sila * 50,
      ease: "none",
      scrollTrigger: {
        trigger: trigger ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}
