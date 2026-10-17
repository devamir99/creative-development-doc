"use client";

import type { ReactNode } from "react";
import { LabButton } from "@/components/ui";

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
  const hasActions = Boolean(onReset || onReplay || onPause || children);
  if (!hasActions) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {onReplay ? (
        <LabButton variant="outline" onClick={onReplay}>
          Replay
        </LabButton>
      ) : null}
      {onPause ? (
        <LabButton
          variant="outline"
          pressed={isPaused}
          onClick={onPause}
          aria-pressed={isPaused}
        >
          {isPaused ? "Resume" : "Pause"}
        </LabButton>
      ) : null}
      {onReset ? (
        <LabButton variant="ghost" onClick={onReset}>
          Reset
        </LabButton>
      ) : null}
      {children}
    </div>
  );
}
