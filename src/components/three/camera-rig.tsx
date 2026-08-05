"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/** Vertical field of view, in degrees — shared with the Canvas's camera prop. */
export const CAMERA_FOV = 35;
/** Camera sits this far from the wall along +z; the wall and light never move. */
export const CAMERA_DISTANCE = 350;

/**
 * Idle drift: a slow elliptical path, out-of-phase on x/y, ~28s per loop.
 * This is the camera's own barely-perceptible sway — separate from (and much
 * smaller than) the light beacon's deliberately visible sweep.
 */
const DRIFT_PERIOD = 28;
const DRIFT_AMPLITUDE_X = 8.5;
const DRIFT_AMPLITUDE_Y = 6;

/** Cursor nudge: same small amplitude family as the idle drift. */
const CURSOR_AMPLITUDE_X = 10;
const CURSOR_AMPLITUDE_Y = 7;

/** Seconds of pointer inactivity before the raw cursor->idle handoff completes. */
const IDLE_FADE_SECONDS = 1.4;
/** Time constant for smoothing that handoff so it never snaps either way. */
const BLEND_TAU = 0.7;

/** How eagerly the camera chases its target each frame — gentle, not snappy. */
const POSITION_LERP = 0.045;

/**
 * Now that the canvas fills the whole hero (rather than a small square box),
 * its aspect ratio varies a lot: wide on desktop, tall on mobile. These
 * control where the opening sits within that frame — right-of-center on wide
 * layouts (to sit beside the copy on the left), upper-of-center on tall ones
 * (to sit above the copy, which is stacked below). A near-square frame is
 * treated as "not wide enough" and stays centered.
 */
const WIDE_ASPECT_THRESHOLD = 1.15;
const DESKTOP_X_FRACTION = 0.6;
const MOBILE_Y_FRACTION_FROM_TOP = 0.32;

const HALF_FOV_RAD = (CAMERA_FOV * Math.PI) / 360;

/**
 * Orbits the camera very subtly around a look-at target near the center of
 * the MF opening. The wall and light source never move — only the viewpoint
 * does, blending between a slow idle drift and a small cursor-driven nudge.
 * The look-at target itself is also offset (see above) so the opening reads
 * as intentionally placed within the full-bleed frame rather than dead center.
 */
export function CameraRig() {
  const { camera, gl } = useThree();

  const pointer = useRef({ x: 0, y: 0 });
  const lastMoveAt = useRef(-Infinity);
  const weight = useRef(0);
  const nextPosition = useRef(new THREE.Vector3(0, 0, CAMERA_DISTANCE));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const el = gl.domElement;

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      lastMoveAt.current = performance.now();
    };

    // Leaving the canvas hands control back to the idle drift; the fade
    // below still eases this over ~1-2s rather than snapping.
    const handleLeave = () => {
      lastMoveAt.current = -Infinity;
    };

    el.addEventListener("pointermove", handleMove, { passive: true });
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    const idleX = Math.sin((t / DRIFT_PERIOD) * Math.PI * 2) * DRIFT_AMPLITUDE_X;
    const idleY = Math.cos((t / DRIFT_PERIOD) * Math.PI * 2) * DRIFT_AMPLITUDE_Y;

    const cursorX = pointer.current.x * CURSOR_AMPLITUDE_X;
    const cursorY = pointer.current.y * CURSOR_AMPLITUDE_Y;

    const elapsedSinceMove = (performance.now() - lastMoveAt.current) / 1000;
    const rawWeight = THREE.MathUtils.clamp(
      1 - elapsedSinceMove / IDLE_FADE_SECONDS,
      0,
      1,
    );
    const blend = 1 - Math.exp(-delta / BLEND_TAU);
    weight.current += (rawWeight - weight.current) * blend;

    const offsetX = THREE.MathUtils.lerp(idleX, cursorX, weight.current);
    const offsetY = THREE.MathUtils.lerp(idleY, cursorY, weight.current);

    // Re-derive the frame's half-height/width every frame from the canvas's
    // actual aspect, so the opening stays correctly placed through resizes.
    const verticalHalfFrame = CAMERA_DISTANCE * Math.tan(HALF_FOV_RAD);
    const aspect = state.size.width / state.size.height;
    const isWide = aspect >= WIDE_ASPECT_THRESHOLD;

    if (isWide) {
      const horizontalHalfFrame = verticalHalfFrame * aspect;
      lookTarget.current.x = -(DESKTOP_X_FRACTION - 0.5) * 2 * horizontalHalfFrame;
      lookTarget.current.y = 0;
    } else {
      lookTarget.current.x = 0;
      lookTarget.current.y =
        -(1 - MOBILE_Y_FRACTION_FROM_TOP - 0.5) * 2 * verticalHalfFrame;
    }

    nextPosition.current.set(offsetX, offsetY, CAMERA_DISTANCE);
    camera.position.lerp(nextPosition.current, POSITION_LERP);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
