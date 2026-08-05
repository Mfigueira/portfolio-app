import * as THREE from "three";

/**
 * The monogram, as two closed paths on a 200x200 reference grid (SVG-style,
 * y increasing downward). Approved geometry — do not re-space or re-center.
 */
const M_PATH_D = "M42 48 L42 152 L104 152 L104 48 L84 48 L73 132 L62 48 Z";
const F_PATH_D =
  "M114 48 L157 48 L143 72 L134 72 L134 92 L149 92 L141 116 L134 116 L134 152 L114 152 Z";

const GRID_CENTER = 100;

/** Scales the M/F cutout around the grid center; wall extents stay fixed. */
const MONOGRAM_SCALE = 0.4;

/** Wall extents, sized well beyond the monogram's bounding box (x: -58..57, y: -52..52). */
const WALL_WIDTH = 900;
const WALL_HEIGHT = 520;

/** Extrusion depth, on the same 200-unit scale as the monogram grid. */
export const WALL_DEPTH = 20;

/** Grid space (y-down) -> local scene space (origin-centered, y-up). */
function toLocal(x: number, y: number): [number, number] {
  return [x - GRID_CENTER, GRID_CENTER - y];
}

/** Scales a grid point around the monogram center before mapping to local space. */
function scaleGridPoint(x: number, y: number): [number, number] {
  return [
    GRID_CENTER + (x - GRID_CENTER) * MONOGRAM_SCALE,
    GRID_CENTER + (y - GRID_CENTER) * MONOGRAM_SCALE,
  ];
}

/** Parses one of the fixed "M x y L x y ... Z" strings above into a closed THREE.Path. */
function pathFromCommands(d: string): THREE.Path {
  const path = new THREE.Path();
  const commands = d.match(/[ML]-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?|Z/g) ?? [];

  commands.forEach((command, index) => {
    if (command === "Z") {
      path.closePath();
      return;
    }
    const [gridX, gridY] = command.slice(1).trim().split(/\s+/).map(Number);
    const [scaledX, scaledY] = scaleGridPoint(gridX as number, gridY as number);
    const [x, y] = toLocal(scaledX, scaledY);
    if (index === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  });

  return path;
}

/**
 * Builds the wall as a single large rectangle with the M and F glyphs
 * subtracted as through-holes, then extrudes it to real thickness. Static —
 * intended to be built once and memoized by the caller.
 */
export function buildWallGeometry(): THREE.ExtrudeGeometry {
  const halfW = WALL_WIDTH / 2;
  const halfH = WALL_HEIGHT / 2;

  const outline = new THREE.Shape();
  outline.moveTo(-halfW, -halfH);
  outline.lineTo(halfW, -halfH);
  outline.lineTo(halfW, halfH);
  outline.lineTo(-halfW, halfH);
  outline.closePath();

  outline.holes = [pathFromCommands(M_PATH_D), pathFromCommands(F_PATH_D)];

  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: WALL_DEPTH,
    bevelEnabled: false,
    curveSegments: 1,
  });
  // Centers x/y (already ~0 by construction) and z (extrusion runs 0..depth
  // by default), so the wall's opening sits exactly at the local origin.
  geometry.center();
  return geometry;
}
