import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import FaceHero from "@/components/FaceHero";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import UniverseBackground from "@/components/three/UniverseBackground";
import HeroText from "@/components/hero/HeroText";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Robel Kebede — Full-Stack Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Robel Kebede, Full-Stack Software Engineer specialising in React, Node.js, AI tooling, and GCP.",
      },
    ],
  }),
});

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={{ y: -2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          style={{ position: "fixed", bottom: 32, right: 32, zIndex: 50, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, background: "var(--cyan)", border: "none", cursor: "pointer", color: "#060608" }}
        >
          <ArrowUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Index() {
  return (
    <>
      <UniverseBackground />
      <HeroText />
      <Navbar />
      <main>
        <FaceHero />
        {/* Gradient bridge: blends hero's #03040a canvas bottom into the site #060608 bg */}
        <div style={{ position: "relative", zIndex: 5, marginTop: -220, height: 220, background: "linear-gradient(to bottom, transparent 0%, #060608 100%)", pointerEvents: "none" }} />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
