"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { postepHero } from "@/lib/postepHero";

/** Unoszące się iskry — tanie Points z addytywnym blendem. */
export default function Iskry({ ile = 500 }: { ile?: number }) {
  const punkty = useRef<THREE.Points>(null);

  const { geometria, predkosci } = useMemo(() => {
    const pozycje = new Float32Array(ile * 3);
    const predkosci = new Float32Array(ile);

    for (let i = 0; i < ile; i++) {
      pozycje[i * 3] = (Math.random() - 0.5) * 16;
      pozycje[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pozycje[i * 3 + 2] = (Math.random() - 0.5) * 9 - 1;
      predkosci[i] = 0.12 + Math.random() * 0.4;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pozycje, 3));
    return { geometria: geo, predkosci };
  }, [ile]);

  useFrame((_, delta) => {
    const obiekt = punkty.current;
    if (!obiekt) return;

    const d = Math.min(delta, 0.05);
    const atrybut = obiekt.geometry.attributes.position as THREE.BufferAttribute;
    const tab = atrybut.array as Float32Array;

    for (let i = 0; i < ile; i++) {
      tab[i * 3 + 1] += predkosci[i] * d;
      if (tab[i * 3 + 1] > 5.5) {
        tab[i * 3 + 1] = -5.5;
        tab[i * 3] = (Math.random() - 0.5) * 16;
      }
    }
    atrybut.needsUpdate = true;

    // przy scrollu iskry rozjeżdżają się i gasną
    obiekt.position.z = postepHero.scroll * 3;
    (obiekt.material as THREE.PointsMaterial).opacity = 0.45 - postepHero.scroll * 0.32;
  });

  return (
    <points ref={punkty} geometry={geometria}>
      <pointsMaterial
        color="#ff2a1f"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
