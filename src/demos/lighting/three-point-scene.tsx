"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";
import type { ThreePointParams } from "./three-point-math";

function LabCamera() {
  const ref = useRef<ThreePerspectiveCamera>(null);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    const cam = ref.current;
    if (!cam) return;
    cam.lookAt(0, 0.6, 0);
    cam.updateProjectionMatrix();
    invalidate();
  }, [invalidate]);
  return (
    <PerspectiveCamera ref={ref} makeDefault position={[0, 1.4, 4.2]} fov={40} />
  );
}

function tempColor(t: number): string {
  // 0 cool blue-ish, 1 warm amber — simple lerp for teaching
  const r = Math.round(180 + t * 75);
  const g = Math.round(200 - t * 40);
  const b = Math.round(255 - t * 180);
  return `rgb(${r},${g},${b})`;
}

function Subject() {
  return (
    <group>
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#d4d4d8" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#18181b" roughness={1} />
      </mesh>
      <mesh position={[0, 1.2, -2.2]}>
        <boxGeometry args={[4, 2.5, 0.2]} />
        <meshStandardMaterial color="#09090b" roughness={1} />
      </mesh>
    </group>
  );
}

function Invalidate({ params }: { params: ThreePointParams }) {
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    invalidate();
  }, [params, invalidate]);
  return null;
}

export function ThreePointScene({ params }: { params: ThreePointParams }) {
  const keyColor = useMemo(() => tempColor(params.keyTemp), [params.keyTemp]);

  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop="demand"
      onCreated={({ gl }) => gl.setClearColor("#050505")}
    >
      <LabCamera />
      <Invalidate params={params} />
      <ambientLight intensity={0.08} />
      <directionalLight
        castShadow
        position={[3.2, 3.5, 2]}
        intensity={params.keyIntensity}
        color={keyColor}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-3, 2, 1]}
        intensity={params.fillIntensity}
        color="#c4d4ff"
      />
      <directionalLight
        position={[-1.5, 2.5, -3]}
        intensity={params.rimIntensity}
        color="#ffffff"
      />
      <Subject />
    </Canvas>
  );
}
