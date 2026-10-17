/**
 * MDX component map for curriculum pages.
 * Every interactive demo used in `content/docs/**` must be registered here
 * before the MDX tag will resolve. See docs/architecture/CONTENT_SYSTEM.md.
 */
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { DollyZoomPlayground } from "@/demos/camera/dolly-zoom-playground";
import { DofPlayground } from "@/demos/camera/dof-playground";
import { FovPlayground } from "@/demos/camera/fov-playground";
import { FundamentalsPlayground } from "@/demos/camera/fundamentals-playground";
import { OrbitPlayground } from "@/demos/camera/orbit-playground";
import { BalancePlayground } from "@/demos/composition/balance-playground";
import { CenterPlayground } from "@/demos/composition/center-playground";
import { FocalPointPlayground } from "@/demos/composition/focal-point-playground";
import { TensionPlayground } from "@/demos/composition/tension-playground";
import { ThirdsPlayground } from "@/demos/composition/thirds-playground";
import { RaycastPlayground } from "@/demos/creative-web/raycast-playground";
import { ScrollProgressPlayground } from "@/demos/creative-web/scroll-progress-playground";
import { CritiquePlayground } from "@/demos/direction/critique-playground";
import { VisualLanguagePlayground } from "@/demos/direction/visual-language-playground";
import { CutTimelinePlayground } from "@/demos/editing/cut-timeline-playground";
import { JlCutPlayground } from "@/demos/editing/jl-cut-playground";
import { TransitionPlayground } from "@/demos/editing/transition-playground";
import { ThreePointPlayground } from "@/demos/lighting/three-point-playground";
import { AnticipationPlayground } from "@/demos/motion/anticipation-playground";
import { EasingPlayground } from "@/demos/motion/easing-playground";
import { ParallaxPlayground } from "@/demos/motion/parallax-playground";
import { StaggerPlayground } from "@/demos/motion/stagger-playground";
import { TimingPlayground } from "@/demos/motion/timing-playground";
import { CinematicLandingPlayground } from "@/demos/projects/cinematic-landing-playground";
import { PortfolioMotifPlayground } from "@/demos/projects/portfolio-motif-playground";
import { ProductHotspotPlayground } from "@/demos/projects/product-hotspot-playground";
import { MotifPlayground } from "@/demos/storytelling/motif-playground";
import { PacingPlayground } from "@/demos/storytelling/pacing-playground";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    TimingPlayground,
    EasingPlayground,
    StaggerPlayground,
    AnticipationPlayground,
    ParallaxPlayground,
    FundamentalsPlayground,
    FovPlayground,
    DollyZoomPlayground,
    OrbitPlayground,
    DofPlayground,
    CutTimelinePlayground,
    JlCutPlayground,
    TransitionPlayground,
    FocalPointPlayground,
    BalancePlayground,
    ThirdsPlayground,
    TensionPlayground,
    CenterPlayground,
    ThreePointPlayground,
    PacingPlayground,
    MotifPlayground,
    ScrollProgressPlayground,
    RaycastPlayground,
    VisualLanguagePlayground,
    CritiquePlayground,
    CinematicLandingPlayground,
    ProductHotspotPlayground,
    PortfolioMotifPlayground,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
