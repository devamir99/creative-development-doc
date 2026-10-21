"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SNIPPET_EN = `ScrollTrigger.create({
  trigger: section,
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => setProgress(self.progress),
});`;

const SNIPPET_FA = `// اسکراب: پیشرفت اسکرول، نشانگر را حرکت می‌دهد
ScrollTrigger.create({
  trigger: section,
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => setProgress(self.progress),
});`;

export function ScrollProgressPlayground() {
  const { pick } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  useGSAP(
    () => {
      const scroller = scrollerRef.current;
      const track = trackRef.current;
      const marker = markerRef.current;
      if (!scroller || !track || !marker) return;

      if (reducedMotion) {
        gsap.set(marker, { yPercent: 0 });
        setProgress(0);
        return;
      }

      const st = ScrollTrigger.create({
        scroller,
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          setProgress(self.progress);
          gsap.set(marker, { yPercent: self.progress * 100 });
        },
      });

      return () => {
        st.kill();
      };
    },
    { dependencies: [replayKey, reducedMotion], scope: scrollerRef },
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [replayKey]);

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {});

  return (
    <PlaygroundShell
      title={pick("ScrollTrigger Progress", "پیشرفت ScrollTrigger")}
      description={
        reducedMotion
          ? pick(
              "Reduced motion: scroll container shown without scrub binding.",
              "حرکت کاهش‌یافته: محفظه اسکرول بدون اتصال scrub نمایش داده می‌شود.",
            )
          : pick(
              "Scroll inside the stage — progress drives the yellow marker (scrubbed).",
              "داخل صحنه اسکرول کن؛ پیشرفت، نشانگر زرد را حرکت می‌دهد (با scrub).",
            )
      }
      onReset={() => setReplayKey((k) => k + 1)}
      stageLabel={pick("Scroll progress stage", "صحنه پیشرفت اسکرول")}
      stageClassName="h-80"
      stage={
        <div
          ref={scrollerRef}
          className="h-full overflow-y-auto overscroll-contain bg-[#0c0c0e]"
          tabIndex={0}
          aria-label={pick("Scrollable demo region", "ناحیه نمایشیِ قابل اسکرول")}
        >
          <div ref={trackRef} className="relative min-h-[220%]">
            <div className="sticky top-0 flex h-48 items-center justify-center border-b border-lab-line bg-[#101012]/p-4">
              <div className="relative h-32 w-4 rounded-sm bg-zinc-800">
                <div
                  ref={markerRef}
                  className="absolute top-0 left-1/2 size-4 -translate-x-1/2 bg-lab-accent"
                />
              </div>
              <p className="ml-6 max-w-[12rem] font-mono text-xs text-lab-muted">
                {pick(
                  "Sticky readout while the tall track scrolls underneath.",
                  "نمایشگر چسبان، درحالی‌که مسیر بلند زیر آن اسکرول می‌شود.",
                )}
              </p>
            </div>
            <div className="space-y-8 p-6 font-mono text-xs text-lab-muted">
              <p>{pick("Keep scrolling…", "به اسکرول ادامه بده…")}</p>
              <p>
                {pick(
                  "Progress maps 0 → 1 across this track.",
                  "پیشرفت در سراسر این مسیر از 0 تا 1 نگاشت می‌شود.",
                )}
              </p>
              <p>
                {pick(
                  "Use scrub for scroll-linked motion; avoid fighting native scroll.",
                  "از scrub برای حرکتِ متصل به اسکرول استفاده کن و با اسکرول بومی درگیر نشو.",
                )}
              </p>
              <p>{pick("End of track.", "پایان مسیر.")}</p>
            </div>
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <LabButton variant="outline" onClick={() => setReplayKey((k) => k + 1)}>
            {pick("Reset scroll", "بازنشانی اسکرول")}
          </LabButton>
          <LabReadout label={pick("progress:", "پیشرفت:")} value={progress.toFixed(3)} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
