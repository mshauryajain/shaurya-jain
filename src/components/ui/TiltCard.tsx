import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for the rotation angles
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Motion values for the glow spot
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative positions from center (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);

    // Glow spotlight positions
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${className}`}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full rounded-[var(--radius)]"
      >
        {/* Cursor Glow Spotlight (rendered underneath cards but inside the container) */}
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[var(--radius)] opacity-0 blur-[80px] transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(150px circle at ${glowX}px ${glowY}px, oklch(0.72 0.22 35 / 0.15), transparent)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Spot Light Overlay for borders */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 rounded-[var(--radius)] border border-transparent transition-opacity duration-300"
          style={{
            background: `radial-gradient(200px circle at ${glowX}px ${glowY}px, oklch(0.72 0.22 35 / 0.12), transparent 80%)`,
            borderImage: `radial-gradient(120px circle at ${glowX}px ${glowY}px, oklch(0.72 0.22 35 / 0.35), transparent 70%) 1`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Internal content wrapped in 3D depth */}
        <div style={{ transform: "translateZ(20px)" }} className="h-full w-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
