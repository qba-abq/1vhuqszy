# Assety strony HUKSZY

Podmieniasz pliki **zachowując nazwy i ścieżki** — kod ich nie zmienia.
Ścieżki są zebrane w `site.config.ts` (klucz `assety`) — tam też podmienisz
rozszerzenie, jeśli wolisz inny format.

Legenda: ✅ = plik już jest (z Twoich grafik) · ⬜ = do dostarczenia

---

## logo/

| Plik | Status | Wymiary | Format | Uwagi |
|---|---|---|---|---|
| `logo.svg` | ⬜ | wektor | SVG | Logotyp „HUKSZY". Używany w preloaderze i stopce. Najlepiej z przezroczystym tłem. |
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
| `portret.png` | ⬜ | 1200×1600 | PNG (alpha) | Wycięta postać/twarz do sekcji „O mnie". Bez tła. |

## klipy/

Miniatury do sekcji Highlights. Podpisy i linki ustawiasz w `site.config.ts` → `klipy`.

| Plik | Status | Wymiary | Format |
|---|---|---|---|
| `klip-1.jpg` … `klip-6.jpg` | ⬜ | 1280×720 (16:9) | JPG/WebP |

> Dopóki plików nie ma, siatka pokazuje wygenerowany placeholder w kolorach marki —
> strona się nie psuje.

## social/

| Plik | Status | Wymiary | Uwagi |
|---|---|---|---|
| `panel-discord.jpg` | ✅ | 1600×800 | Twoja grafika. |
| `panel-instagram.jpg` | ✅ | 1600×800 | Twoja grafika. |
| `panel-donate.jpg` | ✅ | 1600×639 | Twoja grafika. |
| `panel-harmonogram.jpg` | ✅ | 1254×1254 | Twoja grafika (referencja stylu). |

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
