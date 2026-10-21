"use client";

import type { ButtonHTMLAttributes } from "react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg";

const variants = {
  solid:
    "bg-lab-accent text-lab-accent-fg hover:opacity-90 border border-transparent",
  outline:
    "border border-lab-line text-lab-fg hover:border-lab-accent/50 bg-transparent",
  ghost: "border border-transparent text-lab-muted hover:text-lab-fg",
} as const;

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
} as const;

export type LabButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Visual pressed/active state (e.g. selected preset) */
  pressed?: boolean;
};

export function LabButton({
  variant = "outline",
  size = "sm",
  pressed,
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}: LabButtonProps) {
  const resolvedVariant = pressed ? "solid" : variant;

  return (
    <button
      type={type}
      disabled={disabled}
      aria-pressed={pressed}
      className={[
        "inline-flex items-center justify-center font-mono transition-colors disabled:pointer-events-none disabled:opacity-40",
        sizes[size],
        variants[resolvedVariant],
        focusRing,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
