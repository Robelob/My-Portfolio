import { useRef } from "react";
import { Mail, Phone } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { personalInfo } from "@/data/portfolio";
import AmbientFlares from "@/components/effects/AmbientFlares";
import { SectionCanvas, DistantPlanet } from "@/components/three/SpaceObjects";

function SectionMarker() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
      <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--grey-600)", letterSpacing: "0.2em", textTransform: "uppercase" }}>005 · CONTACT</span>
    </div>
  );
}

export default function Contact() {
  const headingRef = useRef<HTMLDivElement>(null);
  useScrollAnimation(headingRef as React.RefObject<Element | null>);

  return (
    <section id="contact" className="relative py-[60px] md:py-[160px] px-6" style={{ background: "transparent" }}>
      <AmbientFlares count={6} intensity="medium" />
      <SectionCanvas className="absolute inset-0 opacity-30 md:opacity-60">
        <DistantPlanet />
      </SectionCanvas>
      <div className="relative mx-auto w-full max-w-xl" style={{ zIndex: 1 }}>
        <div ref={headingRef}>
          <SectionMarker />
          <h2 style={{ fontSize: "var(--text-section)", fontWeight: 300, color: "var(--grey-100)", lineHeight: 1.1, letterSpacing: "0.02em", marginBottom: 16 }}>
            Let's build<br />
            <span style={{ color: "var(--white)" }}>something <span style={{ color: "var(--cyan)" }}>together</span></span>
          </h2>
          <p style={{ fontSize: "var(--text-body)", color: "var(--grey-400)", lineHeight: 1.8, marginBottom: 56 }}>
            Open to full-stack, frontend, and AI engineering roles.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <a
            href={`mailto:${personalInfo.email}`}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              border: "1px solid rgba(0,212,255,0.2)", borderRadius: 2,
              padding: "20px 24px", textDecoration: "none",
              transition: "border-color 0.3s, background 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.5)";
              (e.currentTarget as HTMLElement).style.background = "rgba(0,212,255,0.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,255,0.2)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "1px solid rgba(0,212,255,0.25)", borderRadius: 2, color: "var(--cyan)", flexShrink: 0 }}>
              <Mail size={16} />
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--grey-600)" }}>Email</span>
              <span style={{ fontSize: 15, color: "var(--white)", letterSpacing: "0.02em" }}>{personalInfo.email}</span>
            </div>
          </a>

          <a
            href={`tel:${personalInfo.phone.replace(/\s/g, "")}`}
            style={{
              display: "flex", alignItems: "center", gap: 16,
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2,
              padding: "20px 24px", textDecoration: "none",
              transition: "border-color 0.3s, background 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 2, color: "var(--grey-400)", flexShrink: 0 }}>
              <Phone size={16} />
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--grey-600)" }}>Phone</span>
              <span style={{ fontSize: 15, color: "var(--grey-200)", letterSpacing: "0.02em" }}>{personalInfo.phone}</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
