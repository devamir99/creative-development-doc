"use client";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";
const SNIPPET = `// Shot size is framing, not only zoom
shot = "{{shot}}"; angle = "{{angle}}";
// Wide=geography · Medium=action · Close=emotion`;
export function ShotTypesPlayground() {
  const [size, setSize] = useState(55);
  const [angle, setAngle] = useState<"low" | "eye" | "high">("eye");
  const shot = size < 35 ? "Wide / establishing" : size < 70 ? "Medium" : "Close-up";
  const subjectH = 30 + size * 1.4;
  const tilt = angle === "low" ? "perspective(300px) rotateX(18deg)" : angle === "high" ? "perspective(300px) rotateX(-18deg)" : "none";
  return (
    <PlaygroundShell title="Shot Size & Angle" description="Drag size: geography → action → emotion. Angle changes power: low makes the subject monumental, high makes it vulnerable."
      onReset={() => { setSize(55); setAngle("eye"); }} stageLabel="Shot size and angle stage" stageClassName="h-72"
      stage={<div className="relative flex h-full items-end justify-center overflow-hidden bg-[#101012]"><div className="absolute inset-x-0 bottom-0 h-16 bg-zinc-800/60" /><div className="absolute bottom-16 left-[15%] h-24 w-10 bg-zinc-700" /><div className="absolute right-[15%] bottom-16 h-32 w-12 bg-zinc-800" /><div className="mb-16 bg-lab-accent transition-all" style={{ width: subjectH * 0.62, height: subjectH, transform: tilt }} /><span className="absolute top-3 left-3 font-mono text-[10px] text-lab-muted">{shot} · {angle}</span></div>}
      controls={<div className="flex w-full flex-col gap-3"><div className="flex flex-wrap gap-2">{(["low", "eye", "high"] as const).map((a) => <LabButton key={a} variant="outline" pressed={angle === a} onClick={() => setAngle(a)}>{a}</LabButton>)}</div><LabSlider label="Framing size" unit="%" min={10} max={100} step={1} value={size} onChange={setSize} /><LabReadout label="reads as:" value={shot} /></div>}
      code={{ language: "js", value: formatSnippet(SNIPPET, { shot, angle }) }} />
  );
}
