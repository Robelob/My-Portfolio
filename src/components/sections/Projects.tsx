import { useRef, useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { projects, type Project } from "@/data/portfolio";
import AmbientFlares from "@/components/effects/AmbientFlares";
import { SectionCanvas, RingObject } from "@/components/three/SpaceObjects";

function SectionMarker() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
      <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--grey-600)", letterSpacing: "0.2em", textTransform: "uppercase" }}>004 · PROJECTS</span>
    </div>
  );
}

function StatusBadge({ status, badge }: { status: Project["status"]; badge?: string }) {
  if (status === "completed") {
    const label = badge ?? "Completed";
    return (
      <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", color: "rgba(120,220,120,0.8)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(120,220,120,0.8)", flexShrink: 0 }} />
        {label}
      </span>
    );
  }
  const label = status === "in-progress" ? "In Progress" : "Planned";
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", color: "var(--cyan)", textTransform: "uppercase" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", animation: "blink 1.8s ease-in-out infinite" }} />
      {label}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--cyan)",
        borderLeft: `1px solid ${hovered ? "rgba(0,212,255,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRight: `1px solid ${hovered ? "rgba(0,212,255,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderBottom: `1px solid ${hovered ? "rgba(0,212,255,0.25)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 2, padding: 28, display: "flex", flexDirection: "column", gap: 16,
        background: hovered ? "rgba(0,212,255,0.03)" : "rgba(255,255,255,0.01)",
        transition: "border-color 0.3s, background 0.3s",
      }}>
      {project.gifUrl && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease",
        }}>
          <video
            src={project.gifUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.82) 60%, rgba(10,10,15,0.97) 100%)",
          }} />
        </div>
      )}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 300, color: hovered ? "var(--cyan)" : "var(--white)", letterSpacing: "0.04em", transition: "color 0.3s" }}>{project.title}</h3>
        <StatusBadge status={project.status} badge={project.badge} />
      </div>
      <p style={{ position: "relative", fontSize: 14, lineHeight: 1.8, color: hovered ? "var(--grey-300)" : "var(--grey-400)", flex: 1, transition: "color 0.3s" }}>{project.description}</p>
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 6 }}>
        {project.tech.map((t) => (
          <span key={t} style={{ border: `1px solid ${hovered ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 2, padding: "3px 8px", fontSize: 11, color: hovered ? "var(--grey-200)" : "var(--grey-600)", letterSpacing: "0.06em", fontFamily: "monospace", transition: "border-color 0.3s, color 0.3s" }}>
            {t}
          </span>
        ))}
      </div>
      {(project.githubUrl || project.liveUrl) && (
        <div style={{ position: "relative", display: "flex", gap: 12 }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid rgba(0,212,255,0.35)", borderRadius: 2, padding: "6px 14px", fontSize: 11, color: "var(--cyan)", cursor: "pointer", letterSpacing: "0.08em", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
            >
              <Github size={12} /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid rgba(0,212,255,0.35)", borderRadius: 2, padding: "6px 14px", fontSize: 11, color: "var(--cyan)", cursor: "pointer", letterSpacing: "0.08em", textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
            >
              <ExternalLink size={12} /> Live
            </a>
          )}
        </div>
      )}
    </div>
  );
}


export default function Projects() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  useScrollAnimation(headingRef as React.RefObject<Element | null>);
  useStaggerAnimation(gridRef as React.RefObject<Element | null>, { childSelector: ":scope > *", stagger: 0.12, start: "top 85%" });

  return (
    <section id="projects" className="relative py-[60px] md:py-[160px] px-6" style={{ background: "transparent" }}>
      <AmbientFlares count={4} intensity="low" />
      <SectionCanvas className="absolute inset-0 opacity-[0.13] md:inset-auto md:left-0 md:top-0 md:h-full md:w-[380px] md:opacity-80">
        <RingObject />
      </SectionCanvas>
      <div className="relative mx-auto max-w-6xl" style={{ zIndex: 1 }}>
        <div ref={headingRef}>
          <SectionMarker />
          <h2 style={{ fontSize: "var(--text-section)", fontWeight: 300, color: "var(--grey-100)", lineHeight: 1.1, letterSpacing: "0.02em", marginBottom: 64 }}>
            Things I've<br />
            <span style={{ color: "var(--white)" }}>shipped & <span style={{ color: "var(--cyan)" }}>built</span></span>
          </h2>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
