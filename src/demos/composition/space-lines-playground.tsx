"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

type Mode = "negative" | "lines" | "layers" | "symmetry" | "hierarchy";

const MODE_IDS: Mode[] = [
  "negative",
  "lines",
  "layers",
  "symmetry",
  "hierarchy",
];

export function SpaceLinesPlayground({
  initial = "negative",
}: {
  initial?: Mode;
}) {
  const { pick } = useLocale();
  const [mode, setMode] = useState<Mode>(initial);
  const [amount, setAmount] = useState(55);

  const titles: Record<Mode, string> = {
    negative: pick("Negative Space", "فضای منفی"),
    lines: pick("Leading Lines", "خطوط هدایت‌کننده"),
    layers: pick("Layers & Depth", "لایه‌ها و عمق"),
    symmetry: pick("Symmetry", "تقارن"),
    hierarchy: pick("Visual Hierarchy", "سلسله‌مراتب بصری"),
  };

  const snippet = pick(
    `// composition tool + strength
composition.tool = "{{tool}}";
strength = {{amount}};`,
    `// ابزار ترکیب‌بندی + شدت
composition.tool = "{{tool}}";
strength = {{amount}};`,
  );

  return (
    <PlaygroundShell
      title={titles[mode]}
      description={pick(
        "One frame, five composition tools. Switch modes and drag amount — watch how emptiness, lines, layers, symmetry, or scale order the eye.",
        "یک قاب، پنج ابزار ترکیب‌بندی. حالت را عوض کن و مقدار را بکش — ببین خلأ، خطوط، لایه‌ها، تقارن یا مقیاس چطور چشم را هدایت می‌کنند.",
      )}
      onReset={() => {
        setMode(initial);
        setAmount(55);
      }}
      stageLabel={pick("Composition visual stage", "صحنه بصری ترکیب‌بندی")}
      stageClassName="h-72"
      stage={
        <div className="relative h-full overflow-hidden bg-[#101012]">
          {mode === "negative" && (
            <>
              <div
                className="absolute bg-lab-accent transition-all"
                style={{
                  width: 120 - amount,
                  height: 90 - amount * 0.6,
                  right: `${amount}%`,
                  top: "38%",
                }}
              />
              <span className="absolute bottom-3 left-3 font-mono text-[10px] text-lab-muted">
                {pick(
                  "more empty space = more isolation & calm",
                  "فضای خالی بیشتر = انزوا و آرامش بیشتر",
                )}
              </span>
            </>
          )}
          {mode === "lines" && (
            <>
              <svg className="absolute inset-0 h-full w-full">
                <line
                  x1="0"
                  y1="100%"
                  x2="68%"
                  y2="42%"
                  stroke="#fafa05"
                  strokeWidth="2"
                  opacity={0.3 + amount / 140}
                />
                <line
                  x1="100%"
                  y1="100%"
                  x2="68%"
                  y2="42%"
                  stroke="#fafa05"
                  strokeWidth="2"
                  opacity={0.3 + amount / 140}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="68%"
                  y2="42%"
                  stroke="#71717a"
                  strokeWidth="1"
                />
              </svg>
              <div className="absolute top-[42%] left-[68%] size-12 -translate-x-1/2 -translate-y-1/2 bg-lab-accent" />
            </>
          )}
          {mode === "layers" && (
            <>
              <div
                className="absolute bottom-0 left-0 h-24 w-40 bg-zinc-800"
                style={{
                  transform: `translateX(${-amount / 3}px)`,
                  filter: "brightness(.6)",
                }}
              />
              <div
                className="absolute top-[34%] left-[42%] h-28 w-28 bg-zinc-500"
                style={{ transform: `translateX(${amount / 8}px)` }}
              />
              <div
                className="absolute right-[12%] bottom-8 h-32 w-20 bg-lab-accent"
                style={{ transform: `translateX(${amount / 4}px)` }}
              />
              <span className="absolute top-3 left-3 font-mono text-[10px] text-lab-muted">
                {pick("fore → mid → back", "جلو → میانه → عقب")}
              </span>
            </>
          )}
          {mode === "symmetry" && (
            <>
              <div className="absolute inset-y-0 left-1/2 w-px bg-lab-accent/50" />
              <div
                className="absolute top-[36%] bg-zinc-400 transition-all"
                style={{
                  width: 40 + amount / 2,
                  height: 70,
                  left: `calc(50% - ${70 + amount / 2}px)`,
                }}
              />
              <div
                className="absolute top-[36%] bg-zinc-400 transition-all"
                style={{
                  width: 40 + amount / 2,
                  height: 70,
                  left: `calc(50% + 30px)`,
                }}
              />
              <div className="absolute top-[42%] left-1/2 size-8 -translate-x-1/2 rounded-full bg-lab-accent" />
            </>
          )}
          {mode === "hierarchy" && (
            <>
              <div
                className="absolute bg-lab-accent transition-all"
                style={{
                  width: 30 + amount,
                  height: 24 + amount * 0.7,
                  left: "18%",
                  top: "28%",
                }}
              />
              <div className="absolute top-[62%] left-[22%] h-8 w-24 bg-zinc-500" />
              <div className="absolute top-[70%] left-[22%] h-4 w-36 bg-zinc-700" />
              <div className="absolute right-[15%] top-[30%] size-10 bg-zinc-600" />
            </>
          )}
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {MODE_IDS.map((m) => (
              <LabButton
                key={m}
                variant="outline"
                pressed={mode === m}
                onClick={() => setMode(m)}
              >
                {titles[m]}
              </LabButton>
            ))}
          </div>
          <LabSlider
            label={pick("Strength / amount", "شدت / مقدار")}
            min={10}
            max={90}
            step={1}
            value={amount}
            onChange={setAmount}
          />
          <LabReadout
            label={pick("tool:", "ابزار:")}
            value={titles[mode]}
          />
        </div>
      }
      code={{
        language: "js",
        value: formatSnippet(snippet, { tool: mode, amount }),
      }}
    />
  );
}

export function NegativeSpacePlayground() {
  return <SpaceLinesPlayground initial="negative" />;
}
export function LeadingLinesPlayground() {
  return <SpaceLinesPlayground initial="lines" />;
}
export function LayersDepthPlayground() {
  return <SpaceLinesPlayground initial="layers" />;
}
export function SymmetryPlayground() {
  return <SpaceLinesPlayground initial="symmetry" />;
}
export function HierarchyPlayground() {
  return <SpaceLinesPlayground initial="hierarchy" />;
}
