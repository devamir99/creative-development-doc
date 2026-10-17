"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

const SNIPPET = `// Layers move at different rates along one progress
far.x = progress * {{far}};
mid.x = progress * {{mid}};
near.x = progress * {{near}};`;

export function ParallaxPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0.35);
  const [near, setNear] = useState(80);
  const [mid, setMid] = useState(40);
  const [far, setFar] = useState(16);
  const [playing, setPlaying] = useState(false);
  const proxy = useRef({ p: 0.35 });
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  function apply(p: number) {
    const f = farRef.current;
    const m = midRef.current;
    const n = nearRef.current;
    if (!f || !m || !n) return;
    gsap.set(f, { x: p * far });
    gsap.set(m, { x: p * mid });
    gsap.set(n, { x: p * near });
  }

  useGSAP(
    () => {
      if (playing) return;
      apply(progress);
    },
    { dependencies: [progress, near, mid, far, playing] },
  );

  function scrub(p: number) {
    gsap.killTweensOf(proxy.current);
    setPlaying(false);
    setProgress(p);
  }

  function autoPlay() {
    if (reducedMotion) {
      setProgress(1);
      return;
    }
    gsap.killTweensOf(proxy.current);
    proxy.current.p = progress;
    setPlaying(true);
    gsap.to(proxy.current, {
      p: progress > 0.85 ? 0 : 1,
      duration: 1.6,
      ease: "power1.inOut",
      onUpdate: () => {
        const p = proxy.current.p;
        setProgress(p);
        apply(p);
      },
      onComplete: () => setPlaying(false),
    });
  }

  const codeValue = formatSnippet(SNIPPET, { far, mid, near });

  return (
    <PlaygroundShell
      title="Parallax"
      description={
        reducedMotion
          ? "Reduced motion: scrub layers without auto-play."
          : "One progress value — far/mid/near move at different rates (depth cue)."
      }
      onReset={() => {
        gsap.killTweensOf(proxy.current);
        setPlaying(false);
        setProgress(0.35);
        setNear(80);
        setMid(40);
        setFar(16);
      }}
      onReplay={reducedMotion ? undefined : autoPlay}
      stageLabel="Parallax layer stage"
      stageClassName="h-56 sm:h-64"
      stage={
        <div className="relative h-full overflow-hidden bg-[#0c0c0e]">
          <div
            ref={farRef}
            className="absolute top-8 left-8 h-16 w-40 bg-zinc-700/80"
            aria-hidden
          />
          <div
            ref={midRef}
            className="absolute top-1/2 left-16 h-20 w-28 -translate-y-1/2 bg-zinc-500"
            aria-hidden
          />
          <div
            ref={nearRef}
            className="absolute bottom-6 left-10 h-24 w-16 bg-lab-accent"
            aria-hidden
          />
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <LabButton variant="outline" onClick={autoPlay} disabled={playing}>
              Play progress
            </LabButton>
          </div>
          <LabSlider
            label="Progress"
            min={0}
            max={1}
            step={0.01}
            value={Number(progress.toFixed(2))}
            onChange={scrub}
            disabled={playing}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <LabSlider label="Far amp" min={0} max={60} step={1} value={far} onChange={setFar} disabled={playing} />
            <LabSlider label="Mid amp" min={0} max={100} step={1} value={mid} onChange={setMid} disabled={playing} />
            <LabSlider label="Near amp" min={0} max={140} step={1} value={near} onChange={setNear} disabled={playing} />
          </div>
          <LabReadout label="p:" value={progress.toFixed(2)} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
