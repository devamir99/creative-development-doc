"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import {
  MathUtils,
  type PerspectiveCamera as ThreePerspectiveCamera,
  Vector3,
} from "three";
import { CameraDepthSet, CameraLabLights } from "./camera-depth-set";

export type CameraMoveMode =
  | "pan"
  | "tilt"
  | "dolly"
  | "truck"
  | "pedestal"
  | "orbit"
  | "zoom"
  | "handheld";

export type CameraMovementSceneProps = {
  mode: CameraMoveMode;
  playing: boolean;
  reducedMotion: boolean;
};

const LOOK = new Vector3(0, 1.1, 0);
const BASE = { x: 0, y: 1.35, z: 6.2, fov: 42 };

function applyPose(
  cam: ThreePerspectiveCamera,
  mode: CameraMoveMode,
  u: number,
) {
  const { x, y, z } = BASE;
  let fov = BASE.fov;
  const look = LOOK.clone();

  switch (mode) {
    case "pan": {
      const yaw = MathUtils.degToRad(MathUtils.lerp(-22, 22, u));
      cam.position.set(x, y, z);
      look.x = Math.sin(yaw) * 4;
      look.z = -Math.cos(yaw) * 2;
      break;
    }
    case "tilt": {
      cam.position.set(x, y, z);
      look.y = MathUtils.lerp(0.25, 2.15, u);
      break;
    }
    case "dolly": {
      cam.position.set(x, y, MathUtils.lerp(7.5, 3.5, u));
      break;
    }
    case "truck": {
      cam.position.set(MathUtils.lerp(-2.5, 2.5, u), y, z);
      break;
    }
    case "pedestal": {
      cam.position.set(x, MathUtils.lerp(0.5, 2.7, u), z);
      look.y = MathUtils.lerp(0.65, 1.45, u);
      break;
    }
    case "orbit": {
      const az = MathUtils.degToRad(MathUtils.lerp(-55, 55, u));
      const r = 6.2;
      cam.position.set(Math.sin(az) * r, y + 0.2, Math.cos(az) * r);
      break;
    }
    case "zoom": {
      cam.position.set(x, y, z);
      fov = MathUtils.lerp(58, 26, u);
      break;
    }
    case "handheld": {
      const shake = 0.05 + u * 0.1;
      const t = u * Math.PI * 2;
      cam.position.set(
        x + Math.sin(t * 6.1) * shake,
        y + Math.cos(t * 5.3) * shake * 0.65,
        z + Math.sin(t * 4.2) * shake * 0.35,
      );
      look.x += Math.sin(t * 3.4) * shake * 0.4;
      look.y += Math.cos(t * 2.8) * shake * 0.25;
      break;
    }
  }

  cam.fov = fov;
  cam.lookAt(look);
  cam.updateProjectionMatrix();
}

function MovementCamera({
  mode,
  playing,
  reducedMotion,
}: CameraMovementSceneProps) {
  const ref = useRef<ThreePerspectiveCamera>(null);
  const invalidate = useThree((s) => s.invalidate);
  const tRef = useRef(0);

  useLayoutEffect(() => {
    // Reset only when the mode (or reduced-motion pose) changes — not on
    // play/pause toggles, so pausing keeps the current pose and resuming
    // continues from it instead of jumping back to t = 0.
    tRef.current = 0;
    const cam = ref.current;
    if (!cam) return;
    applyPose(cam, mode, reducedMotion ? 0.65 : 0);
    invalidate();
  }, [mode, reducedMotion, invalidate]);

  useFrame((_, delta) => {
    const cam = ref.current;
    if (!cam) return;
    if (!playing || reducedMotion) return;
    tRef.current += delta;
    // Starts at 0 (matching the layout pose) and loops smoothly:
    // (1 - cos) / 2 is 0 at t = 0 with zero slope at both turnarounds.
    const cycle = (1 - Math.cos(tRef.current * 1.15)) / 2;
    applyPose(cam, mode, cycle);
  });

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={[BASE.x, BASE.y, BASE.z]}
      fov={BASE.fov}
      near={0.1}
      far={80}
    />
  );
}

export function CameraMovementScene(props: CameraMovementSceneProps) {
  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop={props.playing && !props.reducedMotion ? "always" : "demand"}
      onCreated={({ gl }) => {
        gl.setClearColor("#09090b");
      }}
    >
      <MovementCamera {...props} />
      <CameraLabLights />
      <CameraDepthSet />
    </Canvas>
  );
}
