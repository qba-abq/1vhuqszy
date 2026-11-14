#!/usr/bin/env node
/**
 * Dane PRZYKŁADOWE dla Krzykometru, dopóki nie ma przeliczonych VOD-ów.
 *
 *   node scripts/krzykometr-demo.mjs
 *
 * Syntezuje szum o zmiennej głośności (gadanie, pauzy, krzyki, wybuchy
 * śmiechu) według profilu gry i przepuszcza go przez TEN SAM rdzeń
 * analizy co prawdziwe nagrania. Przy okazji to test rdzenia: znane
 * zdarzenia muszą wyjść jako szczyty.
 *
 * Strona pokazuje te dane z plakietką „dane przykładowe"
 * (site.config.ts -> krzykometr.mock).
 */
import { licznikOkien, analizuj } from "./krzykometr-analiza.mjs";
import { zapiszStream } from "./krzykometr.mjs";

const HZ = 2000;
const KROK_S = 0.1;

/** Deterministyczny RNG: te same dane przy każdym uruchomieniu, czysty diff. */
function rng(ziarno) {
  let a = ziarno >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Profile gier. Poziomy w dBFS.
 * zdarzenia: [ile na godzinę, min dB nad tłem, max dB, czas wygasania s]
 * sekcje: fragmenty streamu z innym tłem/częstością (np. finał challenge'u).
 */
const PROFILE = [
  {
    id: "vod-jumpscare",
    data: "2026-08-21",
    minuty: 172,
    ziarno: 7,
    tlo: -34, // horror: szept, cisza, nasłuchiwanie
    mowa: 0.55,
    zdarzenia: [[9, 16, 29, 1.2]],
    sekcje: [{ od: 0.55, do: 0.7, tlo: -37, mnoznik: 2.2 }], // najgorszy korytarz
  },
  {
    id: "vod-overcooked",
    data: "2026-08-23",
    minuty: 181,
    ziarno: 11,
    tlo: -26, // czterech ludzi drze się o cebulę
    mowa: 0.85,
    zdarzenia: [[46, 7, 15, 2.5], [4, 13, 19, 4]],
    sekcje: [{ od: 0.8, do: 0.93, tlo: -23, mnoznik: 1.6 }], // ostatni poziom
  },
  {
    id: "vod-biped",
    data: "2026-08-26",
    minuty: 158,
    ziarno: 23,
    tlo: -29,
    mowa: 0.75,
    zdarzenia: [[18, 10, 21, 4.5]], // śmiech trwa dłużej niż krzyk
    sekcje: [],
  },
  {
    id: "vod-letsfib",
    data: "2026-08-18",
    minuty: 186,
    ziarno: 42,
    tlo: -30,
    mowa: 0.7,
    zdarzenia: [[12, 10, 18, 2]],
    sekcje: [{ od: 0.84, do: 0.92, tlo: -21, mnoznik: 5, maks: 27 }], // habanero 🌶️
  },
];

function syntezuj(p) {
  const los = rng(p.ziarno);
  const gauss = () => Math.sqrt(-2 * Math.log(los() || 1e-9)) * Math.cos(2 * Math.PI * los());
  const kroki = Math.round((p.minuty * 60) / KROK_S);
  const licznik = licznikOkien(HZ);
  const probki = new Float32Array(Math.round(HZ * KROK_S));

  let dryf = 0;
  let mowi = true;
  const aktywne = []; // [dB nad tłem, pozostały czas, tau]

  for (let k = 0; k < kroki; k++) {
    const postep = k / kroki;
    const sekcja = p.sekcje.find((s) => postep >= s.od && postep < s.do);
    const tlo = sekcja?.tlo ?? p.tlo;

    dryf = Math.max(-4, Math.min(4, dryf + gauss() * 0.08));
    // mowa/pauza jako prosty łańcuch Markowa
    if (los() < (mowi ? 0.012 : 0.03)) mowi = los() < p.mowa;
    let poziom = tlo + dryf + (mowi ? gauss() * 2.5 : -11 + gauss());

    for (const [naGodz, min, max, tau] of p.zdarzenia) {
      const szansa = ((naGodz * (sekcja?.mnoznik ?? 1)) / 3600) * KROK_S;
      if (los() < szansa) {
        const gora = sekcja?.maks ?? max;
        aktywne.push([min + (gora - min) * los() ** 1.6, tau]);
      }
    }
    for (let i = aktywne.length - 1; i >= 0; i--) {
      const [db, tau] = aktywne[i];
      // sumowanie mocy: krzyk na tle gadania nie dodaje się liniowo w dB
      poziom = 10 * Math.log10(10 ** (poziom / 10) + 10 ** ((p.tlo + db) / 10));
      aktywne[i][0] = db - (KROK_S / tau) * 8.7; // ~ wykładnicze wygasanie
      if (aktywne[i][0] < -10) aktywne.splice(i, 1);
    }

    const amp = 10 ** (poziom / 20);
    for (let i = 0; i < probki.length; i++) probki[i] = amp * gauss();
    licznik.dodaj(probki);
  }
  return licznik.koniec();
}

for (const p of PROFILE) {
  const wynik = analizuj(syntezuj(p));
  zapiszStream({ id: p.id, data: p.data, ...wynik });
  const top = [...wynik.szczyty].sort((a, b) => b.db - a.db)[0];
  console.log(
    `${p.id.padEnd(16)} ${String(Math.round(wynik.czasTrwania / 60)).padStart(4)} min  ` +
      `tło ${wynik.tloDbfs} dBFS  ${wynik.krzykiNaGodzine} krzyków/h  max +${top?.db} dB  ` +
      `${wynik.poziomy.length} pkt, ${wynik.szczyty.length} szczytów`,
  );
}
