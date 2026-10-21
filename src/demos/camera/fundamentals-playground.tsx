"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

function SceneLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const FundamentalsScene = dynamic(
  () => import("./fundamentals-scene").then((m) => m.FundamentalsScene),
  {
    ssr: false,
    loading: SceneLoading,
  },
);

const SHOTS = [
  {
    id: "wide",
    distance: 9,
    height: 1.4,
    label: { en: "Wide", fa: "واید" },
  },
  {
    id: "medium",
    distance: 5.5,
    height: 1.25,
    label: { en: "Medium", fa: "متوسط" },
  },
  {
    id: "close",
    distance: 3.2,
    height: 1.1,
    label: { en: "Close", fa: "کلوز" },
  },
] as const;

const ANGLES = [
  {
    id: "low",
    height: 0.35,
    label: { en: "Low", fa: "پایین" },
  },
  {
    id: "eye",
    height: 1.25,
    label: { en: "Eye", fa: "چشم" },
  },
  {
    id: "high",
    height: 2.8,
    label: { en: "High", fa: "بالا" },
  },
] as const;

const SNIPPET_EN = `// Shot size ≈ distance · Angle ≈ height
camera.position.set(0, {{height}}, {{distance}});
camera.lookAt(0, 1.1, 0);
camera.fov = {{fov}}; // locked here — see FOV lesson`;

const SNIPPET_FA = `// اندازهٔ نما ≈ فاصله · زاویه ≈ ارتفاع
camera.position.set(0, {{height}}, {{distance}});
camera.lookAt(0, 1.1, 0);
camera.fov = {{fov}}; // اینجا قفل است — درس FOV را ببین`;

export function FundamentalsPlayground() {
  const { locale, fa, pick } = useLocale();
  const [distance, setDistance] = useState(5.5);
  const [height, setHeight] = useState(1.25);
  const fov = 40;

  const shotFeel = useMemo(() => {
    if (distance >= 7.5) {
      return fa ? "واید / معرف" : "wide / establishing";
    }
    if (distance <= 3.8) {
      return fa ? "محدوده کلوزآپ" : "close-up territory";
    }
    return fa ? "متوسط" : "medium";
  }, [distance, fa]);

  const angleFeel = useMemo(() => {
    if (height < 0.7) {
      return fa ? "زاویه پایین (قدرت)" : "low angle (power)";
    }
    if (height > 2.2) {
      return fa ? "زاویه بالا (نمای کلی)" : "high angle (overview)";
    }
    return fa ? "هم‌سطح چشم" : "eye-level";
  }, [height, fa]);

  const codeValue = formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, {
    height: Number(height.toFixed(2)),
    distance: Number(distance.toFixed(2)),
    fov,
  });

  return (
    <PlaygroundShell
      title={pick("Camera Fundamentals", "اصول دوربین")}
      description={pick(
        "Watch only — change shot size (distance) and angle (height). FOV stays locked so you feel spatial framing, not zoom.",
        "فقط ببین — اندازه نما (فاصله) و زاویه (ارتفاع) را عوض کن. FOV قفل می‌ماند تا فریمینگ فضایی را حس کنی، نه زوم.",
      )}
      onReset={() => {
        setDistance(5.5);
        setHeight(1.25);
      }}
      stageLabel={pick(
        "Camera fundamentals 3D stage",
        "صحنه سه‌بعدی اصول دوربین",
      )}
      stageClassName="h-72 sm:h-80"
      stage={
        <FundamentalsScene distance={distance} height={height} fov={fov} />
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Shot size", "اندازه نما")}
            className="flex flex-wrap gap-2"
          >
            {SHOTS.map((s) => (
              <LabButton
                key={s.id}
                variant="outline"
                pressed={Math.abs(distance - s.distance) < 0.2}
                onClick={() => {
                  setDistance(s.distance);
                  setHeight(s.height);
                }}
              >
                {s.label[locale]}
              </LabButton>
            ))}
          </div>
          <div
            role="group"
            aria-label={pick("Camera angle", "زاویه دوربین")}
            className="flex flex-wrap gap-2"
          >
            {ANGLES.map((a) => (
              <LabButton
                key={a.id}
                variant="outline"
                pressed={Math.abs(height - a.height) < 0.15}
                onClick={() => setHeight(a.height)}
              >
                {a.label[locale]}
              </LabButton>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabSlider
              label={pick("Distance", "فاصله")}
              min={2.5}
              max={11}
              step={0.1}
              value={distance}
              onChange={setDistance}
            />
            <LabSlider
              label={pick("Height", "ارتفاع")}
              min={0.2}
              max={3.2}
              step={0.05}
              value={height}
              onChange={setHeight}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <LabReadout label={pick("shot:", "نما:")} value={shotFeel} />
            <LabReadout label={pick("angle:", "زاویه:")} value={angleFeel} />
            <LabReadout
              label="fov:"
              value={pick(`${fov}° locked`, `${fov}° قفل`)}
            />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
