"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const SNIPPET = `// Facing right — leave lead room ahead of the subject
subject.x = {{x}}%; // 50 = center
facing = "right";
// Too little lead room → compressed / tense`;

export function CenterPlayground() {
  const [x, setX] = useState(50);
  const [facing, setFacing] = useState<"left" | "right">("right");

  const leadRoom =
    facing === "right" ? 100 - x : x;
  const feel =
    Math.abs(x - 50) < 3
      ? "centered statement"
      : leadRoom < 22
        ? "compressed / tense"
        : leadRoom > 45
          ? "open lead room"
          : "off-center active";

  const codeValue = formatSnippet(SNIPPET, { x: Math.round(x) });

  return (
    <PlaygroundShell
      title="Center vs Off-Center"
      description="Center reads as statement. Off-center activates space — especially lead room in the facing direction."
      onReset={() => {
        setX(50);
        setFacing("right");
      }}
      stageLabel="Center versus off-center stage"
      stageClassName="h-72 sm:h-80"
      stage={
        <div className="relative flex h-full items-center bg-[#101012]">
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-lab-line/50" />
          <div
            className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1"
            style={{
              left: `${x}%`,
              transform: `translate(-50%, -50%) scaleX(${facing === "left" ? -1 : 1})`,
            }}
          >
            <div className="h-16 w-20 bg-lab-accent" />
            <div
              className="h-0 w-0 border-y-8 border-y-transparent border-l-[14px] border-l-lab-accent"
              aria-hidden
            />
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="Facing" className="flex flex-wrap gap-2">
            <LabButton
              variant="outline"
              pressed={facing === "left"}
              onClick={() => setFacing("left")}
            >
              Face left
            </LabButton>
            <LabButton
              variant="outline"
              pressed={facing === "right"}
              onClick={() => setFacing("right")}
            >
              Face right
            </LabButton>
            <LabButton variant="outline" onClick={() => setX(50)}>
              Snap center
            </LabButton>
            <LabButton
              variant="outline"
              onClick={() => setX(facing === "right" ? 35 : 65)}
            >
              Lead room
            </LabButton>
          </div>
          <LabSlider label="Subject X" unit="%" min={15} max={85} step={1} value={x} onChange={setX} />
          <div className="flex flex-wrap gap-4">
            <LabReadout label="lead≈" value={`${leadRoom.toFixed(0)}%`} />
            <LabReadout label="feel:" value={feel} />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
