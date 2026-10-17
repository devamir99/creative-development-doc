"use client";

import { useId } from "react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg";

export type LabSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type LabSelectProps = {
  id?: string;
  label: string;
  value: string;
  options: readonly LabSelectOption[];
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export function LabSelect({
  id,
  label,
  value,
  options,
  onChange,
  className = "",
  disabled = false,
}: LabSelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className={["flex min-w-[10rem] flex-col gap-2", className].join(" ")}>
      <label htmlFor={selectId} className="text-xs text-lab-muted">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={[
          "h-9 border border-lab-line bg-lab-panel px-3 font-mono text-xs text-lab-fg",
          "hover:border-lab-accent/40 disabled:cursor-not-allowed disabled:opacity-40",
          focusRing,
        ].join(" ")}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
