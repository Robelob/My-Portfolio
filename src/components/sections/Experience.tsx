import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStaggerAnimation, useScrollAnimation } from "@/hooks/useScrollAnimation";
import { experience, type ExperienceEntry } from "@/data/portfolio";
import AmbientFlares from "@/components/effects/AmbientFlares";
import { MoonScene } from "@/components/three/CinematicModels";

type Tab = "fullstack" | "devops";

const TABS: { key: Tab; label: string }[] = [
  { key: "fullstack", label: "Full-Stack" },
  { key: "devops",    label: "DevOps & Cloud" },
];

function SectionMarker() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
      <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--grey-600)", letterSpacing: "0.2em", textTransform: "uppercase" }}>002 · EXPERIENCE</span>
    </div>
  );
}

function BulletText({ text, highlight }: { text: string; highlight: string | null }) {
  if (!highlight) return <span>{text}</span>;
  const parts = text.split(highlight);
  return (
    <span>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span style={{ color: "var(--cyan)", fontWeight: 500 }}>{highlight}</span>
          )}
        </span>
      ))}
    </span>
  );
}

function TimelineDot() {
  return (
    <span style={{ position: "absolute", left: -5, top: 6, width: 10, height: 10, borderRadius: "50%", background: "var(--cyan)", display: "block" }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--cyan)", animation: "pulse-ring 2.4s ease-out infinite" }} />
    </span>
  );
}

function TimelineEntry({ entry }: { entry: ExperienceEntry }) {
  const [hovered, setHovered] = useState(false);
  const bulletsRef = useRef<HTMLUListElement>(null);
  useStaggerAnimation(bulletsRef as React.RefObject<Element | null>, { childSelector: "li", stagger: 0.08, start: "top 88%" });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", paddingLeft: 32, paddingBottom: 48, borderLeft: `1px solid ${hovered ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.08)"}`, transition: "border-color 0.3s", marginLeft: -1 }}>
      <TimelineDot />
      <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 300, color: hovered ? "var(--white)" : "var(--grey-100)", marginBottom: 4, letterSpacing: "0.03em", transition: "color 0.3s" }}>{entry.role}</p>
          <p style={{ fontFamily: "monospace", fontSize: 12, color: hovered ? "var(--cyan)" : "var(--grey-500)", letterSpacing: "0.1em", transition: "color 0.3s" }}>{entry.company} · {entry.location}</p>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: hovered ? "var(--cyan)" : "var(--grey-600)", letterSpacing: "0.12em", border: `1px solid ${hovered ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 2, padding: "4px 10px", transition: "color 0.3s, border-color 0.3s" }}>
          {entry.period}
        </span>
      </div>
      <ul ref={bulletsRef} style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {entry.bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 12, fontSize: 14, lineHeight: 1.75, color: hovered ? "var(--grey-300)" : "var(--grey-400)", transition: "color 0.3s" }}>
            <span style={{ marginTop: 8, width: 4, height: 4, borderRadius: "50%", background: hovered ? "var(--cyan)" : "rgba(255,255,255,0.15)", flexShrink: 0, transition: "background 0.3s" }} />
            <BulletText text={b.text} highlight={b.highlight} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Experience() {
  const [activeTab, setActiveTab] = useState<Tab>("fullstack");
  const headingRef = useRef<HTMLDivElement>(null);
  useScrollAnimation(headingRef as React.RefObject<Element | null>);

  const entry = experience.find((e) => e.category === activeTab)!;

  return (
    <section id="experience" className="relative py-[60px] md:py-[160px] px-6" style={{ background: "transparent" }}>
      <AmbientFlares count={3} intensity="low" />
      <MoonScene className="absolute left-0 top-0 h-full w-[180px] opacity-30 md:w-[480px] md:opacity-100" />
      <div className="relative mx-auto max-w-4xl" style={{ zIndex: 1 }}>
        <div ref={headingRef}>
          <SectionMarker />
          <h2 style={{ fontSize: "var(--text-section)", fontWeight: 300, color: "var(--grey-100)", lineHeight: 1.1, letterSpacing: "0.02em", marginBottom: 48 }}>
            Where I've<br />
            <span style={{ color: "var(--white)" }}>made an <span style={{ color: "var(--cyan)" }}>impact</span></span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 48 }}>
          {TABS.map(({ key, label }) => (
            <button key={key} type="button" onClick={() => setActiveTab(key)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "12px 24px 12px 0", marginRight: 24,
                fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                color: activeTab === key ? "var(--white)" : "var(--grey-600)",
                borderBottom: activeTab === key ? "1px solid var(--cyan)" : "1px solid transparent",
                marginBottom: -1, transition: "color 0.3s, border-color 0.3s",
              }}
              onMouseEnter={(e) => { if (activeTab !== key) { e.currentTarget.style.color = "var(--cyan)"; e.currentTarget.style.borderBottomColor = "rgba(0,212,255,0.3)"; } }}
              onMouseLeave={(e) => { if (activeTab !== key) { e.currentTarget.style.color = "var(--grey-600)"; e.currentTarget.style.borderBottomColor = "transparent"; } }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}>
              <TimelineEntry entry={entry} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
