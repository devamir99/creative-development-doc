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

const CASE_IDS = ["Nova", "Atlas", "Kite"] as const;
const CASE_LABELS_FA = ["نووا", "اطلس", "بادبادک"] as const;

const SNIPPET_EN = `// Portfolio: shared wipe motif between cases
wipe.x = progress; // same yellow bar every time
case = "{{case}}";`;

const SNIPPET_FA = `// پورتفولیو: موتیف پاک‌کن مشترک بین کیس‌ها
wipe.x = progress; // همان نوار زرد هر بار
case = "{{case}}";`;

export function PortfolioMotifPlayground() {
  const { pick, fa } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const [caseIndex, setCaseIndex] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const wipeRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const caseLabel = fa
    ? (CASE_LABELS_FA[caseIndex] ?? "—")
    : (CASE_IDS[caseIndex] ?? "—");

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
        .to(wipe, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.35,
          ease: "power2.out",
        });
      return () => tl.kill();
    },
    { dependencies: [caseIndex, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {
    case: CASE_IDS[caseIndex] ?? "Nova",
  });

  return (
    <PlaygroundShell
      title={pick("Portfolio Motif Wipe (mini)", "پاک‌کن موتیف پورتفولیو (مینی)")}
      description={pick(
        "Same yellow wipe between every case — recognition without cloning the whole layout.",
        "همان پاک‌کن زرد بین هر کیس — بازشناسی بدون کپی کل چیدمان.",
      )}
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
      stageLabel={pick("Portfolio motif stage", "صحنه موتیف پورتفولیو")}
      stageClassName="h-64 sm:h-72"
      stage={
        <div
          className="relative flex h-full items-center justify-center overflow-hidden bg-[#0c0c0e]"
          dir="ltr"
        >
          <div
            ref={panelRef}
            className="flex w-56 flex-col gap-3 border border-lab-line bg-[#141416] p-4"
          >
            <p className="font-mono text-[10px] text-lab-accent uppercase">
              {pick("Case", "کیس")}
            </p>
            <p className="text-xl text-lab-fg">{caseLabel}</p>
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
          {CASE_IDS.map((id, i) => (
            <LabButton
              key={id}
              variant="outline"
              pressed={caseIndex === i}
              onClick={() => {
                setCaseIndex(i);
                setReplayKey((k) => k + 1);
              }}
            >
              {fa ? CASE_LABELS_FA[i] : id}
            </LabButton>
          ))}
          <LabReadout label={pick("case:", "کیس:")} value={caseLabel} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
