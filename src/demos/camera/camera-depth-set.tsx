"use client";

import { Grid } from "@react-three/drei";

/** Shared depth set for camera labs — near subject + mid/far cues for parallax. */
export function CameraDepthSet() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshStandardMaterial color="#fafa05" roughness={0.45} metalness={0.1} />
      </mesh>
      {([-2.2, 2.2] as const).map((x) => (
        <mesh key={x} position={[x, 0.9, -3]} castShadow>
          <boxGeometry args={[0.55, 1.8, 0.55]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.85} />
        </mesh>
      ))}
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

export function CameraLabLights() {
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
