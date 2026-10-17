"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatSnippet } from "@/lib/playground";

gsap.registerPlugin(useGSAP);

type TransitionKind = "dissolve" | "wipe" | "mask" | "cut";

const KINDS: { id: TransitionKind; label: string }[] = [
  { id: "cut", label: "Cut" },
  { id: "dissolve", label: "Dissolve" },
  { id: "wipe", label: "Wipe" },
  { id: "mask", label: "Mask reveal" },
];

const SNIPPET = `// CSS / GSAP stand-ins for editorial transitions
const kind = "{{kind}}";
const duration = {{duration}};

// cut: instantaneous swap
// dissolve: opacity crossfade
// wipe: clip-path / x progress
// mask: circular (or custom) reveal`;

export function TransitionPlayground() {
  const reducedMotion = usePrefersReducedMotion();
  const [kind, setKind] = useState<TransitionKind>("dissolve");
  const [duration, setDuration] = useState(0.7);
  const [replayKey, setReplayKey] = useState(0);

  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const a = aRef.current;
      const b = bRef.current;
      if (!a || !b) return;

      gsap.killTweensOf([a, b]);
      gsap.set(a, {
        opacity: 1,
        xPercent: 0,
        clipPath: "inset(0 0 0 0)",
      });
      gsap.set(b, {
        opacity: kind === "cut" ? 0 : 1,
        xPercent: 0,
        clipPath: "inset(0 0 0 0)",
      });
      b.style.setProperty("--mask", "0%");

      if (reducedMotion) {
        gsap.set(a, { opacity: 0 });
        gsap.set(b, { opacity: 1, clipPath: "inset(0 0 0 0)" });
        b.style.setProperty("--mask", "150%");
        return;
      }

      const d = duration;

      if (kind === "cut") {
        gsap.set(a, { opacity: 1 });
        gsap.set(b, { opacity: 0 });
        gsap.timeline().set(a, { opacity: 0 }, d * 0.5).set(b, { opacity: 1 }, d * 0.5);
        return;
      }

      if (kind === "dissolve") {
        gsap.set(b, { opacity: 0 });
        gsap
          .timeline()
          .to(a, { opacity: 0, duration: d, ease: "none" }, 0)
          .to(b, { opacity: 1, duration: d, ease: "none" }, 0);
        return;
      }

      if (kind === "wipe") {
        gsap.set(b, { opacity: 1, clipPath: "inset(0 100% 0 0)" });
        gsap.set(a, { opacity: 1 });
        gsap.to(b, {
          clipPath: "inset(0 0% 0 0)",
          duration: d,
          ease: "power1.inOut",
        });
        return;
      }

      // mask reveal — expanding circle via CSS variable on B overlay
      gsap.set(a, { opacity: 1 });
      gsap.set(b, { opacity: 1 });
      b.style.setProperty("--mask", "0%");
      gsap.to(b, {
        duration: d,
        ease: "power2.inOut",
        onUpdate: function onUpdate() {
          const p = this.progress();
          b.style.setProperty("--mask", `${p * 150}%`);
        },
      });
    },
    { dependencies: [kind, duration, replayKey, reducedMotion] },
  );

  const codeValue = formatSnippet(SNIPPET, {
    kind,
    duration: Number(duration.toFixed(2)),
  });

  return (
    <PlaygroundShell
      title="Transition Stage"
      description={
        reducedMotion
          ? "Reduced motion: end state of the selected transition."
          : "Compare cut, dissolve, wipe, and mask reveal — same A/B content, different editorial glue."
      }
      onReset={() => {
        setKind("dissolve");
        setDuration(0.7);
        setReplayKey((k) => k + 1);
      }}
      onReplay={reducedMotion ? undefined : () => setReplayKey((k) => k + 1)}
      stageLabel="Transition comparison stage"
      stageClassName="h-72 sm:h-80"
      stage={
        <div className="relative h-full w-full overflow-hidden bg-[#0c0c0e]">
          <div
            ref={aRef}
            className="absolute inset-0 flex items-center justify-center bg-[#141416]"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="h-20 w-28 bg-lab-accent" />
              <span className="font-mono text-[10px] text-lab-muted uppercase">Scene A</span>
            </div>
          </div>
          <div
            ref={bRef}
            className="absolute inset-0 flex items-center justify-center bg-[#1a1a12]"
            style={
              kind === "mask"
                ? {
                    WebkitMaskImage:
                      "radial-gradient(circle, #000 var(--mask, 0%), transparent var(--mask, 0%))",
                    maskImage:
                      "radial-gradient(circle, #000 var(--mask, 0%), transparent var(--mask, 0%))",
                  }
                : undefined
            }
          >
            <div className="flex flex-col items-center gap-2">
              <div className="h-24 w-20 rotate-6 bg-zinc-400" />
              <span className="font-mono text-[10px] text-lab-muted uppercase">Scene B</span>
            </div>
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div role="group" aria-label="Transition kind" className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <LabButton
                key={k.id}
                pressed={kind === k.id}
                variant="outline"
                onClick={() => setKind(k.id)}
              >
                {k.label}
              </LabButton>
            ))}
          </div>
          <LabSlider
            label="Duration"
            unit="s"
            min={0.2}
            max={1.6}
            step={0.05}
            value={duration}
            onChange={setDuration}
            disabled={kind === "cut"}
          />
          <LabReadout label="kind:" value={kind} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
