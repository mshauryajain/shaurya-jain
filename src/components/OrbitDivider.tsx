import { useEffect, useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";

interface OrbitDividerProps {
  speedMultiplier?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function OrbitDivider({ speedMultiplier = 1 }: OrbitDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Link scroll progress to globe rotation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scrollRotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 1.5]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate wireframe sphere vertices (latitude/longitude grid)
    const points: Point3D[] = [];
    const lines: [number, number][] = [];
    const radius = 110;
    const latBands = 10;
    const lonBands = 14;

    // Create sphere points
    for (let lat = 0; lat <= latBands; lat++) {
      const theta = (lat * Math.PI) / latBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon < lonBands; lon++) {
        const phi = (lon * 2 * Math.PI) / lonBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = radius * sinTheta * cosPhi;
        const y = radius * cosTheta;
        const z = radius * sinTheta * sinPhi;

        points.push({ x, y, z });
      }
    }

    // Connect sphere lines
    for (let lat = 0; lat < latBands; lat++) {
      for (let lon = 0; lon < lonBands; lon++) {
        const p1 = lat * lonBands + lon;
        const p2 = lat * lonBands + ((lon + 1) % lonBands);
        const p3 = (lat + 1) * lonBands + lon;

        // Longitude lines
        lines.push([p1, p2]);
        // Latitude lines
        if (lat < latBands) {
          lines.push([p1, p3]);
        }
      }
    }

    // Generate orbiting satellite particles
    const satellites = [
      { angle: 0, speed: 0.015, rx: 190, ry: 45, tilt: 0.4, color: "oklch(0.72 0.22 35)" }, // Coral satellite
      { angle: Math.PI / 2, speed: -0.01, rx: 170, ry: 35, tilt: -0.5, color: "oklch(0.62 0.25 28)" }, // Ember satellite
      { angle: Math.PI, speed: 0.008, rx: 210, ry: 60, tilt: 0.25, color: "oklch(0.97 0.01 60)" }, // Ink/White satellite
    ];

    // Interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.2;
    let targetRotationY = 0;
    let rotationX = 0.2;
    let rotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      // Mouse drives slight tilt offset
      targetRotationY = (x / width) * 0.8;
      targetRotationX = (y / height) * 0.8;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.005 * speedMultiplier;

      // Interpolate rotation towards target (mouse-driven + auto-rotate)
      rotationX += (targetRotationX - rotationX) * 0.05;
      // Base rotation + scroll rotation + mouse offset
      const currentScrollRot = scrollRotation.get();
      const finalRotY = time + currentScrollRot + rotationY;
      rotationY += (targetRotationY - rotationY) * 0.05;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(finalRotY);
      const sinY = Math.sin(finalRotY);

      // Helper to project 3D to 2D
      const project = (p: Point3D) => {
        // Rotate Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        // Rotate X axis
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 350;
        const zOffset = 300;
        const scale = fov / (fov + z2 + zOffset);
        
        return {
          x: width / 2 + x1 * scale,
          y: height / 2 + y2 * scale,
          depth: z2,
          visible: z2 > -180, // depth clipping
        };
      };

      // Project all sphere points
      const projectedPoints = points.map(project);

      // Draw Grid / Constellation lines
      ctx.lineWidth = 0.6;
      for (const [i1, i2] of lines) {
        const pt1 = projectedPoints[i1];
        const pt2 = projectedPoints[i2];

        if (pt1.visible && pt2.visible) {
          const avgDepth = (pt1.depth + pt2.depth) / 2;
          // Fade lines in the background
          const opacity = Math.max(0.02, 1 - (avgDepth + radius) / (radius * 2)) * 0.16;
          ctx.strokeStyle = `oklch(0.97 0.01 60 / ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        }
      }

      // Draw Orbital Rings & Satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed * speedMultiplier;

        // Generate 3D orbit ring coordinates
        const ringPoints: Point3D[] = [];
        const steps = 60;
        
        for (let i = 0; i <= steps; i++) {
          const stepAngle = (i * 2 * Math.PI) / steps;
          
          // Coordinate in orbit plane
          const px = Math.cos(stepAngle) * sat.rx;
          const py = Math.sin(stepAngle) * sat.ry;
          
          // Tilt the orbit plane
          const cosT = Math.cos(sat.tilt);
          const sinT = Math.sin(sat.tilt);
          
          const x = px;
          const y = py * cosT;
          const z = py * sinT;
          
          ringPoints.push({ x, y, z });
        }

        // Project and draw orbit ring
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `oklch(0.97 0.01 60 / 0.06)`;
        
        ringPoints.forEach((p, idx) => {
          const pt = project(p);
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Project and draw Satellite position
        const sat3D = {
          x: Math.cos(sat.angle) * sat.rx,
          y: Math.sin(sat.angle) * sat.ry * Math.cos(sat.tilt),
          z: Math.sin(sat.angle) * sat.ry * Math.sin(sat.tilt),
        };
        const satProj = project(sat3D);

        // Draw glow path trailing the satellite
        const trailLength = 8;
        for (let t = 0; t < trailLength; t++) {
          const trailAngle = sat.angle - sat.speed * t * 1.5;
          const trail3D = {
            x: Math.cos(trailAngle) * sat.rx,
            y: Math.sin(trailAngle) * sat.ry * Math.cos(sat.tilt),
            z: Math.sin(trailAngle) * sat.ry * Math.sin(sat.tilt),
          };
          const trailProj = project(trail3D);
          const size = Math.max(0.5, (3 - t * 0.35) * (satProj.depth > 0 ? 1.2 : 0.8));
          const opacity = (1 - t / trailLength) * 0.5 * (satProj.depth > 0 ? 1 : 0.4);

          ctx.beginPath();
          ctx.arc(trailProj.x, trailProj.y, size, 0, Math.PI * 2);
          ctx.fillStyle = sat.color.includes("oklch") ? sat.color.replace(")", ` / ${opacity})`) : sat.color;
          ctx.fill();
        }
      });

      // Draw subtle core sphere glow
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, radius
      );
      grad.addColorStop(0, "oklch(0.72 0.22 35 / 0.03)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speedMultiplier, scrollRotation]);

  return (
    <div ref={containerRef} className="relative h-[45vh] w-full overflow-hidden flex items-center justify-center" aria-hidden>
      {/* Decorative vertical lines representing system axes */}
      <div className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-line/30 to-transparent" />
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-line/30 to-transparent" />
      
      {/* 3D Projection Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
