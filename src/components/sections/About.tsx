import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { personalInfo, summary, languages, education } from "@/data/portfolio";
import AmbientFlares from "@/components/effects/AmbientFlares";
import { EarthScene } from "@/components/three/CinematicModels";

const STATS = [
  { value: "4",  suffix: "+",  label: "YEARS AT ATOS" },
  { value: "30", suffix: "%",  label: "FASTER INCIDENTS" },
  { value: "20", suffix: "%",  label: "TIME SAVED" },
] as const;

function SectionMarker() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
      <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--grey-600)", letterSpacing: "0.2em", textTransform: "uppercase" }}>001 · ABOUT</span>
    </div>
  );
}

function TiltCard() {
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 900, border: `1px solid ${hovered ? "var(--cyan)" : "var(--border)"}`, background: hovered ? "rgba(0,212,255,0.02)" : "rgba(255,255,255,0.02)", transition: "border-color 0.3s, background 0.3s" }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { mx.set(0); my.set(0); setHovered(false); }}
      className="rounded-[2px] p-8">
      <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", color: hovered ? "var(--cyan)" : "var(--grey-600)", textTransform: "uppercase", marginBottom: 16, transition: "color 0.3s" }}>LANGUAGES</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {languages.map(({ language, level }) => (
          <span key={language} style={{ border: `1px solid ${hovered ? "rgba(0,212,255,0.25)" : "rgba(255,255,255,0.1)"}`, borderRadius: 2, padding: "4px 12px", fontSize: 12, color: hovered ? "var(--grey-100)" : "var(--grey-300)", letterSpacing: "0.05em", transition: "border-color 0.3s, color 0.3s" }}>
            {language} · {level}
          </span>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${hovered ? "rgba(0,212,255,0.2)" : "var(--border)"}`, paddingTop: 24, transition: "border-color 0.3s" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", color: hovered ? "var(--cyan)" : "var(--grey-600)", textTransform: "uppercase", marginBottom: 16, transition: "color 0.3s" }}>EDUCATION</p>
        <p style={{ fontSize: 15, fontWeight: 300, color: "var(--white)", marginBottom: 4 }}>{education.degree}</p>
        <p style={{ fontFamily: "monospace", fontSize: 13, color: "var(--grey-500)", marginBottom: 16 }}>{education.university} · {education.location}</p>
        <p style={{ fontSize: 32, fontWeight: 300, color: "var(--white)", lineHeight: 1 }}>5.0</p>
        <p style={{ fontSize: 13, color: "var(--grey-400)", fontStyle: "italic", marginTop: 8 }}>{education.award}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const leftRef  = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  useScrollAnimation(leftRef as React.RefObject<Element | null>);
  useStaggerAnimation(statsRef as React.RefObject<Element | null>);
  useScrollAnimation(rightRef as React.RefObject<Element | null>, { from: { opacity: 0, x: 48 }, to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, start: "top 80%" });

  return (
    <section id="about" className="relative py-[60px] md:py-[160px] px-6" style={{ background: "transparent" }}>
      {/* Gradient overlay to dissolve the hard seam from the hero section above */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140, background: "linear-gradient(to bottom, #060608, transparent)", zIndex: 10, pointerEvents: "none" }} />
      <AmbientFlares count={4} intensity="low" />
      <EarthScene className="absolute inset-0 opacity-[0.13] md:inset-auto md:right-0 md:top-0 md:h-full md:w-[520px] md:opacity-100" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-16 md:grid-cols-2 md:items-center" style={{ zIndex: 1 }}>
        <div ref={leftRef}>
          <SectionMarker />
          <h2 style={{ fontSize: "var(--text-section)", fontWeight: 300, color: "var(--grey-100)", lineHeight: 1.1, letterSpacing: "0.02em", marginBottom: 24 }}>
            Passionate about<br />
            <span style={{ color: "var(--white)" }}>building <span style={{ color: "var(--cyan)" }}>things</span></span>
          </h2>
          <p style={{ fontSize: "var(--text-body)", color: "var(--grey-300)", lineHeight: 1.9, maxWidth: 540, marginBottom: 16 }}>{personalInfo.tagline}.</p>
          <p style={{ fontSize: "var(--text-body)", color: "var(--grey-300)", lineHeight: 1.9, maxWidth: 540, marginBottom: 48 }}>{summary}</p>
          <div ref={statsRef} className="flex gap-8 flex-wrap">
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} style={{ borderRight: "1px solid rgba(255,255,255,0.06)", paddingRight: 32 }}>
                <p style={{ fontSize: 52, fontWeight: 300, color: "var(--white)", lineHeight: 1 }}>
                  {value}<span style={{ color: "var(--cyan)" }}>{suffix}</span>
                </p>
                <p style={{ fontFamily: "monospace", fontSize: 11, color: "var(--grey-500)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 8 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div ref={rightRef}>
          <TiltCard />
        </div>
      </div>
    </section>
  );
}
