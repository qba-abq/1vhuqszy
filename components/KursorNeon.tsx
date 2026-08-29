"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animacje";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

/**
 * Własny kursor: czerwona kropka + obwódka wleczona z opóźnieniem.
 * Nad linkami i przyciskami obwódka rośnie. Tylko mysz (pointer: fine),
 * na dotyku i przy reduced-motion nie istnieje.
 */
export default function KursorNeon() {
  const kropka = useRef<HTMLDivElement>(null);
  const obwod = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ruchOgraniczony() || !window.matchMedia("(pointer: fine)").matches) return;

    document.body.classList.add("ma-kursor");

    const kx = gsap.quickTo(kropka.current, "x", { duration: 0.08, ease: "power2.out" });
    const ky = gsap.quickTo(kropka.current, "y", { duration: 0.08, ease: "power2.out" });
    const ox = gsap.quickTo(obwod.current, "x", { duration: 0.32, ease: "power2.out" });
    const oy = gsap.quickTo(obwod.current, "y", { duration: 0.32, ease: "power2.out" });

    const ruch = (e: PointerEvent) => {
      kx(e.clientX);
      ky(e.clientY);
      ox(e.clientX);
      oy(e.clientY);
    };

    // delegacja: cokolwiek klikalne = powiekszenie obwodki
    const nadCzymsKlikalnym = (e: Event) =>
      !!(e.target as Element | null)?.closest?.("a, button, [role='button']");
    const najazd = (e: Event) => {
      if (nadCzymsKlikalnym(e)) obwod.current?.classList.add("na-linku");
    };
    const zjazd = (e: Event) => {
      if (nadCzymsKlikalnym(e)) obwod.current?.classList.remove("na-linku");
    };

    window.addEventListener("pointermove", ruch, { passive: true });
    document.addEventListener("pointerover", najazd, { passive: true });
    document.addEventListener("pointerout", zjazd, { passive: true });

    return () => {
      document.body.classList.remove("ma-kursor");
      window.removeEventListener("pointermove", ruch);
      document.removeEventListener("pointerover", najazd);
      document.removeEventListener("pointerout", zjazd);
    };
  }, []);

  return (
    <>
      <div ref={obwod} className="kursor-obwod hidden md:block" aria-hidden="true" />
      <div ref={kropka} className="kursor-kropka hidden md:block" aria-hidden="true" />
    </>
  );
}
