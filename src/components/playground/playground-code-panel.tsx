"use client";

import { useState } from "react";
import { LabButton } from "@/components/ui";

export type PlaygroundCodePanelProps = {
  language: string;
  value: string;
};

export function PlaygroundCodePanel({
  language,
  value,
}: PlaygroundCodePanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border-t border-lab-line">
      <div className="flex items-center justify-between gap-2 border-b border-lab-line px-4 py-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-lab-muted uppercase">
          {language}
        </span>
        <LabButton variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </LabButton>
      </div>
      <pre
        dir="ltr"
        className="lab-ltr overflow-x-auto bg-lab-bg/60 px-4 py-3 font-mono text-xs leading-relaxed text-lab-fg"
      >
        <code>{value}</code>
      </pre>
    </div>
  );
}
