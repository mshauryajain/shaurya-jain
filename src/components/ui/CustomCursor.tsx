import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Position of the mouse (Framer Motion values)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Springs for the smooth trailing ring (slime-like trailing inertia)
  const ringX = useSpring(mouseX, { damping: 35, stiffness: 140, mass: 0.8 });
  const ringY = useSpring(mouseY, { damping: 35, stiffness: 140, mass: 0.8 });

  // Spring dimensions for scaling/morphing the cursor (fluid stretching and snapping)
  const cursorWidth = useSpring(8, { damping: 28, stiffness: 160 });
  const cursorHeight = useSpring(8, { damping: 28, stiffness: 160 });
  const cursorRadius = useSpring(9999, { damping: 28, stiffness: 160 });

  // Use refs for event handler tracking to avoid stale closures and listener re-registration
  const isHoveredRef = useRef(false);
  const hoveredElRef = useRef<HTMLElement | null>(null);

  // Hide the cursor on mobile touch screens
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const mobile = (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(max-width: 768px)").matches
    );
    setIsMobile(mobile);

    if (!mobile) {
      document.documentElement.style.cursor = "none";
      const style = document.createElement("style");
      style.id = "custom-cursor-hide-style";
      style.innerHTML = "* { cursor: none !important; }";
      document.head.appendChild(style);

      return () => {
        document.documentElement.style.cursor = "";
        const targetStyle = document.getElementById("custom-cursor-hide-style");
        if (targetStyle) targetStyle.remove();
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const isHoveredVal = isHoveredRef.current;
      const hoveredElVal = hoveredElRef.current;

      if (isHoveredVal && hoveredElVal) {
        const rect = hoveredElVal.getBoundingClientRect();
        // Snap the ring center to the element center
        mouseX.set(rect.left + rect.width / 2);
        mouseY.set(rect.top + rect.height / 2);
      } else {
        // Normal follow
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }

      // Add trail particles when mouse moves (not when hovering snapped buttons)
      if (!isHoveredVal && Math.random() < 0.6) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 3 + 1,
          alpha: 1,
          color: Math.random() > 0.45 
            ? "oklch(0.72 0.22 35)" 
            : "oklch(0.62 0.25 28)",
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-magnetic]") as HTMLElement | null;

      if (interactive) {
        if (interactive !== hoveredElRef.current) {
          hoveredElRef.current = interactive;
          isHoveredRef.current = true;
          setIsHovered(true);

          // Stretch the cursor to wrap the hovered element
          const rect = interactive.getBoundingClientRect();
          cursorWidth.set(rect.width + 16);
          cursorHeight.set(rect.height + 12);
          
          const style = window.getComputedStyle(interactive);
          const radius = parseInt(style.borderRadius) || 0;
          cursorRadius.set(radius + 4);
        }
      } else if (isHoveredRef.current) {
        hoveredElRef.current = null;
        isHoveredRef.current = false;
        setIsHovered(false);

        cursorWidth.set(8);
        cursorHeight.set(8);
        cursorRadius.set(9999);
      }
    };

    // Use passive listener for scroll/mouse events to optimize scroll performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Particles draw loop
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(")", ` / ${p.alpha})`);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(updateParticles);
    };
    updateParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Particle Canvas Trail */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] h-full w-full overflow-hidden"
      />

      {/* Trailing Spring Cursor Bubble */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: cursorWidth,
          height: cursorHeight,
          borderRadius: cursorRadius,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] bg-white mix-blend-difference"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Tiny sharp center point */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-coral transition-opacity duration-200"
        animate={{
          opacity: isHovered ? 0 : 1,
        }}
      />
    </>
  );
}
