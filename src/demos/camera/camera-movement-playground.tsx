"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";
gsap.registerPlugin(useGSAP);
type Mode = "pan" | "dolly" | "truck" | "orbit";
const LABEL: Record<Mode, string> = { pan: "Pan — rotation only, eye stays", dolly: "Dolly — eye moves toward subject", truck: "Truck — eye slides sideways", orbit: "Orbit — eye arcs around subject" };
export function CameraMovementPlayground() {
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>("pan");
  const [key, setKey] = useState(0);
  const eyeRef = useRef<HTMLDivElement>(null); const viewRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const eye = eyeRef.current, view = viewRef.current; if (!eye || !view) return;
    gsap.killTweensOf([eye, view]); gsap.set(eye, { x: 0, y: 0, rotate: 0 }); gsap.set(view, { xPercent: 0, scale: 1 });
    if (reduced) { gsap.set(view, { scale: mode === "dolly" ? 1.25 : 1, xPercent: mode === "truck" ? -12 : 0 }); return; }
    if (mode === "pan") { gsap.to(eye, { rotate: 28, duration: 1.4, ease: "power1.inOut", yoyo: true, repeat: 1 }); gsap.to(view, { xPercent: -18, duration: 1.4, ease: "power1.inOut", yoyo: true, repeat: 1 }); }
    if (mode === "dolly") { gsap.to(eye, { y: 54, duration: 1.4, ease: "power1.inOut", yoyo: true, repeat: 1 }); gsap.to(view, { scale: 1.35, duration: 1.4, ease: "power1.inOut", yoyo: true, repeat: 1 }); }
    if (mode === "truck") { gsap.to(eye, { x: 72, duration: 1.4, ease: "power1.inOut", yoyo: true, repeat: 1 }); gsap.to(view, { xPercent: -22, duration: 1.4, ease: "power1.inOut", yoyo: true, repeat: 1 }); }
    if (mode === "orbit") { gsap.to(eye, { x: 64, y: 28, duration: 1.4, ease: "power1.inOut", yoyo: true, repeat: 1 }); gsap.to(view, { xPercent: -14, scale: 1.12, duration: 1.4, ease: "power1.inOut", yoyo: true, repeat: 1 }); }
  }, { dependencies: [mode, key, reduced] });
  return (
    <PlaygroundShell title="Camera Movement" description="Top map = where the eye goes. Bottom strip = what the frame feels like. Pan rotates; dolly/truck/orbit move through space."
      onReset={() => { setMode("pan"); setKey((k) => k + 1); }} onReplay={reduced ? undefined : () => setKey((k) => k + 1)} stageLabel="Camera movement stage" stageClassName="h-72"
      stage={<div className="flex h-full flex-col"><div className="relative flex-1 bg-[#0c0c0e]"><div className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 bg-zinc-500" /><div ref={eyeRef} className="absolute bottom-5 left-[42%] size-5 rounded-full bg-lab-accent" /><span className="absolute top-2 left-3 font-mono text-[10px] text-lab-muted">TOP VIEW · yellow = camera · gray = subject</span></div><div className="relative h-24 overflow-hidden border-t border-lab-line bg-[#141416]"><div ref={viewRef} className="flex h-full items-center gap-6 px-8"><div className="h-14 w-10 shrink-0 bg-zinc-700" /><div className="h-20 w-16 shrink-0 bg-lab-accent" /><div className="h-12 w-24 shrink-0 bg-zinc-600" /></div></div></div>}
      controls={<div className="flex w-full flex-col gap-3"><div className="flex flex-wrap gap-2">{(Object.keys(LABEL) as Mode[]).map((m) => <LabButton key={m} variant="outline" pressed={mode === m} onClick={() => { setMode(m); setKey((k) => k + 1); }}>{m}</LabButton>)}</div><LabReadout label="move:" value={LABEL[mode]} /></div>}
      code={{ language: "js", value: formatSnippet(`// {{mode}}: {{label}}`, { mode, label: LABEL[mode] }) }} />
  );
}
