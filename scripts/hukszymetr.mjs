#!/usr/bin/env node
/**
 * Hukszymetr: liczy głośność VOD-a, zapisuje ją do lib/dane/hukszymetr.json
 * i wycina krótkie nagrania najgłośniejszych momentów do odsłuchu na stronie.
 *
 *   node scripts/hukszymetr.mjs <plik wideo/audio> --id outlast-halloween
 *
 * --id      musi pasować do `id` w site.config.ts -> hukszymetr.streamy
 *           (stamtąd biorą się tytuł, gra, data i link do VOD-a). Ponowne
 *           uruchomienie z tym samym id nadpisuje stare dane; inne zostają.
 * --nagrania N   ile najgłośniejszych szczytów wyciąć do odsłuchu (domyślnie wszystkie,
 *           0 = bez nagrań). Trafiają do public/assets/hukszymetr/.
 *
 * Wymaga ffmpeg (Windows: `winget install Gyan.FFmpeg`). Jeśli nie ma go
 * w PATH, wskaż plik zmienną FFMPEG=C:/.../ffmpeg.exe.
 *
 * Skąd plik: Studio twórców -> Treści -> VOD-y -> Pobierz, albo sama ścieżka
 * audio przez yt-dlp:
 *   python -m yt_dlp -f Audio_Only https://www.twitch.tv/videos/<id>
 * 3 h streamu liczy się ok. minuty.
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { licznikOkien, analizuj } from "./hukszymetr-analiza.mjs";

const KORZEN = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLIK_DANYCH = join(KORZEN, "lib", "dane", "hukszymetr.json");
const KATALOG_NAGRAN = join(KORZEN, "public", "assets", "hukszymetr");
const FFMPEG = process.env.FFMPEG || "ffmpeg";

const CZESTOTLIWOSC = 8000; // do obwiedni głośności w zupełności wystarczy
/** Nagranie zaczyna się chwilę PRZED szczytem: słychać, co doprowadziło do krzyku. */
const NAGRANIE_PRZED_S = 3.5;
const NAGRANIE_DLUGOSC_S = 6;

function argumenty(argv) {
  const wynik = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) wynik[argv[i].slice(2)] = argv[++i];
    else wynik._.push(argv[i]);
  }
  return wynik;
}

function ffmpeg(args, naDane) {
  return new Promise((ok, blad) => {
    const proces = spawn(FFMPEG, ["-v", "error", ...args]);
    if (naDane) proces.stdout.on("data", naDane);
    proces.stderr.on("data", (d) => process.stderr.write(d));
    proces.on("error", (e) =>
      blad(e.code === "ENOENT" ? new Error("Nie znaleziono ffmpeg. Zainstaluj (winget install Gyan.FFmpeg) albo ustaw FFMPEG=ścieżka") : e),
    );
    proces.on("close", (kod) => (kod === 0 ? ok() : blad(new Error(`ffmpeg zakończył się kodem ${kod}`))));
  });
}

/** Dekoduje plik do mono float32 i liczy okna w locie (bez trzymania 3 h PCM w RAM). */
async function oknaZPliku(plik) {
  const licznik = licznikOkien(CZESTOTLIWOSC);
  let reszta = Buffer.alloc(0);
  await ffmpeg(
    // filtr górnoprzepustowy wycina buczenie i stuk w biurko
    ["-i", plik, "-vn", "-af", "highpass=f=80", "-ac", "1", "-ar", String(CZESTOTLIWOSC), "-f", "f32le", "-"],
    (kawalek) => {
      const buf = reszta.length ? Buffer.concat([reszta, kawalek]) : kawalek;
      const pelne = buf.length - (buf.length % 4);
      licznik.dodaj(new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + pelne)));
      reszta = buf.subarray(pelne);
    },
  );
  return licznik.koniec();
}

/**
 * Wycina nagranie wokół szczytu. Głośność jest wyrównana (loudnorm) i
 * przycięta limiterem: jumpscare ma być słychać, ale nie ma rozsadzić
 * słuchawek komuś, kto kliknął z ciekawości.
 */
async function wytnijNagranie(plik, id, t) {
  const start = Math.max(0, t - NAGRANIE_PRZED_S);
  const nazwa = `${id}-${t}.m4a`;
  await ffmpeg([
    "-y", "-ss", String(start), "-t", String(NAGRANIE_DLUGOSC_S), "-i", plik, "-vn",
    "-af", [
      "loudnorm=I=-20:TP=-3:LRA=11",
      "afade=t=in:d=0.15",
      `afade=t=out:st=${NAGRANIE_DLUGOSC_S - 0.3}:d=0.3`,
    ].join(","),
    "-ac", "1", "-ar", "44100", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart",
    join(KATALOG_NAGRAN, nazwa),
  ]);
  return `/assets/hukszymetr/${nazwa}`;
}

/** Wstawia/podmienia stream po id. */
export function zapiszStream(stream, plik = PLIK_DANYCH) {
  const dane = existsSync(plik) ? JSON.parse(readFileSync(plik, "utf8")) : { streamy: [] };
  const i = dane.streamy.findIndex((s) => s.id === stream.id);
  if (i >= 0) dane.streamy[i] = stream;
  else dane.streamy.push(stream);
  mkdirSync(dirname(plik), { recursive: true });
  // jeden stream w linii: diff w gicie pokazuje, który VOD się zmienił
  const linie = dane.streamy.map((s) => "    " + JSON.stringify(s));
  writeFileSync(plik, `{\n  "streamy": [\n${linie.join(",\n")}\n  ]\n}\n`);
  return plik;
}

async function main() {
  const arg = argumenty(process.argv.slice(2));
  const [plik] = arg._;
  if (!plik || !arg.id) {
    console.error("Użycie: node scripts/hukszymetr.mjs <plik> --id <id z hukszymetr.streamy> [--nagrania 5]");
    process.exit(1);
  }
  const ileNagran = Number(arg.nagrania ?? Infinity);

  console.log(`[${arg.id}] analizuję ${plik}...`);
  const wynik = analizuj(await oknaZPliku(plik));

  // stare nagrania tego streamu precz: szczyty mogły się przesunąć
  mkdirSync(KATALOG_NAGRAN, { recursive: true });
  for (const f of readdirSync(KATALOG_NAGRAN)) {
    if (f.startsWith(`${arg.id}-`)) rmSync(join(KATALOG_NAGRAN, f));
  }
  const doNagrania = [...wynik.szczyty].sort((a, b) => b.db - a.db).slice(0, ileNagran);
  for (const p of doNagrania) {
    p.audio = await wytnijNagranie(plik, arg.id, p.t);
  }

  const sciezka = zapiszStream({ id: arg.id, ...wynik });
  console.log(
    `[${arg.id}] ${Math.round(wynik.czasTrwania / 60)} min, tło ${wynik.tloDbfs} dBFS, ` +
      `${wynik.krzykiNaGodzine} krzyków/h, najgłośniej +${doNagrania[0]?.db ?? 0} dB, ` +
      `${doNagrania.length} nagrań. Zapisano w ${sciezka}`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
