"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

const SNIPPET_EN = `const camera = {{mode}}; // persp shrinks with distance, ortho does not`;
const SNIPPET_FA = `const camera = {{mode}}; // پرسپکتیو با فاصله کوچک می‌شود، اورتو نه`;

export function ProjectionPlayground() {
  const { fa, pick } = useLocale();
  const [mode, setMode] = useState<"persp" | "ortho">("persp");
  const [distance, setDistance] = useState(50);
  const scaleNear = mode === "ortho" ? 1 : 1.35 - distance / 220;
  const scaleFar = mode === "ortho" ? 1 : 0.45 + distance / 260;

  return (
    <PlaygroundShell
      title={pick(
        "Perspective vs Orthographic",
        "پرسپکتیو در برابر اورتوگرافیک",
      )}
      description={pick(
        "Perspective: near bigger, far smaller, lines converge. Orthographic: size ignores distance — diagrams, UI, technical views.",
        "پرسپکتیو: نزدیک بزرگ‌تر، دور کوچک‌تر، خطوط همگرا می‌شوند. اورتوگرافیک: اندازه فاصله را نادیده می‌گیرد — دیاگرام، UI، نماهای فنی.",
      )}
      onReset={() => {
        setMode("persp");
        setDistance(50);
      }}
      stageLabel={pick(
        "Projection comparison stage",
        "صحنه مقایسه پروجکشن",
      )}
      stageClassName="h-72"
      stage={
        <div className="relative flex h-full items-center justify-center gap-16 overflow-hidden bg-[#101012]">
          <svg className="absolute inset-0 h-full w-full opacity-30">
            {mode === "persp" ? (
              <>
                <line x1="50%" y1="50%" x2="8%" y2="8%" stroke="#fafa05" />
                <line x1="50%" y1="50%" x2="92%" y2="8%" stroke="#fafa05" />
                <line x1="50%" y1="50%" x2="8%" y2="92%" stroke="#fafa05" />
                <line x1="50%" y1="50%" x2="92%" y2="92%" stroke="#fafa05" />
              </>
            ) : (
              <>
                <line x1="20%" y1="8%" x2="20%" y2="92%" stroke="#fafa05" />
                <line x1="50%" y1="8%" x2="50%" y2="92%" stroke="#fafa05" />
                <line x1="80%" y1="8%" x2="80%" y2="92%" stroke="#fafa05" />
              </>
            )}
          </svg>
          <div
            className="bg-lab-accent transition-all"
            style={{ width: 56 * scaleNear, height: 56 * scaleNear }}
          />
          <div
            className="bg-zinc-400 transition-all"
            style={{ width: 56 * scaleFar, height: 56 * scaleFar }}
          />
          <span className="absolute bottom-3 font-mono text-[10px] text-lab-muted">
            {pick(
              "same real size · near vs far",
              "اندازه واقعی یکسان · نزدیک در برابر دور",
            )}
          </span>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div className="flex gap-2">
            <LabButton
              variant="outline"
              pressed={mode === "persp"}
              onClick={() => setMode("persp")}
            >
              {pick("Perspective", "پرسپکتیو")}
            </LabButton>
            <LabButton
              variant="outline"
              pressed={mode === "ortho"}
              onClick={() => setMode("ortho")}
            >
              {pick("Orthographic", "اورتوگرافیک")}
            </LabButton>
          </div>
          <LabSlider
            label={pick("Separation", "جداسازی")}
            min={0}
            max={100}
            step={1}
            value={distance}
            onChange={setDistance}
            disabled={mode === "ortho"}
          />
          <LabReadout
            label={pick("depth cue:", "نشانه عمق:")}
            value={
              mode === "ortho"
                ? pick("none — flat/technical", "هیچ — تخت/فنی")
                : pick("strong — spatial", "قوی — فضایی")
            }
          />
        </div>
      }
      code={{
        language: "js",
        value: formatSnippet(fa ? SNIPPET_FA : SNIPPET_EN, { mode }),
      }}
    />
  );
}
