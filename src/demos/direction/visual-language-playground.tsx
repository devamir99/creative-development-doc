"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

const SNIPPET = `// Consistent language vs random chrome
const consistent = {{consistent}};
accent = consistent ? "#fafa05" : randomHue();
ease = consistent ? "power2.out" : randomEase();`;

export function VisualLanguagePlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [consistent, setConsistent] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const cRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = [aRef.current, bRef.current, cRef.current].filter(
        Boolean,
      ) as HTMLDivElement[];
      if (!cards.length) return;
      gsap.killTweensOf(cards);

      const accents = consistent
        ? ["#fafa05", "#fafa05", "#fafa05"]
        : ["#ff4d6d", "#4cc9f0", "#b5179e"];
      const easings = consistent
        ? (["power2.out", "power2.out", "power2.out"] as const)
        : (["bounce.out", "none", "back.in"] as const);

      cards.forEach((el, i) => {
        const bar = el.querySelector<HTMLElement>("[data-bar]");
        if (bar) bar.style.backgroundColor = accents[i]!;
        gsap.set(el, { y: 28, opacity: 0 });
        if (reducedMotion) {
          gsap.set(el, { y: 0, opacity: 1 });
          return;
        }
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          delay: 0.12 * i,
          ease: easings[i],
        });
      });
    },
    { dependencies: [consistent, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(SNIPPET, {
    consistent: String(consistent),
  });

  return (
    <PlaygroundShell
      title="Visual Language"
      description="Three cards enter. Consistent = one accent + one ease. Inconsistent = random color + random easing — feels like three different brands."
      onReset={() => {
        setConsistent(true);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : () => setReplayKey((k) => k + 1)}
      stageLabel="Visual language comparison stage"
      stageClassName="h-64 sm:h-72"
      stage={
        <div className="grid h-full grid-cols-3 gap-3 p-4">
          <div
            ref={aRef}
            className="flex flex-col justify-end gap-3 border border-lab-line bg-[#141416] p-3"
          >
            <div data-bar className="h-2 w-full bg-lab-accent" />
            <div className="h-16 bg-zinc-700/80" />
            <p className="font-mono text-[10px] text-lab-muted">Card 1</p>
          </div>
          <div
            ref={bRef}
            className="flex flex-col justify-end gap-3 border border-lab-line bg-[#141416] p-3"
          >
            <div data-bar className="h-2 w-full bg-lab-accent" />
            <div className="h-16 bg-zinc-700/80" />
            <p className="font-mono text-[10px] text-lab-muted">Card 2</p>
          </div>
          <div
            ref={cRef}
            className="flex flex-col justify-end gap-3 border border-lab-line bg-[#141416] p-3"
          >
            <div data-bar className="h-2 w-full bg-lab-accent" />
            <div className="h-16 bg-zinc-700/80" />
            <p className="font-mono text-[10px] text-lab-muted">Card 3</p>
          </div>
        </div>
      }
      controls={
        <div className="flex flex-wrap items-center gap-2">
          <LabButton
            variant="outline"
            pressed={consistent}
            onClick={() => {
              setConsistent(true);
              setReplayKey((k) => k + 1);
            }}
          >
            Consistent
          </LabButton>
          <LabButton
            variant="outline"
            pressed={!consistent}
            onClick={() => {
              setConsistent(false);
              setReplayKey((k) => k + 1);
            }}
          >
            Inconsistent
          </LabButton>
          <LabReadout
            label="feel:"
            value={consistent ? "one language" : "three brands colliding"}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
