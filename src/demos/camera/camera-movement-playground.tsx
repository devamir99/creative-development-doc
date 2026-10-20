"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";
import type { CameraMoveMode } from "./camera-movement-scene";

const CameraMovementScene = dynamic(
  () =>
    import("./camera-movement-scene").then((m) => m.CameraMovementScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL stage…
      </div>
    ),
  },
);

const MODES: {
  id: CameraMoveMode;
  label: string;
  watch: string;
  snippet: string;
}[] = [
  {
    id: "pan",
    label: "Pan",
    watch: "Eye stays put — world sweeps left/right (rotation only).",
    snippet: `// Pan = yaw the eye, do not translate
camera.position.set(0, 1.35, 6.2);
camera.lookAt(Math.sin(yaw) * 4, 1.1, -Math.cos(yaw) * 2);`,
  },
  {
    id: "tilt",
    label: "Tilt",
    watch: "Eye stays put — world sweeps up/down.",
    snippet: `// Tilt = change lookAt.y (or pitch), position fixed
camera.position.set(0, 1.35, 6.2);
camera.lookAt(0, lookY, 0);`,
  },
  {
    id: "dolly",
    label: "Dolly",
    watch: "Eye moves toward subject — mid pillars shift vs hero (parallax).",
    snippet: `// Dolly = translate along Z through space
camera.position.z = MathUtils.lerp(7.5, 3.5, t);
camera.lookAt(0, 1.1, 0);`,
  },
  {
    id: "truck",
    label: "Truck",
    watch: "Eye slides sideways — background slides against the subject.",
    snippet: `// Truck = translate on X, look-at locked on subject
camera.position.x = MathUtils.lerp(-2.5, 2.5, t);
camera.lookAt(0, 1.1, 0);`,
  },
  {
    id: "pedestal",
    label: "Pedestal",
    watch: "Eye rises/falls — height change without relying on tilt alone.",
    snippet: `// Pedestal = translate on Y
camera.position.y = MathUtils.lerp(0.5, 2.7, t);
camera.lookAt(0, lookY, 0);`,
  },
  {
    id: "orbit",
    label: "Orbit",
    watch: "Eye arcs around subject — far slabs rotate behind the hero.",
    snippet: `// Orbit = spherical move + fixed lookAt
camera.position.set(Math.sin(az) * r, 1.55, Math.cos(az) * r);
camera.lookAt(0, 1.1, 0);`,
  },
  {
    id: "zoom",
    label: "Zoom",
    watch: "FOV only — subject grows, but little relative parallax vs dolly.",
    snippet: `// Zoom = FOV change, eye stays
camera.position.set(0, 1.35, 6.2);
camera.fov = MathUtils.lerp(58, 26, t);
camera.updateProjectionMatrix();`,
  },
  {
    id: "handheld",
    label: "Handheld",
    watch: "Small irregular noise on position + look — human presence.",
    snippet: `// Handheld = tiny noise on position & lookAt
camera.position.add(shake);
camera.lookAt(target.clone().add(lookShake));`,
  },
];

export function CameraMovementPlayground() {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<CameraMoveMode>("dolly");
  const [playing, setPlaying] = useState(true);
  const active = MODES.find((m) => m.id === mode)!;

  return (
    <PlaygroundShell
      title="Camera Movement"
      description="Real WebGL stage. Yellow figure = subject. Gray pillars mid · dark slabs far. Switch moves and watch whether the eye rotates or travels through space."
      onReset={() => {
        setMode("dolly");
        setPlaying(true);
      }}
      onReplay={
        reduced
          ? undefined
          : () => {
              setPlaying(false);
              requestAnimationFrame(() => setPlaying(true));
            }
      }
      stageLabel="Camera movement WebGL stage"
      stageClassName="h-[22rem] sm:h-[26rem]"
      stage={
        <div className="relative h-full w-full">
          <CameraMovementScene
            mode={mode}
            playing={playing && !reduced}
            reducedMotion={reduced}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-3">
            <p className="font-mono text-[11px] leading-snug text-zinc-200">
              <span className="text-lab-accent">{active.label}</span>
              {" — "}
              {active.watch}
            </p>
          </div>
          {reduced ? (
            <p className="absolute top-2 left-3 font-mono text-[10px] text-lab-muted">
              Reduced motion · static teaching pose
            </p>
          ) : null}
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <LabButton
                key={m.id}
                variant="outline"
                pressed={mode === m.id}
                onClick={() => {
                  setMode(m.id);
                  setPlaying(true);
                }}
              >
                {m.label}
              </LabButton>
            ))}
          </div>
          {!reduced ? (
            <LabButton
              variant="outline"
              pressed={playing}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause move" : "Play move"}
            </LabButton>
          ) : null}
          <LabReadout label="watch for:" value={active.watch} />
        </div>
      }
      code={{
        language: "js",
        value: formatSnippet(active.snippet, {}),
      }}
    />
  );
}
