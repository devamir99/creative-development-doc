"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

const COUNT = 6;
const SNIPPET = `gsap.from(".item", {
  y: 40,
  opacity: 0,
  duration: {{duration}},
  stagger: {{stagger}},
  ease: "power2.out",
});`;

export function StaggerPlayground() {
  const { pick } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [stagger, setStagger] = useState(0.08);
  const [duration, setDuration] = useState(0.45);
  const [replayKey, setReplayKey] = useState(0);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const items = root.querySelectorAll<HTMLElement>("[data-item]");
      gsap.killTweensOf(items);
      if (reducedMotion) {
        gsap.set(items, { y: 0, opacity: 1 });
        return;
      }
      gsap.set(items, { y: 40, opacity: 0 });
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease: "power2.out",
        delay: 0.1,
      });
    },
    { dependencies: [stagger, duration, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(SNIPPET, {
    duration: Number(duration.toFixed(2)),
    stagger: Number(stagger.toFixed(2)),
  });

  return (
    <PlaygroundShell
      title={pick("Stagger", "پلکانی (Stagger)")}
      description={
        reducedMotion
          ? pick(
              "Reduced motion: items shown in final state.",
              "حرکت کاهش‌یافته: آیتم‌ها در حالت نهایی نمایش داده می‌شوند.",
            )
          : pick(
              "Same tween on many elements — only the start times fan out.",
              "همان تویین روی چند عنصر — فقط زمان‌های شروع پخش می‌شوند.",
            )
      }
      onReset={() => {
        setStagger(0.08);
        setDuration(0.45);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : () => setReplayKey((k) => k + 1)}
      stageLabel={pick("Stagger motion stage", "صحنهٔ حرکت پلکانی")}
      stageClassName="h-56 sm:h-64"
      stage={
        <div
          ref={rootRef}
          className="flex h-full items-end justify-center gap-2 px-4 pb-8"
        >
          {Array.from({ length: COUNT }, (_, i) => (
            <div
              key={i}
              data-item
              className="w-8 bg-lab-accent sm:w-10"
              style={{ height: `${36 + i * 10}%` }}
            />
          ))}
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Stagger presets", "پیش‌تنظیم‌های پلکانی")}
            className="flex flex-wrap gap-2"
          >
            {[0, 0.05, 0.1, 0.2].map((v) => (
              <LabButton
                key={v}
                variant="outline"
                pressed={Math.abs(stagger - v) < 0.001}
                onClick={() => setStagger(v)}
              >
                {v === 0 ? pick("None", "هیچ") : `${v}s`}
              </LabButton>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabSlider
              label={pick("Stagger", "پلکانی")}
              unit="s"
              min={0}
              max={0.35}
              step={0.01}
              value={stagger}
              onChange={setStagger}
            />
            <LabSlider
              label={pick("Duration", "مدت")}
              unit="s"
              min={0.2}
              max={1}
              step={0.05}
              value={duration}
              onChange={setDuration}
            />
          </div>
          <LabReadout
            label={pick("items:", "آیتم‌ها:")}
            value={`${COUNT}`}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
