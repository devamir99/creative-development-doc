"use client";

import { Grid, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import type { PerspectiveCamera as ThreePerspectiveCamera } from "three";

type FovSceneProps = {
  fov: number;
};

function DepthSubject() {
  return (
    <group>
      {/* Near subject — accent */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshStandardMaterial color="#fafa05" roughness={0.45} metalness={0.1} />
      </mesh>
      {/* Mid pillars for perspective compression cue */}
      {([-2.2, 2.2] as const).map((x) => (
        <mesh key={x} position={[x, 0.9, -3]} castShadow>
          <boxGeometry args={[0.55, 1.8, 0.55]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.85} />
        </mesh>
      ))}
      {/* Far wall blocks */}
      {([-3, 0, 3] as const).map((x) => (
        <mesh key={`far-${x}`} position={[x, 1.2, -7]}>
          <boxGeometry args={[1.4, 2.4, 0.4]} />
          <meshStandardMaterial color="#27272a" roughness={0.9} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#18181b" roughness={1} />
      </mesh>
      <Grid
        position={[0, 0.01, -2]}
        args={[16, 16]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#3f3f46"
        sectionSize={2}
        sectionThickness={1.1}
        sectionColor="#52525b"
        fadeDistance={18}
        fadeStrength={1.2}
        infiniteGrid={false}
      />
    </group>
  );
}

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

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[4, 8, 5]}
        intensity={1.25}
        shadow-mapSize={[1024, 1024]}
      />
    </>
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
      <Lights />
      <DepthSubject />
    </Canvas>
  );
}
