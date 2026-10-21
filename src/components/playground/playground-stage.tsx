"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/i18n/locale";

export type PlaygroundStageProps = {
  children: ReactNode;
  className?: string;
  /** Accessible name for the visual stage region */
  label?: string;
};

export function PlaygroundStage({
  children,
  className = "",
  label,
}: PlaygroundStageProps) {
  const { common } = useLocale();
  return (
    <div
      role="group"
      aria-label={label ?? common.demoStage}
      className={[
        "relative min-h-36 border-b border-lab-line bg-lab-bg/40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
