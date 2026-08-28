/**
 * Mutowalny stan tła całej strony — postęp scrolla 0..1 i pozycja kursora.
 * Poza Reactem z tego samego powodu co postepHero: czytane co klatkę
 * przez pętlę 3D, zapisywane przez listener scrolla. Zero re-renderów.
 */
export const stanTla = {
  /** 0 = góra dokumentu, 1 = dół */
  scroll: 0,
  myszX: 0,
  myszY: 0,
};
