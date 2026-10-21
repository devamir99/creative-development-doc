"use client";

import type { ReactNode } from "react";
import { LabButton } from "@/components/ui";
import { useLocale } from "@/i18n/locale";

export type PlaygroundToolbarProps = {
  onReset?: () => void;
  onReplay?: () => void;
  onPause?: () => void;
  isPaused?: boolean;
  /** Extra actions rendered after the standard buttons */
  children?: ReactNode;
};

export function PlaygroundToolbar({
  onReset,
  onReplay,
  onPause,
  isPaused = false,
  children,
}: PlaygroundToolbarProps) {
  const { common } = useLocale();
  const hasActions = Boolean(onReset || onReplay || onPause || children);
  if (!hasActions) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {onReplay ? (
        <LabButton variant="outline" onClick={onReplay}>
          {common.replay}
        </LabButton>
      ) : null}
      {onPause ? (
        <LabButton
          variant="outline"
          pressed={isPaused}
          onClick={onPause}
          aria-pressed={isPaused}
        >
          {isPaused ? common.resume : common.pause}
        </LabButton>
      ) : null}
      {onReset ? (
        <LabButton variant="ghost" onClick={onReset}>
          {common.reset}
        </LabButton>
      ) : null}
      {children}
    </div>
  );
}
