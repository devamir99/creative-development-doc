"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";
import {
  BASE_CAMERA_Z,
  BASE_FOV_DEG,
  framingForPush,
} from "./dolly-zoom-math";

function SceneLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const DollyZoomScene = dynamic(
  () => import("./dolly-zoom-scene").then((m) => m.DollyZoomScene),
  { ssr: false, loading: SceneLoading },
);

const SNIPPET_EN = `// Dolly — eye moves, FOV fixed
camera.position.z = {{dollyZ}};
camera.fov = {{dollyFov}};

// Zoom — eye fixed, FOV changes (subject size matched)
camera.position.z = {{zoomZ}};
camera.fov = {{zoomFov}};`;

const SNIPPET_FA = `// دالی — چشم جابه‌جا می‌شود، FOV ثابت
camera.position.z = {{dollyZ}};
camera.fov = {{dollyFov}};

// زوم — چشم ثابت، FOV عوض می‌شود (اندازه سوژه هم‌تراز)
camera.position.z = {{zoomZ}};
camera.fov = {{zoomFov}};`;

const PRESETS = [
  { id: "match", value: 0, label: { en: "Match (0)", fa: "هم‌تراز (0)" } },
  { id: "mild", value: 0.35, label: { en: "Mild", fa: "ملایم" } },
  { id: "strong", value: 0.7, label: { en: "Strong", fa: "قوی" } },
  { id: "max", value: 1, label: { en: "Max", fa: "حداکثر" } },
] as const;

export function DollyZoomPlayground() {
  const { locale, fa, pick } = useLocale();
  const [amount, setAmount] = useState(0.55);
  const framing = useMemo(() => framingForPush(amount), [amount]);

  function handleReset() {
    setAmount(0.55);
  }

  const codeValue = formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, {
    dollyZ: Number(framing.dolly.z.toFixed(2)),
    dollyFov: framing.dolly.fov,
    zoomZ: framing.zoom.z,
    zoomFov: Number(framing.zoom.fov.toFixed(2)),
  });

  return (
    <PlaygroundShell
      title={pick("Dolly vs Zoom", "دالی در برابر زوم")}
      description={pick(
        "Same subject size goal — left moves the eye (dolly), right changes FOV (zoom). Compare pillar parallax and background relationships.",
        "هدف اندازه سوژه یکسان است — چپ چشم را جابه‌جا می‌کند (دالی)، راست FOV را عوض می‌کند (زوم). پارالاکس ستون‌ها و رابطه پس‌زمینه را مقایسه کن.",
      )}
      onReset={handleReset}
      stageLabel={pick(
        "Side-by-side dolly and zoom 3D stages",
        "صحنه‌های سه‌بعدی دالی و زوم کنار هم",
      )}
      stageClassName="h-auto min-h-72"
      stage={
        <div className="grid h-72 grid-cols-1 sm:h-80 sm:grid-cols-2">
          <div className="relative border-b border-lab-line sm:border-r sm:border-b-0">
            <p className="pointer-events-none absolute top-2 left-3 z-10 font-mono text-[10px] tracking-wide text-lab-accent uppercase">
              {pick("Dolly", "دالی")} · z={framing.dolly.z.toFixed(2)} · fov=
              {framing.dolly.fov}°
            </p>
            <DollyZoomScene
              cameraZ={framing.dolly.z}
              fov={framing.dolly.fov}
            />
          </div>
          <div className="relative">
            <p className="pointer-events-none absolute top-2 left-3 z-10 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
              {pick("Zoom", "زوم")} · z={framing.zoom.z.toFixed(2)} · fov=
              {framing.zoom.fov.toFixed(1)}°
            </p>
            <DollyZoomScene
              cameraZ={framing.zoom.z}
              fov={framing.zoom.fov}
            />
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Push amount presets", "پیش‌تنظیم‌های میزان جلو رفتن")}
            className="flex flex-wrap items-center gap-2"
          >
            {PRESETS.map((preset) => (
              <LabButton
                key={preset.id}
                pressed={Math.abs(amount - preset.value) < 0.001}
                variant="outline"
                onClick={() => setAmount(preset.value)}
              >
                {preset.label[locale]}
              </LabButton>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <LabSlider
              className="min-w-[14rem] flex-1"
              label={pick("Push-in amount", "میزان جلو رفتن")}
              min={0}
              max={1}
              step={0.01}
              value={amount}
              onChange={setAmount}
            />
            <LabReadout
              label={pick("baseline:", "پایه:")}
              value={`z=${BASE_CAMERA_Z} · fov=${BASE_FOV_DEG}°`}
            />
          </div>
          <p className="text-xs text-lab-muted">
            {pick(
              "Framing is matched with",
              "فریمینگ با",
            )}{" "}
            <code className="font-mono text-lab-fg">
              z × tan(fov/2) ≈ constant
            </code>
            {pick(
              ". Differences you see are spatial (dolly) vs optical (zoom) — not a fake scale trick.",
              " هم‌تراز می‌شود. تفاوت‌هایی که می‌بینی فضایی (دالی) در برابر نوری (زوم) است — نه یک ترفند مقیاس جعلی.",
            )}
          </p>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
