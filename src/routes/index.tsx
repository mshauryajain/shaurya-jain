import { createFileRoute } from "@tanstack/react-router";
import { LiquidBackground } from "@/components/LiquidBackground";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Archive } from "@/components/sections/Archive";
import { Contact } from "@/components/sections/Contact";
import { OrbitDivider } from "@/components/OrbitDivider";
import { Marquee } from "@/components/Marquee";
import { MARQUEE } from "@/data/portfolio";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { StarfieldBackground } from "@/components/ui/StarfieldBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shaurya Jain — Founder, Builder, Student of Space & Systems" },
      { name: "description", content: "Portfolio of Shaurya Jain — Founder of Whysp AI, AstroVent India, NASA citizen scientist, Stanford Code in Place 2026." },
      { property: "og:title", content: "Shaurya Jain — Portfolio" },
      { property: "og:description", content: "Founder. Builder. Student of space & systems." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <CustomCursor />
      <StarfieldBackground />
      <SmoothScroll />
      <LiquidBackground />

      <div className="dot-matrix" />
      <div className="grain" />

      <main className="relative z-[2]">
        <Hero />
        <OrbitDivider speedMultiplier={1.1} />
        <Experience />
        <Marquee words={MARQUEE} />
        <Projects />
        <OrbitDivider speedMultiplier={0.8} />
        <Education />
        <Archive />
        <OrbitDivider speedMultiplier={1.3} />
        <Contact />
      </main>
    </>
  );
}
