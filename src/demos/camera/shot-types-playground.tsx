"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";
import type { ShotAngle } from "./shot-types-scene";

function SceneLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const ShotTypesScene = dynamic(
  () => import("./shot-types-scene").then((m) => m.ShotTypesScene),
  {
    ssr: false,
    loading: SceneLoading,
  },
);

const ANGLE_LABEL: Record<ShotAngle, { en: string; fa: string }> = {
  low: { en: "low", fa: "پایین" },
  eye: { en: "eye", fa: "چشم" },
  high: { en: "high", fa: "بالا" },
};

const ANGLE_COPY: Record<ShotAngle, { en: string; fa: string }> = {
  low: {
    en: "Low angle — subject reads monumental / powerful",
    fa: "زاویه پایین — سوژه عظیم / قدرتمند خوانده می‌شود",
  },
  eye: {
    en: "Eye-level — neutral observer",
    fa: "هم‌سطح چشم — ناظر خنثی",
  },
  high: {
    en: "High angle — subject reads vulnerable / mapped",
    fa: "زاویه بالا — سوژه آسیب‌پذیر / نقشه‌گونه خوانده می‌شود",
  },
};

function shotLabel(framing: number, fa: boolean) {
  if (framing < 0.22) {
    return fa
      ? "واید / معرف — اول جغرافیا"
      : "Wide / establishing — geography first";
  }
  if (framing < 0.45) {
    return fa
      ? "تمام‌قد / واید-متوسط — بدن در فضا"
      : "Full / wide-medium — body in space";
  }
  if (framing < 0.7) {
    return fa
      ? "متوسط — کنش و ژست"
      : "Medium — action & gesture";
  }
  if (framing < 0.88) {
    return fa
      ? "کلوزآپ — احساس و جزئیات"
      : "Close-up — emotion & detail";
  }
  return fa
    ? "اکستریم کلوز — جدا کردن یک ویژگی"
    : "Extreme close — isolate a feature";
}

const SNIPPET_EN = `// Shot size ≈ camera distance (FOV held)
const distance = lerp(11.5, 2.35, {{framing}});
camera.position.set(0, {{camY}}, distance);
camera.lookAt(0, {{lookY}}, 0);
// angle={{angle}} · {{shot}}`;

const SNIPPET_FA = `// اندازهٔ نما ≈ فاصلهٔ دوربین (FOV ثابت)
const distance = lerp(11.5, 2.35, {{framing}});
camera.position.set(0, {{camY}}, distance);
camera.lookAt(0, {{lookY}}, 0);
// زاویه={{angle}} · {{shot}}`;

export function ShotTypesPlayground() {
  const { locale, fa, pick } = useLocale();
  const [framing, setFraming] = useState(0.48);
  const [angle, setAngle] = useState<ShotAngle>("eye");

  const shot = useMemo(() => shotLabel(framing, fa), [framing, fa]);
  const camY = angle === "low" ? 0.35 : angle === "high" ? 3.4 : 1.4;
  const lookY = angle === "low" ? 1.55 : angle === "high" ? 0.85 : 1.15;
  const angleCopy = ANGLE_COPY[angle][locale];
  const shotAccent = shot.split("—")[0]?.trim() ?? shot;

  return (
    <PlaygroundShell
      title={pick("Shot Size & Angle", "اندازه نما و زاویه")}
      description={pick(
        "Same lit 3D set, different eye. Size moves the camera closer/farther. Angle changes height and look-at — power, not just decoration.",
        "همان مجموعه سه‌بعدی روشن، چشم متفاوت. اندازه دوربین را نزدیک‌تر/دورتر می‌برد. زاویه ارتفاع و look-at را عوض می‌کند — قدرت، نه فقط تزئین.",
      )}
      onReset={() => {
        setFraming(0.48);
        setAngle("eye");
      }}
      stageLabel={pick(
        "Shot size and angle WebGL stage",
        "صحنه WebGL اندازه نما و زاویه",
      )}
      stageClassName="h-[22rem] sm:h-[26rem]"
      stage={
        <div className="relative h-full w-full">
          <ShotTypesScene framing={framing} angle={angle} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-10 pb-3">
            <p className="font-mono text-[11px] leading-snug text-zinc-200">
              <span className="text-lab-accent">{shotAccent}</span>
              {" · "}
              {angleCopy}
            </p>
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {(["low", "eye", "high"] as const).map((a) => (
              <LabButton
                key={a}
                variant="outline"
                pressed={angle === a}
                onClick={() => setAngle(a)}
              >
                {ANGLE_LABEL[a][locale]}
              </LabButton>
            ))}
          </div>
          <LabSlider
            label={pick("Framing (wide → close)", "فریمینگ (واید → کلوز)")}
            unit="%"
            min={0}
            max={100}
            step={1}
            value={Math.round(framing * 100)}
            onChange={(v) => setFraming(v / 100)}
          />
          <LabReadout
            label={pick("reads as:", "خوانده می‌شود:")}
            value={shot}
          />
        </div>
      }
      code={{
        language: "js",
        value: formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, {
          framing: Number(framing.toFixed(2)),
          camY,
          lookY,
          angle,
          shot,
        }),
      }}
    />
  );
}
