import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMDXComponents } from "@/components/mdx";
import { isLocale } from "@/lib/i18n";
import { source } from "@/lib/source";

type DocsParams = Promise<{ lang: string; slug?: string[] }>;

async function DocsContent({ params }: { params: DocsParams }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export default async function Page(
  props: PageProps<"/[lang]/docs/[[...slug]]">,
) {
  // Resolve the page BEFORE the Suspense boundary so unknown slugs throw
  // notFound() before streaming starts (real 404, not a soft-404 200).
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();
  if (!source.getPage(slug, lang)) notFound();

  return (
    <Suspense fallback={null}>
      <DocsContent params={props.params} />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return source.generateParams("slug", "lang");
}

export async function generateMetadata(
  props: PageProps<"/[lang]/docs/[[...slug]]">,
): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const slugPath = slug?.length ? `/${slug.join("/")}` : "";
  const pathFor = (locale: string) => `/${locale}/docs${slugPath}`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: pathFor(lang),
      languages: {
        en: pathFor("en"),
        fa: pathFor("fa"),
        "x-default": pathFor("en"),
      },
    },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: pathFor(lang),
      locale: lang === "fa" ? "fa_IR" : "en_US",
      alternateLocale: lang === "fa" ? ["en_US"] : ["fa_IR"],
    },
  };
}
