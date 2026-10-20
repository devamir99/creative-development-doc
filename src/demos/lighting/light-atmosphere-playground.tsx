"use client";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";
type Mode = "types" | "color" | "fog" | "bloom";
const TITLES: Record<Mode, string> = { types: "Light Types", color: "Color & Temperature", fog: "Fog & Atmospheric Depth", bloom: "Bloom & Glow" };
export function LightAtmospherePlayground({ initial = "types" }: { initial?: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [amount, setAmount] = useState(60);
  const warm = amount;
  const bg = mode === "color" ? `linear-gradient(135deg, rgb(${140 + warm},${150},${255 - warm}), rgb(${255},${180 - warm / 3},${90}))` : "#101012";
  return (
    <PlaygroundShell title={TITLES[mode]} description="Ambient fills everything, directional casts direction, point radiates locally, spot makes a cone. Warm/cool, fog, and bloom change mood and depth."
      onReset={() => { setMode(initial); setAmount(60); }} stageLabel="Lighting atmosphere stage" stageClassName="h-72"
      stage={<div className="relative flex h-full items-center justify-center overflow-hidden transition-all" style={{ background: bg }}>
        {mode === "types" && <><div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${amount}% 30%, rgba(250,250,5,.55), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.08), transparent)` }} /><div className="relative size-20 bg-zinc-300 shadow-2xl" /><span className="absolute bottom-3 font-mono text-[10px] text-lab-muted">move intensity = light position/strength metaphor</span></>}
        {mode === "color" && <div className="text-center"><div className="mx-auto size-24 rounded-full" style={{ background: `rgb(${180 + warm},${170},${230 - warm})`, boxShadow: "0 0 50px rgba(255,200,100,.35)" }} /><p className="mt-3 font-mono text-xs text-zinc-200">{warm < 40 ? "cool / night / clinical" : warm > 65 ? "warm / sunset / intimate" : "mixed / neutral"}</p></div>}
        {mode === "fog" && <div className="flex items-end gap-8"><div className="h-28 w-16 bg-lab-accent" /><div className="h-24 w-16 bg-zinc-400" style={{ opacity: 1 - amount / 180, filter: `blur(${amount / 35}px)` }} /><div className="h-32 w-16 bg-zinc-600" style={{ opacity: 1 - amount / 110, filter: `blur(${amount / 18}px)` }} /></div>}
        {mode === "bloom" && <div className="size-20 bg-lab-accent transition-all" style={{ boxShadow: `0 0 ${amount}px ${amount / 2}px rgba(250,250,5,.55)`, filter: `brightness(${1 + amount / 130})` }} />}
      </div>}
      controls={<div className="flex w-full flex-col gap-3"><div className="flex flex-wrap gap-2">{(Object.keys(TITLES) as Mode[]).map((m) => <LabButton key={m} variant="outline" pressed={mode === m} onClick={() => setMode(m)}>{TITLES[m]}</LabButton>)}</div><LabSlider label={mode === "color" ? "Warmth" : "Intensity"} min={0} max={100} step={1} value={amount} onChange={setAmount} /><LabReadout label="look:" value={TITLES[mode]} /></div>}
      code={{ language: "js", value: formatSnippet(`lighting.mode = "{{mode}}"; amount = {{amount}}; // CSS metaphor, not a full renderer`, { mode, amount }) }} />
  );
}
export function LightTypesPlayground() { return <LightAtmospherePlayground initial="types" />; }
export function ColorTemperaturePlayground() { return <LightAtmospherePlayground initial="color" />; }
export function FogBloomPlayground() { return <LightAtmospherePlayground initial="fog" />; }
