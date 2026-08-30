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
  // next/image nie ma na Pages serwera do optymalizacji obrazków,
  // a przy output: "export" nie dokleja basePath do src (obrazy szły 404
  // na Pages) — stąd własny loader, patrz lib/obrazy-loader.ts.
  images: { loader: "custom", loaderFile: "./lib/obrazy-loader.ts" },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  trailingSlash: true,
};

export default nextConfig;
