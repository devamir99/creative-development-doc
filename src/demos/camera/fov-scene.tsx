"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { CameraDepthSet, CameraLabLights } from "./camera-depth-set";

type FovSceneProps = {
  fov: number;
};

function FovCamera({ fov }: { fov: number }) {
  const ref = useRef<ThreePerspectiveCamera>(null);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const cam = ref.current;
    if (!cam) return;
    cam.fov = fov;
    cam.updateProjectionMatrix();
    invalidate();
  }, [fov, invalidate]);

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={[0, 1.25, 6]}
      fov={fov}
      near={0.1}
      far={80}
    />
  );
}

export function FovScene({ fov }: FovSceneProps) {
  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop="demand"
      onCreated={({ gl }) => {
        gl.setClearColor("#09090b");
      }}
    >
      <FovCamera fov={fov} />
      <CameraLabLights />
      <CameraDepthSet />
    </Canvas>
  );
}
