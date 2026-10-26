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

function DocsContentFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-8 md:px-8" aria-hidden>
      <div className="h-9 w-2/3 max-w-xl rounded-md bg-muted" />
      <div className="h-5 w-full max-w-2xl rounded-md bg-muted/70" />
      <div className="mt-6 flex flex-col gap-3">
        <div className="h-4 w-full rounded-md bg-muted/50" />
        <div className="h-4 w-[92%] rounded-md bg-muted/50" />
        <div className="h-4 w-[85%] rounded-md bg-muted/50" />
        <div className="h-4 w-[70%] rounded-md bg-muted/50" />
      </div>
    </div>
  );
}

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

export default function Page(
  props: PageProps<"/[lang]/docs/[[...slug]]">,
) {
  return (
    <Suspense fallback={<DocsContentFallback />}>
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
