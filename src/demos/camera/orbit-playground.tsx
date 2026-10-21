"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";
import { DEFAULT_ORBIT, orbitPose, type OrbitParams } from "./orbit-math";

function SceneLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const OrbitScene = dynamic(
  () => import("./orbit-scene").then((m) => m.OrbitScene),
  {
    ssr: false,
    loading: SceneLoading,
  },
);

const ANGLE_PRESETS = [
  {
    id: "front",
    azimuthDeg: 0,
    elevationDeg: 12,
    label: { en: "Front", fa: "روبه‌رو" },
  },
  {
    id: "three-quarter-l",
    azimuthDeg: -40,
    elevationDeg: 18,
    label: { en: "¾ L", fa: "¾ چپ" },
  },
  {
    id: "three-quarter-r",
    azimuthDeg: 40,
    elevationDeg: 18,
    label: { en: "¾ R", fa: "¾ راست" },
  },
  {
    id: "high",
    azimuthDeg: 25,
    elevationDeg: 55,
    label: { en: "High", fa: "بالا" },
  },
] as const;

const SNIPPET_EN = `// Spherical orbit around the subject
const phi = ((90 - {{elevationDeg}}) * Math.PI) / 180;
const theta = ({{azimuthDeg}} * Math.PI) / 180;
camera.position.set(
  {{x}},
  {{y}},
  {{z}},
);
camera.lookAt(0, 1.1, 0);
camera.fov = {{fov}};`;

const SNIPPET_FA = `// چرخش مداری کروی دور سوژه
const phi = ((90 - {{elevationDeg}}) * Math.PI) / 180;
const theta = ({{azimuthDeg}} * Math.PI) / 180;
camera.position.set(
  {{x}},
  {{y}},
  {{z}},
);
camera.lookAt(0, 1.1, 0);
camera.fov = {{fov}};`;

export function OrbitPlayground() {
  const { locale, fa, pick } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const [params, setParams] = useState<OrbitParams>({ ...DEFAULT_ORBIT });
  const [autoRotate, setAutoRotate] = useState(false);

  const pose = useMemo(() => orbitPose(params), [params]);
  const rotating = autoRotate && !reducedMotion;

  const handleAutoAzimuthCommit = useCallback((azimuthDeg: number) => {
    setParams((p) => ({ ...p, azimuthDeg: Number(azimuthDeg.toFixed(1)) }));
  }, []);

  function handleReset() {
    setAutoRotate(false);
    setParams({ ...DEFAULT_ORBIT });
  }

  function patch(partial: Partial<OrbitParams>) {
    setAutoRotate(false);
    setParams((p) => ({ ...p, ...partial }));
  }

  const codeValue = formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, {
    elevationDeg: Number(params.elevationDeg.toFixed(1)),
    azimuthDeg: Number(params.azimuthDeg.toFixed(1)),
    x: Number(pose.position[0].toFixed(2)),
    y: Number(pose.position[1].toFixed(2)),
    z: Number(pose.position[2].toFixed(2)),
    fov: params.fov,
  });

  const description = reducedMotion
    ? pick(
        "Reduced motion: auto-orbit disabled. Drag azimuth / elevation / radius — eye moves on a sphere, look-at stays on the subject.",
        "حرکت کاهش‌یافته: چرخش خودکار غیرفعال است. آزیموت / ارتفاع / شعاع را بکش — چشم روی کره حرکت می‌کند، look-at روی سوژه می‌ماند.",
      )
    : pick(
        "Orbit = eye travels on a sphere around a fixed look-at. FOV stays put so you only study spatial move.",
        "چرخش مداری (Orbit) = چشم روی کره‌ای دور look-at ثابت حرکت می‌کند. FOV ثابت می‌ماند تا فقط حرکت فضایی را بررسی کنی.",
      );

  return (
    <PlaygroundShell
      title={pick("Orbit Playground", "دموی چرخش مداری (Orbit)")}
      description={description}
      onReset={handleReset}
      stageLabel={pick("Orbit camera 3D stage", "صحنه سه‌بعدی دوربین مداری")}
      stageClassName="h-72 sm:h-80"
      stage={
        <OrbitScene
          params={params}
          autoRotate={rotating}
          onAutoAzimuthCommit={handleAutoAzimuthCommit}
        />
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Orbit angle presets", "پیش‌تنظیم‌های زاویه مدار")}
            className="flex flex-wrap items-center gap-2"
          >
            {ANGLE_PRESETS.map((preset) => (
              <LabButton
                key={preset.id}
                pressed={
                  !rotating &&
                  Math.abs(params.azimuthDeg - preset.azimuthDeg) < 0.5 &&
                  Math.abs(params.elevationDeg - preset.elevationDeg) < 0.5
                }
                variant="outline"
                onClick={() =>
                  patch({
                    azimuthDeg: preset.azimuthDeg,
                    elevationDeg: preset.elevationDeg,
                  })
                }
              >
                {preset.label[locale]}
              </LabButton>
            ))}
            {!reducedMotion ? (
              <LabButton
                pressed={rotating}
                variant={rotating ? "solid" : "outline"}
                onClick={() => setAutoRotate((v) => !v)}
              >
                {rotating
                  ? pick("Auto on", "خودکار روشن")
                  : pick("Auto orbit", "چرخش خودکار")}
              </LabButton>
            ) : null}
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <LabSlider
              label={pick("Azimuth", "آزیموت")}
              unit="°"
              min={-180}
              max={180}
              step={1}
              value={Number(params.azimuthDeg.toFixed(0))}
              onChange={(azimuthDeg) => patch({ azimuthDeg })}
              disabled={rotating}
            />
            <LabSlider
              label={pick("Elevation", "ارتفاع زاویه‌ای")}
              unit="°"
              min={-5}
              max={80}
              step={1}
              value={params.elevationDeg}
              onChange={(elevationDeg) => patch({ elevationDeg })}
            />
            <LabSlider
              label={pick("Radius", "شعاع")}
              min={3}
              max={10}
              step={0.1}
              value={params.radius}
              onChange={(radius) => patch({ radius })}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <LabReadout
              label={pick("pos:", "موقعیت:")}
              value={pose.position.map((n) => n.toFixed(2)).join(", ")}
            />
            <LabReadout
              label="fov:"
              value={pick(
                `${params.fov}° (fixed)`,
                `${params.fov}° (ثابت)`,
              )}
            />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
