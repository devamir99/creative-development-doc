"use client";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";
type Mode = "metaphor" | "reveal" | "environment" | "mise";
const TITLES: Record<Mode, string> = { metaphor: "Visual Metaphor", reveal: "Anticipation & Reveal", environment: "Environmental Storytelling", mise: "Mise-en-scène" };
export function StoryVisualPlayground({ initial = "metaphor" }: { initial?: Mode }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [amount, setAmount] = useState(55);
  return (
    <PlaygroundShell title={TITLES[mode]} description="Story without dialogue: a symbol can carry an idea, a covered frame creates anticipation, objects in a room imply a life, staging arranges meaning."
      onReset={() => { setMode(initial); setAmount(55); }} stageLabel="Visual storytelling stage" stageClassName="h-72"
      stage={<div className="relative flex h-full items-center justify-center overflow-hidden bg-[#101012]">
        {mode === "metaphor" && <div className="text-center"><div className="mx-auto rounded-full bg-lab-accent transition-all" style={{ width: 30 + amount, height: 30 + amount, boxShadow: `0 0 ${amount}px #fafa05` }} /><p className="mt-4 font-mono text-xs text-lab-muted">small light growing = hope / idea / dawn</p></div>}
        {mode === "reveal" && <div className="relative h-36 w-64 bg-zinc-800"><div className="absolute inset-0 flex items-center justify-center bg-lab-accent text-black font-bold">REVEAL</div><div className="absolute inset-y-0 left-0 bg-[#101012] transition-all" style={{ width: `${100 - amount}%` }} /></div>}
        {mode === "environment" && <div className="grid grid-cols-3 gap-3">{["⌚ stopped clock", "✉ unopened mail", "🪑 empty chair", "📷 torn photo", "🧳 packed bag", "🕯 burnt candle"].slice(0, 3 + Math.round(amount / 30)).map((x) => <div key={x} className="border border-lab-line bg-zinc-900 p-3 font-mono text-[10px] text-zinc-300">{x}</div>)}</div>}
        {mode === "mise" && <div className="relative h-44 w-72 border border-lab-line bg-zinc-900"><div className="absolute bg-lab-accent transition-all" style={{ width: 24 + amount / 2, height: 60, left: `${18 + amount / 5}%`, top: "24%" }} /><div className="absolute right-5 bottom-5 h-10 w-24 bg-zinc-600" /><span className="absolute top-2 left-2 font-mono text-[10px] text-lab-muted">actor · set · light · space in one frame</span></div>}
      </div>}
      controls={<div className="flex w-full flex-col gap-3"><div className="flex flex-wrap gap-2">{(Object.keys(TITLES) as Mode[]).map((m) => <LabButton key={m} variant="outline" pressed={mode === m} onClick={() => setMode(m)}>{TITLES[m]}</LabButton>)}</div><LabSlider label="Intensity / uncover" min={5} max={95} step={1} value={amount} onChange={setAmount} /><LabReadout label="device:" value={TITLES[mode]} /></div>}
      code={{ language: "js", value: formatSnippet(`story.device = "{{mode}}"; intensity = {{amount}};`, { mode, amount }) }} />
  );
}
export function MetaphorPlayground() { return <StoryVisualPlayground initial="metaphor" />; }
export function RevealPlayground() { return <StoryVisualPlayground initial="reveal" />; }
export function EnvironmentStoryPlayground() { return <StoryVisualPlayground initial="environment" />; }
export function MiseEnScenePlayground() { return <StoryVisualPlayground initial="mise" />; }
