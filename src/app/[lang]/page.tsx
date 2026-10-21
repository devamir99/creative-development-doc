import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/farsiui/badge";
import { Button } from "@/components/farsiui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/farsiui/card";
import { Separator } from "@/components/farsiui/separator";
import { isLocale, type Locale } from "@/lib/i18n";

type Phase = {
  id: string;
  title: string;
  href: string;
  desc?: string;
};

type Copy = {
  eyebrow: string;
  openDocs: string;
  brand: string;
  titleA: string;
  titleB: string;
  intro: string;
  primary: string;
  primaryHref: string;
  secondary: string;
  secondaryHref: string;
  curriculum: string;
  enterSection: string;
  phases: Phase[];
  otherLang: string;
  otherHref: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: "Documentation",
    openDocs: "Browse docs →",
    brand: "Creative Lab",
    titleA: "Cinematic craft,",
    titleB: "documented.",
    intro:
      "A handbook for camera, composition, motion, and creative web — every lesson pairs clear writing with an interactive playground and reusable code.",
    primary: "Browse documentation",
    primaryHref: "/docs",
    secondary: "Start with Camera",
    secondaryHref: "/docs/camera",
    curriculum: "Sections",
    enterSection: "Open section →",
    phases: [
      { id: "01", title: "Camera", href: "/docs/camera" },
      { id: "02", title: "Editing", href: "/docs/editing" },
      { id: "03", title: "Composition", href: "/docs/composition" },
      { id: "04", title: "Motion Design", href: "/docs/motion" },
      { id: "05", title: "Storytelling", href: "/docs/storytelling" },
      { id: "06", title: "Light & Color", href: "/docs/lighting" },
      { id: "07", title: "Creative Web", href: "/docs/creative-web" },
    ],
    otherLang: "فارسی",
    otherHref: "/fa",
  },
  fa: {
    eyebrow: "مستندات",
    openDocs: "مشاهدهٔ مستندات ←",
    brand: "Creative Lab",
    titleA: "هنر سینمایی،",
    titleB: "مستند شده.",
    intro:
      "مرجع دوربین، تدوین، ترکیب‌بندی، حرکت و وب خلاقانه — هر درس با متن روشن، دموی تعاملی و کدی که می‌توانی در پروژه‌ات به کار ببری.",
    primary: "مشاهدهٔ مستندات",
    primaryHref: "/docs",
    secondary: "شروع از دوربین",
    secondaryHref: "/docs/camera",
    curriculum: "بخش‌ها",
    enterSection: "باز کردن بخش ←",
    phases: [
      {
        id: "۰۱",
        title: "دوربین",
        href: "/docs/camera",
        desc: "حرکت دوربین، عمق میدان و اندازهٔ نما",
      },
      {
        id: "۰۲",
        title: "تدوین",
        href: "/docs/editing",
        desc: "برش، ریتم و گذار بین صحنه‌ها",
      },
      {
        id: "۰۳",
        title: "ترکیب‌بندی",
        href: "/docs/composition",
        desc: "تعادل، نقطهٔ کانونی و هدایت چشم",
      },
      {
        id: "۰۴",
        title: "طراحی حرکت",
        href: "/docs/motion",
        desc: "زمان‌بندی، ایزینگ و فنر",
      },
      {
        id: "۰۵",
        title: "داستان‌گویی",
        href: "/docs/storytelling",
        desc: "ریتم روایت، موتیف و آشکارسازی",
      },
      {
        id: "۰۶",
        title: "نور و رنگ",
        href: "/docs/lighting",
        desc: "نورپردازی سه‌نقطه‌ای، دمای رنگ و مه",
      },
      {
        id: "۰۷",
        title: "وب خلاقانه",
        href: "/docs/creative-web",
        desc: "GSAP، اسکرول و WebGL در مرورگر",
      },
    ],
    otherLang: "English",
    otherHref: "/en",
  },
};

function FaHome({ t, docs }: { t: Copy; docs: (href: string) => string }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="lab-glow pointer-events-none absolute inset-0" />
      <div className="lab-grid pointer-events-none absolute inset-0" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Badge variant="secondary">{t.eyebrow}</Badge>
        <div className="flex items-center gap-4">
          <Link
            href={t.otherHref}
            className="text-sm text-lab-muted transition-colors hover:text-lab-accent"
          >
            {t.otherLang}
          </Link>
          <Link
            href={docs("/docs")}
            className="text-sm text-lab-accent transition-opacity hover:opacity-80"
          >
            {t.openDocs}
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pt-10 pb-20">
        <p className="mb-4 text-xs font-semibold text-lab-accent">{t.brand}</p>
        <h1 className="max-w-3xl text-5xl leading-[1.25] font-extrabold sm:text-6xl md:text-7xl">
          {t.titleA}
          <br />
          <span className="text-lab-muted">{t.titleB}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-loose text-lab-muted">
          {t.intro}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="outline">۶۵ درس</Badge>
          <Badge variant="outline">۳۶ دموی تعاملی</Badge>
          <Badge variant="outline">فارسی و English</Badge>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={docs(t.primaryHref)} />}
          >
            {t.primary}
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href={docs(t.secondaryHref)} />}
          >
            {t.secondary}
          </Button>
        </div>

        <Separator className="my-14 bg-lab-line" />

        <section>
          <h2 className="mb-6 text-sm font-bold text-lab-muted">
            {t.curriculum}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.phases.map((phase) => (
              <Link key={phase.id} href={docs(phase.href)} className="group">
                <Card className="h-full border-lab-line bg-lab-panel transition-colors group-hover:border-lab-accent/50">
                  <CardHeader>
                    <span className="text-xs text-lab-muted">{phase.id}</span>
                    <CardTitle className="text-lg text-lab-fg">
                      {phase.title}
                    </CardTitle>
                    {phase.desc ? (
                      <CardDescription className="leading-relaxed text-lab-muted">
                        {phase.desc}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm text-lab-accent">
                      {t.enterSection}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = COPY[lang];
  return {
    title: `${t.titleA} ${t.titleB}`,
    description: t.intro,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        fa: "/fa",
        "x-default": "/en",
      },
    },
    openGraph: {
      title: `${t.titleA} ${t.titleB}`,
      description: t.intro,
      url: `/${lang}`,
      locale: lang === "fa" ? "fa_IR" : "en_US",
      alternateLocale: lang === "fa" ? ["en_US"] : ["fa_IR"],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = COPY[lang];
  const docs = (href: string) => `/${lang}${href}`;

  if (lang === "fa") {
    return <FaHome t={t} docs={docs} />;
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="lab-glow pointer-events-none absolute inset-0" />
      <div className="lab-grid pointer-events-none absolute inset-0" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <p className="text-sm tracking-[0.2em] text-lab-muted uppercase">
          {t.eyebrow}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={t.otherHref}
            className="text-sm text-lab-muted transition-colors hover:text-lab-accent"
          >
            {t.otherLang}
          </Link>
          <Link
            href={docs("/docs")}
            className="text-sm text-lab-accent transition-opacity hover:opacity-80"
          >
            {t.openDocs}
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pt-10 pb-20">
        <p className="mb-4 font-[family-name:var(--font-display)] text-xs tracking-[0.25em] text-lab-accent uppercase">
          {t.brand}
        </p>
        <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl md:text-7xl">
          {t.titleA}
          <br />
          <span className="text-lab-muted">{t.titleB}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-lab-muted">
          {t.intro}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={docs(t.primaryHref)}
            className="inline-flex h-12 items-center bg-lab-accent px-6 text-sm font-medium text-lab-accent-fg transition-opacity hover:opacity-90"
          >
            {t.primary}
          </Link>
          <Link
            href={docs(t.secondaryHref)}
            className="inline-flex h-12 items-center border border-lab-line px-6 text-sm text-lab-fg transition-colors hover:border-lab-accent/40"
          >
            {t.secondary}
          </Link>
        </div>

        <section className="mt-20">
          <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-lab-muted uppercase">
            {t.curriculum}
          </h2>
          <ul className="divide-y divide-lab-line border-y border-lab-line">
            {t.phases.map((phase) => (
              <li key={phase.id}>
                <Link
                  href={docs(phase.href)}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-lab-accent"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-lab-muted">
                      {phase.id}
                    </span>
                    <span className="text-lg tracking-tight">{phase.title}</span>
                  </span>
                  <span className="font-mono text-xs text-lab-muted opacity-0 transition-opacity group-hover:opacity-100">
                    {t.enterSection}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
