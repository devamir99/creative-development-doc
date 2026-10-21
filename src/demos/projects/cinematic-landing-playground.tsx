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

const CHAPTER_IDS = ["Hero", "Setup", "Product", "CTA"] as const;

const CHAPTER_LABELS_FA = ["هیرو", "مقدمه", "محصول", "CTA"] as const;

const SNIPPET_EN = `// Mini cinematic landing: hard cuts between chapters
chapter = "{{chapter}}";
// Hero → Setup → Product → CTA (hold lengths differ)`;

const SNIPPET_FA = `// لندینگ سینمایی مینی: برش سخت بین فصل‌ها
chapter = "{{chapter}}";
// Hero → Setup → Product → CTA (طول نگه‌داشت فرق دارد)`;

export function CinematicLandingPlayground() {
  const { pick, fa } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const [chapter, setChapter] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const chapterLabel = fa
    ? (CHAPTER_LABELS_FA[chapter] ?? "—")
    : (CHAPTER_IDS[chapter] ?? "—");

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
      setChapter(CHAPTER_IDS.length - 1);
      return;
    }
    setChapter(0);
    setReplayKey((k) => k + 1);
    CHAPTER_IDS.forEach((_, i) => {
      if (i === 0) return;
      window.setTimeout(() => setChapter(i), i * 900);
    });
  }

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {
    chapter: CHAPTER_IDS[chapter] ?? "Hero",
  });

  return (
    <PlaygroundShell
      title={pick("Cinematic Landing (mini)", "لندینگ سینمایی (مینی)")}
      description={pick(
        "Four chapters with hard cuts. Watch the yellow accent stay constant — language + pacing without a full page build.",
        "چهار فصل با برش سخت. اکسنت زرد ثابت می‌ماند — زبان + ریتم روایت بدون ساخت کل صفحه.",
      )}
      onReset={() => {
        setChapter(0);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : playSequence}
      stageLabel={pick(
        "Cinematic landing mini stage",
        "صحنه مینی لندینگ سینمایی",
      )}
      stageClassName="h-64 sm:h-72"
      stage={
        <div className="flex h-full flex-col bg-[#0c0c0e]" dir="ltr">
          <div className="flex gap-1 border-b border-lab-line p-2">
            {CHAPTER_IDS.map((id, i) => (
              <div
                key={id}
                className={`h-1 flex-1 ${i === chapter ? "bg-lab-accent" : "bg-zinc-800"}`}
              />
            ))}
          </div>
          <div
            ref={panelRef}
            className="flex flex-1 flex-col items-start justify-center gap-3 p-6"
          >
            <p className="font-mono text-[10px] tracking-wide text-lab-accent uppercase">
              {chapterLabel}
            </p>
            {chapter === 0 ? (
              <>
                <p className="text-2xl text-lab-fg">
                  {pick("Brand", "برند")}
                </p>
                <p className="text-sm text-lab-muted">
                  {pick("One line. One CTA.", "یک خط. یک CTA.")}
                </p>
                <div className="mt-2 h-9 w-28 bg-lab-accent" />
              </>
            ) : null}
            {chapter === 1 ? (
              <>
                <p className="text-lg text-lab-fg">
                  {pick("The problem", "مسئله")}
                </p>
                <div className="h-16 w-full max-w-xs bg-zinc-800" />
              </>
            ) : null}
            {chapter === 2 ? (
              <>
                <div className="size-24 bg-lab-accent" />
                <p className="text-sm text-lab-muted">
                  {pick("Product beat", "ضرباهنگ محصول")}
                </p>
              </>
            ) : null}
            {chapter === 3 ? (
              <>
                <p className="text-lg text-lab-fg">
                  {pick("Ready?", "آماده‌ای؟")}
                </p>
                <div className="h-10 w-36 bg-lab-accent" />
              </>
            ) : null}
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Chapter", "فصل")}
            className="flex flex-wrap gap-2"
          >
            {CHAPTER_IDS.map((id, i) => (
              <LabButton
                key={id}
                variant="outline"
                pressed={chapter === i}
                onClick={() => {
                  setChapter(i);
                  setReplayKey((k) => k + 1);
                }}
              >
                {fa ? CHAPTER_LABELS_FA[i] : id}
              </LabButton>
            ))}
            <LabButton variant="solid" onClick={playSequence}>
              {pick("Play sequence", "پخش توالی")}
            </LabButton>
          </div>
          <LabReadout label={pick("now:", "الان:")} value={chapterLabel} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
