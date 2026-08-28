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

1. **Preloader** — licznik %, rozdarcie kurtyny (raz na sesję)
2. **Hero** — scena 3D reagująca na kursor i scroll, status live/offline, CTA
3. **O mnie** — kadr na zdjęcie, bio z maskami tekstowymi, pas animowanych liczników
4. **Harmonogram** — lista streamów (dzień, godziny, kategoria), znaczniki „dziś" i „najbliższy", dni wolne w jednej linijce
5. **Highlights** — siatka klipów z parallaxem
6. **Socials + kontakt** — kanały, wsparcie, stopka

## Wydajność i dostępność

Zmierzone Lighthouse na buildzie produkcyjnym (`npm run build && npm start`):

- **Desktop:** performance 97, accessibility 100, best practices 100, SEO 100
- **Mobile:** performance 91, accessibility 100, best practices 100, SEO 100

Decyzje, które to umożliwiły — nie zmieniaj ich bez pomiaru:

- **Scena 3D nie ładuje się poniżej 768 px** ani na słabym sprzęcie (`hardwareConcurrency <= 2`,
  `deviceMemory < 2`, `saveData`). Na desktopie dociąga się dopiero w bezczynności po `load`.
  Przełącznik: `site.config.ts` → `wydajnosc`.
- **Nagłówek z nickiem w hero nie jest animowany.** To element LCP — animowanie go
  (opacity / scale / filter) przesuwało metrykę o ~3 s na telefonie.
- **`prefers-reduced-motion`** wyłącza Lenisa, wejścia GSAP, liczniki, przechył kart i intro;
  scena 3D renderuje jedną klatkę.
- **Intro trwa dłużej na desktopie niż na telefonie** (`wydajnosc.dlugoscIntroMs`
  i `dlugoscIntroMobileMs`). Przez czas intro strona jest zasłonięta, więc na
  telefonie pełna wersja zbijała performance z ~91 do ~74.
- **Wejście z linku do sekcji** (np. `/#harmonogram`) pomija intro.

## Status live

`site.config.ts` → `live` to na razie mock. Podpięcie prawdziwego Twitcha opisane
w komentarzu w `components/ui/StatusLive.tsx`.
