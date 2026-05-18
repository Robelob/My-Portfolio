import { useRef, useEffect } from "react";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

interface Star {
  x: number; y: number; z: number;
  r: number; opacity: number;
  speed: number; phase: number; isCyan: boolean;
}

export default function UniverseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lowPower  = usePerformanceMode();

  useEffect(() => {
    if (lowPower) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const setSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const isMobile = window.innerWidth < 768;
    // Stars distributed evenly on a full sphere shell (large radius for full-screen coverage)
    const stars: Star[] = Array.from({ length: isMobile ? 400 : 700 }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const rr    = 120 + Math.random() * 80;
      return {
        x:      rr * Math.sin(phi) * Math.cos(theta),
        y:      rr * Math.sin(phi) * Math.sin(theta),
        z:      rr * Math.cos(phi),
        r:      isMobile ? 0.6 + Math.random() * 1.6 : 0.4 + Math.random() * 1.2,
        opacity: isMobile ? 0.5 + Math.random() * 0.5 : 0.3 + Math.random() * 0.7,
        speed:  0.4 + Math.random() * 1.2,
        phase:  Math.random() * Math.PI * 2,
        isCyan: Math.random() < 0.06,
      };
    });

    let rotY = 0;
    let rotX = 0;
    let lastT = 0;
    let rafId: number;

    const draw = (t: number) => {
      const delta = lastT ? Math.min(t - lastT, 50) : 16;
      lastT = t;

      // Y: full revolution ≈ 3.5 min; X: gentle tilt ≈ 8 min
      rotY += 0.00003 * delta;
      rotX += 0.000012 * delta;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      const { width, height } = canvas;
      // fov must be based on max(width,height) so stars fill the full screen on any aspect ratio
      const fov = Math.max(width, height) * 1.2;
      const depthOffset = 240;

      ctx.fillStyle = "#060608";
      ctx.fillRect(0, 0, width, height);

      for (const s of stars) {
        // Rotate around Y axis
        const rx0 = s.x * cosY + s.z * sinY;
        const ry0 = s.y;
        const rz0 = -s.x * sinY + s.z * cosY;
        // Then rotate around X axis for full-sphere coverage
        const rx  = rx0;
        const ry  = ry0 * cosX - rz0 * sinX;
        const rz  = ry0 * sinX + rz0 * cosX;

        // Perspective projection — camera at origin looking into the sphere
        const depth = rz + depthOffset;
        if (depth < 5) continue;
        const proj = fov / depth;
        const sx   = rx * proj + width  * 0.5;
        const sy   = ry * proj + height * 0.5;
        if (sx < -2 || sx > width + 2 || sy < -2 || sy > height + 2) continue;

        // Twinkling
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.003 * s.speed + s.phase);
        const alpha   = s.opacity * twinkle;
        const ar      = Math.max(0.3, s.r * proj * 0.22);

        ctx.beginPath();
        ctx.arc(sx, sy, ar, 0, Math.PI * 2);
        ctx.fillStyle = s.isCyan
          ? `rgba(0,212,255,${alpha})`
          : `rgba(210,220,235,${alpha})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setSize);
    };
  }, [lowPower]);

  if (lowPower) {
    return (
      <div className="pointer-events-none fixed inset-0"
        style={{ zIndex: -2, background: "#060608" }} />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -2 }}
    />
  );
}
