"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

export type CutMode = "hard" | "dissolve" | "jump" | "match";

const MODES: { id: CutMode; label: string }[] = [
  { id: "hard", label: "Hard cut" },
  { id: "dissolve", label: "Dissolve" },
  { id: "jump", label: "Jump cut" },
  { id: "match", label: "Match cut" },
];

const SNIPPET = `// Conceptual edit, not a video API
const mode = "{{mode}}";
const cutAt = {{cutAt}}; // 0–1 along the timeline
const dissolve = {{dissolve}}; // seconds of overlap (dissolve only)

// Hard: A ends, B starts at cutAt
// Dissolve: crossfade A→B over dissolve around cutAt
// Jump: same framing language, time skips (A→A′)
// Match: shared shape/motion bridges A→B`;

export function CutTimelinePlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<CutMode>("hard");
  const [cutAt, setCutAt] = useState(0.45);
  const [dissolve, setDissolve] = useState(0.35);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  const progressProxy = useRef({ t: 0 });
  const shotARef = useRef<HTMLDivElement>(null);
  const shotBRef = useRef<HTMLDivElement>(null);

  const cutLabel = useMemo(() => {
    switch (mode) {
      case "hard":
        return "Instant A→B";
      case "dissolve":
        return `Crossfade ~${dissolve.toFixed(2)}s`;
      case "jump":
        return "Same space, time skips";
      case "match":
        return "Shared graphic bridge";
      default:
        return "";
    }
  }, [mode, dissolve]);

  useGSAP(
    () => {
      const a = shotARef.current;
      const b = shotBRef.current;
      if (!a || !b) return;

      gsap.killTweensOf(progressProxy.current);
      progressProxy.current.t = 0;
      setProgress(0);
      setPlaying(false);

      gsap.set(a, { opacity: 1, scale: 1, x: 0 });
      gsap.set(b, { opacity: 0, scale: 1, x: 0 });

      if (reducedMotion) {
        // Show the post-cut state statically for A/B readability.
        if (mode === "jump") {
          gsap.set(a, { opacity: 1, x: 28 });
          gsap.set(b, { opacity: 0 });
        } else {
          gsap.set(a, { opacity: mode === "dissolve" ? 0.35 : 0 });
          gsap.set(b, { opacity: 1 });
        }
        setProgress(1);
        return;
      }

      const duration = 2.4;
      setPlaying(true);

      const tl = gsap.timeline({
        onUpdate: () => setProgress(progressProxy.current.t),
        onComplete: () => setPlaying(false),
      });

      tl.to(progressProxy.current, {
        t: 1,
        duration,
        ease: "none",
      }, 0);

      if (mode === "hard") {
        tl.set(a, { opacity: 0 }, cutAt * duration);
        tl.set(b, { opacity: 1 }, cutAt * duration);
      } else if (mode === "dissolve") {
        const overlap = Math.min(dissolve, duration * 0.8);
        const start = Math.max(0, cutAt * duration - overlap / 2);
        tl.to(a, { opacity: 0, duration: overlap, ease: "none" }, start);
        tl.fromTo(
          b,
          { opacity: 0 },
          { opacity: 1, duration: overlap, ease: "none" },
          start,
        );
      } else if (mode === "jump") {
        // Same "shot family": B never fully takes over — A jumps in space/time.
        tl.to(a, { x: 0, duration: cutAt * duration, ease: "none" }, 0);
        tl.set(a, { x: 36, opacity: 1 }, cutAt * duration);
        tl.set(b, { opacity: 0 }, 0);
        tl.to(a, { x: 52, duration: (1 - cutAt) * duration, ease: "none" }, cutAt * duration);
      } else {
        // Match: shared circle motif scales through the cut.
        tl.to(a, { scale: 1.15, duration: cutAt * duration, ease: "power1.in" }, 0);
        tl.set(a, { opacity: 0 }, cutAt * duration);
        tl.fromTo(
          b,
          { opacity: 1, scale: 0.85 },
          { opacity: 1, scale: 1, duration: (1 - cutAt) * duration, ease: "power1.out" },
          cutAt * duration,
        );
      }

      return () => {
        tl.kill();
      };
    },
    { dependencies: [mode, cutAt, dissolve, replayKey, reducedMotion] },
  );

  function handleReplay() {
    setReplayKey((k) => k + 1);
  }

  function handleReset() {
    setMode("hard");
    setCutAt(0.45);
    setDissolve(0.35);
    setReplayKey((k) => k + 1);
  }

  const codeValue = formatSnippet(SNIPPET, {
    mode,
    cutAt: Number(cutAt.toFixed(2)),
    dissolve: Number(dissolve.toFixed(2)),
  });

  const description = reducedMotion
    ? "Reduced motion: timeline shows the post-cut relationship without playing through."
    : "Watch the viewer and the timeline together — the cut point is where meaning flips.";

  return (
    <PlaygroundShell
      title="Cut Visualizer"
      description={description}
      onReset={handleReset}
      onReplay={reducedMotion ? undefined : handleReplay}
      stageLabel="Editing cut comparison stage"
      stageClassName="h-auto min-h-72"
      stage={
        <div className="flex h-full min-h-72 flex-col gap-3 p-3 sm:p-4">
          <div className="relative grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
            <div
              ref={shotARef}
              className="relative flex min-h-36 items-center justify-center overflow-hidden rounded-sm border border-lab-line bg-[#141416]"
              aria-hidden
            >
              <span className="absolute top-2 left-2 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
                Shot A
              </span>
              {mode === "match" ? (
                <div className="size-16 rounded-full border-2 border-lab-accent bg-lab-accent/20" />
              ) : mode === "jump" ? (
                <div className="flex items-end gap-1">
                  <div className="h-10 w-6 bg-lab-accent" />
                  <div className="h-14 w-6 bg-zinc-500" />
                  <div className="h-8 w-6 bg-zinc-600" />
                </div>
              ) : (
                <div className="h-16 w-24 bg-lab-accent" />
              )}
            </div>
            <div
              ref={shotBRef}
              className="relative flex min-h-36 items-center justify-center overflow-hidden rounded-sm border border-lab-line bg-[#101012]"
              aria-hidden
            >
              <span className="absolute top-2 left-2 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
                Shot B{mode === "jump" ? " (unused)" : ""}
              </span>
              {mode === "match" ? (
                <div className="size-20 rounded-full border-2 border-zinc-300 bg-zinc-300/15" />
              ) : mode === "jump" ? (
                <p className="px-4 text-center font-mono text-[10px] text-lab-muted">
                  Jump stays in Shot A&apos;s world
                </p>
              ) : (
                <div className="h-20 w-16 rotate-6 bg-zinc-400" />
              )}
            </div>
          </div>

          <div className="relative h-10 overflow-hidden rounded-sm border border-lab-line bg-zinc-950">
            <div
              className="absolute inset-y-0 left-0 bg-lab-accent/25"
              style={{ width: `${cutAt * 100}%` }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-zinc-700/50"
              style={{ width: `${(1 - cutAt) * 100}%` }}
            />
            {mode === "dissolve" ? (
              <div
                className="absolute inset-y-1 rounded-sm bg-white/20"
                style={{
                  left: `calc(${cutAt * 100}% - ${dissolve * 12}%)`,
                  width: `${Math.max(8, dissolve * 24)}%`,
                }}
                title="Dissolve overlap"
              />
            ) : null}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-lab-accent"
              style={{ left: `${progress * 100}%` }}
              aria-hidden
            />
            <div className="absolute inset-0 flex items-center justify-between px-2 font-mono text-[10px] text-lab-muted">
              <span>A</span>
              <span>cut @ {(cutAt * 100).toFixed(0)}%</span>
              <span>B</span>
            </div>
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label="Cut type"
            className="flex flex-wrap items-center gap-2"
          >
            {MODES.map((m) => (
              <LabButton
                key={m.id}
                pressed={mode === m.id}
                variant="outline"
                onClick={() => setMode(m.id)}
                disabled={playing && !reducedMotion}
              >
                {m.label}
              </LabButton>
            ))}
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <LabSlider
              label="Cut position"
              min={0.15}
              max={0.85}
              step={0.01}
              value={cutAt}
              onChange={setCutAt}
              disabled={playing && !reducedMotion}
            />
            <LabSlider
              label="Dissolve length"
              unit="s"
              min={0.1}
              max={1}
              step={0.05}
              value={dissolve}
              onChange={setDissolve}
              disabled={mode !== "dissolve" || (playing && !reducedMotion)}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <LabReadout label="mode:" value={cutLabel} />
            <LabReadout
              label="playhead:"
              value={`${(progress * 100).toFixed(0)}%`}
            />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
