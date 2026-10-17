"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { useLayoutEffect, useRef } from "react";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import { CameraLabLights } from "./camera-depth-set";
import { DOF_CAMERA, DOF_SUBJECTS, type DofParams } from "./dof-math";

export type DofSceneProps = {
  params: DofParams;
  /** When false, skip the DOF pass (sharp frame for comparison / reduced motion). */
  enabled: boolean;
};

function LabCamera() {
  const ref = useRef<ThreePerspectiveCamera>(null);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const cam = ref.current;
    if (!cam) return;
    cam.lookAt(...DOF_CAMERA.lookAt);
    cam.updateProjectionMatrix();
    invalidate();
  }, [invalidate]);

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={DOF_CAMERA.position}
      fov={DOF_CAMERA.fov}
      near={0.1}
      far={80}
    />
  );
}

function DofSubjects() {
  return (
    <group>
      <mesh position={DOF_SUBJECTS.near.position} castShadow>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshStandardMaterial color="#fafa05" roughness={0.4} metalness={0.08} />
      </mesh>
      <mesh position={DOF_SUBJECTS.mid.position} castShadow>
        <boxGeometry args={[0.9, 1.4, 0.9]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.7} />
      </mesh>
      <mesh position={DOF_SUBJECTS.far.position} castShadow>
        <boxGeometry args={[1.6, 2.2, 0.5]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#18181b" roughness={1} />
      </mesh>
    </group>
  );
}

function FocusPlaneMarker({ focusZ }: { focusZ: number }) {
  return (
    <mesh position={[0, 0.55, focusZ]}>
      <planeGeometry args={[3.2, 2.4]} />
      <meshBasicMaterial
        color="#fafa05"
        transparent
        opacity={0.12}
        depthWrite={false}
      />
    </mesh>
  );
}

function InvalidateOnParams({ params, enabled }: DofSceneProps) {
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    invalidate();
  }, [params, enabled, invalidate]);
  return null;
}

export function DofScene({ params, enabled }: DofSceneProps) {
  const focusTarget: [number, number, number] = [0, 0.55, params.focusZ];

  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop="always"
      onCreated={({ gl }) => {
        gl.setClearColor("#09090b");
      }}
    >
      <LabCamera />
      <CameraLabLights />
      <DofSubjects />
      <FocusPlaneMarker focusZ={params.focusZ} />
      <InvalidateOnParams params={params} enabled={enabled} />
      {enabled ? (
        <EffectComposer multisampling={0}>
          <DepthOfField
            target={focusTarget}
            focalLength={0.02}
            bokehScale={params.bokehScale}
            worldFocusRange={params.focusRange}
            height={360}
          />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
