"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import ObiektHero from "./ObiektHero";
import Iskry from "./Iskry";
import { postepHero } from "@/lib/postepHero";
import { ruchOgraniczony } from "@/lib/useRuchDozwolony";

/** Czy przeglądarka w ogóle da radę z WebGL-em. */
function maWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroScena() {
  const opakowanie = useRef<HTMLDivElement>(null);
  const [gotowa, setGotowa] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [mobilnie, setMobilnie] = useState(false);
  const [statyczna, setStatyczna] = useState(false);
  const [widoczna, setWidoczna] = useState(true);
  const [dpr, setDpr] = useState(1.25);

  useEffect(() => {
    setWebgl(maWebGL());
    setMobilnie(window.matchMedia("(max-width: 768px)").matches);
    setStatyczna(ruchOgraniczony());
    setGotowa(true);
  }, []);

  /* Scena renderuje tylko gdy jest w kadrze i karta jest aktywna. */
  useEffect(() => {
    const el = opakowanie.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([wpis]) => {
        postepHero.widoczna = wpis.isIntersecting;
        setWidoczna(wpis.isIntersecting && !document.hidden);
      },
      { rootMargin: "120px" },
    );
    obs.observe(el);

    const naZmianeKarty = () => setWidoczna(!document.hidden && postepHero.widoczna);
    document.addEventListener("visibilitychange", naZmianeKarty);

    return () => {
      obs.disconnect();
      document.removeEventListener("visibilitychange", naZmianeKarty);
    };
  }, []);

  // Brak WebGL → tło zostaje samo, bez pustego canvasu.
  if (gotowa && !webgl) return null;

  return (
    <div ref={opakowanie} className="h-full w-full">
      {gotowa && (
        <Canvas
          camera={{ position: [0, 0, 6.6], fov: 42 }}
          dpr={dpr}
          frameloop={statyczna ? "demand" : widoczna ? "always" : "never"}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ pointerEvents: "none" }}
        >
          {/* Spadek fps → niższe DPR zamiast klatkowania */}
          <PerformanceMonitor
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr((d) => Math.min(1.5, d + 0.25))}
          />
          <AdaptiveDpr />

          <ambientLight intensity={0.22} />
          {/* klucz — buduje rysunek fasetek */}
          <directionalLight position={[5, 6, 6]} intensity={5} color="#ffffff" />
          {/* kontra od dołu i z tyłu — czerwone obrysy brył */}
          <pointLight position={[-4.5, -2.5, 2.5]} intensity={16} distance={14} color="#e10600" />
          <pointLight position={[4.5, 2.5, -3.5]} intensity={26} distance={14} color="#ff2a1f" />
          <spotLight
            position={[0, 6, 5]}
            angle={0.6}
            penumbra={1}
            intensity={26}
            distance={18}
            color="#ffffff"
          />

          <ObiektHero mobilnie={mobilnie} />
          <Iskry ile={mobilnie ? 180 : 480} />

          {/* mgła tylko dla dalekiego planu — bryła stoi ~7 jednostek od kamery */}
          <fog attach="fog" args={["#101017", 13, 30]} />
        </Canvas>
      )}
    </div>
  );
}
