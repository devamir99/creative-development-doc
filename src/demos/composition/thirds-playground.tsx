"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const SNIPPET = `// Rule of thirds intersections (normalized)
const points = [
  [1/3, 1/3], [2/3, 1/3],
  [1/3, 2/3], [2/3, 2/3],
];
subject.at = [{{x}}, {{y}}]; // 0–1`;

export function ThirdsPlayground() {
  const [x, setX] = useState(1 / 3);
  const [y, setY] = useState(1 / 3);
  const [showGrid, setShowGrid] = useState(true);

  const codeValue = formatSnippet(SNIPPET, {
    x: x.toFixed(2),
    y: y.toFixed(2),
  });

  return (
    <PlaygroundShell
      title="Rule of Thirds"
      description="Place the subject on intersections — a starting heuristic, not a law."
      onReset={() => {
        setX(1 / 3);
        setY(1 / 3);
        setShowGrid(true);
      }}
      stageLabel="Rule of thirds stage"
      stageClassName="h-72 sm:h-80"
      stage={
        <div className="relative h-full w-full bg-[#101012]">
          {showGrid ? (
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute top-0 bottom-0 left-1/3 w-px bg-lab-accent/50" />
              <div className="absolute top-0 bottom-0 left-2/3 w-px bg-lab-accent/50" />
              <div className="absolute right-0 left-0 top-1/3 h-px bg-lab-accent/50" />
              <div className="absolute right-0 left-0 top-2/3 h-px bg-lab-accent/50" />
              {[
                [1 / 3, 1 / 3],
                [2 / 3, 1 / 3],
                [1 / 3, 2 / 3],
                [2 / 3, 2 / 3],
              ].map(([px, py]) => (
                <div
                  key={`${px}-${py}`}
                  className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lab-accent"
                  style={{ left: `${px * 100}%`, top: `${py * 100}%` }}
                />
              ))}
            </div>
          ) : null}
          <div
            className="absolute size-14 -translate-x-1/2 -translate-y-1/2 bg-zinc-300"
            style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
            aria-hidden
          />
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="Thirds presets" className="flex flex-wrap gap-2">
            {(
              [
                { label: "TL", x: 1 / 3, y: 1 / 3 },
                { label: "TR", x: 2 / 3, y: 1 / 3 },
                { label: "BL", x: 1 / 3, y: 2 / 3 },
                { label: "BR", x: 2 / 3, y: 2 / 3 },
                { label: "Center", x: 0.5, y: 0.5 },
              ] as const
            ).map((p) => (
              <LabButton
                key={p.label}
                variant="outline"
                pressed={Math.abs(x - p.x) < 0.02 && Math.abs(y - p.y) < 0.02}
                onClick={() => {
                  setX(p.x);
                  setY(p.y);
                }}
              >
                {p.label}
              </LabButton>
            ))}
            <LabButton
              variant="outline"
              pressed={showGrid}
              onClick={() => setShowGrid((v) => !v)}
            >
              {showGrid ? "Grid on" : "Grid off"}
            </LabButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabSlider label="X" min={0.1} max={0.9} step={0.01} value={x} onChange={setX} />
            <LabSlider label="Y" min={0.1} max={0.9} step={0.01} value={y} onChange={setY} />
          </div>
          <LabReadout label="norm:" value={`${x.toFixed(2)}, ${y.toFixed(2)}`} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
