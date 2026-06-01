import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

type Props = { flip?: boolean; intensity?: number };

export function KineticWave({ flip = false, intensity = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [-120 * intensity, 120 * intensity]);
  const skew = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <div ref={ref} className="relative h-[42vh] w-full overflow-hidden" aria-hidden>
      <motion.svg
        viewBox="0 0 1600 600"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ x, skewY: skew, scaleY: flip ? -1 : 1 }}
      >
        <defs>
          <linearGradient id="wave-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.42 0.22 22)" />
            <stop offset="55%" stopColor="oklch(0.62 0.26 28)" />
            <stop offset="100%" stopColor="oklch(0.78 0.22 38)" />
          </linearGradient>
          <filter id="wave-blur"><feGaussianBlur stdDeviation="0.6" /></filter>
        </defs>
        <path
          d="M-100,300 C200,120 500,520 900,260 C1200,60 1450,420 1800,220 L1800,800 L-100,800 Z"
          fill="url(#wave-g)"
          filter="url(#wave-blur)"
        />
        <path
          d="M-100,360 C220,180 520,560 920,300 C1240,120 1480,460 1800,280"
          fill="none"
          stroke="oklch(0.92 0.05 40 / 0.18)"
          strokeWidth="1"
        />
      </motion.svg>
    </div>
  );
}
