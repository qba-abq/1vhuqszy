"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/animacje";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

type Props = {
  href: string;
  children: React.ReactNode;
  wariant?: "pelny" | "obrys";
  zewnetrzny?: boolean;
  klasa?: string;
};

const SKOS = "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)";

/**
 * Przycisk w stylu paneli kanału: ścięte rogi, czerwień, strzałki.
 * Na myszce jest „magnetyczny": lekko ciągnie się do kursora.
 */
export default function PrzyciskCTA({
  href,
  children,
  wariant = "pelny",
  zewnetrzny = true,
  klasa = "",
}: Props) {
  const el = useRef<HTMLAnchorElement>(null);

  const przyciagnij = (e: React.PointerEvent) => {
    const a = el.current;
    if (!a || e.pointerType !== "mouse" || ruchOgraniczony()) return;
    const r = a.getBoundingClientRect();
    gsap.to(a, {
      x: (e.clientX - r.left - r.width / 2) * 0.28,
      y: (e.clientY - r.top - r.height / 2) * 0.34,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const pusc = () => {
    if (el.current) gsap.to(el.current, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.55)" });
  };

  const bazowe =
    "group relative inline-flex items-center gap-3 px-7 py-4 font-sans text-sm font-extrabold uppercase tracking-[0.18em] transition-all duration-300 will-change-transform";

  const styl =
    wariant === "pelny"
      ? "bg-huk-red text-white hover:bg-huk-red-hot hover:shadow-neon-mocny"
      : "border border-huk-linia2 text-huk-t1 hover:border-huk-red hover:text-white hover:shadow-neon";

  return (
    <Link
      ref={el}
      onPointerMove={przyciagnij}
      onPointerLeave={pusc}
      href={href}
      target={zewnetrzny ? "_blank" : undefined}
      rel={zewnetrzny ? "noopener noreferrer" : undefined}
      className={`${bazowe} ${styl} ${klasa}`}
      style={{ clipPath: SKOS }}
    >
      <span className="text-huk-white/60 transition-transform duration-300 group-hover:translate-x-1">
        &gt;
      </span>
      {children}
      <span className="text-huk-white/60 transition-transform duration-300 group-hover:translate-x-1">
        &gt;&gt;
      </span>
    </Link>
  );
}
