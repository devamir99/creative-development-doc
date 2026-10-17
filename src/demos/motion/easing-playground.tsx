"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef, useState, type RefObject } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

const TRAVEL_X = 200;
const DEFAULT_DURATION = 0.8;
const DEFAULT_EASE = "power2.out";

const EASE_PRESETS = [
  { label: "none", value: "none" },
  { label: "power2.in", value: "power2.in" },
  { label: "power2.out", value: "power2.out" },
  { label: "power2.inOut", value: "power2.inOut" },
  { label: "back.out", value: "back.out(1.7)" },
] as const;

const DURATION_PRESETS = [
  { label: "0.4s", value: 0.4 },
  { label: "0.8s", value: 0.8 },
  { label: "1.2s", value: 1.2 },
] as const;

const SNIPPET = `gsap.to(el, {
  x: ${TRAVEL_X},
  duration: {{duration}},
  ease: {{ease}},
});`;

const CURVE_W = 280;
const CURVE_H = 120;
const P_MIN = -0.2;
const P_MAX = 1.3;

function progressToY(progress: number) {
  const clamped = Math.min(P_MAX, Math.max(P_MIN, progress));
  const norm = (clamped - P_MIN) / (P_MAX - P_MIN);
  return CURVE_H * (1 - norm);
}

function sampleEasePath(ease: string, steps = 56): string {
  const easeFn = gsap.parseEase(ease);
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = easeFn(t) as number;
    const x = t * CURVE_W;
    const y = progressToY(p);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return d;
}

function MotionLane({
  label,
  boxRef,
  reducedMotion,
  tone,
}: {
  label: string;
  boxRef: RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
  tone: "accent" | "muted";
}) {
  const fill =
    tone === "accent" ? "bg-lab-accent" : "border border-lab-muted bg-transparent";

  return (
    <div className="relative h-14 border-b border-lab-line px-4">
      <p className="absolute top-1 left-4 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
        {label}
      </p>
      <div
        className="absolute inset-x-4 top-[60%] h-px -translate-y-1/2 bg-lab-line"
        aria-hidden
      />
      {reducedMotion ? (
        <div
          className="absolute top-[60%] left-4 size-8 -translate-y-1/2 border border-dashed border-lab-muted/50"
          aria-hidden
        />
      ) : null}
      <div
        ref={boxRef}
        aria-hidden
        className={
          reducedMotion
            ? `absolute top-[60%] left-4 size-8 ${fill}`
            : `absolute top-[60%] left-4 size-8 -translate-y-1/2 ${fill}`
        }
        style={
          reducedMotion
            ? { transform: `translate(${TRAVEL_X}px, -50%)` }
            : undefined
        }
      />
    </div>
  );
}

function EaseCurve({ ease }: { ease: string }) {
  const primary = useMemo(() => sampleEasePath(ease), [ease]);
  const linear = useMemo(() => sampleEasePath("none"), []);

  return (
    <div className="border-b border-lab-line px-4 py-3">
      <p className="mb-2 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
        Curve · progress vs time
      </p>
      <svg
        viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
        className="h-28 w-full max-w-md text-lab-accent"
        role="img"
        aria-label={`Easing curve for ${ease}`}
      >
        <line
          x1={0}
          y1={progressToY(0)}
          x2={CURVE_W}
          y2={progressToY(0)}
          className="stroke-lab-line"
          strokeWidth={1}
        />
        <line
          x1={0}
          y1={progressToY(1)}
          x2={CURVE_W}
          y2={progressToY(1)}
          className="stroke-lab-line"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <path
          d={linear}
          fill="none"
          className="stroke-lab-muted"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.7}
        />
        <path
          d={primary}
          fill="none"
          className="stroke-lab-accent"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="mt-1 font-mono text-[10px] text-lab-muted">
        Solid = selected ease · dashed = linear reference
      </p>
    </div>
  );
}

export function EasingPlayground() {
  const primaryRef = useRef<HTMLDivElement>(null);
  const linearRef = useRef<HTMLDivElement>(null);
  const [ease, setEase] = useState<string>(DEFAULT_EASE);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [replayKey, setReplayKey] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;
      const primary = primaryRef.current;
      const linear = linearRef.current;
      if (!primary || !linear) return;

      gsap.set([primary, linear], { x: 0 });
      gsap.to(primary, {
        x: TRAVEL_X,
        duration,
        ease,
        delay: 0.12,
      });
      gsap.to(linear, {
        x: TRAVEL_X,
        duration,
        ease: "none",
        delay: 0.12,
      });
    },
    { dependencies: [ease, duration, replayKey, reducedMotion] },
  );

  function handleReplay() {
    if (reducedMotion) return;
    setReplayKey((k) => k + 1);
  }

  function handleReset() {
    setEase(DEFAULT_EASE);
    setDuration(DEFAULT_DURATION);
    if (!reducedMotion) setReplayKey((k) => k + 1);
  }

  const codeValue = formatSnippet(SNIPPET, { duration, ease });

  const description = reducedMotion
    ? "Reduced motion is on — curve and end positions stay static. Presets still update the code panel."
    : "Same distance & duration · selected ease vs linear · watch the curve";

  return (
    <PlaygroundShell
      title="Easing Playground"
      description={description}
      onReplay={reducedMotion ? undefined : handleReplay}
      onReset={handleReset}
      stageLabel="Easing comparison stage with motion lanes and curve graph"
      stageClassName="min-h-0"
      stage={
        <>
          <MotionLane
            label={`A · ${ease}`}
            boxRef={primaryRef}
            reducedMotion={reducedMotion}
            tone="accent"
          />
          <MotionLane
            label="B · none (linear)"
            boxRef={linearRef}
            reducedMotion={reducedMotion}
            tone="muted"
          />
          <EaseCurve ease={ease} />
        </>
      }
      controls={
        <>
          <div className="flex w-full flex-col gap-3">
            <div
              role="group"
              aria-label="Ease presets"
              className="flex flex-wrap items-center gap-2"
            >
              {EASE_PRESETS.map((preset) => (
                <LabButton
                  key={preset.value}
                  pressed={ease === preset.value}
                  variant="outline"
                  aria-label={`Set ease to ${preset.label}`}
                  onClick={() => {
                    setEase(preset.value);
                    if (!reducedMotion) setReplayKey((k) => k + 1);
                  }}
                >
                  {preset.label}
                </LabButton>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label="Duration presets"
                className="flex flex-wrap items-center gap-2"
              >
                {DURATION_PRESETS.map((preset) => (
                  <LabButton
                    key={preset.value}
                    pressed={duration === preset.value}
                    variant="outline"
                    aria-label={`Set duration to ${preset.label}`}
                    onClick={() => {
                      setDuration(preset.value);
                      if (!reducedMotion) setReplayKey((k) => k + 1);
                    }}
                  >
                    {preset.label}
                  </LabButton>
                ))}
              </div>
              <LabReadout className="ms-auto" label="ease:" value={ease} />
              <LabReadout label="duration:" value={duration} />
            </div>
          </div>
        </>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
