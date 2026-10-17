import Link from "next/link";

const phases = [
  { id: "01", title: "Camera", status: "~70%", href: "/docs/camera" },
  { id: "02", title: "Editing", status: "Done", href: "/docs/editing" },
  { id: "03", title: "Composition", status: "Done", href: "/docs/composition" },
  {
    id: "04",
    title: "Motion Design",
    status: "Now",
    href: "/docs/motion/timing",
  },
  { id: "05", title: "Storytelling", status: "Next", href: "/docs/storytelling" },
  { id: "06", title: "Light & Color", status: "Soon", href: "/docs/lighting" },
  { id: "07", title: "Creative Web", status: "Soon", href: "/docs/creative-web" },
] as const;

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="lab-glow pointer-events-none absolute inset-0" />
      <div className="lab-grid pointer-events-none absolute inset-0" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <p className="text-sm tracking-[0.2em] text-lab-muted uppercase">
          Development Handbook
        </p>
        <Link
          href="/docs"
          className="text-sm text-lab-accent transition-opacity hover:opacity-80"
        >
          Open docs →
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-20 pt-10">
        <p className="mb-4 font-[family-name:var(--font-display)] text-xs tracking-[0.25em] text-lab-accent uppercase">
          Creative Lab
        </p>
        <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl md:text-7xl">
          Learn cinematic craft.
          <br />
          <span className="text-lab-muted">Ship interactive demos.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-lab-muted">
          Personal operating manual for camera, composition, motion, and creative
          web — each lesson with docs, playground, and reusable code.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/docs/motion/timing"
            className="inline-flex h-12 items-center bg-lab-accent px-6 text-sm font-medium text-lab-accent-fg transition-opacity hover:opacity-90"
          >
            Continue: Timing
          </Link>
          <Link
            href="/docs/composition"
            className="inline-flex h-12 items-center border border-lab-line px-6 text-sm text-lab-fg transition-colors hover:border-lab-accent/40"
          >
            Review Composition
          </Link>
        </div>

        <section className="mt-20">
          <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-lab-muted uppercase">
            Curriculum
          </h2>
          <ul className="divide-y divide-lab-line border-y border-lab-line">
            {phases.map((phase) => (
              <li key={phase.id}>
                <Link
                  href={phase.href}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-lab-accent"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-lab-muted">
                      {phase.id}
                    </span>
                    <span className="text-lg tracking-tight">{phase.title}</span>
                  </span>
                  <span
                    className={
                      phase.status === "Now"
                        ? "font-mono text-xs text-lab-accent"
                        : "font-mono text-xs text-lab-muted"
                    }
                  >
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
