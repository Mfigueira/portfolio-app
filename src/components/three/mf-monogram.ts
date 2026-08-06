import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * Approved monogram paths from mf_monogram_v7_regular_m.html — 200×200 grid,
 * SVG-style coordinates (y increasing downward). Do not re-space or re-center.
 */
const M_PATH_D = "M42 48 L42 152 L104 152 L104 48 L84 48 L73 132 L62 48 Z";
const F_PATH_D =
  "M114 48 L157 48 L143 72 L134 72 L134 92 L149 92 L141 116 L134 116 L134 152 L114 152 Z";

const GRID_CENTER = 100;

/** Grid space (y-down) → local scene space (origin-centered, y-up). */
function toLocal(x: number, y: number): [number, number] {
  return [x - GRID_CENTER, GRID_CENTER - y];
}

/** Parses one of the fixed "M x y L x y ... Z" strings into a closed THREE.Shape. */
function shapeFromCommands(d: string): THREE.Shape {
  const shape = new THREE.Shape();
  const commands = d.match(/[ML]-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?|Z/g) ?? [];

  commands.forEach((command, index) => {
    if (command === "Z") {
      shape.closePath();
      return;
    }
    const [gridX, gridY] = command.slice(1).trim().split(/\s+/).map(Number);
    const [x, y] = toLocal(gridX as number, gridY as number);
    if (index === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });

  return shape;
}

function buildScaledMonogramExtrusion(
  depth: number,
  coinRadius: number,
  facePadding: number,
  zOrigin: "center" | "start",
): THREE.BufferGeometry {
  const shapes = [shapeFromCommands(M_PATH_D), shapeFromCommands(F_PATH_D)];

  const extruded = shapes.map(
    (shape) =>
      new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 1,
      }),
  );

  const geometry = mergeGeometries(extruded)!;
  extruded.forEach((geo) => geo.dispose());

  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = (coinRadius * 2 * facePadding) / Math.max(size.x, size.y);
  const zOffset = zOrigin === "center" ? -depth / 2 : 0;
  geometry.translate(-center.x, -center.y, zOffset);
  geometry.scale(scale, scale, 1);

  return geometry;
}

/**
 * Builds a flat monogram mesh scaled to fit a coin face, with a shallow emboss
 * along +Z. Intended to be placed on each cylinder cap.
 */
export function buildMonogramGeometry(
  coinRadius: number,
  embossDepth: number,
  facePadding = 0.86,
): THREE.BufferGeometry {
  return buildScaledMonogramExtrusion(embossDepth, coinRadius, facePadding, "center");
}

/**
 * Same MF silhouette as the coin emboss, extruded outward for a shaped light beam.
 * The coin-face cross-section sits at z = 0 and the beam extends along +Z.
 */
export function buildMonogramBeamGeometry(
  coinRadius: number,
  beamLength: number,
  facePadding = 0.86,
): THREE.BufferGeometry {
  const geometry = buildScaledMonogramExtrusion(
    beamLength,
    coinRadius,
    facePadding,
    "start",
  );

  const positions = geometry.getAttribute("position");
  const colors = new Float32Array(positions.count * 3);

  for (let i = 0; i < positions.count; i++) {
    const t = THREE.MathUtils.clamp(positions.getZ(i) / beamLength, 0, 1);
    const fade = Math.pow(1 - t, 1.5);
    colors[i * 3] = fade;
    colors[i * 3 + 1] = fade;
    colors[i * 3 + 2] = fade;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return geometry;
}
