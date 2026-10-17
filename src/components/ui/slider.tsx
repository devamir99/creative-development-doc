"use client";

import { useId } from "react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg";

export type LabSliderProps = {
  id?: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Optional unit suffix shown next to the value (e.g. "s") */
  unit?: string;
  className?: string;
  disabled?: boolean;
};

export function LabSlider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit,
  className = "",
  disabled = false,
}: LabSliderProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={["flex min-w-[12rem] flex-col gap-2", className].join(" ")}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-xs text-lab-muted">
          {label}
        </label>
        <span className="font-mono text-xs text-lab-fg tabular-nums">
          {value}
          {unit ? unit : null}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={[
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-lab-line accent-[var(--lab-accent)] disabled:cursor-not-allowed disabled:opacity-40",
          focusRing,
        ].join(" ")}
      />
    </div>
  );
}
