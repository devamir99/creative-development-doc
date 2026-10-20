export const ORBIT_TARGET = { x: 0, y: 1.1, z: 0 } as const;

export const DEFAULT_ORBIT = {
  azimuthDeg: 32,
  elevationDeg: 18,
  radius: 6,
  fov: 40,
} as const;

export type OrbitParams = {
  /** Degrees around Y (0 = from +Z toward the subject). */
  azimuthDeg: number;
  /** Degrees above the horizontal through the target (0 = eye-level, 80 ≈ top-down). */
  elevationDeg: number;
  radius: number;
  fov: number;
};

export type OrbitCameraPose = {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
};

/**
 * Spherical orbit around a fixed look-at target.
 * Elevation is clamped so we never pass through the poles awkwardly.
 */
export function orbitPose(params: OrbitParams): OrbitCameraPose {
  const elevation = Math.min(85, Math.max(-10, params.elevationDeg));
  const radius = Math.max(1.5, params.radius);
  const phi = ((90 - elevation) * Math.PI) / 180;
  const theta = (params.azimuthDeg * Math.PI) / 180;

  const x = ORBIT_TARGET.x + radius * Math.sin(phi) * Math.sin(theta);
  const y = ORBIT_TARGET.y + radius * Math.cos(phi);
  const z = ORBIT_TARGET.z + radius * Math.sin(phi) * Math.cos(theta);

  return {
    position: [x, y, z],
    lookAt: [ORBIT_TARGET.x, ORBIT_TARGET.y, ORBIT_TARGET.z],
    fov: params.fov,
  };
}
