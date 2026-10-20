"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import type { Mesh } from "three";

export type EasingSceneProps = {
  ease: string;
  duration: number;
  replayKey: number;
  reducedMotion: boolean;
};

function Track({
  ease,
  duration,
  replayKey,
  reducedMotion,
}: EasingSceneProps) {
  const primary = useRef<Mesh>(null);
  const linear = useRef<Mesh>(null);
  const easeFn = useMemo(() => gsap.parseEase(ease), [ease]);

  useEffect(() => {
    if (!primary.current || !linear.current) return;
    primary.current.position.x = -2.2;
    linear.current.position.x = -2.2;
  }, [replayKey, ease, duration]);

  useFrame(({ clock }) => {
    if (!primary.current || !linear.current) return;
    if (reducedMotion) {
      primary.current.position.x = 2.2;
      linear.current.position.x = 2.2;
      return;
    }
    const t = Math.min(1, clock.elapsedTime / duration);
    // Restart when replayKey changes via remount of this component from parent key
    const p = easeFn(t) as number;
    primary.current.position.x = -2.2 + p * 4.4;
    linear.current.position.x = -2.2 + t * 4.4;
    primary.current.rotation.y = p * Math.PI * 0.5;
  });

  return (
    <>
      {/* Runway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 2.4]} />
        <meshStandardMaterial color="#18181b" roughness={1} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[6.2, 0.02, 0.04]} />
        <meshStandardMaterial color="#3f3f46" />
      </mesh>
      {/* Start / end markers */}
      {([-2.2, 2.2] as const).map((x) => (
        <mesh key={x} position={[x, 0.05, 0]}>
          <boxGeometry args={[0.06, 0.1, 1.2]} />
          <meshStandardMaterial color="#52525b" />
        </mesh>
      ))}
      {/* Linear reference (wire) */}
      <mesh ref={linear} position={[-2.2, 0.45, 0.35]}>
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshStandardMaterial
          color="#71717a"
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Eased hero */}
      <mesh ref={primary} position={[-2.2, 0.45, -0.35]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#fafa05" roughness={0.4} metalness={0.1} />
      </mesh>
      <ambientLight intensity={0.4} />
      <directionalLight castShadow position={[3, 6, 4]} intensity={1.2} />
    </>
  );
}

export function EasingScene(props: EasingSceneProps) {
  return (
    <Canvas
      key={props.replayKey}
      className="h-full w-full"
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 2.8, 5.2], fov: 38, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor("#09090b");
        camera.lookAt(0, 0.3, 0);
      }}
    >
      <Track {...props} />
    </Canvas>
  );
}
