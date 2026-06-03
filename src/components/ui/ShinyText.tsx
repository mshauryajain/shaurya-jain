import { ReactNode } from "react";

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  speed?: number; // Speed in seconds
}

export function ShinyText({ children, className = "", speed = 4 }: ShinyTextProps) {
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        color: "oklch(0.97 0.01 60 / 60%)",
        backgroundImage: "linear-gradient(120deg, transparent 35%, oklch(0.97 0.01 60) 50%, transparent 65%)",
        backgroundSize: "200% 100%",
        backgroundPositionX: "-200%",
        backgroundRepeat: "no-repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        animation: `shiny-text-glow ${speed}s linear infinite`,
      }}
    >
      <style>{`
        @keyframes shiny-text-glow {
          0% { background-position-x: 200%; }
          100% { background-position-x: -200%; }
        }
      `}</style>
      {children}
    </span>
  );
}
