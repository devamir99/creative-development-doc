"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";
import type { CameraMoveMode } from "./camera-movement-scene";

function SceneLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const CameraMovementScene = dynamic(
  () =>
    import("./camera-movement-scene").then((m) => m.CameraMovementScene),
  {
    ssr: false,
    loading: SceneLoading,
  },
);

const MODES: {
  id: CameraMoveMode;
  label: { en: string; fa: string };
  watch: { en: string; fa: string };
  snippet: { en: string; fa: string };
}[] = [
  {
    id: "pan",
    label: { en: "Pan", fa: "پن" },
    watch: {
      en: "Eye stays put — world sweeps left/right (rotation only).",
      fa: "چشم ثابت می‌ماند — دنیا چپ/راست جارو می‌شود (فقط چرخش).",
    },
    snippet: {
      en: `// Pan = yaw the eye, do not translate
camera.position.set(0, 1.35, 6.2);
camera.lookAt(Math.sin(yaw) * 4, 1.1, -Math.cos(yaw) * 2);`,
      fa: `// پن = چرخش افقی چشم، بدون جابه‌جایی
camera.position.set(0, 1.35, 6.2);
camera.lookAt(Math.sin(yaw) * 4, 1.1, -Math.cos(yaw) * 2);`,
    },
  },
  {
    id: "tilt",
    label: { en: "Tilt", fa: "تیلت" },
    watch: {
      en: "Eye stays put — world sweeps up/down.",
      fa: "چشم ثابت می‌ماند — دنیا بالا/پایین جارو می‌شود.",
    },
    snippet: {
      en: `// Tilt = change lookAt.y (or pitch), position fixed
camera.position.set(0, 1.35, 6.2);
camera.lookAt(0, lookY, 0);`,
      fa: `// تیلت = تغییر lookAt.y (یا pitch)، موقعیت ثابت
camera.position.set(0, 1.35, 6.2);
camera.lookAt(0, lookY, 0);`,
    },
  },
  {
    id: "dolly",
    label: { en: "Dolly", fa: "دالی" },
    watch: {
      en: "Eye moves toward subject — mid pillars shift vs hero (parallax).",
      fa: "چشم به سمت سوژه جلو می‌رود — ستون‌های میانی نسبت به قهرمان جابه‌جا می‌شوند (پارالاکس).",
    },
    snippet: {
      en: `// Dolly = translate along Z through space
camera.position.z = MathUtils.lerp(7.5, 3.5, t);
camera.lookAt(0, 1.1, 0);`,
      fa: `// دالی = جابه‌جایی روی Z در فضا
camera.position.z = MathUtils.lerp(7.5, 3.5, t);
camera.lookAt(0, 1.1, 0);`,
    },
  },
  {
    id: "truck",
    label: { en: "Truck", fa: "تراک" },
    watch: {
      en: "Eye slides sideways — background slides against the subject.",
      fa: "چشم به پهلو می‌لغزد — پس‌زمینه در برابر سوژه جابه‌جا می‌شود.",
    },
    snippet: {
      en: `// Truck = translate on X, look-at locked on subject
camera.position.x = MathUtils.lerp(-2.5, 2.5, t);
camera.lookAt(0, 1.1, 0);`,
      fa: `// تراک = جابه‌جایی روی X، look-at قفل روی سوژه
camera.position.x = MathUtils.lerp(-2.5, 2.5, t);
camera.lookAt(0, 1.1, 0);`,
    },
  },
  {
    id: "pedestal",
    label: { en: "Pedestal", fa: "پدستال" },
    watch: {
      en: "Eye rises/falls — height change without relying on tilt alone.",
      fa: "چشم بالا/پایین می‌رود — تغییر ارتفاع بدون اتکا فقط به تیلت.",
    },
    snippet: {
      en: `// Pedestal = translate on Y
camera.position.y = MathUtils.lerp(0.5, 2.7, t);
camera.lookAt(0, lookY, 0);`,
      fa: `// پدستال = جابه‌جایی روی Y
camera.position.y = MathUtils.lerp(0.5, 2.7, t);
camera.lookAt(0, lookY, 0);`,
    },
  },
  {
    id: "orbit",
    label: { en: "Orbit", fa: "چرخش مداری (Orbit)" },
    watch: {
      en: "Eye arcs around subject — far slabs rotate behind the hero.",
      fa: "چشم دور سوژه قوس می‌زند — صفحات دور پشت قهرمان می‌چرخند.",
    },
    snippet: {
      en: `// Orbit = spherical move + fixed lookAt
camera.position.set(Math.sin(az) * r, 1.55, Math.cos(az) * r);
camera.lookAt(0, 1.1, 0);`,
      fa: `// چرخش مداری = حرکت کروی + lookAt ثابت
camera.position.set(Math.sin(az) * r, 1.55, Math.cos(az) * r);
camera.lookAt(0, 1.1, 0);`,
    },
  },
  {
    id: "zoom",
    label: { en: "Zoom", fa: "زوم" },
    watch: {
      en: "FOV only — subject grows, but little relative parallax vs dolly.",
      fa: "فقط FOV — سوژه بزرگ می‌شود، ولی پارالاکس نسبی نسبت به دالی کم است.",
    },
    snippet: {
      en: `// Zoom = FOV change, eye stays
camera.position.set(0, 1.35, 6.2);
camera.fov = MathUtils.lerp(58, 26, t);
camera.updateProjectionMatrix();`,
      fa: `// زوم = تغییر FOV، چشم ثابت
camera.position.set(0, 1.35, 6.2);
camera.fov = MathUtils.lerp(58, 26, t);
camera.updateProjectionMatrix();`,
    },
  },
  {
    id: "handheld",
    label: { en: "Handheld", fa: "دستی (Handheld)" },
    watch: {
      en: "Small irregular noise on position + look — human presence.",
      fa: "نویز نامنظم کوچک روی موقعیت + نگاه — حس حضور انسانی.",
    },
    snippet: {
      en: `// Handheld = tiny noise on position & lookAt
camera.position.add(shake);
camera.lookAt(target.clone().add(lookShake));`,
      fa: `// دستی = نویز ریز روی موقعیت و lookAt
camera.position.add(shake);
camera.lookAt(target.clone().add(lookShake));`,
    },
  },
];

export function CameraMovementPlayground() {
  const { locale, pick } = useLocale();
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<CameraMoveMode>("dolly");
  const [playing, setPlaying] = useState(true);
  const active = MODES.find((m) => m.id === mode)!;
  const label = active.label[locale];
  const watch = active.watch[locale];
  const snippet = active.snippet[locale];

  return (
    <PlaygroundShell
      title={pick("Camera Movement", "حرکت دوربین")}
      description={pick(
        "Real WebGL stage. Yellow figure = subject. Gray pillars mid · dark slabs far. Switch moves and watch whether the eye rotates or travels through space.",
        "صحنه واقعی WebGL. فیگور زرد = سوژه. ستون‌های خاکستری میانی · صفحات تیره دور. حرکت‌ها را عوض کن و ببین چشم می‌چرخد یا در فضا جابه‌جا می‌شود.",
      )}
      onReset={() => {
        setMode("dolly");
        setPlaying(true);
      }}
      onReplay={
        reduced
          ? undefined
          : () => {
              setPlaying(false);
              requestAnimationFrame(() => setPlaying(true));
            }
      }
      stageLabel={pick(
        "Camera movement WebGL stage",
        "صحنه WebGL حرکت دوربین",
      )}
      stageClassName="h-[22rem] sm:h-[26rem]"
      stage={
        <div className="relative h-full w-full">
          <CameraMovementScene
            mode={mode}
            playing={playing && !reduced}
            reducedMotion={reduced}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-3">
            <p className="font-mono text-[11px] leading-snug text-zinc-200">
              <span className="text-lab-accent">{label}</span>
              {" — "}
              {watch}
            </p>
          </div>
          {reduced ? (
            <p className="absolute top-2 left-3 font-mono text-[10px] text-lab-muted">
              {pick(
                "Reduced motion · static teaching pose",
                "حرکت کاهش‌یافته · وضعیت ثابت آموزشی",
              )}
            </p>
          ) : null}
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <LabButton
                key={m.id}
                variant="outline"
                pressed={mode === m.id}
                onClick={() => {
                  setMode(m.id);
                  setPlaying(true);
                }}
              >
                {m.label[locale]}
              </LabButton>
            ))}
          </div>
          {!reduced ? (
            <LabButton
              variant="outline"
              pressed={playing}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing
                ? pick("Pause move", "توقف حرکت")
                : pick("Play move", "پخش حرکت")}
            </LabButton>
          ) : null}
          <LabReadout
            label={pick("watch for:", "مراقب باش:")}
            value={watch}
          />
        </div>
      }
      code={{
        language: "js",
        value: formatSnippet(snippet, {}),
      }}
    />
  );
}
