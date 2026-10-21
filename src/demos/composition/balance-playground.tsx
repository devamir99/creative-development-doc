"use client";

import { useMemo, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

type BalanceMode = "sym" | "asym" | "radial";

/** Crude “weight” = area * contrast factor for teaching readout. */
function weight(size: number, contrast: number) {
  return size * size * contrast;
}

const SNIPPET_EN = `// Asymmetry: large quiet mass vs small loud accent
left.weight ≈ {{leftW}}
right.weight ≈ {{rightW}}
// Balance ≠ equal size — equal *perceived* weight`;

const SNIPPET_FA = `// عدم تقارن: جرم آرام بزرگ در برابر تأکید کوچک و پررنگ
left.weight ≈ {{leftW}}
right.weight ≈ {{rightW}}
// تعادل ≠ اندازهٔ برابر — وزن *ادراک‌شده* برابر`;

export function BalancePlayground() {
  const { pick } = useLocale();
  const [mode, setMode] = useState<BalanceMode>("asym");
  const [leftSize, setLeftSize] = useState(72);
  const [rightSize, setRightSize] = useState(36);
  const [rightContrast, setRightContrast] = useState(1.35);

  const leftW = useMemo(() => weight(leftSize, 0.7), [leftSize]);
  const rightW = useMemo(
    () => weight(rightSize, rightContrast),
    [rightSize, rightContrast],
  );
  const ratio = rightW / Math.max(leftW, 1);

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {
    leftW: Math.round(leftW),
    rightW: Math.round(rightW),
  });

  const modeButtons: { id: BalanceMode; label: string }[] = [
    { id: "sym", label: pick("Symmetrical", "متقارن") },
    { id: "asym", label: pick("Asymmetrical", "نامتقارن") },
    { id: "radial", label: pick("Radial", "شعاعی") },
  ];

  return (
    <PlaygroundShell
      title={pick("Balance / Weight", "تعادل بصری / وزن")}
      description={pick(
        "Symmetry is one kind of balance. Here a large muted block can balance a small high-contrast accent.",
        "تقارن یک نوع تعادل است. اینجا یک بلوک بزرگ و ملایم می‌تواند تأکید کوچک با کنتراست بالا را متعادل کند.",
      )}
      onReset={() => {
        setMode("asym");
        setLeftSize(72);
        setRightSize(36);
        setRightContrast(1.35);
      }}
      stageLabel={pick("Balance composition stage", "صحنهٔ ترکیب‌بندی تعادل")}
      stageClassName="h-72 sm:h-80"
      stage={
        <div className="relative flex h-full items-center justify-center bg-[#101012]">
          <div className="pointer-events-none absolute inset-y-4 left-1/2 w-px bg-lab-line/60" />
          {mode === "radial" ? (
            <div className="relative size-40">
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-zinc-500"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-56px)`,
                  }}
                />
              ))}
              <div className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lab-accent" />
            </div>
          ) : mode === "sym" ? (
            <div className="flex w-full max-w-md items-center justify-between px-10">
              <div
                className="bg-zinc-500"
                style={{ width: leftSize, height: leftSize * 0.7 }}
              />
              <div
                className="bg-zinc-500"
                style={{ width: leftSize, height: leftSize * 0.7 }}
              />
            </div>
          ) : (
            <div className="flex w-full max-w-lg items-center justify-between px-8">
              <div
                className="bg-zinc-600"
                style={{ width: leftSize, height: leftSize * 0.85 }}
              />
              <div
                className="bg-lab-accent"
                style={{
                  width: rightSize,
                  height: rightSize,
                  filter: `contrast(${rightContrast})`,
                }}
              />
            </div>
          )}
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Balance mode", "حالت تعادل")}
            className="flex flex-wrap gap-2"
          >
            {modeButtons.map((m) => (
              <LabButton
                key={m.id}
                pressed={mode === m.id}
                variant="outline"
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </LabButton>
            ))}
          </div>
          {mode === "asym" ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <LabSlider
                label={pick("Left size", "اندازهٔ چپ")}
                min={40}
                max={100}
                step={1}
                value={leftSize}
                onChange={setLeftSize}
              />
              <LabSlider
                label={pick("Accent size", "اندازهٔ تأکید")}
                min={20}
                max={64}
                step={1}
                value={rightSize}
                onChange={setRightSize}
              />
              <LabSlider
                label={pick("Accent contrast", "کنتراست تأکید")}
                min={0.8}
                max={1.8}
                step={0.05}
                value={rightContrast}
                onChange={setRightContrast}
              />
            </div>
          ) : mode === "sym" ? (
            <LabSlider
              label={pick("Block size", "اندازهٔ بلوک")}
              min={40}
              max={100}
              step={1}
              value={leftSize}
              onChange={setLeftSize}
            />
          ) : (
            <p className="font-mono text-xs text-lab-muted">
              {pick(
                "Radial: equal satellites around a center — calm orbit, not left/right weighing.",
                "شعاعی: ماهواره‌های برابر حول مرکز — مدار آرام، نه وزن‌کشی چپ/راست.",
              )}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            <LabReadout
              label={pick("L weight≈", "وزن چپ≈")}
              value={`${Math.round(leftW)}`}
            />
            <LabReadout
              label={pick("R weight≈", "وزن راست≈")}
              value={`${Math.round(rightW)}`}
            />
            <LabReadout label="R/L≈" value={ratio.toFixed(2)} />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
