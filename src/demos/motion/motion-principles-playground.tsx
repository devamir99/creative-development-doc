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

type Mode = "spacing" | "spring" | "secondary" | "morph" | "kinetic";

const MODE_IDS: Mode[] = [
  "spacing",
  "spring",
  "secondary",
  "morph",
  "kinetic",
];

export function MotionPrinciplesPlayground({
  initial = "spacing",
}: {
  initial?: Mode;
}) {
  const { fa, pick } = useLocale();
  const reduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>(initial);
  const [strength, setStrength] = useState(55);
  const [key, setKey] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const titles: Record<Mode, string> = {
    spacing: pick("Spacing", "فاصله‌گذاری"),
    spring: pick("Spring & Inertia", "فنر و اینرسی"),
    secondary: pick("Secondary Motion", "حرکت ثانویه"),
    morph: pick("Morphing", "مورفینگ"),
    kinetic: pick("Kinetic Typography", "تایپ جنبشی"),
  };

  const snippet = pick(
    `// motion principle + strength
motion.principle = "{{mode}}";
strength = {{strength}};`,
    `// اصل حرکت + شدت
motion.principle = "{{mode}}";
strength = {{strength}};`,
  );

  useGSAP(() => {
    const main = mainRef.current,
      trail = trailRef.current,
      text = textRef.current;
    if (mode !== "kinetic" && !main) return;
    if (mode === "kinetic" && !text) return;
    gsap.killTweensOf(
      [main, trail, text].filter((el): el is HTMLDivElement => el !== null),
    );
    if (main) gsap.set(main, { x: 0, scale: 1, borderRadius: "8%", rotate: 0 });
    if (trail) gsap.set(trail, { x: 0, opacity: 0.7 });
    if (reduced) {
      if (main) gsap.set(main, { x: 150 });
      if (text) gsap.set(text.querySelectorAll("[data-letter]"), { y: 0, opacity: 1 });
      return;
    }
    if (mode === "spacing")
      gsap.to(main, {
        x: 210,
        duration: 1.1,
        ease: strength > 60 ? "power2.in" : strength < 40 ? "power2.out" : "none",
        repeat: 1,
        yoyo: true,
      });
    if (mode === "spring")
      gsap.to(main, {
        x: 210,
        duration: 1.4,
        ease: `elastic.out(1, ${0.25 + strength / 160})`,
        repeat: 1,
        yoyo: true,
      });
    if (mode === "secondary") {
      gsap.to(main, {
        x: 210,
        duration: 0.9,
        ease: "power2.inOut",
        repeat: 1,
        yoyo: true,
      });
      if (trail)
        gsap.to(trail, {
          x: 210,
          duration: 0.9 + strength / 90,
          ease: "power2.out",
          repeat: 1,
          yoyo: true,
          delay: 0.05,
        });
    }
    if (mode === "morph")
      gsap.to(main, {
        x: 150,
        scale: 1.25,
        borderRadius: "50%",
        rotate: 90,
        duration: 1,
        ease: "power2.inOut",
        repeat: 1,
        yoyo: true,
      });
    if (mode === "kinetic" && text)
      gsap.fromTo(
        text.querySelectorAll("[data-letter]"),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.04 + strength / 1200,
          ease: "power3.out",
        },
      );
  }, { dependencies: [mode, strength, key, reduced] });

  return (
    <PlaygroundShell
      title={titles[mode]}
      description={pick(
        "Spacing = where frames bunch. Spring = overshoot/settle. Secondary = followers lag. Morph = shape becomes message. Kinetic = type performs.",
        "فاصله‌گذاری = جایی که فریم‌ها فشرده می‌شوند. فنر = فراجهش و نشست. ثانویه = دنبال‌کننده‌ها عقب می‌مانند. مورف = شکل پیام می‌شود. تایپ جنبشی = متن اجرا می‌کند.",
      )}
      onReset={() => {
        setMode(initial);
        setStrength(55);
        setKey((k) => k + 1);
      }}
      onReplay={reduced ? undefined : () => setKey((k) => k + 1)}
      stageLabel={pick("Motion principles stage", "صحنه اصول حرکت")}
      stageClassName="h-64"
      stage={
        <div className="relative flex h-full items-center overflow-hidden bg-[#101012] px-8">
          <div className="absolute inset-x-8 top-1/2 h-px bg-lab-line" />
          {mode === "kinetic" ? (
            <div
              ref={textRef}
              className="flex text-4xl font-bold tracking-wide text-lab-fg"
            >
              {fa ? (
                <span data-letter className="inline-block">
                  حرکت
                </span>
              ) : (
                "MOTION".split("").map((ch, i) => (
                  <span key={i} data-letter className="inline-block">
                    {ch}
                  </span>
                ))
              )}
            </div>
          ) : (
            <>
              <div
                ref={mainRef}
                className="relative z-10 size-14 shrink-0 bg-lab-accent"
              />
              {mode === "secondary" && (
                <div ref={trailRef} className="absolute left-16 size-9 bg-zinc-400" />
              )}
              <div className="ml-40 flex gap-2">
                {mode === "spacing" &&
                  Array.from({ length: 9 }).map((_, i) => (
                    <span
                      key={i}
                      className="size-2 rounded-full bg-zinc-500"
                      style={{
                        opacity: 0.35 + i / 14,
                        transform: `translateX(${
                          strength > 60
                            ? i * i * 0.7
                            : strength < 40
                              ? (8 - i) * 2
                              : i * 3
                        }px)`,
                      }}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {MODE_IDS.map((m) => (
              <LabButton
                key={m}
                variant="outline"
                pressed={mode === m}
                onClick={() => {
                  setMode(m);
                  setKey((k) => k + 1);
                }}
              >
                {titles[m]}
              </LabButton>
            ))}
          </div>
          <LabSlider
            label={pick("Strength", "شدت")}
            min={5}
            max={95}
            step={1}
            value={strength}
            onChange={(v) => {
              setStrength(v);
              setKey((k) => k + 1);
            }}
          />
          <LabReadout
            label={pick("principle:", "اصل:")}
            value={titles[mode]}
          />
        </div>
      }
      code={{
        language: "js",
        value: formatSnippet(snippet, { mode, strength }),
      }}
    />
  );
}

export function SpacingPlayground() {
  return <MotionPrinciplesPlayground initial="spacing" />;
}
export function SpringPlayground() {
  return <MotionPrinciplesPlayground initial="spring" />;
}
export function SecondaryMotionPlayground() {
  return <MotionPrinciplesPlayground initial="secondary" />;
}
export function MorphPlayground() {
  return <MotionPrinciplesPlayground initial="morph" />;
}
export function KineticTypePlayground() {
  return <MotionPrinciplesPlayground initial="kinetic" />;
}
