"use client";

import { useRef } from "react";
import { gsap } from "@/lib/animacje";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

type Props = {
  children: React.ReactNode;
  /** Maksymalny przechył w stopniach. */
  sila?: number;
  klasa?: string;
};

/** Karta z przechyłem 3D podążającym za kursorem. Na dotyku i przy reduced-motion nieaktywna. */
export default function KartaTilt({ children, sila = 9, klasa = "" }: Props) {
  const el = useRef<HTMLDivElement>(null);

  const ruch = (e: React.PointerEvent<HTMLDivElement>) => {
    const karta = el.current;
    if (!karta || e.pointerType !== "mouse" || ruchOgraniczony()) return;

    const r = karta.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    gsap.to(karta, {
      rotateY: x * sila * 2,
      rotateX: -y * sila * 2,
      scale: 1.03,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 900,
      transformOrigin: "center",
    });
  };

  const wyjscie = () => {
    if (!el.current) return;
    gsap.to(el.current, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: "power3.out" });
  };

  return (
    <div
      ref={el}
      onPointerMove={ruch}
      onPointerLeave={wyjscie}
      className={`will-change-transform ${klasa}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
