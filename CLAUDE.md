# Portfolio – Claude Code Instructions

## Project Overview
This is Robel Kebede's personal portfolio website built with TanStack Start, React 19,
React Three Fiber, Tailwind v4, and shadcn/ui. A 3D hero section already exists.
The goal is a cinematic, scroll-driven, dark-themed portfolio that impresses recruiters
for Full-Stack / Frontend / AI engineering roles.

## Stack (DO NOT change these)
- **Framework:** TanStack Start (TanStack Router + Vite)
- **Language:** TypeScript (strict)
- **3D:** React Three Fiber (@react-three/fiber), Drei (@react-three/drei), Postprocessing
- **Styling:** Tailwind v4 (no config file — uses CSS variables in index.css)
- **UI Components:** shadcn/ui (Radix primitives, already installed)
- **Animation:** GSAP + ScrollTrigger (install if not present), Framer Motion (install if not present)
- **Package manager:** bun (use `bun add` not `npm install`)
- **Deployment:** Cloudflare Pages (wrangler.jsonc already configured)

## Install missing packages before building
```bash
bun add gsap @types/gsap framer-motion
```

## Design System (STRICTLY follow these)
```
Background:     #0a0a0f  (deep space black)
Surface:        #0f0f1a  (card backgrounds)
Border:         rgba(255,255,255,0.08)
Primary accent: #2563EB  (blue — matches CV)
Secondary:      #7c3aed  (violet)
Gradient:       linear-gradient(135deg, #2563EB, #7c3aed)
Text primary:   #f1f5f9
Text muted:     #94a3b8
Glass card:     background: rgba(255,255,255,0.03), backdrop-filter: blur(12px)
Border radius:  16px for cards, 8px for buttons
Font:           System font stack (no Google Fonts imports needed)
```

## File Structure Convention
```
src/
  components/
    sections/
      Hero.tsx          ← ALREADY EXISTS — DO NOT TOUCH
      About.tsx         ← CREATE
      Experience.tsx    ← CREATE
      Skills.tsx        ← CREATE
      Projects.tsx      ← CREATE
      Contact.tsx       ← CREATE
    ui/                 ← shadcn components (already here)
    three/              ← 3D helper components
    layout/
      Navbar.tsx        ← CREATE
      Footer.tsx        ← CREATE
  hooks/
    useScrollAnimation.ts  ← CREATE (GSAP ScrollTrigger helper)
  data/
    portfolio.ts           ← CREATE (all CV content as typed data)
  styles/
    globals.css            ← already exists
```

## CV Data (use EXACTLY these values everywhere)
```typescript
// src/data/portfolio.ts — create this file first

export const personalInfo = {
  name: "Robel Kebede",
  title: "Full-Stack Software Engineer",
  subtitle: "DevOps & Cloud",
  location: "Łódź, Poland",
  email: "robel.mukebede@gmail.com",
  phone: "+48 729 320 690",
  tagline: "Building scalable web apps and AI-powered developer tools",
}

export const summary = `Full-Stack and DevOps Engineer with 4+ years building scalable 
web applications and developer tooling at Atos Poland. Delivers end-to-end products — 
React/Vue.js frontends, Node.js APIs, and containerised GCP services. Reduced incident 
resolution time by 30% through AI-driven automation and cut stakeholder reporting effort by 20%.`

export const experience = [
  {
    company: "Atos Poland",
    role: "Software & DevOps Engineer",
    period: "2021 – Present",
    location: "Łódź, Poland",
    category: "fullstack",
    bullets: [
      {
        text: "Built a full-stack Service Request Platform (Vue.js, Node.js, Firestore + REST APIs) used across multiple cross-functional teams, reducing inter-team communication overhead.",
        highlight: null,
      },
      {
        text: "Engineered an AI-powered bug-reporting system that auto-converts user inputs into structured GitHub Issues, cutting manual triage and incident resolution time by ~30%.",
        highlight: "30%",
      },
      {
        text: "Refactored legacy frontends and optimised API endpoints, reducing page load times and improving responsiveness for end-users.",
        highlight: null,
      },
      {
        text: "Built a ticket search engine in ServiceNow UI Builder, streamlining developer workflows and accelerating support resolution.",
        highlight: null,
      },
    ],
  },
  {
    company: "Atos Poland",
    role: "Software & DevOps Engineer",
    period: "2021 – Present",
    location: "Łódź, Poland",
    category: "devops",
    bullets: [
      {
        text: "Built and maintained CI/CD pipelines (GitHub Actions); managed containerised services on GCP and Linux environments.",
        highlight: null,
      },
      {
        text: "Migrated legacy monitoring to a modern observability stack (Grafana, ElasticSearch, Node-RED), improving real-time system reliability and alerting coverage.",
        highlight: null,
      },
      {
        text: "Developed real-time monitoring dashboards and automated alerting pipelines, reducing mean time to detection across production systems.",
        highlight: null,
      },
      {
        text: "Automated stakeholder reporting with Power BI and Power Automate, saving ~20% of manual reporting time per sprint cycle.",
        highlight: "20%",
      },
    ],
  },
]

export const skills = {
  Frontend:       ["React.js", "Vue.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
  Backend:        ["Node.js", "Express.js", "REST APIs"],
  "Cloud & DevOps": ["GCP", "Docker", "GitHub Actions", "Ansible", "Linux", "Bitbucket"],
  "Data & Monitoring": ["Grafana", "ElasticSearch", "Prometheus", "Power BI", "Firestore", "PostgreSQL"],
  Tools:          ["ServiceNow UI Builder", "Power Automate", "Git"],
}

export const education = {
  degree: "Bachelor of Engineering — IT in Business",
  university: "WSB University",
  location: "Toruń, Poland",
  period: "2019 – 2023",
  gpa: "5.0 / 5.0",
  award: "Rector's Award for Academic Excellence",
}

export const languages = [
  { language: "Amharic", level: "Native" },
  { language: "English", level: "C2 Proficient" },
  { language: "Polish",  level: "A2 Communicative" },
]

export const projects = [
  {
    title: "AI Finance Agent",
    description: "RAG-powered personal finance assistant using Claude API and pgvector. Users chat with an AI that retrieves and reasons over their real spending data.",
    tech: ["React", "Node.js", "Claude API", "Supabase", "pgvector"],
    status: "in-progress",
    liveUrl: null,
    githubUrl: null,
  },
]
```

## Animation Rules
- Use GSAP ScrollTrigger for scroll-driven reveals (fade up, stagger children)
- Use Framer Motion for hover states and micro-interactions
- All animations must respect `prefers-reduced-motion`
- Particle/3D effects must NOT block scroll or interaction
- Mobile: disable heavy 3D effects, keep 2D animations only

## Section Build Order (STRICTLY follow this sequence)
1. `src/data/portfolio.ts` — data file (no UI, just data)
2. `src/hooks/useScrollAnimation.ts` — GSAP hook
3. `src/components/layout/Navbar.tsx` — sticky nav with section links
4. `src/components/sections/About.tsx`
5. `src/components/sections/Experience.tsx`
6. `src/components/sections/Skills.tsx`
7. `src/components/sections/Projects.tsx`
8. `src/components/sections/Contact.tsx`
9. `src/components/layout/Footer.tsx`
10. Wire everything together in the main route file

## Critical Rules
- NEVER modify any existing Hero/3D files
- NEVER use `npm` — always use `bun`
- NEVER add Google Fonts `<link>` tags (use system fonts)
- NEVER use inline styles unless absolutely necessary — use Tailwind classes
- ALWAYS use TypeScript with proper types — no `any`
- ALWAYS make components mobile-responsive (mobile-first)
- Keep each component file under 200 lines — split if larger
- Test that `bun run dev` has zero TypeScript errors before finishing any section
