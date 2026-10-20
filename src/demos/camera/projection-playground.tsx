"use client";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";
export function ProjectionPlayground() {
  const [mode, setMode] = useState<"persp" | "ortho">("persp");
  const [distance, setDistance] = useState(50);
  const scaleNear = mode === "ortho" ? 1 : 1.35 - distance / 220;
  const scaleFar = mode === "ortho" ? 1 : 0.45 + distance / 260;
  return (
    <PlaygroundShell title="Perspective vs Orthographic" description="Perspective: near bigger, far smaller, lines converge. Orthographic: size ignores distance — diagrams, UI, technical views."
      onReset={() => { setMode("persp"); setDistance(50); }} stageLabel="Projection comparison stage" stageClassName="h-72"
      stage={<div className="relative flex h-full items-center justify-center gap-16 overflow-hidden bg-[#101012]"><svg className="absolute inset-0 h-full w-full opacity-30">{mode === "persp" ? <><line x1="50%" y1="50%" x2="8%" y2="8%" stroke="#fafa05" /><line x1="50%" y1="50%" x2="92%" y2="8%" stroke="#fafa05" /><line x1="50%" y1="50%" x2="8%" y2="92%" stroke="#fafa05" /><line x1="50%" y1="50%" x2="92%" y2="92%" stroke="#fafa05" /></> : <><line x1="20%" y1="8%" x2="20%" y2="92%" stroke="#fafa05" /><line x1="50%" y1="8%" x2="50%" y2="92%" stroke="#fafa05" /><line x1="80%" y1="8%" x2="80%" y2="92%" stroke="#fafa05" /></>}</svg><div className="bg-lab-accent transition-all" style={{ width: 56 * scaleNear, height: 56 * scaleNear }} /><div className="bg-zinc-400 transition-all" style={{ width: 56 * scaleFar, height: 56 * scaleFar }} /><span className="absolute bottom-3 font-mono text-[10px] text-lab-muted">same real size · near vs far</span></div>}
      controls={<div className="flex w-full flex-col gap-3"><div className="flex gap-2"><LabButton variant="outline" pressed={mode === "persp"} onClick={() => setMode("persp")}>Perspective</LabButton><LabButton variant="outline" pressed={mode === "ortho"} onClick={() => setMode("ortho")}>Orthographic</LabButton></div><LabSlider label="Separation" min={0} max={100} step={1} value={distance} onChange={setDistance} disabled={mode === "ortho"} /><LabReadout label="depth cue:" value={mode === "ortho" ? "none — flat/technical" : "strong — spatial"} /></div>}
      code={{ language: "js", value: formatSnippet(`const camera = {{mode}}; // persp shrinks with distance, ortho does not`, { mode }) }} />
  );
}
