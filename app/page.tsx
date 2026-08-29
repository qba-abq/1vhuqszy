import Preloader from "@/components/Preloader";
import TloZywe from "@/components/TloZywe";
import Nawigacja from "@/components/Nawigacja";
import KursorNeon from "@/components/KursorNeon";
import PasekMarquee from "@/components/ui/PasekMarquee";
import Hero from "@/components/sections/Hero";
import OMnie from "@/components/sections/OMnie";
import Harmonogram from "@/components/sections/Harmonogram";
import Highlights from "@/components/sections/Highlights";
import Kontakt from "@/components/sections/Kontakt";

export default function Home() {
  return (
    <>
      <Preloader />
      <TloZywe />
      <Nawigacja />
      <KursorNeon />
      <main className="relative z-10">
        <Hero />
        <PasekMarquee slowa={["Hukszy", "Live", "Wt 17:00", "Pt 21:00", "Sb 21:00"]} />
        <OMnie />
        <Harmonogram />
        <PasekMarquee
          kierunek={-1}
          slowa={["Klipy", "Highlights", "Memy", "Horror", "Jumpscare"]}
        />
        <Highlights />
        <Kontakt />
      </main>
    </>
  );
}
