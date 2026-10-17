"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { CameraDepthSet, CameraLabLights } from "./camera-depth-set";
import { orbitPose, type OrbitParams } from "./orbit-math";

export type OrbitSceneProps = {
  params: OrbitParams;
  autoRotate: boolean;
  /** Called when auto-rotate stops so the parent slider can catch up. */
  onAutoAzimuthCommit?: (azimuthDeg: number) => void;
};

function applyPose(
  cam: ThreePerspectiveCamera,
  params: OrbitParams,
  azimuthDeg: number,
) {
  const pose = orbitPose({ ...params, azimuthDeg });
  cam.position.set(...pose.position);
  cam.fov = pose.fov;
  cam.lookAt(...pose.lookAt);
  cam.updateProjectionMatrix();
}

function OrbitCamera({
  params,
  autoRotate,
  onAutoAzimuthCommit,
}: OrbitSceneProps) {
  const ref = useRef<ThreePerspectiveCamera>(null);
  const invalidate = useThree((s) => s.invalidate);
  const azimuthRef = useRef(params.azimuthDeg);
  const wasAuto = useRef(autoRotate);

  useLayoutEffect(() => {
    if (!autoRotate) {
      azimuthRef.current = params.azimuthDeg;
    }
  }, [params.azimuthDeg, autoRotate]);

  useLayoutEffect(() => {
    const cam = ref.current;
    if (!cam || autoRotate) return;
    applyPose(cam, params, azimuthRef.current);
    invalidate();
  }, [params, autoRotate, invalidate]);

  useEffect(() => {
    if (wasAuto.current && !autoRotate) {
      onAutoAzimuthCommit?.(azimuthRef.current);
    }
    wasAuto.current = autoRotate;
  }, [autoRotate, onAutoAzimuthCommit]);

  useFrame((_, delta) => {
    if (!autoRotate) return;
    const cam = ref.current;
    if (!cam) return;
    azimuthRef.current = (azimuthRef.current + delta * 28) % 360;
    applyPose(cam, params, azimuthRef.current);
  });

  const pose = orbitPose(params);

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={pose.position}
      fov={pose.fov}
      near={0.1}
      far={80}
    />
  );
}

export function OrbitScene(props: OrbitSceneProps) {
  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop={props.autoRotate ? "always" : "demand"}
      onCreated={({ gl }) => {
        gl.setClearColor("#09090b");
      }}
    >
      <OrbitCamera {...props} />
      <CameraLabLights />
      <CameraDepthSet />
    </Canvas>
  );
}
