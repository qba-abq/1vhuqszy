/**
 * Jedyne miejsce do edycji treści strony.
 * Nick, linki, kolory, harmonogram, statystyki i ścieżki do grafik — wszystko tutaj.
 * Podmiana wartości nie wymaga dotykania komponentów.
 */

export const site = {
  /* ——— MARKA ——————————————————————————————————————————— */
  nick: "HUKSZY",
  handle: "HUKSZYTV",
  tagline: "Streamy, które słychać",
  opis:
    "Gram głośno, tnę szybko i nie udaję, że wiem co robię. " +
    "Wpadaj na live po hałas, memy i horrory, przy których razem będziemy się bać.",
  bio: [
    "Cześć, jestem HUKSZY. Streamuję trzy razy w tygodniu: od horrorów, przez sesje z widzami, po granie w rzeczy, których nikt mi nie polecał.",
    "Kanał zbudowała społeczność, która przychodzi po głośny śmiech i zostaje na dłużej. Jeśli lubisz szybkie cięcia, jumpscare'y i autoironię, jesteś u siebie.",
  ],

  /* ——— DOMENA / SEO ————————————————————————————————————— */
  url: "https://hukszy.pl", // ← podmień na docelową domenę
  seo: {
    tytul: "HUKSZY | streamer, Twitch, klipy",
    opis:
      "Oficjalna strona streamera HUKSZY. Harmonogram streamów, najlepsze klipy, " +
      "Discord i social media. Live na twitch.tv/hukszy.",
    slowaKluczowe: ["hukszy", "hukszytv", "streamer", "twitch", "polski streamer", "klipy"],
  },

  /* ——— KOLORY AKCENTOWE ————————————————————————————————
     Wstrzykiwane jako zmienne CSS w app/layout.tsx.
     Zmiana tutaj = zmiana w całym serwisie.                       */
  kolory: {
    akcent: "#E10600", // czerwony marki
    akcentJasny: "#FF2A1F", // poświata / hover
    akcentCiemny: "#8A0400", // cienie, gradienty
    tlo: "#0D0D0D", // czarny marki
    tloGlebokie: "#050505", // tło sekcji
    tekst: "#FFFFFF",
  },

  /* ——— STATUS LIVE ——————————————————————————————————————
     Na razie mock. Podmiana na realny Twitch API: patrz components/ui/StatusLive.tsx */
  live: {
    mock: true,
    czyLive: false,
    tytulStreamu: "Horrory z widzami: kto pierwszy krzyknie",
    gra: "Phasmophobia",
  },

  /* ——— WYDAJNOŚĆ ————————————————————————————————————————
     Scena 3D to ~140 KB JS i sporo pracy GPU. Na telefonach kosztuje
     kilkanaście punktów Lighthouse, a kryształ i tak jest tam ozdobą,
     bo nie ma kursora. Ustaw `scena3DnaMobile: true`, jeśli wolisz efekt
     od wyniku. Poniżej 768 px scena wtedy też się załaduje.              */
  wydajnosc: {
    scena3DnaMobile: false,
    /** Ile trwa faza licznika w intro (ms), zanim kurtyna się rozedrze.
     *  Przez ten czas strona jest zasłonięta, więc każda sekunda idzie
     *  wprost w metrykę LCP. Zmierzone: 2600 ms na telefonie zbija
     *  Lighthouse performance z ~92 na ~74, dlatego telefon dostaje
     *  krótszą wersję. Chcesz pełne intro wszędzie? Zrównaj obie liczby. */
    dlugoscIntroMs: 2600,
    dlugoscIntroMobileMs: 900,
    /** Poniżej tej szerokości scena 3D się nie ładuje (px). */
    prog3D: 768,
  },

  /* ——— LINKI ————————————————————————————————————————— */
  linki: {
    twitch: "https://twitch.tv/hukszy",
    youtube: "https://youtube.com/@hukszytv",
    instagram: "https://instagram.com/hukszytv",
    tiktok: "https://tiktok.com/@hukszytv",
    discord: "https://discord.gg/hukszytv",
    donate: "https://tipply.pl/@hukszytv",
    email: "kontakt@hukszy.pl",
  },

  /* ——— STATYSTYKI (animowane liczniki) ——————————————————— */
  statystyki: [
    { etykieta: "Obserwujących", wartosc: 12400, sufiks: "+" },
    { etykieta: "Godzin na live", wartosc: 1850, sufiks: "h" },
    { etykieta: "Streamów w roku", wartosc: 156, sufiks: "" },
    { etykieta: "Ludzi na Discordzie", wartosc: 3200, sufiks: "+" },
  ],

  /* ——— HARMONOGRAM ——————————————————————————————————————
     godziny: null = dzień wolny (karta wyszarzona)                */
  harmonogram: [
    { skrot: "PN", dzien: "Poniedziałek", godziny: null },
    { skrot: "WT", dzien: "Wtorek", godziny: { od: "17:00", do: "20:00" }, opis: "Rozgrzewka tygodnia" },
    { skrot: "ŚR", dzien: "Środa", godziny: null },
    { skrot: "CZ", dzien: "Czwartek", godziny: null },
    { skrot: "PT", dzien: "Piątek", godziny: { od: "21:00", do: "24:00" }, opis: "Horror night" },
    { skrot: "SB", dzien: "Sobota", godziny: { od: "21:00", do: "24:00" }, opis: "Granie z widzami" },
    { skrot: "ND", dzien: "Niedziela", godziny: null },
  ],

  /* ——— HIGHLIGHTS / KLIPY ————————————————————————————————
     miniatura: podmień plik w /public/assets/klipy (16:9, 1280×720) */
  klipy: [
    { id: "klip-1", tytul: "Krzyk, który usłyszało całe osiedle", opis: "Phasmophobia", miniatura: "/assets/klipy/klip-1.png", link: "" },
    { id: "klip-2", tytul: "Clutch na ostatniej sekundzie", opis: "CS2", miniatura: "/assets/klipy/klip-2.png", link: "" },
    { id: "klip-3", tytul: "Widz zgadł hasło w 2 sekundy", opis: "Teleturniej", miniatura: "/assets/klipy/klip-3.png", link: "" },
    { id: "klip-4", tytul: "Najgorszy skok wiary w historii", opis: "Elden Ring", miniatura: "/assets/klipy/klip-4.png", link: "" },
    { id: "klip-5", tytul: "Mikrofon nie wytrzymał", opis: "Reakcje", miniatura: "/assets/klipy/klip-5.png", link: "" },
    { id: "klip-6", tytul: "Speedrun do zawału", opis: "Lethal Company", miniatura: "/assets/klipy/klip-6.png", link: "" },
  ],

  /* ——— ŚCIEŻKI DO GRAFIK ————————————————————————————————
     Pełna lista wymaganych plików: /public/assets/README.md        */
  assety: {
    logo: "/assets/logo/logo.svg",
    logoPng: "/assets/logo/logo.png",
    tloHero: "/assets/tlo/tlo-hero.jpg",
    /** Zdjęcie do sekcji „O mnie". Puste = pokazuje się sam kadr z sygnetem.
     *  Wgraj plik do /public/assets/postac i wpisz tu ścieżkę. */
    portret: "",
    og: "/assets/og/og.jpg",
    panele: {
      discord: "/assets/social/panel-discord.jpg",
      instagram: "/assets/social/panel-instagram.jpg",
      donate: "/assets/social/panel-donate.jpg",
      harmonogram: "/assets/social/panel-harmonogram.jpg",
    },
  },
} as const;

export type Site = typeof site;
export type PozycjaHarmonogramu = (typeof site.harmonogram)[number];
export type Klip = (typeof site.klipy)[number];
