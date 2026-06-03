import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { PROJECTS } from "@/data/portfolio";
import { SectionLabel } from "./Experience";

export function Projects() {
  return (
    <section id="work" className="relative px-6 py-32 md:px-12 md:py-48">
      <SectionLabel index="02" title="Selected Work" subtitle="Things shipped, things in orbit" />
      <div className="mx-auto mt-20 grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-12">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [index === 0 ? 80 : 0, index === 0 ? -80 : -40]);
  const big = index === 0;

  // 3D Tilt calculations
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [8, -8]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-8, 8]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(relativeX);
    tiltY.set(relativeY);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.article
      ref={ref}
      style={{ y, rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border border-line bg-card/40 p-8 backdrop-blur-sm transition-[border-color] duration-700 hover:border-coral/40 md:p-10 ${
        big ? "md:col-span-8 md:row-span-2" : "md:col-span-4"
      }`}
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-coral/10 blur-3xl transition-all duration-1000 group-hover:bg-coral/25" />
      <div className="relative flex h-full min-h-[320px] flex-col justify-between">
        <div>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-ink-dim">
            <span>{project.kind}</span>
            <span>{project.period}</span>
          </div>
          <h3 className={`mt-6 font-display leading-[0.95] text-ink ${big ? "text-[clamp(3rem,7vw,7rem)]" : "text-[clamp(2rem,3vw,3.5rem)]"}`}>
            {project.name}
          </h3>
          <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-ink-muted md:text-base">
            {project.blurb}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full border border-line/80 bg-canvas/60 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
      {big && (
        <svg viewBox="0 0 400 400" className="pointer-events-none absolute -bottom-10 -right-10 h-80 w-80 opacity-60 mix-blend-screen" aria-hidden>
          <defs>
            <radialGradient id="orb">
              <stop offset="0%" stopColor="oklch(0.78 0.22 38)" />
              <stop offset="60%" stopColor="oklch(0.50 0.22 22)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="180" fill="url(#orb)" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="oklch(1 0 0 / 0.18)" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="oklch(1 0 0 / 0.10)" />
        </svg>
      )}
    </motion.article>
  );
}
