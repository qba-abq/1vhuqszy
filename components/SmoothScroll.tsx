"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animacje";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

/**
 * Smooth scroll (Lenis) spięty z tickerem GSAP i ScrollTriggerem.
 * Przy prefers-reduced-motion Lenis w ogóle nie startuje — zostaje natywny scroll.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (ruchOgraniczony()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: false, // klatki dostarcza ticker GSAP (jedna pętla rAF na całą stronę)
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (czas: number) => lenis.raf(czas * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
