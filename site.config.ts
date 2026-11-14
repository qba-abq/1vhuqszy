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
  /* Teksty oparte na tym, co faktycznie dzieje się na kanale (stan na
     14.11.2026): VOD-y i klipy z Twitcha, panele kanału, kanał YouTube
     i ostatnie kategorie na Kicku. Przy zmianie gier odśwież wymienione tytuły. */
  opis:
    "Horrory, przy których drę się głośniej niż gra, koopy z ekipą " +
    "i spokojne wieczory w Red Dead. Gramy gęsto, wpadaj na live.",
  bio: [
    "Cześć, tu Hukszy. Streamuję na Twitchu zwykle trzy razy w tygodniu: we wtorek po południu na luzie, w piątek i sobotę wieczorem na dłużej. Gram różnie: horrory jak Outlast, Backrooms czy SCP: Permafrost, przy których krzyczę głośniej niż gra, kooperacyjny chaos w Log Riders, Biped albo Overcooked 2, a na odpoczynek Red Dead Redemption 2 i budowanie fabryki w Satisfactory.",
    "Ze streamów robi się ekipa: wspólne granie z widzami, kolaby z Kimusią i Kapitanem Flamingo, memy na Discordzie i challenge'e (było już „100 follow = habanero”). Najlepsze akcje lądują na YouTube i TikToku, czasem nadaję też na Kicku. Wpadaj, jesteś u siebie.",
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
    /* ——— akcent marki ——— */
    akcent: "#E10600", // czerwony marki
    akcentJasny: "#FF3B30", // poświata / hover
    akcentCiemny: "#8A0400", // cienie, gradienty

    /* ——— drugi akcent: SKLEP ————————————————————————————
       Bursztyn sąsiaduje z czerwienią (paleta „ognia"), więc nie kłóci się
       z marką, a wyraźnie oddziela handel od reszty strony: ceny, znaczki
       i nagłówek sklepu. Nigdzie indziej go nie używamy.              */
    akcent2: "#FFB020",
    akcent2Ciemny: "#B36F00",

    /* ——— powierzchnie ————————————————————————————————————
       Czysta czerń spłaszcza układ i męczy oczy, dlatego baza to ciemna
       szarość, a każdy kolejny poziom jest JAŚNIEJSZY (w ciemnym motywie
       głębię buduje światło, nie cień).                                */
    pow0: "#101017", // tło strony
    pow1: "#191921", // sekcje wyróżnione, panele
    pow2: "#22222C", // karty
    pow3: "#2D2D39", // karta pod kursorem

    /* ——— tekst: trzy poziomy ważności ——— */
    tekst1: "rgba(255,255,255,0.94)",
    tekst2: "rgba(255,255,255,0.72)",
    tekst3: "rgba(255,255,255,0.54)",

    /* ——— linie ——— */
    linia: "rgba(255,255,255,0.09)",
    linia2: "rgba(255,255,255,0.17)",

    /* zgodność wstecz */
    tlo: "#191921",
    tloGlebokie: "#101017",
    tekst: "#FFFFFF",
  },
  /* ——— STATUS LIVE ——————————————————————————————————————
     Na razie mock. Podmiana na realny Twitch API: patrz components/ui/StatusLive.tsx */
  live: {
    mock: true,
    czyLive: false,
    tytulStreamu: "Halloweenowy stream: Outlast",
    gra: "Outlast",
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
  /* Linki zgodne z panelami kanału na Twitchu (twitch.tv/hukszy/about). */
  linki: {
    twitch: "https://twitch.tv/hukszy",
    kick: "https://kick.com/hukszy",
    youtube: "https://youtube.com/@hukszytv",
    instagram: "https://instagram.com/hukszytv",
    tiktok: "https://www.tiktok.com/@hukszy3",
    discord: "https://discord.gg/cmsz7rwgu",
    donate: "https://streamelements.com/hukszy/tip",
    email: "kontakt@hukszy.pl",
  },

  /* ——— STATYSTYKI (animowane liczniki) ——————————————————— */
  statystyki: [
    { etykieta: "Streamy w tygodniu", wartosc: 3, sufiks: "" },
    { etykieta: "Godzin na najdłuższym live", wartosc: 5, sufiks: "+" }, // Outlast, 31.10: 5 h 30 min
    { etykieta: "Horrorów na koncie", wartosc: 5, sufiks: "+" }, // Outlast, Backrooms, SCP: Permafrost, The Night Shift, Jumpscare Scare Jump
    { etykieta: "Gier na streamach", wartosc: 15, sufiks: "+" },
  ],

  /* ——— HARMONOGRAM ——————————————————————————————————————
     godziny: null = dzień wolny (karta wyszarzona)
     Na Twitchu nie ma ustawionego harmonogramu; godziny wzięte ze startów
     VOD-ów z października i listopada 2026 (wt ~16:00, pt i sb ~20:00).     */
  harmonogram: [
    { skrot: "PN", dzien: "Poniedziałek", godziny: null },
    { skrot: "WT", dzien: "Wtorek", godziny: { od: "16:00", do: "19:00" }, opis: "Na luzie: Red Dead, Roblox" },
    { skrot: "ŚR", dzien: "Środa", godziny: null },
    { skrot: "CZ", dzien: "Czwartek", godziny: null },
    { skrot: "PT", dzien: "Piątek", godziny: { od: "20:00", do: "24:00" }, opis: "Wieczorne granie z ekipą" },
    { skrot: "SB", dzien: "Sobota", godziny: { od: "20:00", do: "24:00" }, opis: "Długi live: horrory i koopy" },
    { skrot: "ND", dzien: "Niedziela", godziny: null },
  ],

  /* ——— HIGHLIGHTS / KLIPY ————————————————————————————————
     Klipy z twitch.tv/hukszy/clips. Klipy, w przeciwieństwie do VOD-ów,
     nie wygasają, więc linki zostają żywe. Tytuły są oryginalne (nadali je
     klipujący z czatu).
     miniatura: kadr z klipu w /public/assets/klipy (16:9, 1280×720). Przy
     wymianie sprawdź, czy w kadrze nie widać czatu z czymś, czego nie
     chcesz na stronie (huKRZYK jest przycięty właśnie z tego powodu).      */
  klipy: [
    { id: "klip-hukrzyk", tytul: "huKRZYK", opis: "Outlast · Halloween", miniatura: "/assets/klipy/klip-hukrzyk.jpg", link: "https://www.twitch.tv/hukszy/clip/OptimisticAstuteAardvarkKreygasm-2V685W0Jy1rwDJdJ" },
    { id: "klip-gorunc", tytul: "gorunc", opis: "MECCHA CHAMELEON", miniatura: "/assets/klipy/klip-gorunc.jpg", link: "https://www.twitch.tv/hukszy/clip/BovineSuaveTireLeeroyJenkins-E9kktrbyCY4PxvVy" },
    { id: "klip-pawel-jumper", tytul: "PAWEŁ JUMPER", opis: "Backrooms · ekipa", miniatura: "/assets/klipy/klip-pawel-jumper.jpg", link: "https://www.twitch.tv/hukszy/clip/ThirstyPluckyDonkeyVoteNay-jl8XMBvdyP-u_Tff" },
    { id: "klip-zolnierz", tytul: "wyglądam ci na żołnierza?", opis: "Battlefield 6", miniatura: "/assets/klipy/klip-zolnierz.jpg", link: "https://www.twitch.tv/hukszy/clip/SpicyEagerMinkMcaT-JogqIt8gSDIyy0hz" },
    { id: "klip-pulapka", tytul: "PUŁAPKA", opis: "Sea of Thieves", miniatura: "/assets/klipy/klip-pulapka.jpg", link: "https://www.twitch.tv/hukszy/clip/HeadstrongCrunchyDiscOSsloth--TlBBhb9yIXW9LZe" },
    { id: "klip-spot", tytul: "he knows a spot", opis: "SCP: Permafrost", miniatura: "/assets/klipy/klip-spot.jpg", link: "https://www.twitch.tv/hukszy/clip/IronicPuzzledStorkMrDestructoid-l36KnkPXMjYbPSDW" },
  ],

  /* ——— HUKSZYMETR ——————————————————————————————————————
     Głośność całych VOD-ów, sekunda po sekundzie, plus nagrania
     najgłośniejszych momentów do odsłuchu. Dane liczy skrypt:
       node scripts/hukszymetr.mjs <plik VOD-a> --id outlast-halloween
     i zapisuje je w lib/dane/hukszymetr.json (+ nagrania w
     /public/assets/hukszymetr). `id` poniżej łączy wpis z danymi; kolejność
     tutaj = kolejność zakładek. Stream bez policzonych danych się nie pokaże.

     Twitch kasuje VOD-y po kilku tygodniach: link wtedy przestaje działać,
     ale wykres i nagrania zostają (są w repo).

     mock: true  = dane przykładowe (scripts/hukszymetr-demo.mjs --zapisz):
                   plakietka na stronie, szczyty NIE linkują do VOD-a.
     podpisy: opisy szczytów po sekundzie streamu, widoczne w dymku i tabeli,
              np. { "outlast-halloween": { 552: "Pierwszy korytarz" } }      */
  hukszymetr: {
    mock: false,
    streamy: [
      { id: "outlast-halloween", tytul: "Halloweenowy stream: Outlast", gra: "Outlast 👻", data: "2026-10-31", link: "https://www.twitch.tv/videos/2916058703" },
      { id: "roblox-piatek13", tytul: "Piątek 13-ego, stream bez kamerki", gra: "ROBLOX", data: "2026-11-13", link: "https://www.twitch.tv/videos/2927877699" },
      { id: "log-riders", tytul: "Czy uda nam się to przejść?!", gra: "Log Riders", data: "2026-11-07", link: "https://www.twitch.tv/videos/2922427837" },
      { id: "satisfactory", tytul: "Satysfakcjonująca fabryka", gra: "Satisfactory", data: "2026-11-14", link: "https://www.twitch.tv/videos/2928834251" },
    ],
    podpisy: {} as Record<string, Record<number, string>>,
  },

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
