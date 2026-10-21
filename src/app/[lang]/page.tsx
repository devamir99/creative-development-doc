import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    openDocs: string;
    brand: string;
    titleA: string;
    titleB: string;
    intro: string;
    primary: string;
    secondary: string;
    curriculum: string;
    phases: { id: string; title: string; status: string; href: string }[];
    otherLang: string;
    otherHref: string;
  }
> = {
  en: {
    eyebrow: "Development Handbook",
    openDocs: "Open docs →",
    brand: "Creative Lab",
    titleA: "Learn cinematic craft.",
    titleB: "Ship interactive demos.",
    intro:
      "Personal operating manual for camera, composition, motion, and creative web — each lesson with docs, playground, and reusable code.",
    primary: "Continue: Timing",
    secondary: "Review Composition",
    curriculum: "Curriculum",
    phases: [
      { id: "01", title: "Camera", status: "Done", href: "/docs/camera" },
      { id: "02", title: "Editing", status: "Done", href: "/docs/editing" },
      { id: "03", title: "Composition", status: "Done", href: "/docs/composition" },
      { id: "04", title: "Motion Design", status: "Now", href: "/docs/motion/timing" },
      { id: "05", title: "Storytelling", status: "Done", href: "/docs/storytelling" },
      { id: "06", title: "Light & Color", status: "Done", href: "/docs/lighting" },
      { id: "07", title: "Creative Web", status: "Done", href: "/docs/creative-web" },
    ],
    otherLang: "فارسی",
    otherHref: "/fa",
  },
  fa: {
    eyebrow: "دفترچه توسعه",
    openDocs: "باز کردن داکیومنت ←",
    brand: "Creative Lab",
    titleA: "هنر سینمایی را یاد بگیر.",
    titleB: "دموی تعاملی بساز.",
    intro:
      "راهنمای شخصی دوربین، ترکیب‌بندی، حرکت و وب خلاقانه — هر درس با متن، دمو و کد قابل استفاده.",
    primary: "ادامه: زمان‌بندی",
    secondary: "مرور ترکیب‌بندی",
    curriculum: "برنامه درسی",
    phases: [
      { id: "۰۱", title: "دوربین", status: "کامل", href: "/docs/camera" },
      { id: "۰۲", title: "تدوین", status: "کامل", href: "/docs/editing" },
      { id: "۰۳", title: "ترکیب‌بندی", status: "کامل", href: "/docs/composition" },
      { id: "۰۴", title: "طراحی حرکت", status: "اکنون", href: "/docs/motion/timing" },
      { id: "۰۵", title: "داستان‌گویی", status: "کامل", href: "/docs/storytelling" },
      { id: "۰۶", title: "نور و رنگ", status: "کامل", href: "/docs/lighting" },
      { id: "۰۷", title: "وب خلاقانه", status: "کامل", href: "/docs/creative-web" },
    ],
    otherLang: "English",
    otherHref: "/en",
  },
};

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = COPY[lang];
  const docs = (href: string) => `/${lang}${href}`;

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
            href={docs("/docs/motion/timing")}
            className="inline-flex h-12 items-center bg-lab-accent px-6 text-sm font-medium text-lab-accent-fg transition-opacity hover:opacity-90"
          >
            {t.primary}
          </Link>
          <Link
            href={docs("/docs/composition")}
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
                  <span className="font-mono text-xs text-lab-muted">
                    {phase.status}
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
