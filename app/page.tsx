import Preloader from "@/components/Preloader";
import TloZywe from "@/components/TloZywe";
import Nawigacja from "@/components/Nawigacja";
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
      <main className="relative z-10">
        <Hero />
        <OMnie />
        <Harmonogram />
        <Highlights />
        <Kontakt />
      </main>
    </>
  );
}
