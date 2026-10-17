"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const DEFAULT_FOV = 40;

const FOV_PRESETS = [
  { label: "28° tele", value: 28 },
  { label: "40° normal", value: 40 },
  { label: "75° wide", value: 75 },
] as const;

const SNIPPET = `<PerspectiveCamera
  makeDefault
  position={[0, 1.25, 6]}
  fov={{fov}}
/>`;

const FovScene = dynamic(
  () => import("./fov-scene").then((m) => m.FovScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL stage…
      </div>
    ),
  },
);

export function FovPlayground() {
  const [fov, setFov] = useState(DEFAULT_FOV);

  function handleReset() {
    setFov(DEFAULT_FOV);
  }

  const codeValue = formatSnippet(SNIPPET, { fov });

  return (
    <PlaygroundShell
      title="FOV Playground"
      description="Camera position locked — only FOV changes. Watch perspective stretch vs compression on the depth set."
      onReset={handleReset}
      stageLabel="Field of view 3D stage"
      stageClassName="h-72 sm:h-80"
      stage={<FovScene fov={fov} />}
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label="FOV presets"
            className="flex flex-wrap items-center gap-2"
          >
            {FOV_PRESETS.map((preset) => (
              <LabButton
                key={preset.value}
                pressed={fov === preset.value}
                variant="outline"
                aria-label={`Set field of view to ${preset.label}`}
                onClick={() => setFov(preset.value)}
              >
                {preset.label}
              </LabButton>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <LabSlider
              className="min-w-[14rem] flex-1"
              label="Field of view"
              unit="°"
              min={20}
              max={90}
              step={1}
              value={fov}
              onChange={setFov}
            />
            <LabReadout label="fov:" value={`${fov}°`} />
          </div>
        </div>
      }
      code={{ language: "tsx", value: codeValue }}
    />
  );
}
