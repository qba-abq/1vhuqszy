"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { site } from "@/site.config";
import dane from "@/lib/dane/krzykometr.json";
import { gsap, ScrollTrigger, animujWejscie } from "@/lib/animacje";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";
import NaglowekSekcji from "@/components/ui/NaglowekSekcji";

/* ——— dane ———————————————————————————————————————————————————————————
   Format pliku opisuje scripts/krzykometr-analiza.mjs. Wszystkie poziomy
   są w dB względem tła (mediany streamu), stąd „+18 dB nad tłem".        */

type Szczyt = { t: number; db: number };
type DaneStreamu = {
  id: string;
  data?: string;
  czasTrwania: number;
  krok: number;
  tloDbfs: number;
  prog: number;
  podloga: number;
  krzykiNaGodzine: number;
  poziomy: number[];
  szczyty: Szczyt[];
};
type Stream = DaneStreamu & {
  tytul: string;
  gra: string;
  link: string;
  najglosniejszy: Szczyt;
  /** sekunda szczytu -> miejsce w rankingu głośności (1 = najgłośniej) */
  ranking: Map<number, number>;
};

const MOCK = site.krzykometr.mock;
const PODPISY: Record<string, Record<number, string>> = site.krzykometr.podpisy;

const STREAMY: Stream[] = (dane.streamy as DaneStreamu[]).flatMap((s) => {
  const klip = site.klipy.find((k) => k.id === s.id);
  if (!klip || !s.szczyty.length) return [];
  const wgGlosnosci = [...s.szczyty].sort((a, b) => b.db - a.db);
  return [
    {
      ...s,
      tytul: klip.tytul,
      gra: klip.opis,
      link: klip.link,
      najglosniejszy: wgGlosnosci[0],
      ranking: new Map(wgGlosnosci.map((p, i) => [p.t, i + 1])),
    },
  ];
});

/* ——— formatowanie ————————————————————————————————————————————————— */

const dwa = (n: number) => String(n).padStart(2, "0");
const rozbij = (s: number) => [Math.floor(s / 3600), Math.floor((s % 3600) / 60), Math.floor(s % 60)];

function fmtDb(v: number, miejsca = 1) {
  const liczba = Math.abs(v).toLocaleString("pl-PL", {
    minimumFractionDigits: miejsca,
    maximumFractionDigits: miejsca,
  });
  return `${v < 0 ? "−" : "+"}${liczba} dB`;
}
function fmtCzas(s: number) {
  const [h, m, sek] = rozbij(s);
  return `${h}:${dwa(m)}:${dwa(sek)}`;
}
function fmtDlugosc(s: number) {
  const [h, m] = rozbij(s);
  return `${h} h ${dwa(m)} min`;
}
function fmtData(iso?: string) {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
/** Twitch przyjmuje ?t=1h2m3s i otwiera VOD dokładnie w tej sekundzie. */
function linkWChwili(link: string, t: number) {
  const [h, m, s] = rozbij(t);
  return `${link}?t=${h}h${m}m${s}s`;
}

/* ——— geometria ———————————————————————————————————————————————————— */

const MARGINES_GORA = 40; // etykiety szczytów
const MARGINES_DOL = 30; // oś czasu
const PODLOGA_RYSOWANIA = -6; // dB nad tłem, które rysujemy jako ciszę
const PROMIEN_TRAFIENIA = 14; // px: tak blisko kursora szczyt uznajemy za „trafiony"

/**
 * Fala jest symetryczna jak w edytorze audio: środek = cisza, krawędź =
 * najgłośniejszy moment. Kolumn jest tyle, ile się mieści (~1 na 1,5 px),
 * a każda bierze MAKSIMUM swoich kubełków, żeby żaden krzyk nie zniknął.
 */
function geometria(s: Stream, W: number, H: number) {
  const h = H - MARGINES_GORA - MARGINES_DOL;
  const cy = MARGINES_GORA + h / 2;
  const maks = Math.max(s.prog + 10, ...s.poziomy) + 1;
  // Środek fali rysujemy od PODLOGA_RYSOWANIA, a nie od podłogi z danych:
  // zwykłe gadanie zostaje cienkim pasem, pauzy spadają do zera, a krzyki
  // mają całą wysokość dla siebie.
  const dno = Math.max(s.podloga, PODLOGA_RYSOWANIA);
  const amp = (v: number) => ((Math.max(v, dno) - dno) / (maks - dno)) * (h / 2);

  const n = s.poziomy.length;
  const kol = Math.max(2, Math.min(n, Math.floor(W / 1.5)));
  const pkt: number[] = [];
  for (let c = 0; c < kol; c++) {
    const a = Math.floor((c * n) / kol);
    const b = Math.max(a + 1, Math.floor(((c + 1) * n) / kol));
    let m = -Infinity;
    for (let i = a; i < b; i++) m = Math.max(m, s.poziomy[i]);
    pkt.push(m);
  }

  const xKol = (c: number) => (c / (kol - 1)) * W;
  const xCzasu = (t: number) => (t / s.czasTrwania) * W;
  const kolCzasu = (t: number) => Math.min(kol - 1, Math.max(0, Math.round((t / s.czasTrwania) * (kol - 1))));
  const czasKol = (c: number) => (c / (kol - 1)) * s.czasTrwania;

  const gorna = pkt.map((v, c) => `${c ? "L" : "M"}${xKol(c).toFixed(1)},${(cy - amp(v)).toFixed(1)}`).join("");
  let dolna = "";
  for (let c = kol - 1; c >= 0; c--) dolna += `L${xKol(c).toFixed(1)},${(cy + amp(pkt[c])).toFixed(1)}`;
  const dolnaLinia = "M" + dolna.slice(1);

  return { h, cy, amp, kol, pkt, xKol, xCzasu, kolCzasu, czasKol, gorna, dolnaLinia, obszar: `${gorna}${dolna}Z` };
}

type Geometria = ReturnType<typeof geometria>;

/* ——— mini fala w zakładce ————————————————————————————————————————— */

function MiniFala({ s }: { s: Stream }) {
  const W = 120;
  const H = 28;
  const d = useMemo(() => {
    const g = geometria(s, W * 0.75, H + MARGINES_GORA + MARGINES_DOL); // ~80 kolumn
    const skala = W / (W * 0.75);
    return g.obszar.replace(/([ML])([\d.]+),([\d.]+)/g, (_, k, x, y) => {
      return `${k}${(Number(x) * skala).toFixed(1)},${(Number(y) - MARGINES_GORA).toFixed(1)}`;
    });
  }, [s]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-7 w-full" preserveAspectRatio="none" aria-hidden>
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/* ——— sekcja ——————————————————————————————————————————————————————— */

export default function Krzykometr() {
  const sekcja = useRef<HTMLElement>(null);
  const ramka = useRef<HTMLDivElement>(null);
  const klip = useRef<SVGRectElement>(null);
  const glowica = useRef<SVGGElement>(null);
  const kropka = useRef<SVGCircleElement>(null);
  const odczyt = useRef<HTMLSpanElement>(null);

  const [aktywny, setAktywny] = useState(0);
  const [W, setW] = useState(0);
  const [H, setH] = useState(300);
  const [kursor, setKursor] = useState<number | null>(null);
  const [rysuje, setRysuje] = useState(false);

  const idGradientu = useId().replace(/:/g, "");
  const s = STREAMY[aktywny];
  const g = useMemo(() => (W && s ? geometria(s, W, H) : null), [s, W, H]);

  /* stan animacji trzymany poza Reactem: GSAP pisze prosto w atrybuty SVG */
  const geo = useRef<Geometria | null>(null);
  const postep = useRef(0);
  const widoczny = useRef(false);
  const tween = useRef<gsap.core.Tween | null>(null);

  const ustawPostep = useCallback((p: number) => {
    postep.current = p;
    const gg = geo.current;
    if (!gg || !klip.current || !glowica.current || !kropka.current) return;
    const x = p * gg.xKol(gg.kol - 1);
    const c = Math.min(gg.kol - 1, Math.round(p * (gg.kol - 1)));
    klip.current.setAttribute("width", String(x));
    glowica.current.setAttribute("transform", `translate(${x.toFixed(1)},0)`);
    glowica.current.style.opacity = p > 0 && p < 1 ? "1" : "0";
    kropka.current.setAttribute("cy", (gg.cy - gg.amp(gg.pkt[c])).toFixed(1));
    if (odczyt.current && p < 1) {
      odczyt.current.textContent = `${fmtDb(gg.pkt[c])} · ${fmtCzas(gg.czasKol(c))}`;
    }
  }, []);

  const rysuj = useCallback(
    (czas: number) => {
      tween.current?.kill();
      if (ruchOgraniczony()) {
        ustawPostep(1);
        setRysuje(false);
        return;
      }
      const stan = { p: 0 };
      setRysuje(true);
      setKursor(null);
      tween.current = gsap.to(stan, {
        p: 1,
        duration: czas,
        ease: "power1.inOut",
        onUpdate: () => ustawPostep(stan.p),
        onComplete: () => setRysuje(false),
      });
    },
    [ustawPostep],
  );

  // szerokość wykresu = szerokość ramki; rysujemy w prawdziwych pikselach,
  // żeby tekst i kreski nie rozciągały się jak przy viewBox + preserveAspectRatio
  useEffect(() => {
    const el = ramka.current;
    if (!el) return;
    const zmierz = (szer: number) => {
      setW(Math.round(szer));
      setH(szer < 640 ? 230 : 320);
    };
    // pierwszy pomiar od razu: ResizeObserver czeka na klatkę renderowania,
    // której karta w tle (albo ukryty iframe) potrafi nie dostać
    zmierz(el.clientWidth);
    const ro = new ResizeObserver(([wpis]) => zmierz(wpis.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // po każdej zmianie geometrii odtwórz bieżący stan rysowania (resize, nowa zakładka)
  useLayoutEffect(() => {
    geo.current = g;
    ustawPostep(postep.current);
  }, [g, ustawPostep]);

  // pierwsze rysowanie: gdy wykres wjedzie w kadr
  useEffect(() => {
    const el = sekcja.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      animujWejscie("[data-wejscie]", { trigger: el, y: 40, odstep: 0.1, start: "top 78%" });
      ScrollTrigger.create({
        trigger: ramka.current,
        start: "top 72%",
        once: true,
        onEnter: () => {
          widoczny.current = true;
          rysuj(2.8);
        },
      });
    }, el);
    return () => {
      tween.current?.kill();
      ctx.revert();
    };
  }, [rysuj]);

  const zmienStream = (i: number) => {
    if (i === aktywny) return;
    setAktywny(i);
    setKursor(null);
    if (widoczny.current) {
      postep.current = 0;
      rysuj(1.2);
    }
  };

  // statystyki wjeżdżają od nowa przy zmianie zakładki
  useEffect(() => {
    if (!widoczny.current || ruchOgraniczony()) return;
    const kafle = sekcja.current?.querySelectorAll("[data-kstat]");
    if (!kafle?.length) return;
    gsap.fromTo(kafle, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" });
  }, [aktywny]);

  /* ——— interakcja ——— */

  const trafiony = useMemo(() => {
    if (!g || !s || kursor === null) return null;
    const x = g.xKol(kursor);
    let najblizszy: Szczyt | null = null;
    let odl = PROMIEN_TRAFIENIA;
    for (const p of s.szczyty) {
      const d = Math.abs(g.xCzasu(p.t) - x);
      if (d <= odl) {
        odl = d;
        najblizszy = p;
      }
    }
    return najblizszy;
  }, [g, s, kursor]);

  const otworzMoment = (p: Szczyt | null) => {
    if (!p || MOCK || !s) return;
    window.open(linkWChwili(s.link, p.t), "_blank", "noopener,noreferrer");
  };

  const naRuch = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!g || rysuje) return;
    const r = e.currentTarget.getBoundingClientRect();
    const c = Math.round(((e.clientX - r.left) / r.width) * (g.kol - 1));
    setKursor(Math.max(0, Math.min(g.kol - 1, c)));
  };

  const naKlawisz = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!g || !s) return;
    const krok = Math.max(1, Math.round(g.kol / 100));
    const teraz = kursor ?? g.kolCzasu(s.najglosniejszy.t);
    const ruch: Record<string, number> = {
      ArrowRight: teraz + krok,
      ArrowLeft: teraz - krok,
      Home: 0,
      End: g.kol - 1,
    };
    if (e.key in ruch) {
      e.preventDefault();
      setKursor(Math.max(0, Math.min(g.kol - 1, ruch[e.key])));
    } else if (e.key === "Enter") {
      otworzMoment(trafiony);
    } else if (e.key === "Escape") {
      setKursor(null);
    }
  };

  if (!STREAMY.length || !s) return null;

  /* ——— elementy wykresu zależne od rozmiaru ——— */

  const krokOsi = W < 640 ? 3600 : 1800;
  const znaczniki: number[] = [];
  for (let t = krokOsi; t < s.czasTrwania - krokOsi * 0.25; t += krokOsi) znaczniki.push(t);

  // podpisy tylko przy 3 najgłośniejszych i tylko jeśli się nie zderzają
  const podpisane: number[] = [];
  if (g) {
    for (const p of [...s.szczyty].sort((a, b) => b.db - a.db).slice(0, 3)) {
      const x = g.xCzasu(p.t);
      if (podpisane.every((t) => Math.abs(g.xCzasu(t) - x) > 64)) podpisane.push(p.t);
    }
  }
  const yKolumny = (gg: Geometria, t: number, db: number) =>
    gg.cy - gg.amp(Math.max(db, gg.pkt[gg.kolCzasu(t)])) - 7;

  const wartoscKursora = g && kursor !== null ? g.pkt[kursor] : null;
  const xKursora = g && kursor !== null ? g.xKol(kursor) : 0;
  const dymekWLewo = xKursora > W - 210;
  const opisTrafionego = trafiony ? PODPISY[s.id]?.[trafiony.t] : undefined;

  return (
    <section
      ref={sekcja}
      id="krzykometr"
      className="relative overflow-hidden bg-huk-p1/92 px-6 py-24 sm:py-32"
      aria-label="Krzykometr: głośność streamów"
    >
      <div className="halftone pointer-events-none absolute right-8 top-16 h-32 w-32 opacity-15" />

      <div className="mx-auto max-w-6xl">
        <NaglowekSekcji nadtytul="streamy, które słychać">Krzykometr</NaglowekSekcji>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4" data-wejscie style={{ opacity: 0 }}>
          <p className="max-w-2xl text-base leading-relaxed text-huk-t2 sm:text-lg">
            Głośność całego streamu, od pierwszej do ostatniej minuty. Każdy szczyt to krzyk,
            jumpscare albo wybuch śmiechu. Im wyżej, tym bardziej poniosło.
          </p>
          {MOCK && (
            <span
              className="podtytul rounded-full border border-huk-linia2 px-3 py-1.5 text-[0.62rem] text-huk-t3"
              title="Wykres pokazuje dane poglądowe. Prawdziwe pomiary VOD-ów pojawią się wkrótce."
            >
              dane przykładowe
            </span>
          )}
        </div>

        {/* ——— zakładki: jeden stream na raz ——— */}
        <div
          role="tablist"
          aria-label="Wybierz stream"
          className="mt-10 grid grid-cols-2 gap-2 lg:grid-cols-4"
          data-wejscie
          style={{ opacity: 0 }}
        >
          {STREAMY.map((st, i) => {
            const wybrany = i === aktywny;
            return (
              <button
                key={st.id}
                role="tab"
                aria-selected={wybrany}
                aria-controls="krzykometr-wykres"
                onClick={() => zmienStream(i)}
                className={`group border px-4 pb-3 pt-3.5 text-left transition-colors duration-300 ${
                  wybrany
                    ? "border-huk-red/70 bg-huk-p3"
                    : "border-huk-linia bg-huk-p2/70 hover:border-huk-linia2 hover:bg-huk-p2"
                }`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className={`truncate text-sm font-semibold ${wybrany ? "text-huk-t1" : "text-huk-t2"}`}>
                    {st.gra}
                  </span>
                  <span className="shrink-0 font-display text-sm text-huk-t3">{fmtDb(st.najglosniejszy.db, 0)}</span>
                </span>
                <span
                  className={`mt-2 block transition-colors duration-300 ${
                    wybrany ? "text-huk-red" : "text-huk-t3/60 group-hover:text-huk-red/70"
                  }`}
                >
                  <MiniFala s={st} />
                </span>
              </button>
            );
          })}
        </div>

        {/* ——— statystyki wybranego streamu ——— */}
        <dl className="mt-6 grid grid-cols-3 gap-2" data-wejscie style={{ opacity: 0 }}>
          {[
            {
              etykieta: "Najgłośniej",
              wartosc: fmtDb(s.najglosniejszy.db, 0),
              dopisek: `w ${fmtCzas(s.najglosniejszy.t)}`,
            },
            {
              etykieta: "Krzyki / h",
              wartosc: s.krzykiNaGodzine.toLocaleString("pl-PL", { maximumFractionDigits: 1 }),
              dopisek: `≥ ${fmtDb(s.prog, 0)} nad tłem`,
            },
            { etykieta: "Długość", wartosc: fmtDlugosc(s.czasTrwania), dopisek: fmtData(s.data) },
          ].map((k) => (
            <div key={k.etykieta} data-kstat className="border border-huk-linia bg-huk-p2/70 px-3 py-3 sm:px-5 sm:py-4">
              {/* bez .podtytul: jego rozstrzelenie 0.32em nie mieści się w kaflu na telefonie */}
              <dt className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.12em] text-huk-t3 sm:text-[0.66rem] sm:tracking-[0.28em]">
                {k.etykieta}
              </dt>
              <dd className="mt-1.5 font-display text-[1.3rem] leading-none text-huk-t1 sm:text-4xl">{k.wartosc}</dd>
              <dd className="mt-1.5 text-xs text-huk-t3">{k.dopisek}</dd>
            </div>
          ))}
        </dl>

        {/* ——— wykres ——— */}
        <figure className="mt-6 border border-huk-linia bg-huk-p0/80" data-wejscie style={{ opacity: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-huk-linia px-4 py-3 sm:px-5">
            <figcaption className="text-sm text-huk-t2">
              <span className="font-semibold text-huk-t1">{s.tytul}</span>
              <span className="text-huk-t3"> · głośność względem typowego gadania</span>
            </figcaption>
            <span className="text-xs text-huk-t3">
              {rysuje ? (
                <>
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-huk-red align-middle" />
                  <span ref={odczyt} className="tabular-nums" />
                </>
              ) : (
                <span>
                  <span className="hidden sm:inline">Najedź na falę</span>
                  <span className="sm:hidden">Przesuń palcem po fali</span>
                  {MOCK ? "" : ", kliknij szczyt, żeby obejrzeć ten moment"}
                </span>
              )}
            </span>
          </div>

          <div ref={ramka} className="relative mx-4 sm:mx-5" style={{ height: H }}>
            {g && (
              <svg
                width={W}
                height={H}
                className="absolute inset-0 overflow-visible"
                role="img"
                aria-label={`Głośność streamu ${s.tytul}: najgłośniejszy moment ${fmtDb(s.najglosniejszy.db)} nad tłem w ${fmtCzas(s.najglosniejszy.t)}, ${s.krzykiNaGodzine} krzyków na godzinę. Szczegóły w tabeli pod wykresem.`}
              >
                <defs>
                  <linearGradient
                    id={`fala-${idGradientu}`}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    x2="0"
                    y1={g.cy - g.h / 2}
                    y2={g.cy + g.h / 2}
                  >
                    <stop offset="0" style={{ stopColor: "var(--akcent-jasny)", stopOpacity: 1 }} />
                    <stop offset="0.32" style={{ stopColor: "var(--akcent)", stopOpacity: 0.7 }} />
                    <stop offset="0.5" style={{ stopColor: "var(--akcent-ciemny)", stopOpacity: 0.35 }} />
                    <stop offset="0.68" style={{ stopColor: "var(--akcent)", stopOpacity: 0.7 }} />
                    <stop offset="1" style={{ stopColor: "var(--akcent-jasny)", stopOpacity: 1 }} />
                  </linearGradient>
                  <clipPath id={`klip-${idGradientu}`}>
                    <rect ref={klip} x="0" y="-20" width="0" height={H + 40} />
                  </clipPath>
                  <filter id={`blask-${idGradientu}`} x="-10%" y="-50%" width="120%" height="200%">
                    <feGaussianBlur stdDeviation="4" />
                  </filter>
                </defs>

                {/* siatka czasu */}
                {znaczniki.map((t) => (
                  <g key={t} transform={`translate(${g.xCzasu(t).toFixed(1)},0)`}>
                    <line y1={MARGINES_GORA - 8} y2={H - MARGINES_DOL} stroke="var(--linia)" />
                    <text y={H - 10} textAnchor="middle" className="fill-huk-t3 text-[11px] tabular-nums">
                      {fmtCzas(t).slice(0, -3)}
                    </text>
                  </g>
                ))}

                {/* oś ciszy + progi krzyku (symetrycznie, podpis tylko u góry) */}
                <line x1={0} x2={W} y1={g.cy} y2={g.cy} stroke="var(--linia2)" />
                {[-1, 1].map((znak) => (
                  <line
                    key={znak}
                    x1={0}
                    x2={W}
                    y1={g.cy + znak * g.amp(s.prog)}
                    y2={g.cy + znak * g.amp(s.prog)}
                    stroke="var(--linia2)"
                  />
                ))}

                {/* fala: rysowana „igłą sejsmografu" przez clipPath */}
                <g clipPath={`url(#klip-${idGradientu})`}>
                  <g filter={`url(#blask-${idGradientu})`} opacity={0.55}>
                    <path d={g.gorna} fill="none" stroke="var(--akcent)" strokeWidth={2} />
                    <path d={g.dolnaLinia} fill="none" stroke="var(--akcent)" strokeWidth={2} />
                  </g>
                  <path d={g.obszar} fill={`url(#fala-${idGradientu})`} />
                  <path d={g.gorna} fill="none" stroke="var(--akcent-jasny)" strokeWidth={1.25} strokeLinejoin="round" />
                  <path d={g.dolnaLinia} fill="none" stroke="var(--akcent-jasny)" strokeWidth={1.25} strokeLinejoin="round" />

                  {/* szczyty */}
                  {s.szczyty.map((p) => {
                    const x = g.xCzasu(p.t);
                    const y = yKolumny(g, p.t, p.db);
                    const aktywnyPunkt = trafiony?.t === p.t;
                    return (
                      <g key={p.t}>
                        <circle
                          cx={x}
                          cy={y}
                          r={aktywnyPunkt ? 6 : 4}
                          fill={aktywnyPunkt ? "var(--akcent-jasny)" : "var(--pow0)"}
                          stroke="var(--akcent-jasny)"
                          strokeWidth={2}
                        />
                        {podpisane.includes(p.t) && (
                          <text
                            x={Math.min(W - 24, Math.max(24, x))}
                            y={y - 12}
                            textAnchor="middle"
                            className="fill-huk-t1 font-display text-[15px] tabular-nums"
                          >
                            {fmtDb(p.db, 0)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* podpis progu nad falą, nie pod nią */}
                <text
                  x={W}
                  y={g.cy - g.amp(s.prog) - 6}
                  textAnchor="end"
                  className="fill-huk-t2 text-[11px]"
                  // obwódka w kolorze tła: podpis czytelny także na tle fali
                  style={{ paintOrder: "stroke", stroke: "var(--pow0)", strokeWidth: 4, strokeLinejoin: "round" }}
                >
                  próg krzyku {fmtDb(s.prog, 0)}
                </text>

                {/* głowica rysująca */}
                <g ref={glowica} style={{ opacity: 0 }} aria-hidden>
                  <line y1={MARGINES_GORA - 12} y2={H - MARGINES_DOL} stroke="var(--akcent-jasny)" strokeWidth={1} />
                  <circle ref={kropka} r={5} fill="var(--akcent-jasny)" style={{ filter: "drop-shadow(0 0 6px var(--akcent))" }} />
                </g>

                {/* celownik */}
                {kursor !== null && !rysuje && wartoscKursora !== null && (
                  <g transform={`translate(${xKursora.toFixed(1)},0)`} aria-hidden>
                    <line y1={MARGINES_GORA - 12} y2={H - MARGINES_DOL} stroke="var(--tekst2)" strokeWidth={1} />
                    <circle cy={g.cy - g.amp(wartoscKursora)} r={4} fill="var(--tekst1)" />
                    <circle cy={g.cy + g.amp(wartoscKursora)} r={4} fill="var(--tekst1)" />
                  </g>
                )}
              </svg>
            )}

            {/* warstwa interakcji: większa niż fala, wskaźnik i klawiatura */}
            <div
              id="krzykometr-wykres"
              role="slider"
              tabIndex={0}
              aria-label="Pozycja na osi czasu streamu. Strzałki przesuwają, Enter otwiera szczyt."
              aria-valuemin={0}
              aria-valuemax={s.czasTrwania}
              aria-valuenow={g && kursor !== null ? Math.round(g.czasKol(kursor)) : 0}
              aria-valuetext={
                g && kursor !== null && wartoscKursora !== null
                  ? `${fmtCzas(g.czasKol(kursor))}, ${fmtDb(wartoscKursora)} nad tłem`
                  : "brak zaznaczenia"
              }
              className={`absolute inset-0 touch-pan-y outline-none focus-visible:ring-1 focus-visible:ring-huk-red/70 ${
                trafiony && !MOCK ? "cursor-pointer" : "cursor-crosshair"
              }`}
              onPointerMove={naRuch}
              onPointerDown={naRuch}
              onPointerLeave={(e) => e.pointerType === "mouse" && setKursor(null)}
              onClick={() => otworzMoment(trafiony)}
              onKeyDown={naKlawisz}
              onFocus={() => g && kursor === null && !rysuje && setKursor(g.kolCzasu(s.najglosniejszy.t))}
              onBlur={() => setKursor(null)}
            />

            {/* dymek: wartość pierwsza, opis pod spodem */}
            {g && kursor !== null && !rysuje && wartoscKursora !== null && (
              <div
                className="pointer-events-none absolute top-0 z-10 min-w-[150px] max-w-[220px] border border-huk-linia2 bg-huk-p3/95 px-3 py-2 shadow-karta backdrop-blur"
                style={{
                  left: xKursora,
                  transform: `translateX(${dymekWLewo ? "calc(-100% - 10px)" : "10px"})`,
                }}
              >
                <p className="font-display text-xl leading-none text-huk-t1 tabular-nums">
                  {fmtDb(trafiony ? trafiony.db : wartoscKursora)}
                </p>
                <p className="mt-1 text-xs text-huk-t3 tabular-nums">
                  nad tłem · {fmtCzas(trafiony ? trafiony.t : g.czasKol(kursor))}
                </p>
                {trafiony && (
                  <p className="mt-1.5 border-t border-huk-linia pt-1.5 text-xs text-huk-t2">
                    <span className="mr-1.5 inline-block h-0.5 w-3 bg-huk-red-hot align-middle" />
                    {opisTrafionego ?? `#${s.ranking.get(trafiony.t)} najgłośniejszy moment`}
                    {!MOCK && <span className="mt-0.5 block text-huk-red-hot">▶ kliknij, by obejrzeć</span>}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* widok tabeli: każda wartość z dymka dostępna bez najeżdżania */}
          <details className="group border-t border-huk-linia px-4 py-3 text-sm sm:px-5">
            <summary className="cursor-pointer list-none text-huk-t3 transition-colors hover:text-huk-t1">
              <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
              Szczyty w tabeli ({s.szczyty.length})
            </summary>
            <table className="mt-3 w-full text-left tabular-nums">
              <thead className="text-xs text-huk-t3">
                <tr>
                  <th className="py-1.5 pr-4 font-normal">#</th>
                  <th className="py-1.5 pr-4 font-normal">Moment</th>
                  <th className="py-1.5 pr-4 font-normal">Nad tłem</th>
                  <th className="py-1.5 font-normal">Opis</th>
                </tr>
              </thead>
              <tbody>
                {[...s.szczyty]
                  .sort((a, b) => b.db - a.db)
                  .map((p) => (
                    <tr key={p.t} className="border-t border-huk-linia text-huk-t2">
                      <td className="py-1.5 pr-4 text-huk-t3">{s.ranking.get(p.t)}</td>
                      <td className="py-1.5 pr-4">
                        {MOCK ? (
                          fmtCzas(p.t)
                        ) : (
                          <a
                            href={linkWChwili(s.link, p.t)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-huk-t1 underline decoration-huk-red/60 underline-offset-4 hover:decoration-huk-red"
                          >
                            {fmtCzas(p.t)}
                          </a>
                        )}
                      </td>
                      <td className="py-1.5 pr-4 text-huk-t1">{fmtDb(p.db)}</td>
                      <td className="py-1.5 text-huk-t3">{PODPISY[s.id]?.[p.t] ?? ""}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </details>
        </figure>
      </div>
    </section>
  );
}
