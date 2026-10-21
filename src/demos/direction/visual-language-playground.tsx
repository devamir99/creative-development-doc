"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

const SNIPPET_EN = `// Consistent language vs random chrome
const consistent = {{consistent}};
accent = consistent ? "#fafa05" : randomHue();
ease = consistent ? "power2.out" : randomEase();`;

const SNIPPET_FA = `// زبان یکدست در برابر ظاهر تصادفی
const consistent = {{consistent}};
accent = consistent ? "#fafa05" : randomHue();
ease = consistent ? "power2.out" : randomEase();`;

export function VisualLanguagePlayground() {
  const { pick } = useLocale();
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

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {
    consistent: String(consistent),
  });

  return (
    <PlaygroundShell
      title={pick("Visual Language", "زبان بصری")}
      description={pick(
        "Three cards enter. Consistent = one accent + one ease. Inconsistent = random color + random easing — feels like three different brands.",
        "سه کارت وارد می‌شوند. یکدست = یک اکسنت + یک ایزینگ. ناهماهنگ = رنگ و ایزینگ تصادفی — حس سه برند متفاوت.",
      )}
      onReset={() => {
        setConsistent(true);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : () => setReplayKey((k) => k + 1)}
      stageLabel={pick(
        "Visual language comparison stage",
        "صحنه مقایسه زبان بصری",
      )}
      stageClassName="h-64 sm:h-72"
      stage={
        <div className="grid h-full grid-cols-3 gap-3 p-4">
          <div
            ref={aRef}
            className="flex flex-col justify-end gap-3 border border-lab-line bg-[#141416] p-3"
          >
            <div data-bar className="h-2 w-full bg-lab-accent" />
            <div className="h-16 bg-zinc-700/80" />
            <p className="font-mono text-[10px] text-lab-muted">
              {pick("Card 1", "کارت ۱")}
            </p>
          </div>
          <div
            ref={bRef}
            className="flex flex-col justify-end gap-3 border border-lab-line bg-[#141416] p-3"
          >
            <div data-bar className="h-2 w-full bg-lab-accent" />
            <div className="h-16 bg-zinc-700/80" />
            <p className="font-mono text-[10px] text-lab-muted">
              {pick("Card 2", "کارت ۲")}
            </p>
          </div>
          <div
            ref={cRef}
            className="flex flex-col justify-end gap-3 border border-lab-line bg-[#141416] p-3"
          >
            <div data-bar className="h-2 w-full bg-lab-accent" />
            <div className="h-16 bg-zinc-700/80" />
            <p className="font-mono text-[10px] text-lab-muted">
              {pick("Card 3", "کارت ۳")}
            </p>
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
            {pick("Consistent", "یکدست")}
          </LabButton>
          <LabButton
            variant="outline"
            pressed={!consistent}
            onClick={() => {
              setConsistent(false);
              setReplayKey((k) => k + 1);
            }}
          >
            {pick("Inconsistent", "ناهماهنگ")}
          </LabButton>
          <LabReadout
            label={pick("feel:", "حس:")}
            value={pick(
              consistent ? "one language" : "three brands colliding",
              consistent ? "یک زبان" : "سه برند در برخورد",
            )}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
