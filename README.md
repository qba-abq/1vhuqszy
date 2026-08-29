# HUKSZY — strona-wizytówka streamera

One-page w klimacie kanału: czerń, czerwień, grunge, scena 3D w hero i animacje sterowane scrollem.

## Uruchomienie

```bash
npm install
npm run dev
```

Podgląd: http://localhost:3000

Produkcyjnie:

```bash
npm run build && npm start
```

## Co gdzie edytować

| Chcesz zmienić | Plik |
|---|---|
| Nick, bio, linki, harmonogram, statystyki, klipy, SEO | `site.config.ts` |
| Kolory akcentowe | `site.config.ts` → `kolory` (wstrzykiwane jako zmienne CSS) |
| Scena 3D na telefonach (domyślnie wyłączona) | `site.config.ts` → `wydajnosc.scena3DnaMobile` |
| Długość intro | `site.config.ts` → `wydajnosc.dlugoscIntroMs` / `dlugoscIntroMobileMs` |
| Zdjęcie w sekcji „O mnie" | `site.config.ts` → `assety.portret` (puste = sam kadr z sygnetem) |
| Grafiki | `public/assets/` — lista plików i wymiary w `public/assets/README.md` |
| Style bazowe i utilities | `app/globals.css` |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind 4 · React Three Fiber + drei · GSAP (ScrollTrigger, SplitText) · Lenis

## Sekcje

0. **Żywe tło** — pioruny/korzenie rosnące w dół razem ze scrollem, losowe błyski
   wyładowań z poblaskiem ekranu i dryfujące odłamki 3D przez całą stronę
1. **Preloader** — licznik %, litery logo wchodzące pojedynczo, rozdarcie kurtyny (raz na sesję)
2. **Hero** — scena 3D reagująca na kursor i scroll, status live/offline, CTA
3. **O mnie** — kadr na zdjęcie, bio z maskami tekstowymi, pas animowanych liczników
4. **Harmonogram** — lista streamów (dzień, godziny, kategoria), znaczniki „dziś" i „najbliższy", dni wolne w jednej linijce
5. **Highlights** — siatka klipów z parallaxem
6. **Socials + kontakt** — kanały, wsparcie, stopka

## Wydajność i dostępność

Zmierzone Lighthouse na buildzie produkcyjnym (`npm run build && npm start`):

- **Desktop:** performance 99, accessibility 100, best practices 100, SEO 100
- **Mobile:** performance 85-89 (3 przebiegi), accessibility 100, best practices 100, SEO 100

Decyzje, które to umożliwiły — nie zmieniaj ich bez pomiaru:

- **Sceny 3D ładują się też na telefonie** (decyzja: mobile 1:1 z desktopem,
  kosztem wyniku Lighthouse). Wyjątek: bardzo słaby sprzęt (`hardwareConcurrency <= 2`,
  `deviceMemory < 2`, `saveData`) — tam 3D odpuszcza. Wszystko dociąga się
  w bezczynności po `load`. Przełącznik: `site.config.ts` → `wydajnosc`.
- **Nagłówek z nickiem w hero nie jest animowany.** To element LCP — animowanie go
  (opacity / scale / filter) przesuwało metrykę o ~3 s na telefonie.
- **`prefers-reduced-motion`** wyłącza Lenisa, wejścia GSAP, liczniki, przechył kart i intro;
  scena 3D renderuje jedną klatkę.
- **Intro trwa tyle samo na desktopie i telefonie** (`wydajnosc.dlugoscIntroMs`
  = `dlugoscIntroMobileMs`; mobile 1:1). Przez czas intro strona jest zasłonięta,
  co na telefonie kosztuje kilkanaście punktów performance.
- **Wejście z linku do sekcji** (np. `/#harmonogram`) pomija intro.
- **Tło na telefonie jest czysto CSS-owe** (pętla rysowania piorunów bez JS);
  scroll-scrub, błyski GSAP i warstwa 3D tła działają tylko od 768 px wzwyż.

## Status live

`site.config.ts` → `live` to na razie mock. Podpięcie prawdziwego Twitcha opisane
w komentarzu w `components/ui/StatusLive.tsx`.
