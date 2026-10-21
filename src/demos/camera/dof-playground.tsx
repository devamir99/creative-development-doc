"use client";

import gsap from "gsap";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";
import {
  approxFocusDistance,
  DEFAULT_DOF,
  DOF_SUBJECTS,
  focusZForPlane,
  nearestPlane,
  type DofFocusPlane,
  type DofParams,
} from "./dof-math";

function SceneLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const DofScene = dynamic(
  () => import("./dof-scene").then((m) => m.DofScene),
  {
    ssr: false,
    loading: SceneLoading,
  },
);

const SNIPPET_EN = `// Approx. DOF via postprocessing (not a physical lens)
// Focus plane at world Z = {{focusZ}}
const focusTarget = [0, 0.55, {{focusZ}}];

<DepthOfField
  target={focusTarget}
  focalLength={0.02}
  bokehScale={{bokehScale}}
  worldFocusRange={{focusRange}}
/>`;

const SNIPPET_FA = `// تقریب عمق میدان با postprocessing (نه لنز فیزیکی)
// صفحه فوکوس در world Z = {{focusZ}}
const focusTarget = [0, 0.55, {{focusZ}}];

<DepthOfField
  target={focusTarget}
  focalLength={0.02}
  bokehScale={{bokehScale}}
  worldFocusRange={{focusRange}}
/>`;

const PLANE_LABEL: Record<DofFocusPlane, { en: string; fa: string }> = {
  near: { en: "Near", fa: "نزدیک" },
  mid: { en: "Mid", fa: "میانی" },
  far: { en: "Far", fa: "دور" },
};

export function DofPlayground() {
  const { locale, fa, pick } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const [params, setParams] = useState<DofParams>({ ...DEFAULT_DOF });
  const [enabled, setEnabled] = useState(true);
  const [racking, setRacking] = useState(false);
  const focusProxy = useRef({ z: DEFAULT_DOF.focusZ });

  const distance = useMemo(
    () => approxFocusDistance(params.focusZ),
    [params.focusZ],
  );
  const activePlane = nearestPlane(params.focusZ);

  const stopRack = useCallback(() => {
    gsap.killTweensOf(focusProxy.current);
    setRacking(false);
  }, []);

  useEffect(() => () => {
    gsap.killTweensOf(focusProxy.current);
  }, []);

  const patch = useCallback(
    (partial: Partial<DofParams>) => {
      stopRack();
      setParams((p) => ({ ...p, ...partial }));
    },
    [stopRack],
  );

  const jumpPlane = useCallback(
    (plane: DofFocusPlane) => {
      stopRack();
      const z = focusZForPlane(plane);
      focusProxy.current.z = z;
      setParams((p) => ({ ...p, focusZ: z }));
    },
    [stopRack],
  );

  const startRack = useCallback(() => {
    if (reducedMotion) {
      jumpPlane(activePlane === "far" ? "near" : "far");
      return;
    }
    stopRack();
    setRacking(true);
    focusProxy.current.z = params.focusZ;
    const toFar = activePlane !== "far";
    const endZ = focusZForPlane(toFar ? "far" : "near");
    gsap.to(focusProxy.current, {
      z: endZ,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => {
        setParams((p) => ({ ...p, focusZ: focusProxy.current.z }));
      },
      onComplete: () => setRacking(false),
    });
  }, [reducedMotion, jumpPlane, activePlane, stopRack, params.focusZ]);

  function handleReset() {
    stopRack();
    focusProxy.current.z = DEFAULT_DOF.focusZ;
    setEnabled(true);
    setParams({ ...DEFAULT_DOF });
  }

  const codeValue = formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, {
    focusZ: Number(params.focusZ.toFixed(2)),
    bokehScale: Number(params.bokehScale.toFixed(1)),
    focusRange: Number(params.focusRange.toFixed(2)),
  });

  const description = reducedMotion
    ? pick(
        "Reduced motion: rack animation jumps. DOF here is a post-process approximation — teach focus distance, not physical lens math.",
        "حرکت کاهش‌یافته: انیمیشن تغییر فوکوس می‌پرد. عمق میدان اینجا تقریب پست‌پروسس است — فاصله فوکوس را آموزش بده، نه ریاضی لنز فیزیکی.",
      )
    : pick(
        "Rack focus moves the sharp plane between Near → Far. This is a post-process approximation, not a real thin-lens simulation.",
        "تغییر فوکوس صفحهٔ شارپ را بین نزدیک → دور جابه‌جا می‌کند. این تقریب پست‌پروسس است، نه شبیه‌سازی واقعی لنز نازک.",
      );

  const planeLabel = PLANE_LABEL[activePlane][locale];

  return (
    <PlaygroundShell
      title={pick(
        "Depth of Field / Rack Focus",
        "عمق میدان / تغییر فوکوس",
      )}
      description={description}
      onReset={handleReset}
      onReplay={reducedMotion ? undefined : startRack}
      stageLabel={pick("Depth of field 3D stage", "صحنه سه‌بعدی عمق میدان")}
      stageClassName="h-72 sm:h-80"
      stage={<DofScene params={params} enabled={enabled} />}
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Focus plane presets", "پیش‌تنظیم‌های صفحه فوکوس")}
            className="flex flex-wrap items-center gap-2"
          >
            {(Object.keys(DOF_SUBJECTS) as DofFocusPlane[]).map((plane) => (
              <LabButton
                key={plane}
                pressed={!racking && activePlane === plane}
                variant="outline"
                onClick={() => jumpPlane(plane)}
                disabled={racking}
              >
                {PLANE_LABEL[plane][locale]}
              </LabButton>
            ))}
            <LabButton
              pressed={racking}
              variant={racking ? "solid" : "outline"}
              onClick={startRack}
              disabled={racking}
            >
              {reducedMotion
                ? pick("Jump focus", "پرش فوکوس")
                : pick("Rack focus", "تغییر فوکوس")}
            </LabButton>
            <LabButton
              pressed={!enabled}
              variant="outline"
              onClick={() => {
                stopRack();
                setEnabled((v) => !v);
              }}
            >
              {enabled
                ? pick("DOF on", "عمق میدان روشن")
                : pick("DOF off", "عمق میدان خاموش")}
            </LabButton>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <LabSlider
              label={pick("Focus Z", "فوکوس Z")}
              min={-9}
              max={0.5}
              step={0.05}
              value={Number(params.focusZ.toFixed(2))}
              onChange={(focusZ) => patch({ focusZ })}
              disabled={racking}
            />
            <LabSlider
              label={pick("Bokeh", "بوکه")}
              min={0}
              max={10}
              step={0.1}
              value={params.bokehScale}
              onChange={(bokehScale) => patch({ bokehScale })}
              disabled={!enabled}
            />
            <LabSlider
              label={pick("Focus range", "بازه فوکوس")}
              min={0.2}
              max={4}
              step={0.05}
              value={params.focusRange}
              onChange={(focusRange) => patch({ focusRange })}
              disabled={!enabled}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <LabReadout
              label={pick("plane:", "صفحه:")}
              value={planeLabel}
            />
            <LabReadout
              label={pick("≈ distance:", "≈ فاصله:")}
              value={`${distance.toFixed(2)} u`}
            />
            <LabReadout
              label={pick("effect:", "اثر:")}
              value={
                enabled
                  ? pick("postprocess DOF", "عمق میدان پست‌پروسس")
                  : pick("off (sharp)", "خاموش (شارپ)")
              }
            />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
