"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { postepHero } from "@/lib/postepHero";

/**
 * Poszarpany kryształ z ciemnego metalu, obrysowany czerwonym neonem —
 * nawiązanie do logotypu kanału. Reaguje na kursor (obrót) i scroll
 * (odjazd w głąb + rozgrzanie rdzenia).
 *
 * Bryła jest CIEMNA: kolor buduje światło i krawędzie, nie emisja.
 * Zbyt duże `emissiveIntensity` spłaszcza ją do czerwonej plamy.
 */

/** Icosahedron z lekko porozciąganymi wierzchołkami = czyste, fasetowane ścianki. */
function geometriaOdlamka(promien: number, ziarno: number, sila = 0.18) {
  const geo = new THREE.IcosahedronGeometry(promien, 0);
  const poz = geo.attributes.position;
  const w = new THREE.Vector3();

  // Deterministyczny „szum" — ta sama bryła przy każdym renderze.
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

type Props = { mobilnie: boolean };

export default function ObiektHero({ mobilnie }: Props) {
  const grupa = useRef<THREE.Group>(null);
  const krysztal = useRef<THREE.Mesh>(null);
  const rdzen = useRef<THREE.Mesh>(null);
  const orbita = useRef<THREE.Group>(null);
  const swiatloRdzenia = useRef<THREE.PointLight>(null);

  const geoGlowna = useMemo(() => geometriaOdlamka(1.5, 1, 0.34), []);
  // druga, mniejsza bryła w środku — daje głębię i „pęknięcia" jak w logotypie
  const geoWnetrze = useMemo(() => geometriaOdlamka(1.08, 5, 0.4), []);
  const geoKrawedzie = useMemo(() => new THREE.EdgesGeometry(geoGlowna, 1), [geoGlowna]);
  const geoRdzen = useMemo(() => new THREE.IcosahedronGeometry(0.55, 0), []);

  /** Mniejsze odłamki krążące wokół bryły. */
  const fragmenty = useMemo(() => {
    const ile = mobilnie ? 4 : 7;
    return Array.from({ length: ile }, (_, i) => {
      const kat = (i / ile) * Math.PI * 2;
      const promien = 2.6 + (i % 3) * 0.5;
      return {
        geo: geometriaOdlamka(0.09 + (i % 3) * 0.05, i + 7, 0.32),
        pozycja: new THREE.Vector3(
          Math.cos(kat) * promien,
          Math.sin(kat * 1.7) * 1.1,
          Math.sin(kat) * promien * 0.55,
        ),
      };
    });
  }, [mobilnie]);

  // Na wąskim ekranie ta sama bryła zajmuje cały kadr i zjada czytelność tekstu.
  const bazowaSkala = mobilnie ? 0.6 : 1;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const s = postepHero.scroll;
    const d = Math.min(delta, 0.05); // po powrocie z nieaktywnej karty delta bywa ogromna

    if (grupa.current) {
      const celY = postepHero.myszX * 0.5 + t * 0.1;
      const celX = postepHero.myszY * 0.28 + s * 0.5;
      grupa.current.rotation.y += (celY - grupa.current.rotation.y) * Math.min(1, d * 3);
      grupa.current.rotation.x += (celX - grupa.current.rotation.x) * Math.min(1, d * 3);
      grupa.current.rotation.z = Math.sin(t * 0.25) * 0.07 + s * 0.5;

      grupa.current.position.z = (mobilnie ? -1.4 : -0.6) - s * 4;
      // na mobile bryła idzie wyżej, żeby nie leżała na akapicie
      grupa.current.position.y = (mobilnie ? 0.85 : 0) + Math.sin(t * 0.6) * 0.08 - s * 0.5;
      // Bryła skaluje się z szerokością kadru 3D — na węższym oknie nie
      // rozlewa się na tekst, na szerokim nie ginie w tle.
      const dopasowanie = Math.min(1.1, Math.max(0.62, state.viewport.width / 8));
      grupa.current.scale.setScalar(bazowaSkala * dopasowanie * (1 - s * 0.22));
    }

    if (rdzen.current) {
      rdzen.current.rotation.x -= d * 0.45;
      rdzen.current.rotation.y += d * 0.3;
      (rdzen.current.material as THREE.MeshBasicMaterial).opacity = Math.min(
        0.9,
        0.22 + Math.sin(t * 2.1) * 0.06 + s * 0.8,
      );
    }

    if (krysztal.current) {
      const mat = krysztal.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.05 + s * 0.5;
    }

    if (swiatloRdzenia.current) {
      swiatloRdzenia.current.intensity = 3 + Math.sin(t * 2.4) * 0.8 + s * 10;
    }

    if (orbita.current) {
      orbita.current.rotation.y += d * (0.16 + s * 0.8);
      orbita.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <group ref={grupa}>
      {/* bryła główna — ciemny metal, rzeźbiony światłem */}
      <mesh ref={krysztal} geometry={geoGlowna}>
        <meshStandardMaterial
          color="#1a1a1f"
          metalness={0.45}
          roughness={0.24}
          flatShading
          emissive="#e10600"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* wewnętrzna bryła — widoczna w szczelinach, buduje głębię */}
      <mesh geometry={geoWnetrze} rotation={[0.7, 0.4, 0.2]}>
        <meshStandardMaterial
          color="#2a0604"
          metalness={0.8}
          roughness={0.35}
          flatShading
          emissive="#e10600"
          emissiveIntensity={0.28}
        />
      </mesh>

      {/* neonowy obrys krawędzi */}
      <lineSegments geometry={geoKrawedzie}>
        <lineBasicMaterial
          color="#ff2a1f"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* rozgrzany rdzeń prześwitujący przez szczeliny */}
      <mesh ref={rdzen} geometry={geoRdzen}>
        <meshBasicMaterial
          color="#ff3a2a"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight ref={swiatloRdzenia} color="#ff2a1f" intensity={3} distance={7} decay={2} />

      {/* krążące odłamki */}
      <group ref={orbita}>
        {fragmenty.map((f, i) => (
          <mesh key={i} geometry={f.geo} position={f.pozycja}>
            <meshStandardMaterial
              color="#141417"
              metalness={0.7}
              roughness={0.28}
              flatShading
              emissive="#e10600"
              emissiveIntensity={0.12}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
