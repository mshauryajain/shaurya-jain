import { useEffect, useRef } from "react";

export function LiquidBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 30, ty = 35, cx = 30, cy = 35;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 60 + 10;
      ty = (e.clientY / window.innerHeight) * 60 + 10;
    };
    const loop = () => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      el.style.setProperty("--mx", `${cx}%`);
      el.style.setProperty("--my", `${cy}%`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div ref={ref} className="liquid" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.06_0.005_20/0.85)_85%)]" />
    </div>
  );
}
