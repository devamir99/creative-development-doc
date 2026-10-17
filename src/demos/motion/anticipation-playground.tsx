"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

const SNIPPET = `gsap.timeline()
  .to(el, { x: -{{anti}}, duration: 0.18, ease: "power1.in" }) // anticipate
  .to(el, { x: {{travel}}, duration: {{duration}}, ease: "power2.out" }) // action
  .to(el, { x: {{travel}} - {{follow}}, duration: 0.22, ease: "power1.out" }) // settle`;

export function AnticipationPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const elRef = useRef<HTMLDivElement>(null);
  const [anti, setAnti] = useState(24);
  const [follow, setFollow] = useState(18);
  const [duration, setDuration] = useState(0.45);
  const [replayKey, setReplayKey] = useState(0);
  const travel = 200;

  useGSAP(
    () => {
      const el = elRef.current;
      if (!el) return;
      gsap.killTweensOf(el);
      if (reducedMotion) {
        gsap.set(el, { x: travel });
        return;
      }
      gsap.set(el, { x: 0 });
      gsap
        .timeline({ delay: 0.12 })
        .to(el, { x: -anti, duration: 0.18, ease: "power1.in" })
        .to(el, { x: travel, duration, ease: "power2.out" })
        .to(el, {
          x: travel - follow * 0.35,
          duration: 0.2,
          ease: "power1.out",
        })
        .to(el, { x: travel, duration: 0.18, ease: "power1.inOut" });
    },
    { dependencies: [anti, follow, duration, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(SNIPPET, {
    anti,
    follow,
    duration: Number(duration.toFixed(2)),
    travel,
  });

  return (
    <PlaygroundShell
      title="Anticipation & Follow-Through"
      description={
        reducedMotion
          ? "Reduced motion: end pose only."
          : "Wind-up opposite the action, then overshoot/settle — classic cartoon physics, useful in UI."
      }
      onReset={() => {
        setAnti(24);
        setFollow(18);
        setDuration(0.45);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : () => setReplayKey((k) => k + 1)}
      stageLabel="Anticipation motion stage"
      stageClassName="h-48"
      stage={
        <div className="relative flex h-full items-center px-6">
          <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-lab-line" />
          <div
            ref={elRef}
            className="size-12 bg-lab-accent"
            aria-hidden
          />
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="Presets" className="flex flex-wrap gap-2">
            <LabButton
              variant="outline"
              onClick={() => {
                setAnti(0);
                setFollow(0);
                setReplayKey((k) => k + 1);
              }}
            >
              No wind-up
            </LabButton>
            <LabButton
              variant="outline"
              onClick={() => {
                setAnti(24);
                setFollow(18);
                setReplayKey((k) => k + 1);
              }}
            >
              Classic
            </LabButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <LabSlider label="Anticipation" unit="px" min={0} max={48} step={1} value={anti} onChange={setAnti} />
            <LabSlider label="Follow-through" unit="px" min={0} max={40} step={1} value={follow} onChange={setFollow} />
            <LabSlider label="Action dur." unit="s" min={0.25} max={0.9} step={0.05} value={duration} onChange={setDuration} />
          </div>
          <LabReadout label="travel:" value={`${travel}px`} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
