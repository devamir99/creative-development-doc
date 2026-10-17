"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

const DEFAULT_DURATION = 0.6;
const TRAVEL_X = 240;

const PRESETS = [
  { label: "0.2s", value: 0.2 },
  { label: "0.6s", value: 0.6 },
  { label: "1.6s", value: 1.6 },
] as const;

const TIMING_SNIPPET = `gsap.to(el, {
  x: ${TRAVEL_X},
  duration: {{duration}},
  ease: "none",
});`;

export function TimingPlayground() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [replayKey, setReplayKey] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = boxRef.current;
      if (!el || reducedMotion) return;

      gsap.set(el, { x: 0 });
      gsap.to(el, {
        x: TRAVEL_X,
        duration,
        ease: "none",
        delay: 0.15,
      });
    },
    { dependencies: [duration, replayKey, reducedMotion] },
  );

  function handleReplay() {
    if (reducedMotion) return;
    setReplayKey((k) => k + 1);
  }

  function handleReset() {
    setDuration(DEFAULT_DURATION);
    if (!reducedMotion) {
      setReplayKey((k) => k + 1);
    }
  }

  const codeValue = formatSnippet(TIMING_SNIPPET, { duration });

  const description = reducedMotion
    ? "Reduced motion is on — stage shows the end position statically. Duration presets still update the readout and code."
    : "Same distance · ease none · change only timing";

  return (
    <PlaygroundShell
      title="Live Playground"
      description={description}
      onReplay={reducedMotion ? undefined : handleReplay}
      onReset={handleReset}
      stageLabel={
        reducedMotion
          ? "Timing stage, static end position due to reduced motion"
          : "Timing motion stage — square travels horizontally"
      }
      stage={
        <>
          <div
            className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-lab-line"
            aria-hidden
          />
          {/* Start marker (ghost) when motion is reduced */}
          {reducedMotion ? (
            <div
              className="absolute top-1/2 left-4 size-10 -translate-y-1/2 border border-dashed border-lab-muted/60"
              aria-hidden
            />
          ) : null}
          <div
            ref={boxRef}
            aria-hidden
            className={
              reducedMotion
                ? "absolute top-1/2 left-4 size-10 bg-lab-accent"
                : "absolute top-1/2 left-4 size-10 -translate-y-1/2 bg-lab-accent"
            }
            style={
              reducedMotion
                ? { transform: `translate(${TRAVEL_X}px, -50%)` }
                : undefined
            }
          />
          {reducedMotion ? (
            <p className="absolute inset-x-4 bottom-3 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
              Static fallback · start (dashed) → end (filled)
            </p>
          ) : null}
        </>
      }
      controls={
        <>
          <div
            role="group"
            aria-label="Duration presets"
            className="flex flex-wrap items-center gap-2"
          >
            {PRESETS.map((preset) => (
              <LabButton
                key={preset.value}
                pressed={duration === preset.value}
                variant="outline"
                aria-label={`Set duration to ${preset.label}`}
                onClick={() => {
                  setDuration(preset.value);
                  if (!reducedMotion) {
                    setReplayKey((k) => k + 1);
                  }
                }}
              >
                {preset.label}
              </LabButton>
            ))}
          </div>
          <LabReadout className="ms-auto" label="duration:" value={duration} />
        </>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
