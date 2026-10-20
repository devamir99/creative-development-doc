"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const FundamentalsScene = dynamic(
  () => import("./fundamentals-scene").then((m) => m.FundamentalsScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL stage…
      </div>
    ),
  },
);

const SHOTS = [
  { label: "Wide", distance: 9, height: 1.4 },
  { label: "Medium", distance: 5.5, height: 1.25 },
  { label: "Close", distance: 3.2, height: 1.1 },
] as const;

const ANGLES = [
  { label: "Low", height: 0.35 },
  { label: "Eye", height: 1.25 },
  { label: "High", height: 2.8 },
] as const;

const SNIPPET = `// Shot size ≈ distance · Angle ≈ height
camera.position.set(0, {{height}}, {{distance}});
camera.lookAt(0, 1.1, 0);
camera.fov = {{fov}}; // locked here — see FOV lesson`;

export function FundamentalsPlayground() {
  const [distance, setDistance] = useState(5.5);
  const [height, setHeight] = useState(1.25);
  const fov = 40;

  const shotFeel = useMemo(() => {
    if (distance >= 7.5) return "wide / establishing";
    if (distance <= 3.8) return "close-up territory";
    return "medium";
  }, [distance]);

  const angleFeel = useMemo(() => {
    if (height < 0.7) return "low angle (power)";
    if (height > 2.2) return "high angle (overview)";
    return "eye-level";
  }, [height]);

  const codeValue = formatSnippet(SNIPPET, {
    height: Number(height.toFixed(2)),
    distance: Number(distance.toFixed(2)),
    fov,
  });

  return (
    <PlaygroundShell
      title="Camera Fundamentals"
      description="Watch only — change shot size (distance) and angle (height). FOV stays locked so you feel spatial framing, not zoom."
      onReset={() => {
        setDistance(5.5);
        setHeight(1.25);
      }}
      stageLabel="Camera fundamentals 3D stage"
      stageClassName="h-72 sm:h-80"
      stage={
        <FundamentalsScene distance={distance} height={height} fov={fov} />
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="Shot size" className="flex flex-wrap gap-2">
            {SHOTS.map((s) => (
              <LabButton
                key={s.label}
                variant="outline"
                pressed={Math.abs(distance - s.distance) < 0.2}
                onClick={() => {
                  setDistance(s.distance);
                  setHeight(s.height);
                }}
              >
                {s.label}
              </LabButton>
            ))}
          </div>
          <div role="group" aria-label="Camera angle" className="flex flex-wrap gap-2">
            {ANGLES.map((a) => (
              <LabButton
                key={a.label}
                variant="outline"
                pressed={Math.abs(height - a.height) < 0.15}
                onClick={() => setHeight(a.height)}
              >
                {a.label}
              </LabButton>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabSlider
              label="Distance"
              min={2.5}
              max={11}
              step={0.1}
              value={distance}
              onChange={setDistance}
            />
            <LabSlider
              label="Height"
              min={0.2}
              max={3.2}
              step={0.05}
              value={height}
              onChange={setHeight}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <LabReadout label="shot:" value={shotFeel} />
            <LabReadout label="angle:" value={angleFeel} />
            <LabReadout label="fov:" value={`${fov}° locked`} />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
