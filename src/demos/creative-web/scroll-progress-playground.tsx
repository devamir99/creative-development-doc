"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SNIPPET = `ScrollTrigger.create({
  trigger: section,
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => setProgress(self.progress),
});`;

export function ScrollProgressPlayground() {
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

  const codeValue = formatSnippet(SNIPPET, {});

  return (
    <PlaygroundShell
      title="ScrollTrigger Progress"
      description={
        reducedMotion
          ? "Reduced motion: scroll container shown without scrub binding."
          : "Scroll inside the stage — progress drives the yellow marker (scrubbed)."
      }
      onReset={() => setReplayKey((k) => k + 1)}
      stageLabel="Scroll progress stage"
      stageClassName="h-80"
      stage={
        <div
          ref={scrollerRef}
          className="h-full overflow-y-auto overscroll-contain bg-[#0c0c0e]"
          tabIndex={0}
          aria-label="Scrollable demo region"
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
                Sticky readout while the tall track scrolls underneath.
              </p>
            </div>
            <div className="space-y-8 p-6 font-mono text-xs text-lab-muted">
              <p>Keep scrolling…</p>
              <p>Progress maps 0 → 1 across this track.</p>
              <p>Use scrub for scroll-linked motion; avoid fighting native scroll.</p>
              <p>End of track.</p>
            </div>
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <LabButton variant="outline" onClick={() => setReplayKey((k) => k + 1)}>
            Reset scroll
          </LabButton>
          <LabReadout label="progress:" value={progress.toFixed(3)} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
