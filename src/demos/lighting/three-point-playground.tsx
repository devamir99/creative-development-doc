"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";
import {
  DEFAULT_THREE_POINT,
  type ThreePointParams,
} from "./three-point-math";

const ThreePointScene = dynamic(
  () => import("./three-point-scene").then((m) => m.ThreePointScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL…
      </div>
    ),
  },
);

const DEFAULT = DEFAULT_THREE_POINT;

const SNIPPET = `// Classic three-point — teaching intensities, not photometric units
key.intensity = {{key}};
fill.intensity = {{fill}};
rim.intensity = {{rim}};
// keyTemp 0 = cool, 1 = warm (color mix)`;

export function ThreePointPlayground() {
  const [params, setParams] = useState<ThreePointParams>({ ...DEFAULT });

  const codeValue = formatSnippet(SNIPPET, {
    key: params.keyIntensity.toFixed(2),
    fill: params.fillIntensity.toFixed(2),
    rim: params.rimIntensity.toFixed(2),
  });

  return (
    <PlaygroundShell
      title="Three-Point Lighting"
      description="Key shapes form; fill opens shadows; rim separates subject from background. Intensities are teaching knobs — not lux."
      onReset={() => setParams({ ...DEFAULT })}
      stageLabel="Three-point lighting stage"
      stageClassName="h-72 sm:h-80"
      stage={<ThreePointScene params={params} />}
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="Lighting presets" className="flex flex-wrap gap-2">
            <LabButton
              variant="outline"
              onClick={() =>
                setParams({
                  keyIntensity: 1.6,
                  fillIntensity: 0.15,
                  rimIntensity: 1.1,
                  keyTemp: 0.75,
                })
              }
            >
              Dramatic
            </LabButton>
            <LabButton
              variant="outline"
              onClick={() =>
                setParams({
                  keyIntensity: 1.1,
                  fillIntensity: 0.7,
                  rimIntensity: 0.4,
                  keyTemp: 0.5,
                })
              }
            >
              Soft product
            </LabButton>
            <LabButton variant="outline" onClick={() => setParams({ ...DEFAULT })}>
              Default
            </LabButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabSlider
              label="Key"
              min={0}
              max={2.5}
              step={0.05}
              value={params.keyIntensity}
              onChange={(keyIntensity) => setParams((p) => ({ ...p, keyIntensity }))}
            />
            <LabSlider
              label="Fill"
              min={0}
              max={1.5}
              step={0.05}
              value={params.fillIntensity}
              onChange={(fillIntensity) => setParams((p) => ({ ...p, fillIntensity }))}
            />
            <LabSlider
              label="Rim"
              min={0}
              max={2}
              step={0.05}
              value={params.rimIntensity}
              onChange={(rimIntensity) => setParams((p) => ({ ...p, rimIntensity }))}
            />
            <LabSlider
              label="Key temp"
              min={0}
              max={1}
              step={0.05}
              value={params.keyTemp}
              onChange={(keyTemp) => setParams((p) => ({ ...p, keyTemp }))}
            />
          </div>
          <LabReadout
            label="temp:"
            value={params.keyTemp < 0.4 ? "cool" : params.keyTemp > 0.65 ? "warm" : "neutral"}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
