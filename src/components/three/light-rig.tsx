"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/** Full back-and-forth cycle, in seconds — a slow, lighthouse-like sweep. */
const SWEEP_PERIOD = 9;
/** How far the hot core travels either side of center (world units). */
const SWEEP_AMPLITUDE = 80;

/** Parallax nudge from the pointer — deliberately larger/livelier than the camera's own drift. */
const PARALLAX_AMPLITUDE_X = 36;
const PARALLAX_AMPLITUDE_Y = 22;
const PARALLAX_LERP = 0.06;

/** Generates a soft white-to-transparent radial falloff, used so the moving
 *  core has no hard rectangular edge as it sweeps behind the opening. */
function createGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.6)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * The beacon: a bright, soft-edged core that sweeps back and forth behind the
 * opening and nudges toward the pointer, layered on top of a dim, static fill
 * so the opening is never fully dark between passes.
 */
function BeaconCore() {
  const { gl } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Guarded for SSR (no `document` on the server); on the client this
  // resolves synchronously during the first render, no effect needed.
  const texture = useMemo(
    () => (typeof document === "undefined" ? null : createGlowTexture()),
    [],
  );

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  useEffect(() => {
    const el = gl.domElement;
    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    el.addEventListener("pointermove", handleMove, { passive: true });
    return () => el.removeEventListener("pointermove", handleMove);
  }, [gl]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const sweepX = Math.sin((t / SWEEP_PERIOD) * Math.PI * 2) * SWEEP_AMPLITUDE;
    const parallaxX = pointer.current.x * PARALLAX_AMPLITUDE_X;
    const parallaxY = pointer.current.y * PARALLAX_AMPLITUDE_Y;

    mesh.current.position.x = THREE.MathUtils.lerp(
      mesh.current.position.x,
      sweepX + parallaxX,
      PARALLAX_LERP,
    );
    mesh.current.position.y = THREE.MathUtils.lerp(
      mesh.current.position.y,
      parallaxY,
      PARALLAX_LERP,
    );
  });

  if (!texture) return null;

  return (
    <mesh ref={mesh}>
      {/* <planeGeometry args={[260, 260]} /> */}
      <meshBasicMaterial
        map={texture}
        color="#eef1f5"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * The light source behind the wall: a dim, static fill (so the opening is
 * always at least faintly lit) plus the sweeping/parallaxing beacon core, and
 * a low-intensity point light for a faint rim on the opening's cut edges.
 */
export function LightRig({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh>
        <planeGeometry args={[420, 420]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#eef1f5"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <BeaconCore />
      <pointLight color="#eef1f5" intensity={40} distance={340} decay={2} />
    </group>
  );
}
