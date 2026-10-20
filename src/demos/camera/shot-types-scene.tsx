"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import {
  MathUtils,
  type PerspectiveCamera as ThreePerspectiveCamera,
} from "three";
import { CameraDepthSet, CameraLabLights } from "./camera-depth-set";

export type ShotAngle = "low" | "eye" | "high";

export type ShotTypesSceneProps = {
  /** 0 = wide / establishing, 1 = extreme close */
  framing: number;
  angle: ShotAngle;
};

function framingToDistance(framing: number) {
  // Wide → close: farther → nearer
  return MathUtils.lerp(11.5, 2.35, framing);
}

function anglePose(angle: ShotAngle, distance: number) {
  switch (angle) {
    case "low":
      return {
        position: [0, 0.35, distance] as [number, number, number],
        lookAt: [0, 1.55, 0] as [number, number, number],
      };
    case "high":
      return {
        position: [0, 3.4, distance * 0.92] as [number, number, number],
        lookAt: [0, 0.85, 0] as [number, number, number],
      };
    default:
      return {
        position: [0, 1.4, distance] as [number, number, number],
        lookAt: [0, 1.15, 0] as [number, number, number],
      };
  }
}

function ShotCamera({ framing, angle }: ShotTypesSceneProps) {
  const ref = useRef<ThreePerspectiveCamera>(null);
  const invalidate = useThree((s) => s.invalidate);
  const distance = framingToDistance(framing);
  const pose = anglePose(angle, distance);

  useLayoutEffect(() => {
    const cam = ref.current;
    if (!cam) return;
    cam.position.set(...pose.position);
    cam.lookAt(...pose.lookAt);
    cam.fov = 40;
    cam.updateProjectionMatrix();
    invalidate();
  }, [pose, invalidate]);

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={pose.position}
      fov={40}
      near={0.1}
      far={90}
    />
  );
}

export function ShotTypesScene(props: ShotTypesSceneProps) {
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
      <ShotCamera {...props} />
      <CameraLabLights />
      <CameraDepthSet />
    </Canvas>
  );
}
