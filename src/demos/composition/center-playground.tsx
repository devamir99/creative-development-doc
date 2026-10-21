"use client";

import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout, LabSlider } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

const SNIPPET_EN = `// Facing right — leave lead room ahead of the subject
subject.x = {{x}}%; // 50 = center
facing = "right";
// Too little lead room → compressed / tense`;

const SNIPPET_FA = `// رو به راست — فضای پیش‌رو را جلوی سوژه بگذار
subject.x = {{x}}%; // 50 = مرکز
facing = "right";
// فضای پیش‌رو کم → فشرده / پرتنش`;

export function CenterPlayground() {
  const { pick } = useLocale();
  const [x, setX] = useState(50);
  const [facing, setFacing] = useState<"left" | "right">("right");

  const leadRoom =
    facing === "right" ? 100 - x : x;
  const feel =
    Math.abs(x - 50) < 3
      ? pick("centered statement", "بیانیهٔ مرکزی")
      : leadRoom < 22
        ? pick("compressed / tense", "فشرده / پرتنش")
        : leadRoom > 45
          ? pick("open lead room", "فضای پیش‌روی باز")
          : pick("off-center active", "خارج‌مرکز فعال");

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {
    x: Math.round(x),
  });

  return (
    <PlaygroundShell
      title={pick("Center vs Off-Center", "مرکز در برابر خارج‌مرکز")}
      description={pick(
        "Center reads as statement. Off-center activates space — especially lead room in the facing direction.",
        "مرکز مثل بیانیه خوانده می‌شود. خارج‌مرکز فضا را فعال می‌کند — به‌ویژه فضای پیش‌رو در جهت نگاه.",
      )}
      onReset={() => {
        setX(50);
        setFacing("right");
      }}
      stageLabel={pick(
        "Center versus off-center stage",
        "صحنهٔ مرکز در برابر خارج‌مرکز",
      )}
      stageClassName="h-72 sm:h-80"
      stage={
        <div className="relative flex h-full items-center bg-[#101012]">
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-lab-line/50" />
          <div
            className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1"
            style={{
              left: `${x}%`,
              transform: `translate(-50%, -50%) scaleX(${facing === "left" ? -1 : 1})`,
            }}
          >
            <div className="h-16 w-20 bg-lab-accent" />
            <div
              className="h-0 w-0 border-y-8 border-y-transparent border-l-[14px] border-l-lab-accent"
              aria-hidden
            />
          </div>
        </div>
      }
      controls={
        <div className="flex w-full flex-col gap-3">
          <div
            role="group"
            aria-label={pick("Facing", "جهت نگاه")}
            className="flex flex-wrap gap-2"
          >
            <LabButton
              variant="outline"
              pressed={facing === "left"}
              onClick={() => setFacing("left")}
            >
              {pick("Face left", "نگاه به چپ")}
            </LabButton>
            <LabButton
              variant="outline"
              pressed={facing === "right"}
              onClick={() => setFacing("right")}
            >
              {pick("Face right", "نگاه به راست")}
            </LabButton>
            <LabButton variant="outline" onClick={() => setX(50)}>
              {pick("Snap center", "چسباندن به مرکز")}
            </LabButton>
            <LabButton
              variant="outline"
              onClick={() => setX(facing === "right" ? 35 : 65)}
            >
              {pick("Lead room", "فضای پیش‌رو")}
            </LabButton>
          </div>
          <LabSlider
            label={pick("Subject X", "موقعیت X سوژه")}
            unit="%"
            min={15}
            max={85}
            step={1}
            value={x}
            onChange={setX}
          />
          <div className="flex flex-wrap gap-4">
            <LabReadout
              label={pick("lead≈", "پیش‌رو≈")}
              value={`${leadRoom.toFixed(0)}%`}
            />
            <LabReadout label={pick("feel:", "حس:")} value={feel} />
          </div>
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
