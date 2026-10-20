"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";
import type { ShotAngle } from "./shot-types-scene";

const ShotTypesScene = dynamic(
  () => import("./shot-types-scene").then((m) => m.ShotTypesScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL stage…
      </div>
    ),
  },
);

function shotLabel(framing: number) {
  if (framing < 0.22) return "Wide / establishing — geography first";
  if (framing < 0.45) return "Full / wide-medium — body in space";
  if (framing < 0.7) return "Medium — action & gesture";
  if (framing < 0.88) return "Close-up — emotion & detail";
  return "Extreme close — isolate a feature";
}

const ANGLE_COPY: Record<ShotAngle, string> = {
  low: "Low angle — subject reads monumental / powerful",
  eye: "Eye-level — neutral observer",
  high: "High angle — subject reads vulnerable / mapped",
};

const SNIPPET = `// Shot size ≈ camera distance (FOV held)
const distance = lerp(11.5, 2.35, {{framing}});
camera.position.set(0, {{camY}}, distance);
camera.lookAt(0, {{lookY}}, 0);
// angle={{angle}} · {{shot}}`;

export function ShotTypesPlayground() {
  const [framing, setFraming] = useState(0.48);
  const [angle, setAngle] = useState<ShotAngle>("eye");

  const shot = useMemo(() => shotLabel(framing), [framing]);
  const camY = angle === "low" ? 0.35 : angle === "high" ? 3.4 : 1.4;
  const lookY = angle === "low" ? 1.55 : angle === "high" ? 0.85 : 1.15;

  return (
    <PlaygroundShell
      title="Shot Size & Angle"
      description="Same lit 3D set, different eye. Size moves the camera closer/farther. Angle changes height and look-at — power, not just decoration."
      onReset={() => {
        setFraming(0.48);
        setAngle("eye");
      }}
      stageLabel="Shot size and angle WebGL stage"
      stageClassName="h-[22rem] sm:h-[26rem]"
      stage={
        <div className="relative h-full w-full">
          <ShotTypesScene framing={framing} angle={angle} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-3">
            <p className="font-mono text-[11px] leading-snug text-zinc-200">
              <span className="text-lab-accent">{shot.split("—")[0]?.trim()}</span>
              {" · "}
              {ANGLE_COPY[angle]}
            </p>
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {(["low", "eye", "high"] as const).map((a) => (
              <LabButton
                key={a}
                variant="outline"
                pressed={angle === a}
                onClick={() => setAngle(a)}
              >
                {a}
              </LabButton>
            ))}
          </div>
          <LabSlider
            label="Framing (wide → close)"
            unit="%"
            min={0}
            max={100}
            step={1}
            value={Math.round(framing * 100)}
            onChange={(v) => setFraming(v / 100)}
          />
          <LabReadout label="reads as:" value={shot} />
        </div>
      }
      code={{
        language: "js",
        value: formatSnippet(SNIPPET, {
          framing: Number(framing.toFixed(2)),
          camY,
          lookY,
          angle,
          shot,
        }),
      }}
    />
  );
}
