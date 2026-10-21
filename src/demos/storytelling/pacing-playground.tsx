"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

type BeatId = "setup" | "turn" | "payoff";

const BEAT_IDS: BeatId[] = ["setup", "turn", "payoff"];

const SNIPPET_EN = `// Narrative beats: hold → cut → hold
beats = [
  { label: "Setup", hold: {{setup}} },
  { label: "Turn", hold: {{turn}} },
  { label: "Payoff", hold: {{payoff}} },
];`;

const SNIPPET_FA = `// ضربان‌های روایی: نگه‌داشت → برش → نگه‌داشت
beats = [
  { label: "Setup", hold: {{setup}} },
  { label: "Turn", hold: {{turn}} },
  { label: "Payoff", hold: {{payoff}} },
];`;

export function PacingPlayground() {
  const { fa, pick } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const [setup, setSetup] = useState(0.9);
  const [turn, setTurn] = useState(0.45);
  const [payoff, setPayoff] = useState(1.1);
  const [beatIndex, setBeatIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const beatLabel = (id: BeatId) => {
    switch (id) {
      case "setup":
        return pick("Setup", "مقدمه (Setup)");
      case "turn":
        return pick("Turn", "چرخش (Turn)");
      case "payoff":
        return pick("Payoff", "پاداش (Payoff)");
    }
  };

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
      const holdValues = [setup, turn, payoff];
      const tl = gsap.timeline({ delay: 0.1 });
      holdValues.forEach((hold, i) => {
        tl.call(() => setBeatIndex(i));
        tl.fromTo(
          el,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        );
        tl.to({}, { duration: hold });
        if (i < holdValues.length - 1) {
          tl.to(el, { opacity: 0, y: -8, duration: 0.2, ease: "power1.in" });
        }
      });
      return () => tl.kill();
    },
    { dependencies: [setup, turn, payoff, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, {
    setup: setup.toFixed(2),
    turn: turn.toFixed(2),
    payoff: payoff.toFixed(2),
  });

  const currentId = BEAT_IDS[beatIndex];

  return (
    <PlaygroundShell
      title={pick("Narrative Pacing", "ریتم روایت")}
      description={
        reducedMotion
          ? pick(
              "Reduced motion: final beat shown.",
              "حرکت کاهش‌یافته: فقط ضربان پایانی نمایش داده می‌شود.",
            )
          : pick(
              "Same three beats — only hold lengths change the story’s breath.",
              "همان سه ضربان — فقط طول نگه‌داشت‌ها نفس داستان را عوض می‌کند.",
            )
      }
      onReset={() => {
        setSetup(0.9);
        setTurn(0.45);
        setPayoff(1.1);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : () => setReplayKey((k) => k + 1)}
      stageLabel={pick("Story pacing stage", "صحنه ریتم روایت")}
      stageClassName="h-56"
      stage={
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
          <div
            ref={cardRef}
            className="flex min-h-24 w-full max-w-sm flex-col items-center justify-center border border-lab-line bg-[#141416] px-4 py-6"
          >
            <p className="font-mono text-[10px] tracking-wide text-lab-muted uppercase">
              {pick(
                `Beat ${beatIndex + 1} / 3`,
                `ضربان ${beatIndex + 1} / 3`,
              )}
            </p>
            <p className="mt-2 text-lg text-lab-fg">
              {currentId ? beatLabel(currentId) : null}
            </p>
          </div>
          <div className="flex gap-2">
            {BEAT_IDS.map((id, i) => (
              <div
                key={id}
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
              {pick("Slow story", "روایت آهسته")}
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
              {pick("Staccato", "استکاتو")}
            </LabButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <LabSlider
              label={pick("Setup hold", "نگه‌داشت مقدمه")}
              unit="s"
              min={0.2}
              max={1.8}
              step={0.05}
              value={setup}
              onChange={setSetup}
            />
            <LabSlider
              label={pick("Turn hold", "نگه‌داشت چرخش")}
              unit="s"
              min={0.15}
              max={1.2}
              step={0.05}
              value={turn}
              onChange={setTurn}
            />
            <LabSlider
              label={pick("Payoff hold", "نگه‌داشت پاداش")}
              unit="s"
              min={0.2}
              max={2}
              step={0.05}
              value={payoff}
              onChange={setPayoff}
            />
          </div>
          <LabReadout
            label={pick("now:", "اکنون:")}
            value={currentId ? beatLabel(currentId) : "—"}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
