"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/site.config";
import { gsap, ScrollTrigger } from "@/lib/animacje";

const POZYCJE = [
  { id: "o-mnie", etykieta: "O mnie" },
  { id: "harmonogram", etykieta: "Harmonogram" },
  { id: "klipy", etykieta: "Klipy" },
  { id: "sklep", etykieta: "Merch" },
  { id: "kontakt", etykieta: "Social" },
] as const;

/**
 * Pasek nawigacji: chowa się w hero, wjeżdża po jego opuszczeniu
 * i podświetla sekcję, w której aktualnie jesteś.
 */
export default function Nawigacja() {
  const pasek = useRef<HTMLElement>(null);
  const [aktywna, setAktywna] = useState<string | null>(null);

  useEffect(() => {
    const el = pasek.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { yPercent: -100 });

      // pasek pojawia się dopiero, gdy hero jest za nami
      ScrollTrigger.create({
        trigger: "#hero",
        start: "bottom 30%",
        onEnter: () => gsap.to(el, { yPercent: 0, duration: 0.5, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(el, { yPercent: -100, duration: 0.4, ease: "power2.in" }),
      });

      // podświetlenie aktywnej sekcji
      POZYCJE.forEach(({ id }) => {
        const sekcja = document.getElementById(id);
        if (!sekcja) return;
        ScrollTrigger.create({
          trigger: sekcja,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && setAktywna(id),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={pasek}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-huk-ink/85 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link
          href="#hero"
          className="flex items-center gap-2.5"
          aria-label={`${site.nick} — początek strony`}
        >
          <Image
            src={site.assety.awatar}
            alt=""
            width={34}
            height={34}
            className="rounded-full border border-huk-red/60"
          />
          <span className="tekst-metal font-display text-xl leading-none sm:text-2xl">{site.nick}</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {POZYCJE.map((p) => (
            <li key={p.id}>
              <Link
                href={`#${p.id}`}
                className={`relative text-[0.7rem] font-bold uppercase tracking-[0.18em] transition-colors duration-200 ${
                  aktywna === p.id ? "text-huk-white" : "text-white/55 hover:text-white/85"
                }`}
              >
                {p.etykieta}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-huk-red transition-all duration-300 ${
                    aktywna === p.id ? "w-full shadow-neon" : "w-0"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={site.linki.twitch}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-huk-red px-4 py-2 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-huk-red-hot hover:shadow-neon"
          style={{
            clipPath:
              "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
          }}
        >
          Oglądaj live
        </Link>
      </nav>
    </header>
  );
}
