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
    "Cześć, jestem HUKSZY. Streamuję trzy razy w tygodniu: horrory, przy których krzyczę głośniej niż gra, i kooperacyjny chaos w stylu Overcooked 2 albo Biped, gdzie razem z ekipą sabotujemy sobie życie.",
    "Do tego challenge dla społeczności (100 follow = habanero na żywo), kolaby z innymi twórcami i memy. Nadaję równolegle na Twitchu i Kicku. Wpadaj, jesteś u siebie.",
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
    scena3DnaMobile: true,
    /** Ile trwa faza licznika w intro (ms), zanim kurtyna się rozedrze.
     *  Przez ten czas strona jest zasłonięta, więc każda sekunda idzie
     *  wprost w metrykę LCP (dłuższe intro = niższy wynik Lighthouse
     *  na telefonie). Decyzja Jakuba 2026-08-29: telefon ma być 1:1
     *  z desktopem, stąd obie wartości równe. */
    dlugoscIntroMs: 2600,
    dlugoscIntroMobileMs: 2600,
    /** Poniżej tej szerokości scena 3D się nie ładuje (px). */
    prog3D: 768,
  },

  /* ——— LINKI ————————————————————————————————————————— */
  linki: {
    twitch: "https://twitch.tv/hukszy",
    kick: "https://kick.com/hukszy",
    youtube: "https://youtube.com/@hukszytv",
    instagram: "https://instagram.com/hukszytv",
    tiktok: "https://tiktok.com/@hukszytv",
    discord: "https://discord.gg/hukszytv",
    donate: "https://tipply.pl/@hukszytv",
    email: "kontakt@hukszy.pl",
  },

  /* ——— STATYSTYKI (animowane liczniki) ——————————————————— */
  statystyki: [
    { etykieta: "Streamy w tygodniu", wartosc: 3, sufiks: "" },
    { etykieta: "Godziny na jednym live", wartosc: 3, sufiks: "h" },
    { etykieta: "Platformy równolegle", wartosc: 2, sufiks: "" },
    { etykieta: "Gier w rotacji", wartosc: 5, sufiks: "+" },
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
    { id: "vod-biped", tytul: "Biped z Kimusią", opis: "Biped · kolab", miniatura: "/assets/klipy/vod-biped.jpg", link: "https://www.twitch.tv/videos/2856077335" },
    { id: "vod-overcooked", tytul: "4 osoby w kuchni, ale to nie MasterChef", opis: "Overcooked! 2", miniatura: "/assets/klipy/vod-overcooked.jpg", link: "https://www.twitch.tv/videos/2853548143" },
    { id: "vod-jumpscare", tytul: "Jumpscare za jumpscare'em", opis: "Jumpscare Scare Jump", miniatura: "/assets/klipy/vod-jumpscare.jpg", link: "https://www.twitch.tv/videos/2852578308" },
    { id: "vod-letsfib", tytul: "Let's fib: 100 follow = habanero", opis: "Challenge 🌶️", miniatura: "/assets/klipy/vod-letsfib.jpg", link: "https://www.twitch.tv/videos/2849663644" },
    { id: "vod-impreza", tytul: "Impreza maszynowa, zapraszam", opis: "Live", miniatura: "/assets/klipy/vod-impreza.jpg", link: "https://www.twitch.tv/videos/2847130291" },
    { id: "vod-kick", tytul: "Biped z Kimusią na Kicku", opis: "Kick · multistream", miniatura: "/assets/klipy/vod-kick-biped.webp", link: "https://kick.com/hukszy/videos" },
  ],

  /* ——— SKLEP / MERCH ————————————————————————————————————
     linkSklepu pusty = przycisk "Zobacz cały sklep" prowadzi do donate
     (sklep w budowie).

     Grafiki w /public/assets/sklep to MOCKUPY: bluza, koszulka i kubek
     powstały ze zdjęć stockowych (Pexels, licencja komercyjna) z nadrukiem
     logo w trybie `screen`, reszta to render nadruku. Po sesji zdjęciowej
     realnego merchu podmieniasz pliki zachowując nazwy.                */
  sklep: {
    linkSklepu: "",
    produkty: [
      { id: "bluza", nazwa: "Bluza HUKSZYTV", cena: 199, obraz: "/assets/sklep/bluza-hukszytv.png", znaczek: "Nowość", opis: "Klasyk ekipy" },
      { id: "tee-habanero", nazwa: "Tee Habanero Challenge", cena: 89, obraz: "/assets/sklep/tee-habanero.png", znaczek: "", opis: "100 follow = 🌶️ na żywo" },
      { id: "kubek", nazwa: "Kubek z sygnetem", cena: 49, obraz: "/assets/sklep/kubek-jumpscare.png", znaczek: "Bestseller", opis: "Paliwo na horrory" },
      { id: "podkladka", nazwa: "Podkładka Kuchnia Chaosu", cena: 119, obraz: "/assets/sklep/podkladka-kuchnia.png", znaczek: "", opis: "Overcooked vibes, XXL" },
      { id: "plakat", nazwa: "Plakat HUKSZY A2", cena: 59, obraz: "/assets/sklep/plakat-hukszy.png", znaczek: "", opis: "Logotyp na ścianę, 42×59 cm" },
      { id: "naklejki", nazwa: "Pakiet Naklejek Ekipy", cena: 19, obraz: "/assets/sklep/naklejki-ekipa.png", znaczek: "", opis: "12 sztuk na sprzęt" },
    ],
  },

  /* ——— ŚCIEŻKI DO GRAFIK ————————————————————————————————
     Pełna lista wymaganych plików: /public/assets/README.md        */
  assety: {
    /** Prawdziwe grafiki kanału (pobrane z Twitcha). */
    logoBaner: "/assets/tlo/baner-twitch.png",
    awatar: "/assets/postac/avatar-twitch.png",
    tloHero: "/assets/tlo/tlo-hero.jpg",
    /** Zdjęcie do sekcji „O mnie". Puste = pokazuje się sam kadr z sygnetem.
     *  Wgraj plik do /public/assets/postac i wpisz tu ścieżkę. */
    portret: "",  // puste = kadr pokazuje awatar kanału
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
