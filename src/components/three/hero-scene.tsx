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

const GEOMETRY_RADIUS = 15;
const GEOMETRY_DEPTH = 0.45;
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
/** Higher = snappier cursor follow; lower = more lag. */
const CURSOR_SMOOTH = 3;

const GEOMETRY_LAYOUT = {
  mobile: { position: [0, 22, 0] as const, scale: 0.5 },
  desktop: { position: [30, 0, 0] as const, scale: 1 },
};
const DESKTOP_BREAKPOINT = "(min-width: 768px)";

function useGeometryLayout(): {
  position: [number, number, number];
  scale: number;
} {
  const [layout, setLayout] = useState({
    position: [...GEOMETRY_LAYOUT.mobile.position] as [number, number, number],
    scale: GEOMETRY_LAYOUT.mobile.scale,
  });

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_BREAKPOINT);
    const sync = () => {
      const next = mq.matches ? GEOMETRY_LAYOUT.desktop : GEOMETRY_LAYOUT.mobile;
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

function pointerToRotation(clientX: number, clientY: number): { x: number; y: number } {
  const nx = clientX / window.innerWidth - 0.5;
  const ny = clientY / window.innerHeight - 0.5;
  return {
    x: ROTATION_X_CENTER + ny * 2 * ROTATION_X_AMPLITUDE,
    y: ROTATION_Y_CENTER + nx * 2 * ROTATION_Y_AMPLITUDE,
  };
}

/** Phase offsets so idle motion resumes from the beam's current angle. */
function syncIdlePhase(
  rotation: { x: number; y: number },
  t: number,
  phase: { x: number; y: number },
) {
  const nx = THREE.MathUtils.clamp(
    (rotation.x - ROTATION_X_CENTER) / ROTATION_X_AMPLITUDE,
    -1,
    1,
  );
  const ny = THREE.MathUtils.clamp(
    (rotation.y - ROTATION_Y_CENTER) / ROTATION_Y_AMPLITUDE,
    -1,
    1,
  );
  phase.x = Math.asin(nx) - t;
  phase.y = Math.acos(ny) - t * 0.85;
}

function idleRotation(t: number, phase: { x: number; y: number }) {
  return {
    x: ROTATION_X_CENTER + ROTATION_X_AMPLITUDE * Math.sin(t + phase.x),
    y: ROTATION_Y_CENTER + ROTATION_Y_AMPLITUDE * Math.cos(t * 0.85 + phase.y),
  };
}

function Geometry() {
  const group = useRef<Group>(null);
  const spotlight = useRef<THREE.Mesh>(null);

  const reducedMotion = useRef(false);
  const pointerActive = useRef(false);
  const syncIdlePhaseOnLeave = useRef(false);
  const idlePhase = useRef({ x: Math.PI / 0.5, y: Math.PI / 1.6 });
  const targetRotation = useRef({ x: ROTATION_X_CENTER, y: ROTATION_Y_CENTER });
  const currentRotation = useRef({ x: ROTATION_X_CENTER, y: ROTATION_Y_CENTER });
  const { position, scale } = useGeometryLayout();
  const monogram = useMemo(
    () => buildMonogramGeometry(GEOMETRY_RADIUS, GEOMETRY_DEPTH),
    [],
  );
  const beam = useMemo(() => buildMonogramBeamGeometry(GEOMETRY_RADIUS, BEAM_LENGTH), []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const onMove = (event: PointerEvent) => {
      pointerActive.current = true;
      const next = pointerToRotation(event.clientX, event.clientY);
      targetRotation.current.x = next.x;
      targetRotation.current.y = next.y;
    };

    const onLeave = () => {
      if (pointerActive.current) {
        syncIdlePhaseOnLeave.current = true;
      }
      pointerActive.current = false;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    return () => {
      monogram.dispose();
      beam.dispose();
    };
  }, [monogram, beam]);

  useFrame(({ clock }, delta) => {
    if (reducedMotion.current || !spotlight.current) return;

    const t = clock.elapsedTime * ROTATION_SPEED;

    if (syncIdlePhaseOnLeave.current) {
      syncIdlePhase(currentRotation.current, t, idlePhase.current);
      syncIdlePhaseOnLeave.current = false;
    }

    if (pointerActive.current) {
      const blend = 1 - Math.exp(-CURSOR_SMOOTH * delta);
      currentRotation.current.x +=
        (targetRotation.current.x - currentRotation.current.x) * blend;
      currentRotation.current.y +=
        (targetRotation.current.y - currentRotation.current.y) * blend;
    } else {
      const idle = idleRotation(t, idlePhase.current);
      currentRotation.current.x = idle.x;
      currentRotation.current.y = idle.y;
    }

    spotlight.current.rotation.x = currentRotation.current.x;
    spotlight.current.rotation.y = currentRotation.current.y;
  });

  return (
    <group ref={group} position={position} scale={scale} rotation={[0, -0.25, 0]}>
      <mesh geometry={monogram} position={[0, 0, 0]}>
        <meshStandardMaterial emissive={MONOGRAM_COLOR} fog={false} />
      </mesh>

      <mesh ref={spotlight} geometry={beam} position={[0, 0, GEOMETRY_DEPTH]}>
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
      <Geometry />
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
