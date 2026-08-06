"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { cn } from "@/lib/cn";
import {
  buildMonogramGeometry,
  buildMonogramBeamGeometry,
} from "@/components/three/mf-monogram";
import type { Group } from "three";
import * as THREE from "three";

const COIN_RADIUS = 15;
const EMBOSS_DEPTH = 0.45;
const MONOGRAM_COLOR = "#f8f8f8";
const SPOTLIGHT_COLOR = "#d8d8e0";

/** Mid-gray haze the beam dissolves into along its length. */
const SCENE_FOG_COLOR = "#505058";

const BEAM_LENGTH = 1000;

const ROTATION_Y_MIN = 0;
const ROTATION_Y_MAX = 0.5;
const ROTATION_Y_CENTER = (ROTATION_Y_MIN + ROTATION_Y_MAX) / 2;
const ROTATION_Y_AMPLITUDE = (ROTATION_Y_MAX - ROTATION_Y_MIN) / 2;

const ROTATION_X_MIN = -0.1;
const ROTATION_X_MAX = 0.1;
const ROTATION_X_CENTER = (ROTATION_X_MIN + ROTATION_X_MAX) / 2;
const ROTATION_X_AMPLITUDE = (ROTATION_X_MAX - ROTATION_X_MIN) / 2;
/** One oscillation cycle in ~16s. */
const ROTATION_SPEED = Math.PI / 12;

const COIN_LAYOUT = {
  mobile: { position: [0, 22, 0] as const, scale: 0.5 },
  desktop: { position: [30, 0, 0] as const, scale: 1 },
};
const DESKTOP_BREAKPOINT = "(min-width: 768px)";

function useCoinLayout(): {
  position: [number, number, number];
  scale: number;
} {
  const [layout, setLayout] = useState({
    position: [...COIN_LAYOUT.mobile.position] as [number, number, number],
    scale: COIN_LAYOUT.mobile.scale,
  });

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_BREAKPOINT);
    const sync = () => {
      const next = mq.matches ? COIN_LAYOUT.desktop : COIN_LAYOUT.mobile;
      setLayout({
        position: [...next.position],
        scale: next.scale,
      });
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return layout;
}

function Coin() {
  const group = useRef<Group>(null);
  const spotlight = useRef<THREE.Mesh>(null);

  const reducedMotion = useRef(false);
  const { position, scale } = useCoinLayout();
  const monogram = useMemo(() => buildMonogramGeometry(COIN_RADIUS, EMBOSS_DEPTH), []);
  const beam = useMemo(() => buildMonogramBeamGeometry(COIN_RADIUS, BEAM_LENGTH), []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    return () => {
      monogram.dispose();
      beam.dispose();
    };
  }, [monogram, beam]);

  useFrame(({ clock }) => {
    if (reducedMotion.current || !spotlight.current) return;
    const t = clock.elapsedTime * ROTATION_SPEED;
    spotlight.current.rotation.x = ROTATION_X_CENTER + ROTATION_X_AMPLITUDE * Math.sin(t);
    spotlight.current.rotation.y =
      ROTATION_Y_CENTER + ROTATION_Y_AMPLITUDE * Math.cos(t * 0.85);
  });

  return (
    <group ref={group} position={position} scale={scale} rotation={[0, -0.25, 0]}>
      <mesh geometry={monogram} position={[0, 0, 0]}>
        <meshStandardMaterial
          emissive={MONOGRAM_COLOR}
          roughness={0}
          metalness={1}
          fog={false}
        />
      </mesh>

      <mesh ref={spotlight} geometry={beam} position={[0, 0, EMBOSS_DEPTH]}>
        <meshStandardMaterial
          emissive={SPOTLIGHT_COLOR}
          vertexColors
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          side={THREE.DoubleSide}
          fog
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <Coin />
      <fogExp2 attach="fog" args={[SCENE_FOG_COLOR, 1]} />
    </>
  );
}

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
        "transition-opacity duration-1000",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        gl={{ antialias: true, alpha: true }}
        camera={{
          fov: 15,
          near: 0.1,
          far: 1000,
          position: [0, 0, 300],
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
