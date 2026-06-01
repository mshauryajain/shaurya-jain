import { HONORS, CERTIFICATIONS, TEST_SCORES, VOLUNTEERING } from "@/data/portfolio";
import { SectionLabel } from "./Experience";

export function Archive() {
  return (
    <section id="archive" className="relative px-6 py-32 md:px-12 md:py-48">
      <SectionLabel index="04" title="Archive" subtitle="Honors, certifications, scores, service" />

      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-12">
        <Column title="Honors & Awards" count={HONORS.length} className="md:col-span-7">
          <ul className="divide-y divide-line">
            {HONORS.map((h, i) => (
              <li key={i} className="grid grid-cols-12 gap-3 py-4 transition-colors hover:text-coral">
                <span className="col-span-1 font-mono text-[10px] tracking-widest text-ink-dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="col-span-8 text-pretty text-sm text-ink md:text-base">{h.title}</span>
                <span className="col-span-3 text-right font-mono text-[11px] uppercase tracking-widest text-ink-muted">{h.year}</span>
                <span className="col-span-12 -mt-3 pl-[8.333%] text-xs text-ink-dim">{h.org}</span>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Certifications" count={CERTIFICATIONS.length} className="md:col-span-5">
          <ul className="divide-y divide-line">
            {CERTIFICATIONS.map((c, i) => (
              <li key={i} className="py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-pretty text-sm text-ink md:text-base">{c.name}</span>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-ink-muted">{c.date}</span>
                </div>
                <div className="mt-1 text-xs text-ink-dim">{c.org}</div>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Test Scores" count={TEST_SCORES.length} className="md:col-span-5">
          <ul className="divide-y divide-line">
            {TEST_SCORES.map((t, i) => (
              <li key={i} className="py-5">
                <div className="font-display text-2xl text-coral">{t.score}</div>
                <div className="mt-1 text-sm text-ink">{t.name}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-muted">{t.note} · {t.date}</div>
              </li>
            ))}
          </ul>
        </Column>

        <Column title="Volunteering" count={VOLUNTEERING.length} className="md:col-span-7">
          <ul className="divide-y divide-line">
            {VOLUNTEERING.map((v, i) => (
              <li key={i} className="py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h4 className="text-pretty font-display text-xl text-ink">{v.role}</h4>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">{v.period}</span>
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-ink-dim">{v.org}</div>
                <p className="mt-3 text-sm text-ink-muted">{v.blurb}</p>
              </li>
            ))}
          </ul>
        </Column>
      </div>
    </section>
  );
}

function Column({
  title,
  count,
  className = "",
  children,
}: {
  title: string;
  count: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-6 flex items-end justify-between border-b border-line pb-3">
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">{count} entries</span>
      </div>
      {children}
    </div>
  );
}
