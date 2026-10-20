"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { CameraDepthSet, CameraLabLights } from "./camera-depth-set";

export type DollyZoomSceneProps = {
  cameraZ: number;
  fov: number;
};

function LabCamera({ cameraZ, fov }: DollyZoomSceneProps) {
  const ref = useRef<ThreePerspectiveCamera>(null);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const cam = ref.current;
    if (!cam) return;
    cam.position.set(0, 1.25, cameraZ);
    cam.fov = fov;
    cam.lookAt(0, 1.1, 0);
    cam.updateProjectionMatrix();
    invalidate();
  }, [cameraZ, fov, invalidate]);

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={[0, 1.25, cameraZ]}
      fov={fov}
      near={0.1}
      far={80}
    />
  );
}

export function DollyZoomScene({ cameraZ, fov }: DollyZoomSceneProps) {
  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop="demand"
      onCreated={({ gl }) => {
        gl.setClearColor("#09090b");
      }}
    >
      <LabCamera cameraZ={cameraZ} fov={fov} />
      <CameraLabLights />
      <CameraDepthSet />
    </Canvas>
  );
}
