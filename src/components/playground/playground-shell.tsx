"use client";

import type { ReactNode } from "react";
import { PlaygroundCodePanel } from "./playground-code-panel";
import { PlaygroundErrorBoundary } from "./playground-error-boundary";
import { PlaygroundStage } from "./playground-stage";
import { PlaygroundToolbar } from "./playground-toolbar";

export type PlaygroundShellProps = {
  title: string;
  description?: string;
  onReset?: () => void;
  onReplay?: () => void;
  onPause?: () => void;
  isPaused?: boolean;
  stage: ReactNode;
  /** Optional aria-label for the stage */
  stageLabel?: string;
  stageClassName?: string;
  controls?: ReactNode;
  code?: { language: string; value: string };
  className?: string;
};

export function PlaygroundShell({
  title,
  description,
  onReset,
  onReplay,
  onPause,
  isPaused,
  stage,
  stageLabel,
  stageClassName,
  controls,
  code,
  className = "",
}: PlaygroundShellProps) {
  return (
    <div
      dir="ltr"
      className={[
        "lab-ltr not-prose my-8 overflow-hidden rounded-xl border border-lab-line bg-lab-panel",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PlaygroundErrorBoundary onReset={onReset}>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-lab-line px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-[0.2em] text-lab-accent uppercase">
              {title}
            </p>
            {description ? (
              <p className="mt-1 text-sm text-lab-muted">{description}</p>
            ) : null}
          </div>
          <PlaygroundToolbar
            onReset={onReset}
            onReplay={onReplay}
            onPause={onPause}
            isPaused={isPaused}
          />
        </div>

        <PlaygroundStage label={stageLabel} className={stageClassName}>
          {stage}
        </PlaygroundStage>

        {controls ? (
          <div className="flex flex-wrap items-center gap-2 px-4 py-4">
            {controls}
          </div>
        ) : null}

        {code ? (
          <PlaygroundCodePanel language={code.language} value={code.value} />
        ) : null}
      </PlaygroundErrorBoundary>
    </div>
  );
}
