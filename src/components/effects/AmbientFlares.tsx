import { useMemo } from "react";

interface FlareConfig {
  id: number;
  top: string;
  left: string;
  size: number;
  blur: number;
  duration: number;
  delay: number;
  peak: number;
  isStreak: boolean;
  rotation: number;
}

interface Props {
  count: number;
  intensity: "low" | "medium" | "high";
}

const INTENSITY = {
  low:    { peakMin: 0.3, peakMax: 0.5, blurMin: 6, blurMax: 9,  delayMax: 14000 },
  medium: { peakMin: 0.5, peakMax: 0.7, blurMin: 4, blurMax: 7,  delayMax: 11000 },
  high:   { peakMin: 0.7, peakMax: 1.0, blurMin: 2, blurMax: 5,  delayMax: 8000  },
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function AmbientFlares({ count, intensity }: Props) {
  const cfg = INTENSITY[intensity];

  const flares = useMemo<FlareConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top:      `${rand(4, 92)}%`,
      left:     `${rand(4, 92)}%`,
      size:     rand(6, 16),
      blur:     rand(cfg.blurMin, cfg.blurMax),
      duration: rand(1500, 3500),
      delay:    rand(0, cfg.delayMax),
      peak:     rand(cfg.peakMin, cfg.peakMax),
      isStreak: Math.random() < 0.2,
      rotation: rand(0, 360),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {flares.map((f) => (
        <div
          key={f.id}
          style={{
            position:        "absolute",
            top:             f.top,
            left:            f.left,
            width:           f.isStreak ? "2px"      : `${f.size}px`,
            height:          f.isStreak ? "20px"     : `${f.size}px`,
            borderRadius:    f.isStreak ? "0"        : "50%",
            background:      "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
            filter:          `blur(${f.blur}px)`,
            transform:       f.isStreak ? `rotate(${f.rotation}deg)` : undefined,
            animation:       `flare-pulse ${f.duration}ms ease-in-out ${f.delay}ms infinite`,
            ["--flare-peak" as string]: String(f.peak),
          }}
        />
      ))}
    </div>
  );
}
