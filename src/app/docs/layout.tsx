import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        // Depth-1 sections (Camera, Editing, …) start open so lesson links
        // are in the HTML. Closed Radix CollapsibleContent SSR's empty, so
        // submenus only appear after client hydration + a click.
        defaultOpenLevel: 1,
      }}
    >
      {children}
    </DocsLayout>
  );
}
