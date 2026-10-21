"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

type Mode = "types" | "color" | "fog" | "bloom";

const MODES: Mode[] = ["types", "color", "fog", "bloom"];

const SNIPPET_EN = `lighting.mode = "{{mode}}"; amount = {{amount}}; // CSS metaphor, not a full renderer`;
const SNIPPET_FA = `lighting.mode = "{{mode}}"; amount = {{amount}}; // استعاره CSS، نه یک رندرر کامل`;

export function LightAtmospherePlayground({
  initial = "types",
}: {
  initial?: Mode;
}) {
  const { fa, pick } = useLocale();
  const [mode, setMode] = useState<Mode>(initial);
  const [amount, setAmount] = useState(60);
  const warm = amount;
  const bg =
    mode === "color"
      ? `linear-gradient(135deg, rgb(${140 + warm},${150},${255 - warm}), rgb(${255},${180 - warm / 3},${90}))`
      : "#101012";

  const titles: Record<Mode, string> = {
    types: pick("Light Types", "انواع نور"),
    color: pick("Color & Temperature", "رنگ و دمای رنگ"),
    fog: pick("Fog & Atmospheric Depth", "مه و عمق اتمسفری"),
    bloom: pick("Bloom & Glow", "بلوم و درخشش"),
  };

  const colorFeel =
    warm < 40
      ? pick("cool / night / clinical", "سرد / شب / کلینیکال")
      : warm > 65
        ? pick("warm / sunset / intimate", "گرم / غروب / صمیمی")
        : pick("mixed / neutral", "مخلوط / خنثی");

  return (
    <PlaygroundShell
      title={titles[mode]}
      description={pick(
        "Ambient fills everything, directional casts direction, point radiates locally, spot makes a cone. Warm/cool, fog, and bloom change mood and depth.",
        "Ambient همه‌چیز را پر می‌کند، directional جهت می‌دهد، point محلی می‌تابد و spot مخروط می‌سازد. گرم/سرد، مه و بلوم حال‌وهوا و عمق را عوض می‌کنند.",
      )}
      onReset={() => {
        setMode(initial);
        setAmount(60);
      }}
      stageLabel={pick("Lighting atmosphere stage", "صحنه اتمسفر نورپردازی")}
      stageClassName="h-72"
      stage={
        <div
          className="relative flex h-full items-center justify-center overflow-hidden transition-all"
          style={{ background: bg }}
        >
          {mode === "types" && (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${amount}% 30%, rgba(250,250,5,.55), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.08), transparent)`,
                }}
              />
              <div className="relative size-20 bg-zinc-300 shadow-2xl" />
              <span className="absolute bottom-3 font-mono text-[10px] text-lab-muted">
                {pick(
                  "move intensity = light position/strength metaphor",
                  "جابه‌جایی شدت = استعارهٔ موقعیت/قدرت نور",
                )}
              </span>
            </>
          )}
          {mode === "color" && (
            <div className="text-center">
              <div
                className="mx-auto size-24 rounded-full"
                style={{
                  background: `rgb(${180 + warm},${170},${230 - warm})`,
                  boxShadow: "0 0 50px rgba(255,200,100,.35)",
                }}
              />
              <p className="mt-3 font-mono text-xs text-zinc-200">{colorFeel}</p>
            </div>
          )}
          {mode === "fog" && (
            <div className="flex items-end gap-8">
              <div className="h-28 w-16 bg-lab-accent" />
              <div
                className="h-24 w-16 bg-zinc-400"
                style={{
                  opacity: 1 - amount / 180,
                  filter: `blur(${amount / 35}px)`,
                }}
              />
              <div
                className="h-32 w-16 bg-zinc-600"
                style={{
                  opacity: 1 - amount / 110,
                  filter: `blur(${amount / 18}px)`,
                }}
              />
            </div>
          )}
          {mode === "bloom" && (
            <div
              className="size-20 bg-lab-accent transition-all"
              style={{
                boxShadow: `0 0 ${amount}px ${amount / 2}px rgba(250,250,5,.55)`,
                filter: `brightness(${1 + amount / 130})`,
              }}
            />
          )}
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <LabButton
                key={m}
                variant="outline"
                pressed={mode === m}
                onClick={() => setMode(m)}
              >
                {titles[m]}
              </LabButton>
            ))}
          </div>
          <LabSlider
            label={
              mode === "color"
                ? pick("Warmth", "گرما")
                : pick("Intensity", "شدت")
            }
            min={0}
            max={100}
            step={1}
            value={amount}
            onChange={setAmount}
          />
          <LabReadout label={pick("look:", "نما:")} value={titles[mode]} />
        </div>
      }
      code={{
        language: "js",
        value: formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, { mode, amount }),
      }}
    />
  );
}

export function LightTypesPlayground() {
  return <LightAtmospherePlayground initial="types" />;
}
export function ColorTemperaturePlayground() {
  return <LightAtmospherePlayground initial="color" />;
}
export function FogBloomPlayground() {
  return <LightAtmospherePlayground initial="fog" />;
}
