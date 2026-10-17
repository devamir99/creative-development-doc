"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { CameraDepthSet, CameraLabLights } from "./camera-depth-set";

export type FundamentalsPose = {
  /** Camera distance along Z from subject (~shot size). */
  distance: number;
  /** Camera height (low / eye / high angle). */
  height: number;
  fov: number;
};

function PoseCamera({ distance, height, fov }: FundamentalsPose) {
  const ref = useRef<ThreePerspectiveCamera>(null);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const cam = ref.current;
    if (!cam) return;
    cam.position.set(0, height, distance);
    cam.fov = fov;
    cam.lookAt(0, 0.55, 0);
    cam.updateProjectionMatrix();
    invalidate();
  }, [distance, height, fov, invalidate]);

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={[0, height, distance]}
      fov={fov}
      near={0.1}
      far={80}
    />
  );
}

export function FundamentalsScene(props: FundamentalsPose) {
  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop="demand"
      onCreated={({ gl }) => gl.setClearColor("#09090b")}
    >
      <PoseCamera {...props} />
      <CameraLabLights />
      <CameraDepthSet />
    </Canvas>
  );
}
