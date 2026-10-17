"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

const PRESETS = [
  { label: "0.2s", value: 0.2 },
  { label: "0.6s", value: 0.6 },
  { label: "1.6s", value: 1.6 },
] as const;

export function TimingPlayground() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0.6);
  const [key, setKey] = useState(0);

  useGSAP(
    () => {
      const el = boxRef.current;
      if (!el) return;

      gsap.set(el, { x: 0 });
      gsap.to(el, {
        x: 240,
        duration,
        ease: "none",
        delay: 0.15,
      });
    },
    { dependencies: [duration, key] },
  );

  return (
    <div
      dir="ltr"
      className="lab-ltr not-prose my-8 overflow-hidden rounded-xl border border-lab-line bg-lab-panel"
    >
      <div className="flex items-center justify-between border-b border-lab-line px-4 py-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-lab-accent uppercase">
            Live Playground
          </p>
          <p className="text-sm text-lab-muted">
            Same distance · ease none · change only timing
          </p>
        </div>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="h-9 border border-lab-line px-3 text-xs transition-colors hover:border-lab-accent/50"
        >
          Replay
        </button>
      </div>

      <div className="relative h-36 border-b border-lab-line px-4">
        <div className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-lab-line" />
        <div
          ref={boxRef}
          className="absolute top-1/2 left-4 size-10 -translate-y-1/2 bg-lab-accent"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 py-4">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => {
              setDuration(preset.value);
              setKey((k) => k + 1);
            }}
            className={
              duration === preset.value
                ? "h-9 bg-lab-accent px-3 font-mono text-xs text-lab-accent-fg"
                : "h-9 border border-lab-line px-3 font-mono text-xs text-lab-muted hover:border-lab-accent/40"
            }
          >
            {preset.label}
          </button>
        ))}
        <code className="ms-auto font-mono text-xs text-lab-muted">
          duration: {duration}
        </code>
      </div>
    </div>
  );
}
