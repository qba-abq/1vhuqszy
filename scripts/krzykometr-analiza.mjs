/**
 * Rdzeń Krzykometru: surowe próbki audio -> obwiednia głośności + szczyty.
 *
 * Bez zależności i bez ffmpeg, żeby dało się go testować na syntetycznym
 * sygnale (scripts/krzykometr-demo.mjs) tym samym kodem, który liczy
 * prawdziwe VOD-y (scripts/krzykometr.mjs).
 *
 * Wszystkie poziomy są w dB WZGLĘDEM TŁA (mediany całego streamu), a nie
 * w „dB SPL". Plik audio nie wie, jak głośno było w pokoju; wie tylko,
 * o ile dany moment był głośniejszy od typowego gadania. Dlatego na stronie
 * piszemy „+18 dB nad tłem", nigdy „94 dB".
 */

/** Długość okna RMS w sekundach. Pół sekundy łapie pojedynczy krzyk. */
export const OKNO_S = 0.5;
/** Ile dB nad tłem uznajemy za „krzyk". Ta sama wartość rysuje linię progu. */
export const PROG_KRZYKU_DB = 12;
/** Poniżej tego poziomu (dBFS) okno to cisza: nie wlicza się do tła. */
const CISZA_DBFS = -60;
/** Najniżej rysowany poziom względem tła (cisza = środek fali). */
export const PODLOGA_DB = -12;

/**
 * Liczy RMS w oknach OKNO_S. Działa strumieniowo: wołaj `dodaj` z kolejnymi
 * kawałkami Float32Array, na końcu `koniec`, żeby dostać tablicę dBFS.
 */
export function licznikOkien(czestotliwosc) {
  const rozmiar = Math.max(1, Math.round(czestotliwosc * OKNO_S));
  const okna = [];
  let suma = 0;
  let n = 0;

  return {
    dodaj(probki) {
      for (let i = 0; i < probki.length; i++) {
        const p = probki[i];
        suma += p * p;
        if (++n === rozmiar) {
          okna.push(naDb(Math.sqrt(suma / n)));
          suma = 0;
          n = 0;
        }
      }
    },
    koniec() {
      if (n > rozmiar / 2) okna.push(naDb(Math.sqrt(suma / n)));
      return Float32Array.from(okna);
    },
  };
}

function naDb(rms) {
  return rms > 0 ? 20 * Math.log10(rms) : -120;
}

function mediana(wartosci) {
  if (!wartosci.length) return CISZA_DBFS;
  const s = [...wartosci].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/** Średnia krocząca o szerokości `szer` okien: jeden trzask myszką to jeszcze nie krzyk. */
function wygladz(okna, szer) {
  const wynik = new Float32Array(okna.length);
  const pol = Math.floor(szer / 2);
  for (let i = 0; i < okna.length; i++) {
    let s = 0;
    let n = 0;
    for (let j = Math.max(0, i - pol); j <= Math.min(okna.length - 1, i + pol); j++) {
      s += okna[j];
      n++;
    }
    wynik[i] = s / n;
  }
  return wynik;
}

/**
 * Szczyty: lokalne maksima co najmniej PROG_KRZYKU_DB nad tłem, oddalone od
 * siebie o `odstepS`. Zwracamy najgłośniejsze `ile`, posortowane po czasie.
 */
function znajdzSzczyty(wzgledne, { odstepS, ile }) {
  const odstep = Math.round(odstepS / OKNO_S);
  const kandydaci = [];
  for (let i = 1; i < wzgledne.length - 1; i++) {
    const v = wzgledne[i];
    if (v >= PROG_KRZYKU_DB && v >= wzgledne[i - 1] && v >= wzgledne[i + 1]) kandydaci.push(i);
  }
  kandydaci.sort((a, b) => wzgledne[b] - wzgledne[a]);

  const wybrane = [];
  for (const i of kandydaci) {
    if (wybrane.every((j) => Math.abs(j - i) >= odstep)) wybrane.push(i);
  }
  return { wszystkie: wybrane, top: wybrane.slice(0, ile) };
}

/**
 * Okna dBFS -> dane jednego streamu do JSON-a.
 *
 * @param {Float32Array} okna  wynik licznikOkien().koniec()
 * @param {{ punkty?: number, ileSzczytow?: number }} opcje
 */
export function analizuj(okna, { punkty = 1200, ileSzczytow = 12 } = {}) {
  const czasTrwania = Math.round(okna.length * OKNO_S);
  const tlo = mediana(Array.from(okna).filter((v) => v > CISZA_DBFS));

  // 1 s wygładzenia na szczyty, surowe okna na obwiednię (tam liczy się ostrość)
  const wzgledne = wygladz(okna, 3).map((v) => v - tlo);
  const { wszystkie, top } = znajdzSzczyty(wzgledne, { odstepS: 45, ile: ileSzczytow });

  // Krzyki na godzinę: osobne zdarzenia nad progiem, co najmniej 10 s od siebie.
  const zdarzenia = znajdzSzczyty(wzgledne, { odstepS: 10, ile: Infinity }).wszystkie.length;

  // Obwiednia: maksimum w kubełku, żeby żaden krzyk nie zniknął przy zmniejszaniu.
  const krokOkien = Math.max(1, Math.ceil(okna.length / punkty));
  const poziomy = [];
  for (let i = 0; i < okna.length; i += krokOkien) {
    let max = -Infinity;
    for (let j = i; j < Math.min(okna.length, i + krokOkien); j++) max = Math.max(max, okna[j]);
    poziomy.push(zaokr(Math.max(PODLOGA_DB, max - tlo)));
  }

  return {
    czasTrwania,
    krok: krokOkien * OKNO_S,
    tloDbfs: zaokr(tlo),
    prog: PROG_KRZYKU_DB,
    podloga: PODLOGA_DB,
    krzykiNaGodzine: zaokr(zdarzenia / Math.max(czasTrwania / 3600, 1 / 60)),
    poziomy,
    szczyty: top
      .sort((a, b) => a - b)
      // wartość z surowych okien (nie wygładzonych), żeby zgadzała się z obwiednią na wykresie
      .map((i) => ({
        t: Math.round(i * OKNO_S),
        db: zaokr(Math.max(...[i - 1, i, i + 1].filter((j) => j >= 0 && j < okna.length).map((j) => okna[j])) - tlo),
      })),
  };
}

function zaokr(v) {
  return Math.round(v * 10) / 10;
}
