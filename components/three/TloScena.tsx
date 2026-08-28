"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { stanTla } from "@/lib/stanTla";

/**
 * Druga warstwa 3D: ciemne odłamki dryfujące przez CAŁĄ stronę.
 * Canvas jest fixed za treścią; scroll przesuwa odłamki w górę z różnymi
 * prędkościami (parallax), więc schodząc w dół strony cały czas mija się
 * kolejne bryły. Desktop only — montuje ją TloZywe po bezczynności.
 */

function geometriaOdlamka(promien: number, ziarno: number, sila = 0.4) {
  const geo = new THREE.IcosahedronGeometry(promien, 0);
  const poz = geo.attributes.position;
  const w = new THREE.Vector3();
  const los = (i: number) => {
    const s = Math.sin(i * 127.1 + ziarno * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  for (let i = 0; i < poz.count; i++) {
    w.fromBufferAttribute(poz, i);
    w.multiplyScalar(1 + (los(i) - 0.5) * 2 * sila);
    poz.setXYZ(i, w.x, w.y, w.z);
  }
  poz.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

const ILE = 14;
/** Wysokość „kolumny" świata, przez którą scrolluje kamera (jednostki three). */
const KOLUMNA = 30;

function Odlamki() {
  const grupa = useRef<THREE.Group>(null);

  const odlamki = useMemo(() => {
    const rand = (i: number, k: number) => {
      const s = Math.sin(i * 91.7 + k * 47.3) * 43758.5453;
      return s - Math.floor(s);
    };
    return Array.from({ length: ILE }, (_, i) => ({
      geo: geometriaOdlamka(0.16 + rand(i, 1) * 0.34, i + 3),
      x: (rand(i, 2) - 0.5) * 14,
      y0: rand(i, 3) * KOLUMNA,
      z: -2.5 - rand(i, 4) * 4,
      tempoParallax: 0.5 + rand(i, 5) * 0.9,
      tempoObrotu: (rand(i, 6) - 0.5) * 0.5,
      faza: rand(i, 7) * Math.PI * 2,
    }));
  }, []);

  useFrame((state, delta) => {
    const g = grupa.current;
    if (!g) return;
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const s = stanTla.scroll;

    g.children.forEach((dziecko, i) => {
      const o = odlamki[i];
      // scroll niesie odłamki w górę; modulo zawija kolumnę w pętlę
      const y = ((o.y0 + s * KOLUMNA * o.tempoParallax) % KOLUMNA) - KOLUMNA / 2;
      dziecko.position.y = -y + Math.sin(t * 0.4 + o.faza) * 0.25;
      dziecko.position.x = o.x + Math.sin(t * 0.22 + o.faza) * 0.35 + stanTla.myszX * 0.35;
      dziecko.rotation.x += d * o.tempoObrotu;
      dziecko.rotation.y += d * o.tempoObrotu * 1.4;
    });
  });

  return (
    <group ref={grupa}>
      {odlamki.map((o, i) => (
        <mesh key={i} geometry={o.geo} position={[o.x, 0, o.z]}>
          <meshStandardMaterial
            color="#131316"
            metalness={0.75}
            roughness={0.3}
            flatShading
            emissive="#e10600"
            emissiveIntensity={0.14}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function TloScena() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={1}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 6]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, 0, 2]} intensity={10} distance={14} color="#e10600" />
      <Odlamki />
    </Canvas>
  );
}
