import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { personalInfo } from "@/data/portfolio";
import AmbientFlares from "@/components/effects/AmbientFlares";
import { SectionCanvas, DistantPlanet } from "@/components/three/SpaceObjects";

interface FormState { name: string; email: string; message: string; }
const EMPTY: FormState = { name: "", email: "", message: "" };

function SectionMarker() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
      <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--grey-600)", letterSpacing: "0.2em", textTransform: "uppercase" }}>005 · CONTACT</span>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, textarea }: {
  label: string; name: keyof FormState; type?: string; value: string;
  onChange: (name: keyof FormState, value: string) => void; textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const sharedStyle: React.CSSProperties = {
    width: "100%", background: "transparent",
    borderTop: "none", borderLeft: "none", borderRight: "none",
    borderBottom: `1px solid ${focused ? "var(--cyan)" : "rgba(255,255,255,0.12)"}`,
    color: "var(--white)", fontSize: 14, padding: "10px 0",
    outline: "none", letterSpacing: "0.04em", fontFamily: "inherit",
    transition: "border-color 0.3s",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: focused ? "var(--cyan)" : "var(--grey-600)", transition: "color 0.3s" }}>{label}</label>
      {textarea
        ? <textarea name={name} rows={4} value={value} onChange={(e) => onChange(name, e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...sharedStyle, resize: "none" }} />
        : <input type={type} name={name} value={value} onChange={(e) => onChange(name, e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={sharedStyle} />
      }
    </div>
  );
}

export default function Contact() {
  const [form, setForm]       = useState<FormState>(EMPTY);
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const headingRef            = useRef<HTMLDivElement>(null);
  useScrollAnimation(headingRef as React.RefObject<Element | null>);

  const update = (name: keyof FormState, value: string) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); setForm(EMPTY); }, 800);
  };

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
          <p style={{ fontSize: "var(--text-body)", color: "var(--grey-400)", lineHeight: 1.8, marginBottom: 40 }}>
            Open to full-stack, frontend, and AI engineering roles.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
          <a href={`mailto:${personalInfo.email}`}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--grey-400)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 4, transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--grey-400)")}>
            <Mail size={14} /> {personalInfo.email}
          </a>
          <a href={`tel:${personalInfo.phone.replace(/\s/g, "")}`}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--grey-400)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 4, transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--grey-400)")}>
            <Phone size={14} /> {personalInfo.phone}
          </a>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="success"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, border: "1px solid rgba(0,212,255,0.2)", borderRadius: 2, padding: 48, textAlign: "center" }}>
              <CheckCircle size={28} style={{ color: "var(--cyan)" }} />
              <p style={{ fontSize: 16, fontWeight: 300, color: "var(--white)" }}>Message sent.</p>
              <p style={{ fontSize: 13, color: "var(--grey-500)" }}>I'll be in touch soon.</p>
              <button type="button" onClick={() => setSent(false)}
                style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--grey-600)" }}>
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.form key="form"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <Field label="Name"    name="name"    value={form.name}    onChange={update} />
              <Field label="Email"   name="email"   type="email" value={form.email}   onChange={update} />
              <Field label="Message" name="message" value={form.message} onChange={update} textarea />
              <button type="submit" disabled={loading}
                style={{ marginTop: 8, background: loading ? "rgba(0,212,255,0.4)" : "var(--cyan)", border: "none", borderRadius: 2, padding: "14px 0", color: "#060608", fontSize: 12, fontFamily: "monospace", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.3s" }}>
                {loading ? "Sending…" : "Send Message"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
