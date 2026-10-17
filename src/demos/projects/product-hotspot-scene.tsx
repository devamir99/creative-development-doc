"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState } from "react";
import type { Group, Mesh, PerspectiveCamera as ThreeCam } from "three";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Props = {
  selected: string | null;
  onSelect: (id: string) => void;
};

function LabCam() {
  const ref = useRef<ThreeCam>(null);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    const cam = ref.current;
    if (!cam) return;
    cam.lookAt(0, 0.3, 0);
    invalidate();
  }, [invalidate]);
  return (
    <PerspectiveCamera ref={ref} makeDefault position={[2.2, 1.4, 2.8]} fov={40} />
  );
}

function Marker({
  id,
  position,
  selected,
  onSelect,
}: {
  id: string;
  position: [number, number, number];
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const [hover, setHover] = useState(false);

  return (
    <mesh
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
        invalidate();
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
        invalidate();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
        invalidate();
      }}
    >
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={selected || hover ? "#fafa05" : "#a1a1aa"}
        emissive={selected ? "#fafa05" : "#000000"}
        emissiveIntensity={selected ? 0.35 : 0}
      />
    </mesh>
  );
}

function Product({ selected, onSelect }: Props) {
  const group = useRef<Group>(null);
  const body = useRef<Mesh>(null);
  const reducedMotion = usePrefersReducedMotion();

  useFrame((_, dt) => {
    if (reducedMotion || !group.current) return;
    group.current.rotation.y += dt * 0.35;
  });

  return (
    <group ref={group}>
      <mesh ref={body} position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.6, 0.7, 0.7]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.7, 0.2, 0.85]} />
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </mesh>
      <Marker
        id="sole"
        position={[0, -0.05, 0.55]}
        selected={selected === "sole"}
        onSelect={onSelect}
      />
      <Marker
        id="upper"
        position={[0.2, 0.55, 0.2]}
        selected={selected === "upper"}
        onSelect={onSelect}
      />
      <Marker
        id="laces"
        position={[-0.35, 0.6, 0.15]}
        selected={selected === "laces"}
        onSelect={onSelect}
      />
    </group>
  );
}

export function ProductHotspotScene(props: Props) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      frameloop="always"
      onCreated={({ gl }) => gl.setClearColor("#09090b")}
    >
      <LabCam />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <Product {...props} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <circleGeometry args={[2.5, 48]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
    </Canvas>
  );
}
