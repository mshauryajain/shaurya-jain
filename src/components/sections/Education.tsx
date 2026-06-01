import { EDUCATION } from "@/data/portfolio";
import { SectionLabel } from "./Experience";

export function Education() {
  return (
    <section className="relative px-6 py-32 md:px-12 md:py-48">
      <SectionLabel index="03" title="Education" subtitle="Schools, cohorts, programs" />
      <div className="mx-auto mt-20 max-w-7xl divide-y divide-line">
        {EDUCATION.map((e, i) => (
          <div key={i} className="group grid grid-cols-12 gap-4 py-10 transition-colors hover:bg-coral/[0.03] md:py-12">
            <div className="col-span-12 font-mono text-[11px] uppercase tracking-widest text-ink-dim md:col-span-2">
              {e.period}
            </div>
            <div className="col-span-12 md:col-span-6">
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-tight text-ink transition-colors group-hover:text-coral">
                {e.school}
              </h3>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-ink-muted">{e.degree}</p>
            </div>
            <p className="col-span-12 text-pretty text-sm leading-relaxed text-ink-muted md:col-span-4">
              {e.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
