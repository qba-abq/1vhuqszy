"use client";

import { useEffect, useRef } from "react";
import { maskaTekstu, animujWejscie } from "@/lib/animacje";

type Props = {
  nadtytul: string;
  children: React.ReactNode;
  /** Wyrównanie — domyślnie do lewej, jak na panelach kanału. */
  srodek?: boolean;
  klasa?: string;
};

/** Nagłówek sekcji: rozstrzelony nadtytuł z kreskami + duży tytuł z maską. */
export default function NaglowekSekcji({ nadtytul, children, srodek = false, klasa = "" }: Props) {
  const tytul = useRef<HTMLHeadingElement>(null);
  const nad = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animujWejscie(nad.current, { y: 18, czas: 0.6 });
    maskaTekstu(tytul.current);
  }, []);

  return (
    <div className={`${srodek ? "text-center" : ""} ${klasa}`}>
      <div ref={nad} className={`kreski mb-5 ${srodek ? "justify-center" : ""}`} style={{ opacity: 0 }}>
        {srodek && <span className="linia-akcent h-px w-10 sm:w-16" />}
        <span className="podtytul text-huk-red">{nadtytul}</span>
        <span className="linia-akcent h-px w-10 sm:w-16" />
      </div>

      <h2
        ref={tytul}
        className="tekst-metal text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.9]"
        style={{ opacity: 0 }}
      >
        {children}
      </h2>
    </div>
  );
}
