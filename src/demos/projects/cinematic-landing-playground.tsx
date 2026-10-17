"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

const CHAPTERS = ["Hero", "Setup", "Product", "CTA"] as const;

const SNIPPET = `// Mini cinematic landing: hard cuts between chapters
chapter = "{{chapter}}";
// Hero → Setup → Product → CTA (hold lengths differ)`;

export function CinematicLandingPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [chapter, setChapter] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = panelRef.current;
      if (!el) return;
      gsap.killTweensOf(el);
      if (reducedMotion) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    },
    { dependencies: [chapter, replayKey, reducedMotion] },
  );

  function playSequence() {
    if (reducedMotion) {
      setChapter(CHAPTERS.length - 1);
      return;
    }
    setChapter(0);
    setReplayKey((k) => k + 1);
    CHAPTERS.forEach((_, i) => {
      if (i === 0) return;
      window.setTimeout(() => setChapter(i), i * 900);
    });
  }

  const codeValue = formatSnippet(SNIPPET, {
    chapter: CHAPTERS[chapter] ?? "Hero",
  });

  return (
    <PlaygroundShell
      title="Cinematic Landing (mini)"
      description="Four chapters with hard cuts. Watch the yellow accent stay constant — language + pacing without a full page build."
      onReset={() => {
        setChapter(0);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : playSequence}
      stageLabel="Cinematic landing mini stage"
      stageClassName="h-64 sm:h-72"
      stage={
        <div className="flex h-full flex-col bg-[#0c0c0e]">
          <div className="flex gap-1 border-b border-lab-line p-2">
            {CHAPTERS.map((c, i) => (
              <div
                key={c}
                className={`h-1 flex-1 ${i === chapter ? "bg-lab-accent" : "bg-zinc-800"}`}
              />
            ))}
          </div>
          <div
            ref={panelRef}
            className="flex flex-1 flex-col items-start justify-center gap-3 p-6"
          >
            <p className="font-mono text-[10px] tracking-wide text-lab-accent uppercase">
              {CHAPTERS[chapter]}
            </p>
            {chapter === 0 ? (
              <>
                <p className="text-2xl text-lab-fg">Brand</p>
                <p className="text-sm text-lab-muted">One line. One CTA.</p>
                <div className="mt-2 h-9 w-28 bg-lab-accent" />
              </>
            ) : null}
            {chapter === 1 ? (
              <>
                <p className="text-lg text-lab-fg">The problem</p>
                <div className="h-16 w-full max-w-xs bg-zinc-800" />
              </>
            ) : null}
            {chapter === 2 ? (
              <>
                <div className="size-24 bg-lab-accent" />
                <p className="text-sm text-lab-muted">Product beat</p>
              </>
            ) : null}
            {chapter === 3 ? (
              <>
                <p className="text-lg text-lab-fg">Ready?</p>
                <div className="h-10 w-36 bg-lab-accent" />
              </>
            ) : null}
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="Chapter" className="flex flex-wrap gap-2">
            {CHAPTERS.map((c, i) => (
              <LabButton
                key={c}
                variant="outline"
                pressed={chapter === i}
                onClick={() => {
                  setChapter(i);
                  setReplayKey((k) => k + 1);
                }}
              >
                {c}
              </LabButton>
            ))}
            <LabButton variant="solid" onClick={playSequence}>
              Play sequence
            </LabButton>
          </div>
          <LabReadout label="now:" value={CHAPTERS[chapter] ?? "—"} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
