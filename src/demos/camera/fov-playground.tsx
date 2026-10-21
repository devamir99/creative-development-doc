"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

const DEFAULT_FOV = 40;

const FOV_PRESETS = [
  {
    value: 28,
    label: { en: "28° tele", fa: "28° تله" },
  },
  {
    value: 40,
    label: { en: "40° normal", fa: "40° نرمال" },
  },
  {
    value: 75,
    label: { en: "75° wide", fa: "75° واید" },
  },
] as const;

const SNIPPET = `<PerspectiveCamera
  makeDefault
  position={[0, 1.25, 6]}
  fov={{fov}}
/>`;

function SceneLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const FovScene = dynamic(
  () => import("./fov-scene").then((m) => m.FovScene),
  {
    ssr: false,
    loading: SceneLoading,
  },
);

export function FovPlayground() {
  const { locale, pick } = useLocale();
  const [fov, setFov] = useState(DEFAULT_FOV);

  function handleReset() {
    setFov(DEFAULT_FOV);
  }

  const codeValue = formatSnippet(SNIPPET, { fov });

  return (
    <PlaygroundShell
      title={pick("FOV Playground", "دموی میدان دید (FOV)")}
      description={pick(
        "Camera position locked — only FOV changes. Watch perspective stretch vs compression on the depth set.",
        "موقعیت دوربین قفل است — فقط FOV عوض می‌شود. کشیدگی در برابر فشردگی پرسپکتیو را روی مجموعه عمق ببین.",
      )}
      onReset={handleReset}
      stageLabel={pick(
        "Field of view 3D stage",
        "صحنه سه‌بعدی میدان دید",
      )}
      stageClassName="h-72 sm:h-80"
      stage={<FovScene fov={fov} />}
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("FOV presets", "پیش‌تنظیم‌های FOV")}
            className="flex flex-wrap items-center gap-2"
          >
            {FOV_PRESETS.map((preset) => {
              const label = preset.label[locale];
              return (
                <LabButton
                  key={preset.value}
                  pressed={fov === preset.value}
                  variant="outline"
                  aria-label={pick(
                    `Set field of view to ${preset.label.en}`,
                    `تنظیم میدان دید روی ${preset.label.fa}`,
                  )}
                  onClick={() => setFov(preset.value)}
                >
                  {label}
                </LabButton>
              );
            })}
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <LabSlider
              className="min-w-[14rem] flex-1"
              label={pick("Field of view", "میدان دید")}
              unit="°"
              min={20}
              max={90}
              step={1}
              value={fov}
              onChange={setFov}
            />
            <LabReadout label="fov:" value={`${fov}°`} />
          </div>
        </div>
      }
      code={{ language: "tsx", value: codeValue }}
    />
  );
}
