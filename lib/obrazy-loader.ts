/**
 * Loader next/image dla eksportu statycznego na GitHub Pages.
 *
 * Przy `output: "export"` next/image NIE dokleja basePath do src,
 * więc na https://qba-abq.github.io/1vhuqszy/ każdy obraz leciał 404.
 * Ten loader dokleja prefiks sam; NEXT_PUBLIC_BASE_PATH ustawia next.config
 * z tej samej zmiennej co basePath, więc lokalnie jest pusty.
 */
export default function obrazyLoader({ src }: { src: string }) {
  const baza = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return src.startsWith("/") ? `${baza}${src}` : src;
}
