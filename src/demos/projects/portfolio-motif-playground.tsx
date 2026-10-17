"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

const CASES = ["Nova", "Atlas", "Kite"] as const;

const SNIPPET = `// Portfolio: shared wipe motif between cases
wipe.x = progress; // same yellow bar every time
case = "{{case}}";`;

export function PortfolioMotifPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [caseIndex, setCaseIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const wipeRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wipe = wipeRef.current;
      const panel = panelRef.current;
      if (!wipe || !panel) return;
      gsap.killTweensOf([wipe, panel]);

      if (reducedMotion) {
        gsap.set(wipe, { scaleX: 0 });
        gsap.set(panel, { opacity: 1 });
        return;
      }

      gsap.set(wipe, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(panel, { opacity: 0 });
      const tl = gsap.timeline();
      tl.to(wipe, { scaleX: 1, duration: 0.35, ease: "power2.in" })
        .set(panel, { opacity: 1 })
        .to(wipe, { scaleX: 0, transformOrigin: "right center", duration: 0.35, ease: "power2.out" });
      return () => tl.kill();
    },
    { dependencies: [caseIndex, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(SNIPPET, {
    case: CASES[caseIndex] ?? "Nova",
  });

  return (
    <PlaygroundShell
      title="Portfolio Motif Wipe (mini)"
      description="Same yellow wipe between every case — recognition without cloning the whole layout."
      onReset={() => {
        setCaseIndex(0);
        setReplayKey((k) => k + 1);
      }}
      onReplay={
        reducedMotion
          ? undefined
          : () => {
              setCaseIndex(0);
              setReplayKey((k) => k + 1);
              window.setTimeout(() => setCaseIndex(1), 900);
              window.setTimeout(() => setCaseIndex(2), 1800);
            }
      }
      stageLabel="Portfolio motif stage"
      stageClassName="h-64 sm:h-72"
      stage={
        <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#0c0c0e]">
          <div
            ref={panelRef}
            className="flex w-56 flex-col gap-3 border border-lab-line bg-[#141416] p-4"
          >
            <p className="font-mono text-[10px] text-lab-accent uppercase">Case</p>
            <p className="text-xl text-lab-fg">{CASES[caseIndex]}</p>
            <div className="h-20 bg-zinc-700" />
          </div>
          <div
            ref={wipeRef}
            className="pointer-events-none absolute inset-y-0 left-0 w-full origin-left bg-lab-accent"
            aria-hidden
          />
        </div>
      }
      controls={
        <div className="flex flex-wrap gap-2">
          {CASES.map((c, i) => (
            <LabButton
              key={c}
              variant="outline"
              pressed={caseIndex === i}
              onClick={() => {
                setCaseIndex(i);
                setReplayKey((k) => k + 1);
              }}
            >
              {c}
            </LabButton>
          ))}
          <LabReadout label="case:" value={CASES[caseIndex] ?? "—"} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
