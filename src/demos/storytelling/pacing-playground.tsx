"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

type Beat = { label: string; hold: number };

const SNIPPET = `// Narrative beats: hold → cut → hold
beats = [
  { label: "Setup", hold: {{setup}} },
  { label: "Turn", hold: {{turn}} },
  { label: "Payoff", hold: {{payoff}} },
];`;

export function PacingPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [setup, setSetup] = useState(0.9);
  const [turn, setTurn] = useState(0.45);
  const [payoff, setPayoff] = useState(1.1);
  const [beatIndex, setBeatIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const beats: Beat[] = [
    { label: "Setup", hold: setup },
    { label: "Turn", hold: turn },
    { label: "Payoff", hold: payoff },
  ];

  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el) return;
      gsap.killTweensOf(el);
      if (reducedMotion) {
        setBeatIndex(2);
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({ delay: 0.1 });
      beats.forEach((b, i) => {
        tl.call(() => setBeatIndex(i));
        tl.fromTo(
          el,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        );
        tl.to({}, { duration: b.hold });
        if (i < beats.length - 1) {
          tl.to(el, { opacity: 0, y: -8, duration: 0.2, ease: "power1.in" });
        }
      });
      return () => tl.kill();
    },
    { dependencies: [setup, turn, payoff, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(SNIPPET, {
    setup: setup.toFixed(2),
    turn: turn.toFixed(2),
    payoff: payoff.toFixed(2),
  });

  return (
    <PlaygroundShell
      title="Narrative Pacing"
      description={
        reducedMotion
          ? "Reduced motion: final beat shown."
          : "Same three beats — only hold lengths change the story’s breath."
      }
      onReset={() => {
        setSetup(0.9);
        setTurn(0.45);
        setPayoff(1.1);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : () => setReplayKey((k) => k + 1)}
      stageLabel="Story pacing stage"
      stageClassName="h-56"
      stage={
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
          <div
            ref={cardRef}
            className="flex min-h-24 w-full max-w-sm flex-col items-center justify-center border border-lab-line bg-[#141416] px-4 py-6"
          >
            <p className="font-mono text-[10px] tracking-wide text-lab-muted uppercase">
              Beat {beatIndex + 1} / 3
            </p>
            <p className="mt-2 text-lg text-lab-fg">{beats[beatIndex]?.label}</p>
          </div>
          <div className="flex gap-2">
            {beats.map((b, i) => (
              <div
                key={b.label}
                className={`h-1.5 w-12 ${i === beatIndex ? "bg-lab-accent" : "bg-zinc-700"}`}
              />
            ))}
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <LabButton
              variant="outline"
              onClick={() => {
                setSetup(1.2);
                setTurn(0.3);
                setPayoff(1.4);
                setReplayKey((k) => k + 1);
              }}
            >
              Slow story
            </LabButton>
            <LabButton
              variant="outline"
              onClick={() => {
                setSetup(0.35);
                setTurn(0.25);
                setPayoff(0.4);
                setReplayKey((k) => k + 1);
              }}
            >
              Staccato
            </LabButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <LabSlider label="Setup hold" unit="s" min={0.2} max={1.8} step={0.05} value={setup} onChange={setSetup} />
            <LabSlider label="Turn hold" unit="s" min={0.15} max={1.2} step={0.05} value={turn} onChange={setTurn} />
            <LabSlider label="Payoff hold" unit="s" min={0.2} max={2} step={0.05} value={payoff} onChange={setPayoff} />
          </div>
          <LabReadout label="now:" value={beats[beatIndex]?.label ?? "—"} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
