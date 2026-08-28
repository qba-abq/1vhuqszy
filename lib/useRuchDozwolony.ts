"use client";

import { useEffect, useState } from "react";

/**
 * Zwraca false, gdy użytkownik prosi o ograniczenie animacji
 * (prefers-reduced-motion: reduce). Reaguje na zmianę ustawienia w locie.
 *
 * Start = false, żeby pierwszy render nigdy nie odpalił ruchu przed sprawdzeniem.
 */
export function useRuchDozwolony(): boolean {
  const [dozwolony, setDozwolony] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aktualizuj = () => setDozwolony(!mq.matches);
    aktualizuj();
    mq.addEventListener("change", aktualizuj);
    return () => mq.removeEventListener("change", aktualizuj);
  }, []);

  return dozwolony;
}

/** Wersja synchroniczna do użycia poza Reactem (np. w callbackach GSAP). */
export function ruchOgraniczony(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
