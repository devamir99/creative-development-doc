/**
 * MDX component map for curriculum pages.
 * Every interactive demo used in `content/docs/**` must be registered here
 * before the MDX tag will resolve. See docs/architecture/CONTENT_SYSTEM.md.
 */
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { DollyZoomPlayground } from "@/demos/camera/dolly-zoom-playground";
import { FovPlayground } from "@/demos/camera/fov-playground";
import { OrbitPlayground } from "@/demos/camera/orbit-playground";
import { EasingPlayground } from "@/demos/motion/easing-playground";
import { TimingPlayground } from "@/demos/motion/timing-playground";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Lesson demos (add new playgrounds below)
    TimingPlayground,
    EasingPlayground,
    FovPlayground,
    DollyZoomPlayground,
    OrbitPlayground,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
