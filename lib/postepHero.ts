/**
 * Współdzielony, mutowalny stan sceny 3D.
 * Świadomie poza Reactem — zapisuje go ScrollTrigger i handler myszy,
 * a czyta useFrame. Zero re-renderów, zero zrzuconych klatek.
 */
export const postepHero = {
  /** 0 = góra hero, 1 = koniec przypiętej sekcji */
  scroll: 0,
  /** pozycja kursora w zakresie -1…1 */
  myszX: 0,
  myszY: 0,
  /** czy scena jest w widoku (steruje pętlą renderowania) */
  widoczna: true,
};
