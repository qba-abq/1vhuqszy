# Assety strony HUKSZY

Podmieniasz pliki **zachowując nazwy i ścieżki** — kod ich nie zmienia.
Ścieżki są zebrane w `site.config.ts` (klucz `assety`) — tam też podmienisz
rozszerzenie, jeśli wolisz inny format.

Legenda: ✅ = Twoja grafika, gotowe · 🟨 = placeholder wygenerowany na start, do podmiany · ⬜ = do dostarczenia

---

## logo/

| Plik | Status | Wymiary | Format | Uwagi |
|---|---|---|---|---|
| `logo.svg` | ⬜ | wektor | SVG | Logotyp „HUKSZY". Dopóki go nie ma, preloader i stopka pokazują nick złożony fontem Anton. |
| `logo.png` | ⬜ | 1024×1024 | PNG (alpha) | Fallback, gdy SVG niedostępny. |
| `sygnet.png` | ⬜ | 512×512 | PNG (alpha) | Sam znak „H" — favicon i ikona PWA. |

## tlo/

| Plik | Status | Wymiary | Format | Uwagi |
|---|---|---|---|---|
| `tlo-hero.jpg` | ✅ | 1536×1024 | JPG/WebP | Tekstura tła sceny hero. Docelowo min. 2400 px szerokości. |
| `tlo-sekcja.jpg` | ⬜ | 2000×1200 | JPG/WebP | Tło pod „O mnie" / „Harmonogram". Ciemne, mało detalu w środku kadru. |

## postac/

| Plik | Status | Wymiary | Format | Uwagi |
|---|---|---|---|---|
| `portret.png` | 🟨 | 900×1200 | PNG (alpha) | W repo leży wygenerowany placeholder (sylwetka). Podmień na wyciętą postać/twarz bez tła — najlepiej 1200×1600. |

## klipy/

Miniatury do sekcji Highlights. Podpisy i linki ustawiasz w `site.config.ts` → `klipy`.

| Plik | Status | Wymiary | Format |
|---|---|---|---|
| `klip-1.png` … `klip-6.png` | 🟨 | 1280×720 (16:9) | PNG (placeholder) |

> W repo leży 6 wygenerowanych placeholderów w kolorach marki, żeby siatka od razu
> wyglądała jak trzeba. **Podmiana:** nadpisz pliki zachowując nazwy `klip-N.png`,
> albo wrzuć własne `.jpg`/`.webp` i popraw ścieżki w `site.config.ts` → `klipy`.
> Tam też ustawiasz tytuł, podpis i link do klipu.

## social/

| Plik | Status | Wymiary | Uwagi |
|---|---|---|---|
| `panel-discord.jpg` | ✅ | 1600×800 | Twoja grafika. |
| `panel-instagram.jpg` | ✅ | 1600×800 | Twoja grafika. |
| `panel-donate.jpg` | ✅ | 1600×639 | Twoja grafika. |
| `panel-harmonogram.jpg` | ✅ | 1254×1254 | Twoja grafika (referencja stylu). |

## sklep/

| Plik | Status | Wymiary | Uwagi |
|---|---|---|---|
| `bluza-hukszytv.png`, `tee-habanero.png`, `kubek-jumpscare.png` | 🟨 | 1000×1000 | Mockupy na **prawdziwych zdjęciach** (Pexels, licencja komercyjna) z nadrukiem logo w trybie `screen` — nadruk układa się na fałdach materiału. |
| `podkladka-kuchnia.png`, `plakat-hukszy.png`, `naklejki-ekipa.png` | 🟨 | 1000×1000 | Rendery nadruku (produkty płaskie). |

Wszystkie do podmiany po sesji zdjęciowej realnego merchu — zachowaj nazwy plików,
podpisy i ceny ustawisz w `site.config.ts` → `sklep`.

## og/

| Plik | Status | Wymiary | Format | Uwagi |
|---|---|---|---|---|
| `og.jpg` | ⬜ | 1200×630 | JPG | Obrazek do podglądu linku (Facebook / X / Discord). Dopóki go nie ma, generowany jest automatycznie z `app/opengraph-image.tsx`. |

---

## Zalecenia techniczne

- **Format:** WebP lub AVIF dają najmniejszy rozmiar. JPG też zadziała — `next/image` sam konwertuje.
- **Waga:** tła ≤ 400 KB, miniatury klipów ≤ 150 KB.
- **Ciemne krawędzie:** grafiki wtapiają się w tło strony, więc rogi trzymaj czarne (`#0D0D0D`).
- **Nazwy:** bez spacji i polskich znaków.
- **Skąd biorą się ścieżki:** wszystkie są zebrane w `site.config.ts` → `assety`.
  Jeśli zmieniasz rozszerzenie albo nazwę pliku, popraw je w jednym miejscu tam.
