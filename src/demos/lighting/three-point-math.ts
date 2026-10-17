export type ThreePointParams = {
  keyIntensity: number;
  fillIntensity: number;
  rimIntensity: number;
  keyTemp: number;
};

export const DEFAULT_THREE_POINT: ThreePointParams = {
  keyIntensity: 1.4,
  fillIntensity: 0.35,
  rimIntensity: 0.9,
  keyTemp: 0.65,
};
