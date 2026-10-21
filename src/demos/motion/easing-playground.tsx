"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState, type RefObject } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

function EasingSceneLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-40 items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const EasingScene = dynamic(
  () => import("./easing-scene").then((m) => m.EasingScene),
  {
    ssr: false,
    loading: () => <EasingSceneLoading />,
  },
);

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
const CURVE_H = 100;
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
    <div className="relative h-12 border-b border-lab-line px-4">
      <p className="absolute top-1 left-4 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
        {label}
      </p>
      <div
        className="absolute inset-x-4 top-[62%] h-px -translate-y-1/2 bg-lab-line"
        aria-hidden
      />
      <div
        ref={boxRef}
        aria-hidden
        className={`absolute top-[62%] left-4 size-7 ${fill}`}
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
  const { pick } = useLocale();
  const primary = useMemo(() => sampleEasePath(ease), [ease]);
  const linear = useMemo(() => sampleEasePath("none"), []);

  return (
    <div className="border-b border-lab-line px-4 py-2">
      <p className="mb-1 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
        {pick("Curve · progress vs time", "منحنی · پیشرفت در برابر زمان")}
      </p>
      <svg
        viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
        className="h-24 w-full max-w-md text-lab-accent"
        role="img"
        aria-label={pick(
          `Easing curve for ${ease}`,
          `منحنی ایزینگ برای ${ease}`,
        )}
      >
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
        />
      </svg>
    </div>
  );
}

export function EasingPlayground() {
  const { pick } = useLocale();
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

      gsap.set([primary, linear], { x: 0, yPercent: -50 });
      gsap.to(primary, {
        x: TRAVEL_X,
        duration,
        ease,
        delay: 0.08,
      });
      gsap.to(linear, {
        x: TRAVEL_X,
        duration,
        ease: "none",
        delay: 0.08,
      });
    },
    { dependencies: [ease, duration, replayKey, reducedMotion] },
  );

  function bump() {
    if (!reducedMotion) setReplayKey((k) => k + 1);
  }

  const codeValue = formatSnippet(SNIPPET, { duration, ease });

  return (
    <PlaygroundShell
      title={pick("Easing Playground", "دموی ایزینگ")}
      description={pick(
        "Yellow solid = selected ease. Wire box = linear. Same distance & duration — only the curve changes character. Curve graph mirrors the runway.",
        "جعبهٔ زرد توپر = ایزینگ انتخاب‌شده. جعبهٔ خطی = خطی. همان فاصله و مدت — فقط منحنی شخصیت حرکت را عوض می‌کند. نمودار، باند مقایسه را بازتاب می‌دهد.",
      )}
      onReplay={reducedMotion ? undefined : bump}
      onReset={() => {
        setEase(DEFAULT_EASE);
        setDuration(DEFAULT_DURATION);
        bump();
      }}
      stageLabel={pick(
        "Easing WebGL runway and comparison lanes",
        "باند WebGL ایزینگ و خطوط مقایسه",
      )}
      stageClassName="min-h-0"
      stage={
        <>
          <div className="h-44 border-b border-lab-line sm:h-52">
            <EasingScene
              ease={ease}
              duration={duration}
              replayKey={replayKey}
              reducedMotion={reducedMotion}
            />
          </div>
          <MotionLane
            label={pick(`A · ${ease}`, `الف · ${ease}`)}
            boxRef={primaryRef}
            reducedMotion={reducedMotion}
            tone="accent"
          />
          <MotionLane
            label={pick("B · none (linear)", "ب · none (خطی)")}
            boxRef={linearRef}
            reducedMotion={reducedMotion}
            tone="muted"
          />
          <EaseCurve ease={ease} />
        </>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Ease presets", "پیش‌تنظیم‌های ایزینگ")}
            className="flex flex-wrap items-center gap-2"
          >
            {EASE_PRESETS.map((preset) => (
              <LabButton
                key={preset.value}
                pressed={ease === preset.value}
                variant="outline"
                onClick={() => {
                  setEase(preset.value);
                  bump();
                }}
              >
                {preset.label}
              </LabButton>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {DURATION_PRESETS.map((preset) => (
              <LabButton
                key={preset.value}
                pressed={duration === preset.value}
                variant="outline"
                onClick={() => {
                  setDuration(preset.value);
                  bump();
                }}
              >
                {preset.label}
              </LabButton>
            ))}
            <LabReadout className="ms-auto" label={pick("ease:", "ایزینگ:")} value={ease} />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
