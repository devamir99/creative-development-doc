"use client";

import gsap from "gsap";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";
import {
  approxFocusDistance,
  DEFAULT_DOF,
  DOF_SUBJECTS,
  focusZForPlane,
  nearestPlane,
  type DofFocusPlane,
  type DofParams,
} from "./dof-math";

const DofScene = dynamic(
  () => import("./dof-scene").then((m) => m.DofScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL stage…
      </div>
    ),
  },
);

const SNIPPET = `// Approx. DOF via postprocessing (not a physical lens)
// Focus plane at world Z = {{focusZ}}
const focusTarget = [0, 0.55, {{focusZ}}];

<DepthOfField
  target={focusTarget}
  focalLength={0.02}
  bokehScale={{bokehScale}}
  worldFocusRange={{focusRange}}
/>`;

export function DofPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [params, setParams] = useState<DofParams>({ ...DEFAULT_DOF });
  const [enabled, setEnabled] = useState(true);
  const [racking, setRacking] = useState(false);
  const focusProxy = useRef({ z: DEFAULT_DOF.focusZ });

  const distance = useMemo(
    () => approxFocusDistance(params.focusZ),
    [params.focusZ],
  );
  const activePlane = nearestPlane(params.focusZ);

  const stopRack = useCallback(() => {
    gsap.killTweensOf(focusProxy.current);
    setRacking(false);
  }, []);

  useEffect(() => () => {
    gsap.killTweensOf(focusProxy.current);
  }, []);

  const patch = useCallback(
    (partial: Partial<DofParams>) => {
      stopRack();
      setParams((p) => ({ ...p, ...partial }));
    },
    [stopRack],
  );

  const jumpPlane = useCallback(
    (plane: DofFocusPlane) => {
      stopRack();
      const z = focusZForPlane(plane);
      focusProxy.current.z = z;
      setParams((p) => ({ ...p, focusZ: z }));
    },
    [stopRack],
  );

  const startRack = useCallback(() => {
    if (reducedMotion) {
      jumpPlane(activePlane === "far" ? "near" : "far");
      return;
    }
    stopRack();
    setRacking(true);
    focusProxy.current.z = params.focusZ;
    const toFar = activePlane !== "far";
    const endZ = focusZForPlane(toFar ? "far" : "near");
    gsap.to(focusProxy.current, {
      z: endZ,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        setParams((p) => ({ ...p, focusZ: focusProxy.current.z }));
      },
      onComplete: () => setRacking(false),
    });
  }, [reducedMotion, jumpPlane, activePlane, stopRack, params.focusZ]);

  function handleReset() {
    stopRack();
    focusProxy.current.z = DEFAULT_DOF.focusZ;
    setEnabled(true);
    setParams({ ...DEFAULT_DOF });
  }

  const codeValue = formatSnippet(SNIPPET, {
    focusZ: Number(params.focusZ.toFixed(2)),
    bokehScale: Number(params.bokehScale.toFixed(1)),
    focusRange: Number(params.focusRange.toFixed(2)),
  });

  const description = reducedMotion
    ? "Reduced motion: rack animation jumps. DOF here is a post-process approximation — teach focus distance, not physical lens math."
    : "Rack focus moves the sharp plane between Near → Far. This is a post-process approximation, not a real thin-lens simulation.";

  return (
    <PlaygroundShell
      title="Depth of Field / Rack Focus"
      description={description}
      onReset={handleReset}
      onReplay={reducedMotion ? undefined : startRack}
      stageLabel="Depth of field 3D stage"
      stageClassName="h-72 sm:h-80"
      stage={<DofScene params={params} enabled={enabled} />}
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label="Focus plane presets"
            className="flex flex-wrap items-center gap-2"
          >
            {(Object.keys(DOF_SUBJECTS) as DofFocusPlane[]).map((plane) => (
              <LabButton
                key={plane}
                pressed={!racking && activePlane === plane}
                variant="outline"
                onClick={() => jumpPlane(plane)}
                disabled={racking}
              >
                {DOF_SUBJECTS[plane].label}
              </LabButton>
            ))}
            <LabButton
              pressed={racking}
              variant={racking ? "solid" : "outline"}
              onClick={startRack}
              disabled={racking}
            >
              {reducedMotion ? "Jump focus" : "Rack focus"}
            </LabButton>
            <LabButton
              pressed={!enabled}
              variant="outline"
              onClick={() => {
                stopRack();
                setEnabled((v) => !v);
              }}
            >
              {enabled ? "DOF on" : "DOF off"}
            </LabButton>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <LabSlider
              label="Focus Z"
              min={-9}
              max={0.5}
              step={0.05}
              value={Number(params.focusZ.toFixed(2))}
              onChange={(focusZ) => patch({ focusZ })}
              disabled={racking}
            />
            <LabSlider
              label="Bokeh"
              min={0}
              max={10}
              step={0.1}
              value={params.bokehScale}
              onChange={(bokehScale) => patch({ bokehScale })}
              disabled={!enabled}
            />
            <LabSlider
              label="Focus range"
              min={0.2}
              max={4}
              step={0.05}
              value={params.focusRange}
              onChange={(focusRange) => patch({ focusRange })}
              disabled={!enabled}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <LabReadout label="plane:" value={DOF_SUBJECTS[activePlane].label} />
            <LabReadout label="≈ distance:" value={`${distance.toFixed(2)} u`} />
            <LabReadout
              label="effect:"
              value={enabled ? "postprocess DOF" : "off (sharp)"}
            />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
