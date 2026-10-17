"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

type JlMode = "j" | "l" | "straight";

const SNIPPET = `// Picture and sound can cut at different times
const pictureCut = {{pictureCut}};
const soundCut = {{soundCut}};
// J-cut: sound of B leads (soundCut < pictureCut)
// L-cut: sound of A trails (soundCut > pictureCut)`;

export function JlCutPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<JlMode>("j");
  const [offset, setOffset] = useState(0.18);
  const [replayKey, setReplayKey] = useState(0);
  const [pictureT, setPictureT] = useState(0);
  const [soundT, setSoundT] = useState(0);

  const pictureProxy = useRef({ t: 0 });
  const soundProxy = useRef({ t: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);

  const pictureCut = 0.5;
  const soundCut =
    mode === "straight"
      ? pictureCut
      : mode === "j"
        ? pictureCut - offset
        : pictureCut + offset;

  useGSAP(
    () => {
      const frame = frameRef.current;
      const wave = waveRef.current;
      if (!frame || !wave) return;

      gsap.killTweensOf([pictureProxy.current, soundProxy.current]);
      pictureProxy.current.t = 0;
      soundProxy.current.t = 0;
      setPictureT(0);
      setSoundT(0);

      if (reducedMotion) {
        setPictureT(1);
        setSoundT(1);
        frame.dataset.shot = "B";
        wave.dataset.track = "B";
        return;
      }

      const duration = 2.6;
      const tl = gsap.timeline();

      tl.to(
        pictureProxy.current,
        {
          t: 1,
          duration,
          ease: "none",
          onUpdate: () => {
            const t = pictureProxy.current.t;
            setPictureT(t);
            frame.dataset.shot = t >= pictureCut ? "B" : "A";
          },
        },
        0,
      );

      tl.to(
        soundProxy.current,
        {
          t: 1,
          duration,
          ease: "none",
          onUpdate: () => {
            const t = soundProxy.current.t;
            setSoundT(t);
            wave.dataset.track = t >= soundCut ? "B" : "A";
          },
        },
        0,
      );

      return () => tl.kill();
    },
    { dependencies: [mode, offset, replayKey, reducedMotion, pictureCut, soundCut] },
  );

  function applyMode(next: JlMode) {
    setMode(next);
    if (next === "straight") setOffset(0);
    else if (offset < 0.05) setOffset(0.18);
  }

  function handleReset() {
    setMode("j");
    setOffset(0.18);
    setReplayKey((k) => k + 1);
  }

  const codeValue = formatSnippet(SNIPPET, {
    pictureCut: Number(pictureCut.toFixed(2)),
    soundCut: Number(Math.min(0.95, Math.max(0.05, soundCut)).toFixed(2)),
  });

  return (
    <PlaygroundShell
      title="J-Cut / L-Cut"
      description={
        reducedMotion
          ? "Reduced motion: final A/B picture+sound relationship shown statically."
          : "Picture and sound cut on different beats — J leads with B audio; L trails A audio under B picture."
      }
      onReset={handleReset}
      onReplay={reducedMotion ? undefined : () => setReplayKey((k) => k + 1)}
      stageLabel="J and L cut timeline stage"
      stageClassName="h-auto min-h-72"
      stage={
        <div className="flex min-h-72 flex-col gap-3 p-3 sm:p-4">
          <div
            ref={frameRef}
            data-shot="A"
            className="flex min-h-28 flex-1 items-center justify-center rounded-sm border border-lab-line bg-[#141416] transition-colors data-[shot=B]:bg-[#1a1a12]"
          >
            <p className="font-mono text-sm text-lab-accent">
              Picture: Shot{" "}
              <span className="text-lab-fg">
                {pictureT >= pictureCut ? "B" : "A"}
              </span>
            </p>
          </div>
          <div
            ref={waveRef}
            data-track="A"
            className="relative flex h-14 items-center justify-center overflow-hidden rounded-sm border border-lab-line bg-zinc-950"
          >
            <div
              className="absolute inset-y-0 left-0 bg-lab-accent/20"
              style={{ width: `${Math.min(100, soundCut * 100)}%` }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-zinc-600/40"
              style={{ width: `${Math.max(0, (1 - soundCut) * 100)}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/80"
              style={{ left: `${pictureCut * 100}%` }}
              title="Picture cut"
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-lab-accent"
              style={{ left: `${Math.min(95, Math.max(5, soundCut)) * 100}%` }}
              title="Sound cut"
            />
            <p className="relative z-10 font-mono text-xs text-lab-fg">
              Sound: Track {soundT >= soundCut ? "B" : "A"}
            </p>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-lab-muted">
            <span>White = picture cut</span>
            <span>Yellow = sound cut</span>
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="J L mode" className="flex flex-wrap gap-2">
            {(
              [
                { id: "j" as const, label: "J-cut" },
                { id: "l" as const, label: "L-cut" },
                { id: "straight" as const, label: "Straight cut" },
              ] as const
            ).map((m) => (
              <LabButton
                key={m.id}
                pressed={mode === m.id}
                variant="outline"
                onClick={() => applyMode(m.id)}
              >
                {m.label}
              </LabButton>
            ))}
          </div>
          <LabSlider
            label="Audio offset"
            min={0}
            max={0.35}
            step={0.01}
            value={mode === "straight" ? 0 : offset}
            onChange={setOffset}
            disabled={mode === "straight"}
          />
          <div className="flex flex-wrap gap-4">
            <LabReadout label="picture @:" value={`${(pictureCut * 100).toFixed(0)}%`} />
            <LabReadout
              label="sound @"
              value={`${(Math.min(0.95, Math.max(0.05, soundCut)) * 100).toFixed(0)}%`}
            />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
