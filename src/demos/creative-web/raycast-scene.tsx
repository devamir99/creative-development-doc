"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useState } from "react";

type Props = {
  selected: string | null;
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
};

function Box({
  name,
  position,
  selected,
  onHover,
  onSelect,
}: {
  name: string;
  position: [number, number, number];
  selected: boolean;
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}) {
  const [localHover, setLocalHover] = useState(false);
  const invalidate = useThree((s) => s.invalidate);
  const active = selected || localHover;

  return (
    <mesh
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setLocalHover(true);
        onHover(name);
        document.body.style.cursor = "pointer";
        invalidate();
      }}
      onPointerOut={() => {
        setLocalHover(false);
        onHover(null);
        document.body.style.cursor = "auto";
        invalidate();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(name);
        invalidate();
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={active ? "#fafa05" : "#52525b"}
        roughness={0.5}
      />
    </mesh>
  );
}

export function RaycastScene({ selected, onHover, onSelect }: Props) {
  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false }}
      frameloop="demand"
      onCreated={({ gl }) => gl.setClearColor("#09090b")}
      onPointerMissed={() => onHover(null)}
    >
      <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={42} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} />
      <Box
        name="Left"
        position={[-1.4, 0.5, 0]}
        selected={selected === "Left"}
        onHover={onHover}
        onSelect={onSelect}
      />
      <Box
        name="Center"
        position={[0, 0.5, 0]}
        selected={selected === "Center"}
        onHover={onHover}
        onSelect={onSelect}
      />
      <Box
        name="Right"
        position={[1.4, 0.5, 0]}
        selected={selected === "Right"}
        onHover={onHover}
        onSelect={onSelect}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerOver={() => onHover(null)}
      >
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>
    </Canvas>
  );
}
