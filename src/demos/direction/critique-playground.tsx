"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

const SNIPPET_EN = `// Critique loop: intent → observation → effect
// Frame {{frame}}: clearer single focal point?
// Winner should match the frame with one resting place.`;

const SNIPPET_FA = `// حلقه نقد: نیت → مشاهده → اثر
// قاب {{frame}}: نقطه کانونی واحد واضح‌تر؟
// برنده باید قابی باشد که یک نقطهٔ آرامش دارد.`;

export function CritiquePlayground() {
  const { pick } = useLocale();
  const [frame, setFrame] = useState<"A" | "B" | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correct = "A";
  const isRight = frame === correct;

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {
    frame: frame ?? "?",
  });

  function handleReset() {
    setFrame(null);
    setRevealed(false);
  }

  return (
    <PlaygroundShell
      title={pick("Critique Loop", "حلقه نقد و بازبینی")}
      description={pick(
        "Which frame has a clearer focal point? Pick, then Reveal. Practice intent → observation → effect.",
        "کدام قاب نقطه کانونی واضح‌تری دارد؟ انتخاب کن، بعد آشکار کن. تمرین نیت → مشاهده → اثر.",
      )}
      onReset={handleReset}
      stageLabel={pick("Critique comparison stage", "صحنه مقایسه نقد و بازبینی")}
      stageClassName="h-64 sm:h-72"
      stage={
        <div className="grid h-full grid-cols-1 gap-2 p-3 sm:grid-cols-2">
          <button
            type="button"
            className={`relative overflow-hidden border text-left ${
              frame === "A" ? "border-lab-accent" : "border-lab-line"
            } bg-[#121214]`}
            onClick={() => {
              setFrame("A");
              setRevealed(false);
            }}
            aria-pressed={frame === "A"}
            aria-label={pick("Frame A", "قاب A")}
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
              frame === "B" ? "border-lab-accent" : "border-lab-line"
            } bg-[#121214]`}
            onClick={() => {
              setFrame("B");
              setRevealed(false);
            }}
            aria-pressed={frame === "B"}
            aria-label={pick("Frame B", "قاب B")}
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
              disabled={!frame}
              onClick={() => setRevealed(true)}
            >
              {pick("Reveal", "آشکارسازی")}
            </LabButton>
            <LabButton variant="outline" onClick={handleReset}>
              {pick("Try again", "دوباره تلاش کن")}
            </LabButton>
          </div>
          <LabReadout
            label={pick("pick:", "انتخاب:")}
            value={
              !frame
                ? pick("tap a frame", "یک قاب را بزن")
                : !revealed
                  ? pick(
                      `Frame ${frame} (locked in)`,
                      `قاب ${frame} (ثبت شد)`,
                    )
                  : isRight
                    ? pick(
                        "A — one resting place (you got it)",
                        "A — یک نقطهٔ آرامش (درست بود)",
                      )
                    : pick(
                        "A is clearer — B has competing heroes",
                        "A واضح‌تر است — در B قهرمان‌های رقیب هست",
                      )
            }
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
