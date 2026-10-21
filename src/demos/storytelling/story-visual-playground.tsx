"use client";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";
type Mode = "metaphor" | "reveal" | "environment" | "mise";
const MODES: Mode[] = ["metaphor", "reveal", "environment", "mise"];
export function StoryVisualPlayground({ initial = "metaphor" }: { initial?: Mode }) {
  const { pick } = useLocale();
  const [mode, setMode] = useState<Mode>(initial);
  const [amount, setAmount] = useState(55);
  const titles: Record<Mode, string> = {
    metaphor: pick("Visual Metaphor", "استعاره بصری"),
    reveal: pick("Anticipation & Reveal", "پیش‌آمادگی و آشکارسازی"),
    environment: pick("Environmental Storytelling", "داستان‌گویی محیطی"),
    mise: pick("Mise-en-scène", "میزانسن"),
  };
  const environmentItems = [
    pick("⌚ stopped clock", "⌚ ساعتِ ایستاده"),
    pick("✉ unopened mail", "✉ نامه بازنشده"),
    pick("🪑 empty chair", "🪑 صندلی خالی"),
    pick("📷 torn photo", "📷 عکس پاره‌شده"),
    pick("🧳 packed bag", "🧳 چمدان بسته‌شده"),
    pick("🕯 burnt candle", "🕯 شمع سوخته"),
  ];
  return (
    <PlaygroundShell title={titles[mode]} description={pick("Story without dialogue: a symbol can carry an idea, a covered frame creates anticipation, objects in a room imply a life, staging arranges meaning.", "داستان بدون دیالوگ: یک نماد می‌تواند حامل یک ایده باشد، قابی پوشیده پیش‌آمادگی می‌سازد، اشیای یک اتاق به یک زندگی اشاره می‌کنند و میزانسن معنا را می‌چیند.")}
      onReset={() => { setMode(initial); setAmount(55); }} stageLabel={pick("Visual storytelling stage", "صحنه داستان‌گویی بصری")} stageClassName="h-72"
      stage={<div className="relative flex h-full items-center justify-center overflow-hidden bg-[#101012]">
        {mode === "metaphor" && <div className="text-center"><div className="mx-auto rounded-full bg-lab-accent transition-all" style={{ width: 30 + amount, height: 30 + amount, boxShadow: `0 0 ${amount}px #fafa05` }} /><p className="mt-4 font-mono text-xs text-lab-muted">{pick("small light growing = hope / idea / dawn", "نوری کوچک که بزرگ می‌شود = امید / ایده / سپیده‌دم")}</p></div>}
        {mode === "reveal" && <div className="relative h-36 w-64 bg-zinc-800"><div className="absolute inset-0 flex items-center justify-center bg-lab-accent text-black font-bold">{pick("REVEAL", "آشکارسازی")}</div><div className="absolute inset-y-0 left-0 bg-[#101012] transition-all" style={{ width: `${100 - amount}%` }} /></div>}
        {mode === "environment" && <div className="grid grid-cols-3 gap-3">{environmentItems.slice(0, 3 + Math.round(amount / 30)).map((x) => <div key={x} className="border border-lab-line bg-zinc-900 p-3 font-mono text-[10px] text-zinc-300">{x}</div>)}</div>}
        {mode === "mise" && <div className="relative h-44 w-72 border border-lab-line bg-zinc-900"><div className="absolute bg-lab-accent transition-all" style={{ width: 24 + amount / 2, height: 60, left: `${18 + amount / 5}%`, top: "24%" }} /><div className="absolute right-5 bottom-5 h-10 w-24 bg-zinc-600" /><span className="absolute top-2 left-2 font-mono text-[10px] text-lab-muted">{pick("actor · set · light · space in one frame", "بازیگر · دکور · نور · فضا در یک قاب")}</span></div>}
      </div>}
      controls={<div className="flex w-full flex-col gap-3"><div className="flex flex-wrap gap-2">{MODES.map((m) => <LabButton key={m} variant="outline" pressed={mode === m} onClick={() => setMode(m)}>{titles[m]}</LabButton>)}</div><LabSlider label={pick("Intensity / uncover", "شدت / میزان آشکارسازی")} min={5} max={95} step={1} value={amount} onChange={setAmount} /><LabReadout label={pick("device:", "ابزار روایی:")} value={titles[mode]} /></div>}
      code={{ language: "js", value: formatSnippet(`story.device = "{{mode}}"; intensity = {{amount}};`, { mode, amount }) }} />
  );
}
export function MetaphorPlayground() { return <StoryVisualPlayground initial="metaphor" />; }
export function RevealPlayground() { return <StoryVisualPlayground initial="reveal" />; }
export function EnvironmentStoryPlayground() { return <StoryVisualPlayground initial="environment" />; }
export function MiseEnScenePlayground() { return <StoryVisualPlayground initial="mise" />; }
