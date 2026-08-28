"use client";

/**
 * Mikro-magazyn sygnału „intro skończone".
 * Hero czeka na ten sygnał zanim odpali swoje wejście; jeśli preloader
 * został pominięty (druga wizyta w sesji), sygnał już jest ustawiony
 * i callback odpala się natychmiast.
 */

let wystartowano = false;
const sluchacze = new Set<() => void>();

export function oznaczStart() {
  if (wystartowano) return;
  wystartowano = true;
  sluchacze.forEach((cb) => cb());
  sluchacze.clear();
}

export function naStart(cb: () => void): () => void {
  if (wystartowano) {
    cb();
    return () => {};
  }
  sluchacze.add(cb);
  return () => sluchacze.delete(cb);
}

export function juzWystartowano() {
  return wystartowano;
}
