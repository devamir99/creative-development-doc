"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabReadout } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const RaycastScene = dynamic(
  () => import("./raycast-scene").then((m) => m.RaycastScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL…
      </div>
    ),
  },
);

const SNIPPET = `// R3F: onPointerOver / onClick on meshes
mesh.onPointerOver = () => setHover(name);
mesh.onClick = () => setSelected(name);`;

export function RaycastPlayground() {
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const codeValue = formatSnippet(SNIPPET, {});

  return (
    <PlaygroundShell
      title="Raycasting / Pointer Picking"
      description="Hover and click the boxes — R3F wires pointer events through the raycaster for you."
      onReset={() => {
        setHover(null);
        setSelected(null);
      }}
      stageLabel="Raycast picking stage"
      stageClassName="h-72 sm:h-80"
      stage={
        <RaycastScene
          selected={selected}
          onHover={setHover}
          onSelect={setSelected}
        />
      }
      controls={
        <div className="flex flex-wrap gap-4">
          <LabReadout label="hover:" value={hover ?? "—"} />
          <LabReadout label="selected:" value={selected ?? "—"} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
