"use client";

import { useEffect, useState } from "react";
import { site } from "@/site.config";

/**
 * Czy HUKSZY jest teraz na żywo na Twitchu.
 *
 * Strona jest statyczna (GitHub Pages), więc nie ma serwera, który trzymałby
 * token do oficjalnego API Twitcha (Helix). Pytamy DecAPI (decapi.me): darmowe,
 * bez klucza, z nagłówkiem CORS „*", popularne wśród streamerów do botów czatu.
 *
 *   /twitch/uptime/<kanał>  -> „4 hours, 13 minutes, 13 seconds" albo „<kanał> is offline"
 *   /twitch/title/<kanał>   -> tytuł streama
 *   /twitch/game/<kanał>    -> kategoria
 *
 * Gdy DecAPI nie odpowie, plakietka pokazuje „offline" (lepsze niż fałszywe
 * „live"). Podgląd stanu live bez czekania na stream: dopisz do adresu
 * `?podglad-live`.
 */

export type StatusLive =
  | { stan: "sprawdzam" }
  | { stan: "offline" }
  | { stan: "live"; gra: string; tytul: string; od: string };

const API = "https://decapi.me/twitch";

/** „4 hours, 13 minutes, 13 seconds" -> „4 h 13 min" */
function naPolski(uptime: string) {
  const ile = (jednostka: string) => Number(uptime.match(new RegExp(`(\\d+) ${jednostka}`))?.[1] ?? 0);
  const godziny = ile("day") * 24 + ile("hour");
  const minuty = ile("minute");
  return godziny ? `${godziny} h ${minuty} min` : `${minuty} min`;
}

async function pobierz(kanal: string, signal: AbortSignal): Promise<StatusLive> {
  const tekst = async (co: string) => {
    const r = await fetch(`${API}/${co}/${kanal}`, { signal, cache: "no-store" });
    if (!r.ok) throw new Error(`DecAPI ${co}: ${r.status}`);
    return (await r.text()).trim();
  };

  const uptime = await tekst("uptime");
  // live = odpowiedź z jednostkami czasu; „offline", „User not found" itp. to offline
  if (!/\d+ (day|hour|minute|second)/.test(uptime)) return { stan: "offline" };

  const [tytul, gra] = await Promise.all([tekst("title"), tekst("game")]);
  return { stan: "live", tytul, gra, od: naPolski(uptime) };
}

export function useStatusLive(): StatusLive {
  const [status, setStatus] = useState<StatusLive>({ stan: "sprawdzam" });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("podglad-live")) {
      setStatus({ stan: "live", gra: "Satisfactory", tytul: "SATYSFAKCJONUJĄCA FABRYKA????!@", od: "1 h 05 min" });
      return;
    }

    let kontroler = new AbortController();
    const odswiez = () => {
      // karta w tle nie musi pytać co minutę; dopyta po powrocie
      if (document.visibilityState !== "visible") return;
      kontroler.abort();
      kontroler = new AbortController();
      pobierz(site.live.kanalTwitch, kontroler.signal)
        .then(setStatus)
        .catch((e: unknown) => {
          if (e instanceof DOMException && e.name === "AbortError") return;
          setStatus((poprzedni) => (poprzedni.stan === "sprawdzam" ? { stan: "offline" } : poprzedni));
        });
    };

    odswiez();
    const zegar = window.setInterval(odswiez, site.live.odswiezanieS * 1000);
    document.addEventListener("visibilitychange", odswiez);
    return () => {
      kontroler.abort();
      window.clearInterval(zegar);
      document.removeEventListener("visibilitychange", odswiez);
    };
  }, []);

  return status;
}
