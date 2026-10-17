"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";
import { DEFAULT_ORBIT, orbitPose, type OrbitParams } from "./orbit-math";

const OrbitScene = dynamic(
  () => import("./orbit-scene").then((m) => m.OrbitScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL stage…
      </div>
    ),
  },
);

const ANGLE_PRESETS = [
  { label: "Front", azimuthDeg: 0, elevationDeg: 12 },
  { label: "¾ L", azimuthDeg: -40, elevationDeg: 18 },
  { label: "¾ R", azimuthDeg: 40, elevationDeg: 18 },
  { label: "High", azimuthDeg: 25, elevationDeg: 55 },
] as const;

const SNIPPET = `// Spherical orbit around the subject
const phi = ((90 - {{elevationDeg}}) * Math.PI) / 180;
const theta = ({{azimuthDeg}} * Math.PI) / 180;
camera.position.set(
  {{x}},
  {{y}},
  {{z}},
);
camera.lookAt(0, 0.55, 0);
camera.fov = {{fov}};`;

export function OrbitPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [params, setParams] = useState<OrbitParams>({ ...DEFAULT_ORBIT });
  const [autoRotate, setAutoRotate] = useState(false);

  const pose = useMemo(() => orbitPose(params), [params]);
  const rotating = autoRotate && !reducedMotion;

  const handleAutoAzimuthCommit = useCallback((azimuthDeg: number) => {
    setParams((p) => ({ ...p, azimuthDeg: Number(azimuthDeg.toFixed(1)) }));
  }, []);

  function handleReset() {
    setAutoRotate(false);
    setParams({ ...DEFAULT_ORBIT });
  }

  function patch(partial: Partial<OrbitParams>) {
    setAutoRotate(false);
    setParams((p) => ({ ...p, ...partial }));
  }

  const codeValue = formatSnippet(SNIPPET, {
    elevationDeg: Number(params.elevationDeg.toFixed(1)),
    azimuthDeg: Number(params.azimuthDeg.toFixed(1)),
    x: Number(pose.position[0].toFixed(2)),
    y: Number(pose.position[1].toFixed(2)),
    z: Number(pose.position[2].toFixed(2)),
    fov: params.fov,
  });

  const description = reducedMotion
    ? "Reduced motion: auto-orbit disabled. Drag azimuth / elevation / radius — eye moves on a sphere, look-at stays on the subject."
    : "Orbit = eye travels on a sphere around a fixed look-at. FOV stays put so you only study spatial move.";

  return (
    <PlaygroundShell
      title="Orbit Playground"
      description={description}
      onReset={handleReset}
      stageLabel="Orbit camera 3D stage"
      stageClassName="h-72 sm:h-80"
      stage={
        <OrbitScene
          params={params}
          autoRotate={rotating}
          onAutoAzimuthCommit={handleAutoAzimuthCommit}
        />
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label="Orbit angle presets"
            className="flex flex-wrap items-center gap-2"
          >
            {ANGLE_PRESETS.map((preset) => (
              <LabButton
                key={preset.label}
                pressed={
                  !rotating &&
                  Math.abs(params.azimuthDeg - preset.azimuthDeg) < 0.5 &&
                  Math.abs(params.elevationDeg - preset.elevationDeg) < 0.5
                }
                variant="outline"
                onClick={() =>
                  patch({
                    azimuthDeg: preset.azimuthDeg,
                    elevationDeg: preset.elevationDeg,
                  })
                }
              >
                {preset.label}
              </LabButton>
            ))}
            {!reducedMotion ? (
              <LabButton
                pressed={rotating}
                variant={rotating ? "solid" : "outline"}
                onClick={() => setAutoRotate((v) => !v)}
              >
                {rotating ? "Auto on" : "Auto orbit"}
              </LabButton>
            ) : null}
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <LabSlider
              label="Azimuth"
              unit="°"
              min={-180}
              max={180}
              step={1}
              value={Number(params.azimuthDeg.toFixed(0))}
              onChange={(azimuthDeg) => patch({ azimuthDeg })}
              disabled={rotating}
            />
            <LabSlider
              label="Elevation"
              unit="°"
              min={-5}
              max={80}
              step={1}
              value={params.elevationDeg}
              onChange={(elevationDeg) => patch({ elevationDeg })}
            />
            <LabSlider
              label="Radius"
              min={3}
              max={10}
              step={0.1}
              value={params.radius}
              onChange={(radius) => patch({ radius })}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <LabReadout
              label="pos:"
              value={pose.position.map((n) => n.toFixed(2)).join(", ")}
            />
            <LabReadout label="fov:" value={`${params.fov}° (fixed)`} />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
