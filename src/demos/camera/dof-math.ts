/** World-space focus targets for the DOF lab (camera looks from +Z). */

export type DofFocusPlane = "near" | "mid" | "far";

export type DofParams = {
  /** World Z of the focus plane (subject sits on X=0, Y≈0.55). */
  focusZ: number;
  /** Softness / size of the out-of-focus discs (effect bokehScale). */
  bokehScale: number;
  /** Depth of the sharp band in world units (worldFocusRange). */
  focusRange: number;
};

export const DOF_CAMERA = {
  position: [0, 1.25, 7] as [number, number, number],
  fov: 40,
  lookAt: [0, 0.55, -2] as [number, number, number],
};

/** Subject centers used for Near / Mid / Far presets. */
export const DOF_SUBJECTS = {
  near: { position: [0, 0.55, 0] as [number, number, number], label: "Near" },
  mid: { position: [0, 0.55, -3.5] as [number, number, number], label: "Mid" },
  far: { position: [0, 0.55, -8] as [number, number, number], label: "Far" },
} as const;

export const DEFAULT_DOF: DofParams = {
  focusZ: DOF_SUBJECTS.near.position[2],
  bokehScale: 4,
  focusRange: 1.2,
};

export function focusZForPlane(plane: DofFocusPlane): number {
  return DOF_SUBJECTS[plane].position[2];
}

/** Approximate camera→focus distance for readouts (fixed lab camera). */
export function approxFocusDistance(focusZ: number): number {
  const [, cy, cz] = DOF_CAMERA.position;
  const dy = cy - 0.55;
  const dz = cz - focusZ;
  return Math.hypot(dy, dz);
}

export function nearestPlane(focusZ: number): DofFocusPlane {
  const entries = Object.entries(DOF_SUBJECTS) as [
    DofFocusPlane,
    (typeof DOF_SUBJECTS)[DofFocusPlane],
  ][];
  let best: DofFocusPlane = "near";
  let bestDist = Infinity;
  for (const [key, sub] of entries) {
    const d = Math.abs(sub.position[2] - focusZ);
    if (d < bestDist) {
      bestDist = d;
      best = key;
    }
  }
  return best;
}
