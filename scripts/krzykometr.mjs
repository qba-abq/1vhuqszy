#!/usr/bin/env node
/**
 * Krzykometr: liczy głośność VOD-a i zapisuje ją do lib/dane/krzykometr.json.
 *
 *   node scripts/krzykometr.mjs <plik wideo/audio> --id vod-jumpscare
 *
 * --id      musi pasować do `id` klipu w site.config.ts (stamtąd biorą się
 *           tytuł, gra i link do VOD-a). Ponowne uruchomienie z tym samym id
 *           nadpisuje stare dane; inne streamy zostają.
 * --data    opcjonalnie data streamu (RRRR-MM-DD), pokazywana pod wykresem.
 *
 * Wymaga ffmpeg w PATH (Windows: `winget install Gyan.FFmpeg`).
 * Plik VOD-a pobierzesz z Twitcha: Studio twórców -> Treści -> VOD-y -> Pobierz.
 * Wystarczy sama ścieżka dźwiękowa, 3 h streamu liczy się ok. minuty.
 *
 * Po przeliczeniu prawdziwych VOD-ów ustaw `krzykometr.mock: false`
 * w site.config.ts: znika plakietka „dane przykładowe", a szczyty zaczynają
 * linkować do konkretnej sekundy VOD-a.
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { licznikOkien, analizuj } from "./krzykometr-analiza.mjs";

const CZESTOTLIWOSC = 8000; // do obwiedni głośności w zupełności wystarczy
const PLIK_DANYCH = join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "dane", "krzykometr.json");

function argumenty(argv) {
  const wynik = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) wynik[argv[i].slice(2)] = argv[++i];
    else wynik._.push(argv[i]);
  }
  return wynik;
}

/** Dekoduje plik przez ffmpeg do mono float32 i liczy okna w locie (bez trzymania 3 h PCM w RAM). */
function oknaZPliku(plik) {
  return new Promise((ok, blad) => {
    const licznik = licznikOkien(CZESTOTLIWOSC);
    const ff = spawn("ffmpeg", [
      "-v", "error", "-i", plik, "-vn",
      // filtr górnoprzepustowy wycina buczenie i stuk w biurko
      "-af", "highpass=f=80",
      "-ac", "1", "-ar", String(CZESTOTLIWOSC), "-f", "f32le", "-",
    ]);
    let reszta = Buffer.alloc(0);
    ff.stdout.on("data", (kawalek) => {
      const buf = reszta.length ? Buffer.concat([reszta, kawalek]) : kawalek;
      const pelne = buf.length - (buf.length % 4);
      licznik.dodaj(new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + pelne)));
      reszta = buf.subarray(pelne);
    });
    ff.stderr.on("data", (d) => process.stderr.write(d));
    ff.on("error", (e) =>
      blad(e.code === "ENOENT" ? new Error("Nie znaleziono ffmpeg. Zainstaluj: winget install Gyan.FFmpeg") : e),
    );
    ff.on("close", (kod) => (kod === 0 ? ok(licznik.koniec()) : blad(new Error(`ffmpeg zakończył się kodem ${kod}`))));
  });
}

/** Wstawia/podmienia stream po id. Kolejność = kolejność zakładek na stronie. */
export function zapiszStream(stream) {
  const dane = existsSync(PLIK_DANYCH) ? JSON.parse(readFileSync(PLIK_DANYCH, "utf8")) : { streamy: [] };
  const i = dane.streamy.findIndex((s) => s.id === stream.id);
  if (i >= 0) dane.streamy[i] = stream;
  else dane.streamy.push(stream);
  mkdirSync(dirname(PLIK_DANYCH), { recursive: true });
  // jeden stream w linii: diff w gicie pokazuje, który VOD się zmienił
  const linie = dane.streamy.map((s) => "    " + JSON.stringify(s));
  writeFileSync(PLIK_DANYCH, `{\n  "streamy": [\n${linie.join(",\n")}\n  ]\n}\n`);
  return PLIK_DANYCH;
}

async function main() {
  const arg = argumenty(process.argv.slice(2));
  const [plik] = arg._;
  if (!plik || !arg.id) {
    console.error("Użycie: node scripts/krzykometr.mjs <plik> --id <id klipu z site.config.ts> [--data RRRR-MM-DD]");
    process.exit(1);
  }
  console.log(`Analizuję ${plik}...`);
  const wynik = analizuj(await oknaZPliku(plik));
  const sciezka = zapiszStream({ id: arg.id, ...(arg.data ? { data: arg.data } : {}), ...wynik });
  const top = [...wynik.szczyty].sort((a, b) => b.db - a.db)[0];
  console.log(
    `Gotowe: ${Math.round(wynik.czasTrwania / 60)} min, ${wynik.krzykiNaGodzine} krzyków/h, ` +
      `najgłośniej +${top?.db ?? 0} dB. Zapisano w ${sciezka}`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
