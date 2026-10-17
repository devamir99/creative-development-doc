"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LabButton } from "@/components/ui";
import { copyText } from "@/lib/playground";

export type PlaygroundCodePanelProps = {
  language: string;
  /** Live snippet — should already be synced to playground params via `formatSnippet` */
  value: string;
};

export function PlaygroundCodePanel({
  language,
  value,
}: PlaygroundCodePanelProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const resetTimer = useRef<number | null>(null);
  const statusId = useId();

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  async function handleCopy() {
    const ok = await copyText(value);
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
    }
    setCopied(ok);
    setCopyFailed(!ok);
    resetTimer.current = window.setTimeout(() => {
      setCopied(false);
      setCopyFailed(false);
      resetTimer.current = null;
    }, 1500);
  }

  const status = copied ? "Copied" : copyFailed ? "Copy failed" : "Copy";

  return (
    <div className="border-t border-lab-line">
      <div className="flex items-center justify-between gap-2 border-b border-lab-line px-4 py-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-lab-muted uppercase">
          {language}
        </span>
        <LabButton
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-describedby={statusId}
        >
          {status}
        </LabButton>
      </div>
      <p
        id={statusId}
        className="-m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap"
        style={{ clip: "rect(0, 0, 0, 0)", position: "absolute" }}
        aria-live="polite"
      >
        {copied ? "Code copied to clipboard" : copyFailed ? "Copy failed" : ""}
      </p>
      <pre
        dir="ltr"
        className="lab-ltr overflow-x-auto bg-lab-bg/60 px-4 py-3 font-mono text-xs leading-relaxed text-lab-fg"
      >
        <code>{value}</code>
      </pre>
    </div>
  );
}
