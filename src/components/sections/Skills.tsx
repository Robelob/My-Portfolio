import { useRef, useState } from "react";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { skills, type SkillsMap } from "@/data/portfolio";
import AmbientFlares from "@/components/effects/AmbientFlares";
import { SectionCanvas, CrystalShards } from "@/components/three/SpaceObjects";

type Category = keyof SkillsMap;

function SectionMarker() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
      <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--grey-600)", letterSpacing: "0.2em", textTransform: "uppercase" }}>003 · SKILLS</span>
    </div>
  );
}

function SkillCard({ category, items }: { category: Category; items: string[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderTop: `1px solid ${hovered ? "var(--cyan)" : "rgba(255,255,255,0.08)"}`, paddingTop: 20, transition: "border-color 0.3s" }}>
      <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: hovered ? "var(--cyan)" : "var(--grey-600)", marginBottom: 16, transition: "color 0.3s" }}>
        {category}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((skill) => (
          <span key={skill} style={{ border: `1px solid ${hovered ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: 2, padding: "4px 10px", fontSize: 12, color: hovered ? "var(--grey-200)" : "var(--grey-400)", letterSpacing: "0.04em", transition: "border-color 0.3s, color 0.3s" }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  useScrollAnimation(headingRef as React.RefObject<Element | null>);
  useStaggerAnimation(gridRef as React.RefObject<Element | null>, { childSelector: ":scope > *", stagger: 0.1, start: "top 85%" });

  const entries = Object.entries(skills) as [Category, string[]][];

  return (
    <section id="skills" className="relative py-[60px] md:py-[160px] px-6" style={{ background: "transparent" }}>
      <AmbientFlares count={5} intensity="medium" />
      <SectionCanvas className="absolute inset-0 opacity-[0.13] md:inset-auto md:right-0 md:top-0 md:h-full md:w-[380px] md:opacity-80">
        <CrystalShards />
      </SectionCanvas>
      <div className="relative mx-auto max-w-6xl" style={{ zIndex: 1 }}>
        <div ref={headingRef}>
          <SectionMarker />
          <h2 style={{ fontSize: "var(--text-section)", fontWeight: 300, color: "var(--grey-100)", lineHeight: 1.1, letterSpacing: "0.02em", marginBottom: 64 }}>
            Tools of<br />
            <span style={{ color: "var(--white)" }}>the <span style={{ color: "var(--cyan)" }}>craft</span></span>
          </h2>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {entries.map(([category, items]) => (
            <SkillCard key={category} category={category} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
}
