import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EXPERIENCE } from "@/data/portfolio";
import { TiltCard } from "@/components/ui/TiltCard";

export function Experience() {
  return (
    <section id="experience" className="relative px-6 py-32 md:px-12 md:py-48">
      <SectionLabel index="01" title="Experience" subtitle="Companies, missions, internships" />
      <div className="mx-auto mt-20 max-w-7xl">
        {EXPERIENCE.map((e, i) => (
          <Row key={i} idx={i} item={e} />
        ))}
      </div>
    </section>
  );
}

function Row({ idx, item }: { idx: number; item: (typeof EXPERIENCE)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [idx % 2 === 0 ? -40 : 40, idx % 2 === 0 ? 40 : -40]);

  return (
    <motion.div
      ref={ref}
      style={{ x }}
      className="group relative grid grid-cols-12 items-baseline gap-4 border-t border-line py-10 md:py-14"
    >
      <span className="col-span-12 font-mono text-[11px] uppercase tracking-widest text-ink-dim md:col-span-1">
        / {String(idx + 1).padStart(2, "0")}
      </span>
      <div className="col-span-12 md:col-span-7">
        <h3 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] text-ink transition-colors duration-500 group-hover:text-coral">
          {item.company}
        </h3>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-ink-muted md:text-base">
          {item.blurb}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span key={t} className="rounded-full border border-line/80 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="col-span-12 space-y-1 font-mono text-[11px] uppercase tracking-widest text-ink-muted md:col-span-4 md:text-right">
        <div className="text-ink">{item.title}</div>
        <div>{item.period}</div>
        <div className="text-ink-dim">{item.duration} · {item.place}</div>
      </div>
    </motion.div>
  );
}

export function SectionLabel({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex max-w-7xl items-end justify-between gap-6 border-b border-line pb-6"
    >
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-coral">§ {index}</div>
        <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4rem)] leading-none text-ink">{title}</h2>
      </div>
      {subtitle && (
        <div className="hidden font-mono text-[11px] uppercase tracking-widest text-ink-dim md:block">{subtitle}</div>
      )}
    </motion.div>
  );
}
