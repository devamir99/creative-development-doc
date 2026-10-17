"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { formatSnippet } from "@/lib/playground";

const ProductHotspotScene = dynamic(
  () => import("./product-hotspot-scene").then((m) => m.ProductHotspotScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
        Loading WebGL…
      </div>
    ),
  },
);

const HOTSPOTS = [
  { id: "sole", label: "Sole", note: "Grip + stack height" },
  { id: "upper", label: "Upper", note: "Knit shell" },
  { id: "laces", label: "Laces", note: "Contrast tip" },
] as const;

const SNIPPET = `// Product pattern: orbit + hotspot pick
selected = "{{id}}";
// Spec panel stays synced to the pick`;

export function ProductHotspotPlayground() {
  const [selected, setSelected] = useState<string | null>("upper");
  const active = HOTSPOTS.find((h) => h.id === selected) ?? null;

  const codeValue = formatSnippet(SNIPPET, {
    id: selected ?? "none",
  });

  return (
    <PlaygroundShell
      title="3D Product Hotspots (mini)"
      description="Click the markers on the product block. Spec panel updates — same pattern as a configurator without the full SKU matrix."
      onReset={() => setSelected("upper")}
      stageLabel="Product hotspot stage"
      stageClassName="h-72 sm:h-80"
      stage={
        <div className="grid h-full grid-cols-1 sm:grid-cols-[1fr_9rem]">
          <ProductHotspotScene selected={selected} onSelect={setSelected} />
          <aside className="border-t border-lab-line bg-[#101012] p-3 sm:border-t-0 sm:border-l">
            <p className="font-mono text-[10px] text-lab-muted uppercase">Spec</p>
            <p className="mt-2 text-sm text-lab-fg">{active?.label ?? "—"}</p>
            <p className="mt-1 text-xs text-lab-muted">{active?.note ?? "Pick a hotspot"}</p>
          </aside>
        </div>
      }
      controls={
        <div className="flex flex-wrap gap-2">
          {HOTSPOTS.map((h) => (
            <LabButton
              key={h.id}
              variant="outline"
              pressed={selected === h.id}
              onClick={() => setSelected(h.id)}
            >
              {h.label}
            </LabButton>
          ))}
          <LabReadout label="hotspot:" value={active?.label ?? "—"} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
