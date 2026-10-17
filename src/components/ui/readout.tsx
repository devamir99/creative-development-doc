import type { ReactNode } from "react";

export type LabReadoutProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

/**
 * Numeric / status readout for playground control panels.
 * Server-safe (no client hooks).
 */
export function LabReadout({
  label,
  value,
  className = "",
}: LabReadoutProps) {
  return (
    <div
      className={[
        "inline-flex items-baseline gap-2 font-mono text-xs text-lab-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{label}</span>
      <span className="text-lab-fg tabular-nums">{value}</span>
    </div>
  );
}
