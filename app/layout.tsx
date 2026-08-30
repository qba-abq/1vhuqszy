import type { Metadata, Viewport } from "next";
import { Anton, Montserrat } from "next/font/google";
import { site } from "@/site.config";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-anton",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.tytul,
    template: `%s | ${site.nick}`,
  },
  description: site.seo.opis,
  keywords: [...site.seo.slowaKluczowe],
  authors: [{ name: site.nick, url: site.linki.twitch }],
  creator: site.nick,
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: site.url,
    siteName: site.nick,
    title: site.seo.tytul,
    description: site.seo.opis,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.tytul,
    description: site.seo.opis,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.kolory.tlo,
  colorScheme: "dark",
};

/** Kolory z site.config.ts → zmienne CSS czytane przez globals.css */
const zmienneKolorow = `:root{
  --akcent:${site.kolory.akcent};
  --akcent-jasny:${site.kolory.akcentJasny};
  --akcent-ciemny:${site.kolory.akcentCiemny};
  --akcent2:${site.kolory.akcent2};
  --akcent2-ciemny:${site.kolory.akcent2Ciemny};
  --pow0:${site.kolory.pow0};
  --pow1:${site.kolory.pow1};
  --pow2:${site.kolory.pow2};
  --pow3:${site.kolory.pow3};
  --tekst1:${site.kolory.tekst1};
  --tekst2:${site.kolory.tekst2};
  --tekst3:${site.kolory.tekst3};
  --linia:${site.kolory.linia};
  --linia2:${site.kolory.linia2};
  --tlo:${site.kolory.tlo};
  --tlo-glebokie:${site.kolory.tloGlebokie};
  --tekst:${site.kolory.tekst};
}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${anton.variable} ${montserrat.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: zmienneKolorow }} />
      </head>
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
