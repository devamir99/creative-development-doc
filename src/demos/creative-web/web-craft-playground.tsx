"use client";
import { useEffect, useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";
type Mode = "timeline" | "shader" | "performance" | "page";
const TITLES: Record<Mode, string> = { timeline: "GSAP Timeline", shader: "Shader Thinking", performance: "Performance Budget", page: "Page Transition" };
export function WebCraftPlayground({ initial = "timeline" }: { initial?: Mode }) {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>(initial);
  const [amount, setAmount] = useState(50);
  const [tick, setTick] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (mode !== "shader" || reduced) return;
    let last = performance.now();
    const loop = (now: number) => { if (now - last > 50) { setTick((t) => t + 1); last = now; } raf.current = requestAnimationFrame(loop); };
    raf.current = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf.current);
  }, [mode, reduced]);
  const hue = (tick * 8 + amount * 2) % 360;
  return (
    <PlaygroundShell title={TITLES[mode]} description="Timelines sequence beats, shaders compute color per pixel, performance is a budget, page transitions hide loading behind meaning."
      onReset={() => { setMode(initial); setAmount(50); }} stageLabel="Creative web craft stage" stageClassName="h-72"
      stage={<div className="relative flex h-full items-center justify-center overflow-hidden bg-[#0d0d0f]">
        {mode === "timeline" && <div className="w-64"><div className="flex gap-1">{[0, 1, 2, 3].map((i) => <div key={i} className="h-3 flex-1" style={{ background: amount / 25 > i ? "#fafa05" : "#3f3f46" }} />)}</div><p className="mt-4 font-mono text-xs text-lab-muted">drag strength = playhead through intro → hero → detail → CTA</p></div>}
        {mode === "shader" && <div className="h-36 w-64 transition-all" style={{ background: `linear-gradient(${hue}deg, hsl(${hue} 90% 55%), hsl(${(hue + 90) % 360} 90% 45%), hsl(${(hue + 180) % 360} 80% 35%))`, filter: `saturate(${1 + amount / 80})` }}><p className="p-3 font-mono text-[10px] text-white/80">color = f(position, time) — CSS stand-in for GLSL</p></div>}
        {mode === "performance" && <div className="grid grid-cols-8 gap-1">{Array.from({ length: Math.round(amount * 1.2) }).map((_, i) => <span key={i} className="size-3 bg-lab-accent" style={{ opacity: 0.35 + (i % 5) / 8 }} />)}<p className="col-span-8 mt-3 font-mono text-xs text-lab-muted">{Math.round(amount * 1.2)} animated objects — more is not free</p></div>}
        {mode === "page" && <div className="relative h-36 w-64 overflow-hidden border border-lab-line bg-zinc-900"><div className="absolute inset-0 flex items-center justify-center text-lab-fg">{amount > 50 ? "NEW PAGE" : "OLD PAGE"}</div><div className="absolute inset-y-0 left-0 bg-lab-accent transition-all" style={{ width: `${amount}%`, opacity: 0.9 }} /></div>}
      </div>}
      controls={<div className="flex w-full flex-col gap-3"><div className="flex flex-wrap gap-2">{(Object.keys(TITLES) as Mode[]).map((m) => <LabButton key={m} variant="outline" pressed={mode === m} onClick={() => setMode(m)}>{TITLES[m]}</LabButton>)}</div><LabSlider label="Progress / amount" min={0} max={100} step={1} value={amount} onChange={setAmount} /><LabReadout label="concept:" value={TITLES[mode]} /></div>}
      code={{ language: "js", value: formatSnippet(`web.concept = "{{mode}}"; amount = {{amount}};`, { mode, amount }) }} />
  );
}
export function TimelinePlayground() { return <WebCraftPlayground initial="timeline" />; }
export function ShaderPlayground() { return <WebCraftPlayground initial="shader" />; }
export function PerformancePlayground() { return <WebCraftPlayground initial="performance" />; }
export function PageTransitionPlayground() { return <WebCraftPlayground initial="page" />; }
