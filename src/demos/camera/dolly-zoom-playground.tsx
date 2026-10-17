"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";
import {
  BASE_CAMERA_Z,
  BASE_FOV_DEG,
  framingForPush,
} from "./dolly-zoom-math";

const SceneLoading = () => (
  <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
    Loading WebGL…
  </div>
);

const DollyZoomScene = dynamic(
  () => import("./dolly-zoom-scene").then((m) => m.DollyZoomScene),
  { ssr: false, loading: SceneLoading },
);

const SNIPPET = `// Dolly — eye moves, FOV fixed
camera.position.z = {{dollyZ}};
camera.fov = {{dollyFov}};

// Zoom — eye fixed, FOV changes (subject size matched)
camera.position.z = {{zoomZ}};
camera.fov = {{zoomFov}};`;

export function DollyZoomPlayground() {
  const [amount, setAmount] = useState(0.55);
  const framing = useMemo(() => framingForPush(amount), [amount]);

  function handleReset() {
    setAmount(0.55);
  }

  const codeValue = formatSnippet(SNIPPET, {
    dollyZ: Number(framing.dolly.z.toFixed(2)),
    dollyFov: framing.dolly.fov,
    zoomZ: framing.zoom.z,
    zoomFov: Number(framing.zoom.fov.toFixed(2)),
  });

  return (
    <PlaygroundShell
      title="Dolly vs Zoom"
      description="Same subject size goal — left moves the eye (dolly), right changes FOV (zoom). Compare pillar parallax and background relationships."
      onReset={handleReset}
      stageLabel="Side-by-side dolly and zoom 3D stages"
      stageClassName="h-auto min-h-72"
      stage={
        <div className="grid h-72 grid-cols-1 sm:h-80 sm:grid-cols-2">
          <div className="relative border-b border-lab-line sm:border-r sm:border-b-0">
            <p className="pointer-events-none absolute top-2 left-3 z-10 font-mono text-[10px] tracking-wide text-lab-accent uppercase">
              Dolly · z={framing.dolly.z.toFixed(2)} · fov=
              {framing.dolly.fov}°
            </p>
            <DollyZoomScene
              cameraZ={framing.dolly.z}
              fov={framing.dolly.fov}
            />
          </div>
          <div className="relative">
            <p className="pointer-events-none absolute top-2 left-3 z-10 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
              Zoom · z={framing.zoom.z.toFixed(2)} · fov=
              {framing.zoom.fov.toFixed(1)}°
            </p>
            <DollyZoomScene
              cameraZ={framing.zoom.z}
              fov={framing.zoom.fov}
            />
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label="Push amount presets"
            className="flex flex-wrap items-center gap-2"
          >
            {[
              { label: "Match (0)", value: 0 },
              { label: "Mild", value: 0.35 },
              { label: "Strong", value: 0.7 },
              { label: "Max", value: 1 },
            ].map((preset) => (
              <LabButton
                key={preset.label}
                pressed={Math.abs(amount - preset.value) < 0.001}
                variant="outline"
                onClick={() => setAmount(preset.value)}
              >
                {preset.label}
              </LabButton>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <LabSlider
              className="min-w-[14rem] flex-1"
              label="Push-in amount"
              min={0}
              max={1}
              step={0.01}
              value={amount}
              onChange={setAmount}
            />
            <LabReadout
              label="baseline:"
              value={`z=${BASE_CAMERA_Z} · fov=${BASE_FOV_DEG}°`}
            />
          </div>
          <p className="text-xs text-lab-muted">
            Framing is matched with{" "}
            <code className="font-mono text-lab-fg">
              z × tan(fov/2) ≈ constant
            </code>
            . Differences you see are spatial (dolly) vs optical (zoom) — not a
            fake scale trick.
          </p>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
