"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const SNIPPET = `// Tension rises as masses crowd edges / each other
gap = {{gap}}px
edgeInset = {{edge}}%
// Centered calm ↔ edge pressure`;

export function TensionPlayground() {
  const [gap, setGap] = useState(48);
  const [edge, setEdge] = useState(12);
  const [count, setCount] = useState(2);

  const codeValue = formatSnippet(SNIPPET, { gap, edge });

  return (
    <PlaygroundShell
      title="Tension"
      description="Crowding the frame edge or shrinking the gap between masses raises visual pressure without changing the subject."
      onReset={() => {
        setGap(48);
        setEdge(12);
        setCount(2);
      }}
      stageLabel="Composition tension stage"
      stageClassName="h-72 sm:h-80"
      stage={
        <div className="relative h-full w-full overflow-hidden bg-[#0e0e10]">
          <div
            className="absolute inset-0 border border-dashed border-lab-line/40"
            style={{ margin: `${edge}%` }}
            aria-hidden
          />
          <div
            className="absolute top-1/2 flex -translate-y-1/2 items-center"
            style={{
              left: `${edge}%`,
              right: `${edge}%`,
              gap,
              justifyContent: count > 2 ? "space-between" : "center",
            }}
          >
            {Array.from({ length: count }, (_, i) => (
              <div
                key={i}
                className={i === 0 ? "bg-lab-accent" : "bg-zinc-500"}
                style={{
                  width: i === 0 ? 64 : 48,
                  height: i === 0 ? 80 : 56,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="Mass count" className="flex flex-wrap gap-2">
            {[2, 3].map((n) => (
              <LabButton
                key={n}
                variant="outline"
                pressed={count === n}
                onClick={() => setCount(n)}
              >
                {n} masses
              </LabButton>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabSlider label="Gap" unit="px" min={4} max={120} step={2} value={gap} onChange={setGap} />
            <LabSlider
              label="Edge inset"
              unit="%"
              min={2}
              max={28}
              step={1}
              value={edge}
              onChange={setEdge}
            />
          </div>
          <LabReadout
            label="feel:"
            value={gap < 20 || edge < 6 ? "high pressure" : gap > 80 && edge > 18 ? "open / calm" : "moderate"}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
