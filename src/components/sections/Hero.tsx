import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PROFILE } from "@/data/portfolio";
import { SplitText } from "@/components/ui/SplitText";
import { ShinyText } from "@/components/ui/ShinyText";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-6 pb-10 pt-8 md:px-12 md:pt-10">
      {/* Top bar */}
      <div className="z-10 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-ink-muted">
        <span>SJ — Index / 2026</span>
        <div className="hidden gap-10 md:flex">
          <a href="#work" className="transition-colors hover:text-coral" data-magnetic>Work</a>
          <a href="#experience" className="transition-colors hover:text-coral" data-magnetic>Experience</a>
          <a href="#archive" className="transition-colors hover:text-coral" data-magnetic>Archive</a>
          <a href="#contact" className="transition-colors hover:text-coral" data-magnetic>Contact</a>
        </div>
        <span className="hidden md:block">{PROFILE.location}</span>
      </div>

      {/* Display name */}
      <motion.div style={{ y: y1, opacity, scale }} className="z-10 mt-16">
        <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-ink-muted">
          <span className="inline-block h-px w-10 bg-coral" />
          Portfolio · Volume I
        </div>
        <h1 className="font-display text-balance text-[clamp(4.5rem,16vw,22rem)] font-normal leading-[0.82] text-ink">
          <motion.span
            initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            Shaurya
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block italic text-coral"
          >
            Jain
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-coral"
          >
            .
          </motion.span>
        </h1>
      </motion.div>

      {/* Bottom meta */}
      <motion.div style={{ y: y2 }} className="z-10 mt-12 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
        <p className="md:col-span-5 md:col-start-1 max-w-md text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
          {PROFILE.tagline} Founder building <a href="https://whyspai.com" target="_blank" rel="noopener noreferrer" className="text-ink underline-offset-4 transition-colors hover:text-coral hover:underline" data-magnetic><ShinyText>Whysp AI</ShinyText></a>, ex-student of orbits and aerosols, currently turning curiosity into companies.
        </p>
        <div className="md:col-span-3 md:col-start-7 space-y-1 font-mono text-[11px] uppercase tracking-widest text-ink-dim">
          <div className="flex justify-between"><span>Role</span><span className="text-ink">Founder · CEO</span></div>
          <div className="flex justify-between"><span>Status</span><span className="text-coral">Available — Selectively</span></div>
          <div className="flex justify-between"><span>Year</span><span className="text-ink">MMXXVI</span></div>
        </div>
        <div className="md:col-span-2 md:col-start-11 text-right">
          <a href="#contact" className="group inline-flex items-center gap-2 font-display text-2xl italic text-ink transition-colors hover:text-coral" data-magnetic>
            Get in touch
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

