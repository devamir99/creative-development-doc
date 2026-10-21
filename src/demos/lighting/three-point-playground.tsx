"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";
import {
  DEFAULT_THREE_POINT,
  type ThreePointParams,
} from "./three-point-math";

function WebglLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const ThreePointScene = dynamic(
  () => import("./three-point-scene").then((m) => m.ThreePointScene),
  {
    ssr: false,
    loading: () => <WebglLoading />,
  },
);

const DEFAULT = DEFAULT_THREE_POINT;

const SNIPPET_EN = `// Classic three-point — teaching intensities, not photometric units
key.intensity = {{key}};
fill.intensity = {{fill}};
rim.intensity = {{rim}};
// keyTemp 0 = cool, 1 = warm (color mix)`;

const SNIPPET_FA = `// سه‌نقطه‌ای کلاسیک — شدت‌های آموزشی، نه واحدهای فتومتریک
key.intensity = {{key}};
fill.intensity = {{fill}};
rim.intensity = {{rim}};
// keyTemp 0 = سرد، 1 = گرم (مخلوط رنگ)`;

export function ThreePointPlayground() {
  const { fa, pick } = useLocale();
  const [params, setParams] = useState<ThreePointParams>({ ...DEFAULT });

  const codeValue = formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, {
    key: params.keyIntensity.toFixed(2),
    fill: params.fillIntensity.toFixed(2),
    rim: params.rimIntensity.toFixed(2),
  });

  const tempFeel =
    params.keyTemp < 0.4
      ? pick("cool", "سرد")
      : params.keyTemp > 0.65
        ? pick("warm", "گرم")
        : pick("neutral", "خنثی");

  return (
    <PlaygroundShell
      title={pick("Three-Point Lighting", "نورپردازی سه‌نقطه‌ای")}
      description={pick(
        "Key shapes form; fill opens shadows; rim separates subject from background. Intensities are teaching knobs — not lux.",
        "کلیدی (Key) فرم می‌سازد؛ پرکننده (Fill) سایه‌ها را باز می‌کند؛ کناری (Rim) سوژه را از پس‌زمینه جدا می‌کند. شدت‌ها دکمهٔ آموزشی‌اند — نه lux.",
      )}
      onReset={() => setParams({ ...DEFAULT })}
      stageLabel={pick(
        "Three-point lighting stage",
        "صحنه نورپردازی سه‌نقطه‌ای",
      )}
      stageClassName="h-72 sm:h-80"
      stage={<ThreePointScene params={params} />}
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Lighting presets", "پیش‌تنظیم‌های نورپردازی")}
            className="flex flex-wrap gap-2"
          >
            <LabButton
              variant="outline"
              onClick={() =>
                setParams({
                  keyIntensity: 1.6,
                  fillIntensity: 0.15,
                  rimIntensity: 1.1,
                  keyTemp: 0.75,
                })
              }
            >
              {pick("Dramatic", "دراماتیک")}
            </LabButton>
            <LabButton
              variant="outline"
              onClick={() =>
                setParams({
                  keyIntensity: 1.1,
                  fillIntensity: 0.7,
                  rimIntensity: 0.4,
                  keyTemp: 0.5,
                })
              }
            >
              {pick("Soft product", "محصول نرم")}
            </LabButton>
            <LabButton
              variant="outline"
              onClick={() => setParams({ ...DEFAULT })}
            >
              {pick("Default", "پیش‌فرض")}
            </LabButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabSlider
              label={pick("Key", "کلیدی (Key)")}
              min={0}
              max={2.5}
              step={0.05}
              value={params.keyIntensity}
              onChange={(keyIntensity) =>
                setParams((p) => ({ ...p, keyIntensity }))
              }
            />
            <LabSlider
              label={pick("Fill", "پرکننده (Fill)")}
              min={0}
              max={1.5}
              step={0.05}
              value={params.fillIntensity}
              onChange={(fillIntensity) =>
                setParams((p) => ({ ...p, fillIntensity }))
              }
            />
            <LabSlider
              label={pick("Rim", "کناری (Rim)")}
              min={0}
              max={2}
              step={0.05}
              value={params.rimIntensity}
              onChange={(rimIntensity) =>
                setParams((p) => ({ ...p, rimIntensity }))
              }
            />
            <LabSlider
              label={pick("Key temp", "دمای کلید (Key temp)")}
              min={0}
              max={1}
              step={0.05}
              value={params.keyTemp}
              onChange={(keyTemp) => setParams((p) => ({ ...p, keyTemp }))}
            />
          </div>
          <LabReadout label={pick("temp:", "دما:")} value={tempFeel} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
