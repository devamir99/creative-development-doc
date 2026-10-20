"use client";

import { Grid } from "@react-three/drei";

/**
 * Shared cinematic mini-set for camera labs.
 * Yellow hero = subject. Mid pillars + far slabs = parallax / depth cues.
 */
export function CameraDepthSet() {
  return (
    <group>
      {/* Hero subject — readable silhouette at any framing */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.95, 0]} castShadow>
          <capsuleGeometry args={[0.38, 0.85, 6, 12]} />
          <meshStandardMaterial
            color="#fafa05"
            roughness={0.4}
            metalness={0.12}
          />
        </mesh>
        <mesh position={[0, 1.85, 0]} castShadow>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial
            color="#fafa05"
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[0.55, 0.7, 0.16, 24]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.9} />
        </mesh>
      </group>

      {/* Mid-ground pillars — watch these for parallax */}
      {([-2.4, 2.4] as const).map((x, i) => (
        <mesh key={`mid-${x}`} position={[x, 1.05, -3.2]} castShadow>
          <boxGeometry args={[0.5, 2.1, 0.5]} />
          <meshStandardMaterial
            color={i === 0 ? "#52525b" : "#3f3f46"}
            roughness={0.85}
          />
        </mesh>
      ))}
      <mesh position={[-1.1, 0.45, -2.4]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.7]} />
        <meshStandardMaterial color="#27272a" roughness={0.9} />
      </mesh>
      <mesh position={[1.3, 0.35, -2.6]} castShadow>
        <boxGeometry args={[0.55, 0.7, 0.55]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.88} />
      </mesh>

      {/* Far skyline slabs */}
      {([-4.2, -1.4, 1.4, 4.2] as const).map((x, i) => (
        <mesh key={`far-${x}`} position={[x, 1.4 + (i % 2) * 0.4, -8]}>
          <boxGeometry args={[1.5, 2.6 + (i % 3) * 0.5, 0.35]} />
          <meshStandardMaterial color="#1c1c1f" roughness={0.95} />
        </mesh>
      ))}

      {/* Soft backdrop plane */}
      <mesh position={[0, 3.5, -10]}>
        <planeGeometry args={[28, 12]} />
        <meshStandardMaterial color="#0c0c0e" roughness={1} />
      </mesh>

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -2]}
        receiveShadow
      >
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#141416" roughness={1} />
      </mesh>
      <Grid
        position={[0, 0.015, -2]}
        args={[24, 24]}
        cellSize={0.5}
        cellThickness={0.55}
        cellColor="#3f3f46"
        sectionSize={2}
        sectionThickness={1.05}
        sectionColor="#52525b"
        fadeDistance={20}
        fadeStrength={1.35}
        infiniteGrid={false}
      />
    </group>
  );
}

export function CameraLabLights() {
  return (
    <>
      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#d4d4d8", "#18181b", 0.35]} />
      <directionalLight
        castShadow
        position={[5, 9, 4]}
        intensity={1.35}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={28}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      {/* Cool rim — separates yellow subject from dark set */}
      <directionalLight position={[-4, 3, -2]} intensity={0.45} color="#a5b4fc" />
    </>
  );
}
