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

type Scene = 0 | 1 | 2;

const SNIPPET_EN = `// Same circle motif returns in every scene — meaning accrues
motif.className = "circle accent";
// Scene {{scene}}: {{role}}`;

const SNIPPET_FA = `// همان موتیف دایره در هر صحنه بازمی‌گردد — معنا انباشته می‌شود
motif.className = "circle accent";
// صحنه {{scene}}: {{role}}`;

export function MotifPlayground() {
  const { fa, pick } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const [scene, setScene] = useState<Scene>(0);
  const [useMotif, setUseMotif] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const motifRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const roles = [
    pick("packaging mark", "نشان بسته‌بندی"),
    pick("hero aperture", "روزنهٔ هیرو"),
    pick("CTA badge", "نشان CTA"),
  ] as const;

  useGSAP(
    () => {
      const motif = motifRef.current;
      const stage = stageRef.current;
      if (!motif || !stage) return;
      gsap.killTweensOf([motif, stage]);

      const layouts = [
        { x: -80, y: -20, scale: 1, borderRadius: "50%" },
        { x: 0, y: 0, scale: 2.2, borderRadius: "50%" },
        { x: 90, y: 40, scale: 0.7, borderRadius: "50%" },
      ] as const;

      if (!useMotif) {
        gsap.set(motif, { opacity: 0 });
        return;
      }

      gsap.set(motif, { opacity: 1, backgroundColor: "#fafa05" });
      const L = layouts[scene];

      if (reducedMotion) {
        gsap.set(motif, {
          x: L.x,
          y: L.y,
          scale: L.scale,
          borderRadius: L.borderRadius,
        });
        return;
      }

      gsap.to(motif, {
        x: L.x,
        y: L.y,
        scale: L.scale,
        borderRadius: L.borderRadius,
        duration: 0.55,
        ease: "power2.inOut",
      });
    },
    { dependencies: [scene, useMotif, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, {
    scene: scene + 1,
    role: roles[scene],
  });

  return (
    <PlaygroundShell
      title={pick("Motif Continuity", "تداوم موتیف")}
      description={pick(
        "Three scenes. With motif ON, the yellow circle returns in a new role each time. Turn it OFF — scenes feel unrelated.",
        "سه صحنه. با موتیف روشن، دایرهٔ زرد هر بار در نقشی تازه بازمی‌گردد. خاموشش کن — صحنه‌ها بی‌ربط به‌نظر می‌رسند.",
      )}
      onReset={() => {
        setScene(0);
        setUseMotif(true);
        setReplayKey((k) => k + 1);
      }}
      onReplay={
        reducedMotion
          ? undefined
          : () => {
              setScene(0);
              setReplayKey((k) => k + 1);
              window.setTimeout(() => setScene(1), 700);
              window.setTimeout(() => setScene(2), 1400);
            }
      }
      stageLabel={pick("Motif continuity stage", "صحنه تداوم موتیف")}
      stageClassName="h-64 sm:h-72"
      stage={
        <div
          ref={stageRef}
          className="relative flex h-full items-center justify-center overflow-hidden bg-[#0e0e10]"
        >
          {/* scene chrome */}
          <div className="absolute inset-6 border border-lab-line/50" />
          <p className="absolute top-3 left-4 font-mono text-[10px] tracking-wide text-lab-muted uppercase">
            {pick(`Scene ${scene + 1}`, `صحنه ${scene + 1}`)} · {roles[scene]}
          </p>
          {scene === 0 ? (
            <div className="h-24 w-16 bg-zinc-600" aria-hidden />
          ) : null}
          {scene === 1 ? (
            <div className="h-28 w-40 bg-zinc-700" aria-hidden />
          ) : null}
          {scene === 2 ? (
            <div className="flex h-12 w-36 items-center justify-center bg-zinc-800 font-mono text-xs text-lab-muted">
              {pick("Buy now", "اکنون بخر")}
            </div>
          ) : null}
          <div
            ref={motifRef}
            className="absolute size-10 bg-lab-accent"
            style={{ borderRadius: "50%" }}
            aria-hidden
          />
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Scene", "صحنه")}
            className="flex flex-wrap gap-2"
          >
            {([0, 1, 2] as Scene[]).map((s) => (
              <LabButton
                key={s}
                variant="outline"
                pressed={scene === s}
                onClick={() => setScene(s)}
              >
                {pick(`Scene ${s + 1}`, `صحنه ${s + 1}`)}
              </LabButton>
            ))}
            <LabButton
              variant={useMotif ? "solid" : "outline"}
              pressed={useMotif}
              onClick={() => setUseMotif((v) => !v)}
            >
              {pick(
                `Motif ${useMotif ? "on" : "off"}`,
                `موتیف ${useMotif ? "روشن" : "خاموش"}`,
              )}
            </LabButton>
          </div>
          <LabReadout
            label={pick("role:", "نقش:")}
            value={useMotif ? roles[scene] : pick("none", "هیچ")}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
