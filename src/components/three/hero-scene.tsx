"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { cn } from "@/lib/cn";
import { buildWallGeometry, WALL_DEPTH } from "@/components/three/mf-geometry";
import { CameraRig, CAMERA_DISTANCE, CAMERA_FOV } from "@/components/three/camera-rig";
import { LightRig } from "@/components/three/light-rig";

/** Behind the wall's back face by roughly 4x its thickness — a separate source, not touching it. */
const LIGHT_DISTANCE_BEHIND = WALL_DEPTH * 4;
const LIGHT_Z = -(WALL_DEPTH / 2 + LIGHT_DISTANCE_BEHIND);

/** Close to the page's own --color-bg so the wall reads as an extension of the
 *  hero's darkness rather than a differently-toned card sitting on top of it. */
const WALL_COLOR = "#0d0d0f";

function Wall() {
  const geometry = useMemo(() => buildWallGeometry(), []);

  return (
    <Center disableZ>
      <mesh geometry={geometry}>
        {/* No light in the scene reaches the wall's camera-facing side (the
            beacon sits behind it), so meshStandardMaterial's `color` alone
            would never actually render — the face would stay lit-by-nothing
            black. `emissive` gives it that base tone unconditionally, while
            `color`/roughness still let the beacon's rim light show through
            near the opening. */}
        <meshStandardMaterial
          color={WALL_COLOR}
          emissive={WALL_COLOR}
          emissiveIntensity={1}
          roughness={0.87}
          metalness={0}
        />
      </mesh>
    </Center>
  );
}

function Scene() {
  return (
    <>
      <Wall />
      <LightRig z={LIGHT_Z} />
      <CameraRig />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} intensity={0.85} radius={0.65} mipmapBlur />
        <Noise opacity={0.1} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

/**
 * A dark wall with an MF-shaped opening, lit only by a beacon-like source
 * behind it. The wall never moves — the camera orbits it in a
 * barely-perceptible drift, while the light itself sweeps back and forth and
 * nudges toward the pointer for a livelier parallax. Sized entirely by the
 * parent via `className` — intended to be `absolute inset-0` across the
 * whole hero so the glow can reach every edge, not boxed into its own panel.
 */
export function HeroScene({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "transition-opacity duration-2000 ease-out",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        gl={{ antialias: true, alpha: true }}
        camera={{
          fov: CAMERA_FOV,
          near: 1,
          far: 2000,
          position: [0, 0, CAMERA_DISTANCE],
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
