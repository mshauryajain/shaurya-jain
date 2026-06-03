import { useEffect, useRef } from "react";

export function LiquidBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    
    const onMove = (e: MouseEvent) => {
      // Map mouse coordinates to displacement offset in pixels (-40px to 40px)
      tx = ((e.clientX / window.innerWidth) - 0.5) * 80;
      ty = ((e.clientY / window.innerHeight) - 0.5) * 80;
    };
    
    const loop = () => {
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      
      // Perform GPU-accelerated translation
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      {/* GPU-accelerated wrapper container */}
      <div ref={ref} className="absolute inset-0 will-change-transform">
        <div className="liquid" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(0.06_0.005_20/0.85)_85%)]" />
    </div>
  );
}
