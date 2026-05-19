import { Mail, Github } from "lucide-react";
import { personalInfo } from "@/data/portfolio";

const LINKS = [
  { icon: Mail,   href: `mailto:${personalInfo.email}`,                                                    label: "Email" },
  { icon: Github, href: "https://github.com/Robelob/Ambar-AI-Video-Editor-Plugin-For-Premiere-Pro", label: "GitHub" },
] as const;

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 24px", background: "transparent" }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <a href="#" style={{ fontFamily: "system-ui", fontSize: 14, fontWeight: 300, letterSpacing: "0.18em", color: "var(--grey-600)", textDecoration: "none", transition: "color 0.3s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--grey-600)")}>
          RK
        </a>
        <div style={{ display: "flex", gap: 28 }}>
          {LINKS.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              aria-label={label}
              style={{ color: "var(--grey-700)", transition: "color 0.3s", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--grey-700)")}>
              <Icon size={16} />
            </a>
          ))}
        </div>
        <p style={{ fontFamily: "monospace", fontSize: 10, color: "var(--grey-700)", letterSpacing: "0.15em" }}>
          © 2026 {personalInfo.name}
        </p>
      </div>
    </footer>
  );
}
