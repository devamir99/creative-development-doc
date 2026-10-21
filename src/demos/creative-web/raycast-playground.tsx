"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PlaygroundShell } from "@/components/playground";
import { LabReadout } from "@/components/ui";
import { useLocale } from "@/i18n/locale";
import { formatSnippet } from "@/lib/playground";

function WebglLoading() {
  const { pick } = useLocale();
  return (
    <div className="flex h-full items-center justify-center font-mono text-xs text-lab-muted">
      {pick("Loading WebGL…", "در حال بارگذاری WebGL…")}
    </div>
  );
}

const RaycastScene = dynamic(
  () => import("./raycast-scene").then((m) => m.RaycastScene),
  {
    ssr: false,
    loading: () => <WebglLoading />,
  },
);

const SNIPPET_EN = `// R3F: onPointerOver / onClick on meshes
mesh.onPointerOver = () => setHover(name);
mesh.onClick = () => setSelected(name);`;

const SNIPPET_FA = `// R3F: رویدادهای onPointerOver / onClick روی مش‌ها
mesh.onPointerOver = () => setHover(name);
mesh.onClick = () => setSelected(name);`;

export function RaycastPlayground() {
  const { fa, pick } = useLocale();
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const displayName = (name: string | null) => {
    if (!name) return "—";
    if (!fa) return name;
    if (name === "Left") return "چپ";
    if (name === "Center") return "مرکز";
    if (name === "Right") return "راست";
    return name;
  };

  const codeValue = formatSnippet(pick(SNIPPET_EN, SNIPPET_FA), {});

  return (
    <PlaygroundShell
      title={pick("Raycasting / Pointer Picking", "ری‌کستینگ / انتخاب با اشاره‌گر")}
      description={pick(
        "Hover and click the boxes — R3F wires pointer events through the raycaster for you.",
        "نشانگر را روی جعبه‌ها ببر و کلیک کن؛ R3F رویدادهای اشاره‌گر را خودش از ری‌کستر عبور می‌دهد.",
      )}
      onReset={() => {
        setHover(null);
        setSelected(null);
      }}
      stageLabel={pick("Raycast picking stage", "صحنه انتخاب با ری‌کستینگ")}
      stageClassName="h-72 sm:h-80"
      stage={
        <RaycastScene
          selected={selected}
          onHover={setHover}
          onSelect={setSelected}
        />
      }
      controls={
        <div className="flex flex-wrap gap-4">
          <LabReadout label={pick("hover:", "زیر نشانگر:")} value={displayName(hover)} />
          <LabReadout label={pick("selected:", "انتخاب‌شده:")} value={displayName(selected)} />
        </div>
      }
      code={{ language: "js", value: codeValue }}
    />
  );
}
