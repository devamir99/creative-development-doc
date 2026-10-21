"use client";

import { useCallback, useRef, useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

type FocalTools = {
  size: number;
  contrast: number;
  blurBg: number;
};

const DEFAULT: FocalTools = { size: 56, contrast: 0.85, blurBg: 0 };

const SNIPPET_EN = `// Focal point = size + contrast + isolation
subject.style.width = "{{size}}px";
subject.style.filter = "contrast({{contrast}})";
background.style.filter = "blur({{blurBg}}px)";`;

const SNIPPET_FA = `// نقطه کانونی = اندازه + کنتراست + جداسازی
subject.style.width = "{{size}}px";
subject.style.filter = "contrast({{contrast}})";
background.style.filter = "blur({{blurBg}}px)";`;

export function FocalPointPlayground() {
  const { pick } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 58, y: 42 });
  const [tools, setTools] = useState<FocalTools>({ ...DEFAULT });
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(
    null,
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const stage = stageRef.current;
      if (!stage) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      drag.current = { px: e.clientX, py: e.clientY, ox: pos.x, oy: pos.y };
    },
    [pos],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.current.px) / rect.width) * 100;
    const dy = ((e.clientY - drag.current.py) / rect.height) * 100;
    setPos({
      x: Math.min(90, Math.max(10, drag.current.ox + dx)),
      y: Math.min(90, Math.max(10, drag.current.oy + dy)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {
    size: tools.size,
    contrast: tools.contrast.toFixed(2),
    blurBg: tools.blurBg,
  });

  const presets = [
    { id: "center", label: pick("Center", "مرکز"), x: 50, y: 50 },
    { id: "thirds", label: pick("Rule ⅓", "قانون ⅓"), x: 33, y: 33 },
    {
      id: "lower-right",
      label: pick("Lower right", "پایین راست"),
      x: 68,
      y: 62,
    },
  ];

  return (
    <PlaygroundShell
      title={pick("Focal Point Lab", "آزمایشگاه نقطه کانونی")}
      description={pick(
        "Drag the subject. Size, contrast, and background blur compete to own the eye.",
        "سوژه را بکش. اندازه، کنتراست و بلور پس‌زمینه برای جلب چشم رقابت می‌کنند.",
      )}
      onReset={() => {
        setPos({ x: 58, y: 42 });
        setTools({ ...DEFAULT });
      }}
      stageLabel={pick(
        "Draggable focal point stage",
        "صحنهٔ نقطه کانونی قابل‌کشیدن",
      )}
      stageClassName="h-72 sm:h-80"
      stage={
        <div
          ref={stageRef}
          className="relative h-full w-full overflow-hidden bg-[#121214]"
        >
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, #27272a 0%, transparent 55%), radial-gradient(ellipse at 70% 70%, #1f1f23 0%, #0a0a0b 70%)",
              filter: tools.blurBg > 0 ? `blur(${tools.blurBg}px)` : undefined,
            }}
            aria-hidden
          />
          {/* thirds guide */}
          <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-lab-line" />
            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-lab-line" />
            <div className="absolute right-0 left-0 top-1/3 h-px bg-lab-line" />
            <div className="absolute right-0 left-0 top-2/3 h-px bg-lab-line" />
          </div>
          <button
            type="button"
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-sm border border-lab-accent/80 bg-lab-accent shadow-[0_0_0_999px_transparent] active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-accent"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: tools.size,
              height: tools.size * 0.75,
              filter: `contrast(${tools.contrast})`,
            }}
            aria-label={pick("Drag focal subject", "کشیدن سوژهٔ کانونی")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Position presets", "پیش‌تنظیم موقعیت")}
            className="flex flex-wrap gap-2"
          >
            {presets.map((p) => (
              <LabButton
                key={p.id}
                variant="outline"
                pressed={Math.abs(pos.x - p.x) < 1 && Math.abs(pos.y - p.y) < 1}
                onClick={() => setPos({ x: p.x, y: p.y })}
              >
                {p.label}
              </LabButton>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <LabSlider
              label={pick("Size", "اندازه")}
              unit="px"
              min={28}
              max={96}
              step={1}
              value={tools.size}
              onChange={(size) => setTools((t) => ({ ...t, size }))}
            />
            <LabSlider
              label={pick("Contrast", "کنتراست")}
              min={0.4}
              max={1.4}
              step={0.05}
              value={tools.contrast}
              onChange={(contrast) => setTools((t) => ({ ...t, contrast }))}
            />
            <LabSlider
              label={pick("BG blur", "بلور پس‌زمینه")}
              unit="px"
              min={0}
              max={12}
              step={1}
              value={tools.blurBg}
              onChange={(blurBg) => setTools((t) => ({ ...t, blurBg }))}
            />
          </div>
          <LabReadout
            label={pick("pos:", "موقعیت:")}
            value={`${pos.x.toFixed(0)}%, ${pos.y.toFixed(0)}%`}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
