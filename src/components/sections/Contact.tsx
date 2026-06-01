import { PROFILE } from "@/data/portfolio";

export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-coral">§ 05 — Contact</div>
        <h2 className="mt-6 font-display text-[clamp(3rem,11vw,12rem)] leading-[0.85] text-ink">
          Let's build
          <br />
          <span className="italic text-coral">something</span>
          <br />
          worth orbiting.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">Email</div>
            <a href={`mailto:${PROFILE.email}`} className="mt-2 inline-block font-display text-2xl text-ink transition-colors hover:text-coral md:text-3xl">
              {PROFILE.email}
            </a>
          </div>
          <div className="md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">Currently</div>
            <p className="mt-2 text-ink">Building Whysp.ai · Reading orbital mechanics · Open to selective collaborations.</p>
          </div>
          <div className="md:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">Elsewhere</div>
            <ul className="mt-2 space-y-1 text-ink">
              <li><a className="transition-colors hover:text-coral" href="#">LinkedIn ↗</a></li>
              <li><a className="transition-colors hover:text-coral" href="#">Whysp.ai ↗</a></li>
              <li><a className="transition-colors hover:text-coral" href="#">AstroVent ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">
          <span>© MMXXVI — {PROFILE.name}</span>
          <span>Crafted with motion, light, and red.</span>
          <span>v1.0 / Index</span>
        </div>
      </div>
    </section>
  );
}
