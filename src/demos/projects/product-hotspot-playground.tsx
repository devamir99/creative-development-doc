"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabButton, LabReadout } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

function HotspotLoading() {
  const { common } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {common.loadingWebgl}
    </div>
  );
}

const ProductHotspotScene = dynamic(
  () => import("./product-hotspot-scene").then((m) => m.ProductHotspotScene),
  {
    ssr: false,
    loading: () => <HotspotLoading />,
  },
);

const SNIPPET_EN = `// Product pattern: orbit + hotspot pick
selected = "{{id}}";
// Spec panel stays synced to the pick`;

const SNIPPET_FA = `// الگوی محصول: چرخش مداری + انتخاب هات‌اسپات
selected = "{{id}}";
// پنل مشخصات با انتخاب هم‌گام می‌ماند`;

export function ProductHotspotPlayground() {
  const { pick } = useLocale();
  const [selected, setSelected] = useState<string | null>("upper");

  const hotspots = [
    {
      id: "sole" as const,
      label: pick("Sole", "زیره"),
      note: pick("Grip + stack height", "چسبندگی + ارتفاع پشته"),
    },
    {
      id: "upper" as const,
      label: pick("Upper", "رویه"),
      note: pick("Knit shell", "پوستهٔ بافت"),
    },
    {
      id: "laces" as const,
      label: pick("Laces", "بندها"),
      note: pick("Contrast tip", "نوک متضاد"),
    },
  ];

  const active = hotspots.find((h) => h.id === selected) ?? null;

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {
    id: selected ?? "none",
  });

  return (
    <PlaygroundShell
      title={pick("3D Product Hotspots (mini)", "هات‌اسپات محصول سه‌بعدی (مینی)")}
      description={pick(
        "Click the markers on the product block. Spec panel updates — same pattern as a configurator without the full SKU matrix.",
        "نشانگرهای بلوک محصول را بزن. پنل مشخصات به‌روز می‌شود — همان الگوی کانفیگوراتور بدون ماتریس کامل SKU.",
      )}
      onReset={() => setSelected("upper")}
      stageLabel={pick("Product hotspot stage", "صحنه هات‌اسپات محصول")}
      stageClassName="h-72 sm:h-80"
      stage={
        <div
          className="grid h-full grid-cols-1 sm:grid-cols-[1fr_9rem]"
          dir="ltr"
        >
          <ProductHotspotScene selected={selected} onSelect={setSelected} />
          <aside className="border-t border-lab-line bg-[#101012] p-3 sm:border-t-0 sm:border-l">
            <p className="font-mono text-[10px] text-lab-muted uppercase">
              {pick("Spec", "مشخصات")}
            </p>
            <p className="mt-2 text-sm text-lab-fg">
              {active?.label ?? "—"}
            </p>
            <p className="mt-1 text-xs text-lab-muted">
              {active?.note ?? pick("Pick a hotspot", "یک هات‌اسپات انتخاب کن")}
            </p>
          </aside>
        </div>
      }
      controls={
        <div className="flex flex-wrap gap-2">
          {hotspots.map((h) => (
            <LabButton
              key={h.id}
              variant="outline"
              pressed={selected === h.id}
              onClick={() => setSelected(h.id)}
            >
              {h.label}
            </LabButton>
          ))}
          <LabReadout
            label={pick("hotspot:", "هات‌اسپات:")}
            value={active?.label ?? "—"}
          />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
