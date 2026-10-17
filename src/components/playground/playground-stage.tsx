import type { ReactNode } from "react";

export type PlaygroundStageProps = {
  children: ReactNode;
  className?: string;
  /** Accessible name for the visual stage region */
  label?: string;
};

export function PlaygroundStage({
  children,
  className = "",
  label = "Demo stage",
}: PlaygroundStageProps) {
  return (
    <div
      role="img"
      aria-label={label}
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
