import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Film timestamp ─────────────────────────────────────────────────────── */
function Timestamp() {
  const [vis, setVis]       = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 1200);
    const onScroll = () => { if (window.scrollY > 100) setHidden(true); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <div style={{
      position: "fixed", top: 28, left: 28, zIndex: 20,
      fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em",
      color: "var(--grey-600)", pointerEvents: "none", textTransform: "uppercase",
      opacity: vis && !hidden ? 1 : 0, transition: "opacity 0.5s ease",
    }}>
      2026 · ŁÓDŹ, POLAND
    </div>
  );
}

/* ── Scroll indicator ───────────────────────────────────────────────────── */
function ScrollIndicator() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 10) setGone(true); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 36, left: "50%", transform: "translateX(-50%)", zIndex: 20,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      pointerEvents: "none", opacity: gone ? 0 : 1, transition: "opacity 0.6s ease",
    }}>
      <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, transparent, var(--grey-600))", transformOrigin: "top", animation: "breathe 2.5s ease-in-out infinite" }} />
      <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", color: "var(--grey-600)", textTransform: "uppercase" }}>
        SCROLL
      </span>
    </div>
  );
}

/* ── Main HeroText ──────────────────────────────────────────────────────── */
export default function HeroText() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 280], [1, 0]);
  const y       = useTransform(scrollY, [0, 280], [0, -40]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <Timestamp />
      <motion.div style={{ opacity, y, position: "fixed", bottom: isMobile ? 100 : 64, left: isMobile ? 20 : 36, zIndex: 10, pointerEvents: "none" }}>
        {/* Name block */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1.1, ease: EASE }}
          style={{ fontFamily: "system-ui, sans-serif", fontSize: "var(--text-hero)", fontWeight: 200, letterSpacing: "0.05em", color: "rgba(255,255,255,0.92)", lineHeight: 0.92, textTransform: "uppercase" }}
        >
          ROBEL<br />KEBEDE
        </motion.div>

        {/* Cyan rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
          style={{ height: 1, width: 48, background: "var(--cyan)", marginTop: 20, marginBottom: 16, transformOrigin: "left" }}
        />

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease: EASE }}
          style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(0.65rem,1.3vw,0.82rem)", fontWeight: 400, letterSpacing: "0.22em", color: "var(--grey-400)", lineHeight: 1, textTransform: "uppercase" }}
        >
          Full-Stack &amp; AI Tooling Engineer
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
          style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(0.55rem,1.1vw,0.7rem)", fontWeight: 400, letterSpacing: "0.28em", color: "var(--grey-600)", lineHeight: 1, marginTop: 6, textTransform: "uppercase" }}
        >
          AI Tooling · DevOps · Cloud
        </motion.div>
      </motion.div>
      <ScrollIndicator />
    </>
  );
}
