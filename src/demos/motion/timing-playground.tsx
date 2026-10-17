"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const DEFAULT_DURATION = 0.6;

const PRESETS = [
  { label: "0.2s", value: 0.2 },
  { label: "0.6s", value: 0.6 },
  { label: "1.6s", value: 1.6 },
] as const;

const TIMING_SNIPPET = `gsap.to(el, {
  x: 240,
  duration: {{duration}},
  ease: "none",
});`;

export function TimingPlayground() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [replayKey, setReplayKey] = useState(0);

  useGSAP(
    () => {
      const el = boxRef.current;
      if (!el) return;

      gsap.set(el, { x: 0 });
      gsap.to(el, {
        x: 240,
        duration,
        ease: "none",
        delay: 0.15,
      });
    },
    { dependencies: [duration, replayKey] },
  );

  function handleReplay() {
    setReplayKey((k) => k + 1);
  }

  function handleReset() {
    setDuration(DEFAULT_DURATION);
    setReplayKey((k) => k + 1);
  }

  const codeValue = formatSnippet(TIMING_SNIPPET, { duration });

  return (
    <PlaygroundShell
      title="Live Playground"
      description="Same distance · ease none · change only timing"
      onReplay={handleReplay}
      onReset={handleReset}
      stageLabel="Timing motion stage"
      stage={
        <>
          <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-lab-line" />
          <div
            ref={boxRef}
            className="absolute top-1/2 left-4 size-10 -translate-y-1/2 bg-lab-accent"
          />
        </>
      }
      controls={
        <>
          {PRESETS.map((preset) => (
            <LabButton
              key={preset.value}
              pressed={duration === preset.value}
              variant="outline"
              onClick={() => {
                setDuration(preset.value);
                setReplayKey((k) => k + 1);
              }}
            >
              {preset.label}
            </LabButton>
          ))}
          <LabReadout className="ms-auto" label="duration:" value={duration} />
        </>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
