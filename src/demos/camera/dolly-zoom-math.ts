/** Baseline framing shared by Dolly and Zoom panels. */
export const BASE_CAMERA_Z = 6;
export const BASE_FOV_DEG = 40;
/** Closest dolly Z at push = 1 (still in front of the subject at z=0). */
export const CLOSE_CAMERA_Z = 3;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export type DollyZoomFraming = {
  /** 0 = matched baseline · 1 = strongest push-in */
  amount: number;
  dolly: { z: number; fov: number };
  zoom: { z: number; fov: number };
};

/**
 * Keep the subject roughly the same angular size while comparing techniques.
 * Dolly: move the eye (Z), FOV fixed.
 * Zoom: change FOV, eye fixed.
 *
 * Match: z * tan(fov/2) stays constant vs baseline.
 */
export function framingForPush(amount: number): DollyZoomFraming {
  const t = Math.min(1, Math.max(0, amount));
  const zDolly = lerp(BASE_CAMERA_Z, CLOSE_CAMERA_Z, t);
  const halfBase = ((BASE_FOV_DEG / 2) * Math.PI) / 180;
  const fovZoomRad =
    2 * Math.atan((zDolly / BASE_CAMERA_Z) * Math.tan(halfBase));
  const fovZoom = (fovZoomRad * 180) / Math.PI;

  return {
    amount: t,
    dolly: { z: zDolly, fov: BASE_FOV_DEG },
    zoom: { z: BASE_CAMERA_Z, fov: fovZoom },
  };
}
