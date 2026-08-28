import Preloader from "@/components/Preloader";
import Hero from "@/components/sections/Hero";
import OMnie from "@/components/sections/OMnie";
import Harmonogram from "@/components/sections/Harmonogram";
import Highlights from "@/components/sections/Highlights";
import Kontakt from "@/components/sections/Kontakt";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <OMnie />
        <Harmonogram />
        <Highlights />
        <Kontakt />
      </main>
    </>
  );
}
