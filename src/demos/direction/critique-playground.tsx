"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const SNIPPET = `// Critique loop: intent → observation → effect
// Frame {{pick}}: clearer single focal point?
// Winner should match the frame with one resting place.`;

export function CritiquePlayground() {
  const [pick, setPick] = useState<"A" | "B" | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correct = "A";
  const isRight = pick === correct;

  const codeValue = formatSnippet(SNIPPET, {
    pick: pick ?? "?",
  });

  function handleReset() {
    setPick(null);
    setRevealed(false);
  }

  return (
    <PlaygroundShell
      title="Critique Loop"
      description="Which frame has a clearer focal point? Pick, then Reveal. Practice intent → observation → effect."
      onReset={handleReset}
      stageLabel="Critique comparison stage"
      stageClassName="h-64 sm:h-72"
      stage={
        <div className="grid h-full grid-cols-1 gap-2 p-3 sm:grid-cols-2">
          <button
            type="button"
            className={`relative overflow-hidden border text-left ${
              pick === "A" ? "border-lab-accent" : "border-lab-line"
            } bg-[#121214]`}
            onClick={() => {
              setPick("A");
              setRevealed(false);
            }}
            aria-pressed={pick === "A"}
            aria-label="Frame A"
          >
            <span className="absolute top-2 left-2 z-10 font-mono text-[10px] text-lab-muted">
              A
            </span>
            {/* one clear subject */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_45%,#27272a,transparent_55%)]" />
            <div className="absolute top-[42%] left-[34%] size-14 -translate-x-1/2 -translate-y-1/2 bg-lab-accent" />
            <div className="absolute right-6 bottom-8 h-8 w-12 bg-zinc-700/50" />
          </button>
          <button
            type="button"
            className={`relative overflow-hidden border text-left ${
              pick === "B" ? "border-lab-accent" : "border-lab-line"
            } bg-[#121214]`}
            onClick={() => {
              setPick("B");
              setRevealed(false);
            }}
            aria-pressed={pick === "B"}
            aria-label="Frame B"
          >
            <span className="absolute top-2 left-2 z-10 font-mono text-[10px] text-lab-muted">
              B
            </span>
            {/* competing accents */}
            <div className="absolute top-[30%] left-[25%] size-12 bg-lab-accent" />
            <div className="absolute top-[55%] right-[22%] size-12 bg-lab-accent" />
            <div className="absolute bottom-[20%] left-[40%] size-10 bg-zinc-300" />
            <div className="absolute top-[20%] right-[30%] h-6 w-16 bg-zinc-500" />
          </button>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <LabButton
              variant="solid"
              disabled={!pick}
              onClick={() => setRevealed(true)}
            >
              Reveal
            </LabButton>
            <LabButton variant="outline" onClick={handleReset}>
              Try again
            </LabButton>
          </div>
          <LabReadout
            label="pick:"
            value={
              !pick
                ? "tap a frame"
                : !revealed
                  ? `Frame ${pick} (locked in)`
                  : isRight
                    ? `A — one resting place (you got it)`
                    : `A is clearer — B has competing heroes`
            }
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
