import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "About",      href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills",     href: "#skills" },
  { label: "Projects",   href: "#projects" },
  { label: "Contact",    href: "#contact" },
] as const;

const SECTIONS = NAV_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [active, setActive]       = useState("");
  const [mobileOpen, setMobile]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      style={{ borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "none" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" aria-label="Home" style={{ fontFamily: "system-ui", fontSize: 15, fontWeight: 300, letterSpacing: "0.18em", color: "var(--white)", textDecoration: "none", transition: "color 0.4s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--white)")}
        >
          RK
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = active === href.slice(1);
            return (
              <li key={label}>
                <a href={href}
                style={{
                  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 400,
                  color: isActive ? "var(--white)" : "var(--grey-500)",
                  borderBottom: isActive ? "1px solid var(--cyan)" : "1px solid transparent",
                  paddingBottom: 4,
                  transition: "color 0.3s, border-color 0.3s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "var(--cyan)"; e.currentTarget.style.borderBottomColor = "rgba(0,212,255,0.4)"; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "var(--grey-500)"; e.currentTarget.style.borderBottomColor = "transparent"; } }}>
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <button type="button" aria-label="Menu" onClick={() => setMobile((v) => !v)}
          className="flex flex-col items-center justify-center gap-1.5 p-2 md:hidden">
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: "block", height: 1, width: 22, background: "var(--grey-400)",
              transition: "all 0.3s",
              transform: mobileOpen ? (i === 0 ? "translateY(8px) rotate(45deg)" : i === 2 ? "translateY(-8px) rotate(-45deg)" : "scaleX(0)") : "none",
            }} />
          ))}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="mob" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
            <button onClick={() => setMobile(false)} style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", color: "var(--grey-500)", fontSize: 24, cursor: "pointer" }}>×</button>
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.a key={label} href={href} onClick={() => setMobile(false)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ display: "block", width: "100%", textAlign: "center", padding: "20px 0",
                  fontSize: 26, fontWeight: 300, letterSpacing: "0.1em", color: "var(--grey-100)",
                  textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
