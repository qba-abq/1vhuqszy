import type { NextConfig } from "next";

/**
 * DEPLOY_BASE ustawia workflow GitHub Pages (".github/workflows/pages.yml")
 * na "/1vhuqszy", bo strona wisi pod https://qba-abq.github.io/1vhuqszy/.
 * Lokalnie zmienna jest pusta i nic się nie zmienia.
 */
const basePath = process.env.DEPLOY_BASE ?? "";

const nextConfig: NextConfig = {
  // Statyczny eksport: czysty HTML/CSS/JS w katalogu out/, bez serwera Node.
  // Tego wymaga GitHub Pages.
  output: "export",
  basePath,
  // next/image nie ma na Pages serwera do optymalizacji obrazków
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
