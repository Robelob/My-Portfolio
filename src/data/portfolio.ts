/* ─── Interfaces ──────────────────────────────────────────────────────────── */

export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  tagline: string;
}

export interface ExperienceBullet {
  text: string;
  highlight: string | null;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  category: "fullstack" | "devops";
  bullets: ExperienceBullet[];
}

export interface SkillsMap {
  "AI / LLMs": string[];
  "Creative Cloud": string[];
  Frontend: string[];
  Backend: string[];
  "Cloud & DevOps": string[];
  "Data & Monitoring": string[];
  Tools: string[];
}

export interface Education {
  degree: string;
  university: string;
  location: string;
  period: string;
  gpa: string;
  award: string;
}

export interface Language {
  language: string;
  level: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  status: "in-progress" | "completed" | "planned";
  badge?: string;
  liveUrl: string | null;
  githubUrl: string | null;
  gifUrl?: string;
}

/* ─── Data ────────────────────────────────────────────────────────────────── */

export const personalInfo: PersonalInfo = {
  name: "Robel Kebede",
  title: "Full-Stack & AI Tooling Engineer",
  subtitle: "AI Tooling & DevOps",
  location: "Łódź, Poland",
  email: "robel.mukebede@gmail.com",
  phone: "+48 729 320 690",
  tagline: "Building scalable web apps and AI-powered developer tools",
};

export const summary =
  `Full-Stack and AI Tooling Engineer with 5+ years at Atos Poland building scalable web applications, ` +
  `developer tooling, and AI-powered automation. Shipped a production-ready Adobe Premiere Pro plugin ` +
  `that uses LLMs and Whisper to automate video editing — a hybrid UXP/CEP system built around platform ` +
  `API limitations. Seeks roles in AI tooling, developer platforms, and creative cloud engineering.`;

export const experience: ExperienceEntry[] = [
  {
    company: "Atos Poland",
    role: "Software & DevOps Engineer",
    period: "2021 – Present",
    location: "Łódź, Poland",
    category: "fullstack",
    bullets: [
      {
        text: "Built a full-stack Service Request Platform (Vue.js, Node.js, Firestore + REST APIs) adopted by 4+ cross-functional teams, eliminating 15+ hours of weekly coordination overhead.",
        highlight: "15+ hours",
      },
      {
        text: "Engineered an AI-powered bug-reporting system that auto-converts user inputs into structured GitHub Issues, cutting mean incident resolution time by 30% (from 4h to 2.8h).",
        highlight: "30%",
      },
      {
        text: "Refactored 3 legacy Vue.js modules, reducing initial page load time by 48% (2.1s → 1.1s) and improving Core Web Vitals scores.",
        highlight: "48%",
      },
      {
        text: "Built a ticket search engine in ServiceNow UI Builder, reducing average support ticket resolution time by 25%.",
        highlight: "25%",
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
        text: "Built and maintained CI/CD pipelines (GitHub Actions); managed containerised services on GCP and Linux environments, achieving 99.9% deployment success rate.",
        highlight: "99.9%",
      },
      {
        text: "Migrated legacy monitoring to a modern observability stack (Grafana, ElasticSearch, Node-RED), improving MTD (mean time to detection) by 40%.",
        highlight: "40%",
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
];

export const skills: SkillsMap = {
  "AI / LLMs": ["LangChain", "Ollama", "Whisper", "Gemini API", "Claude API", "RAG (pgvector)", "Prompt Engineering"],
  "Creative Cloud": ["Adobe UXP", "CEP/ExtendScript", "Premiere Pro API"],
  Frontend: ["React.js", "Vue.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
  Backend: ["Node.js", "Express.js", "REST APIs", "Python"],
  "Cloud & DevOps": ["GCP", "Docker", "GitHub Actions", "Ansible", "Linux", "Bitbucket"],
  "Data & Monitoring": ["Grafana", "ElasticSearch", "Prometheus", "Power BI", "Firestore", "PostgreSQL"],
  Tools: ["ServiceNow UI Builder", "Power Automate", "Git"],
};

export const education: Education = {
  degree: "Bachelor of Engineering — IT in Business",
  university: "WSB University",
  location: "Toruń, Poland",
  period: "2019 – 2023",
  gpa: "5.0 / 5.0",
  award: "Rector's Award for Academic Excellence",
};

export const languages: Language[] = [
  { language: "Amharic", level: "Native" },
  { language: "English", level: "C2 Proficient" },
  { language: "Polish", level: "A2 Communicative" },
];

export const projects: Project[] = [
  {
    title: "Memex — Local Multimodal RAG System",
    description:
      "A fully local, multimodal RAG system that indexes PDFs, audio, video, and images — then lets you chat with them, search visually, and explore connections between ideas. Nothing leaves your machine. Built on Qdrant for vector search, Neo4j for knowledge-graph traversal, Whisper for audio/video transcription, and CLIP for text-to-image retrieval. Streams cited answers via a Next.js interface backed by a FastAPI orchestration layer — all orchestrated with Docker Compose and running entirely on local hardware with no cloud subscriptions or per-query cost.",
    tech: ["Python", "FastAPI", "Qdrant", "Neo4j", "Whisper", "CLIP", "Next.js", "Ollama", "Docker"],
    status: "completed",
    badge: "Open Source",
    liveUrl: null,
    githubUrl: "https://github.com/Robelob/memex",
    gifUrl: "/memex.mp4",
  },
  {
    title: "Ambar — AI Video Editor Plugin for Adobe Premiere Pro",
    description:
      "A production-ready Premiere Pro plugin that automatically detects silence, transcribes speech, and uses LLMs to suggest editorial cuts — reducing editing time by ~70% for talking-head content. Architected as a hybrid UXP + CEP system with file-based IPC to work around Adobe API limitations. Integrates multiple AI providers (Groq, Ollama, Gemini, OpenAI) with graceful fallbacks and local-first options. Features a three-layer audio and editing pipeline (RMS silence detection → Whisper transcription → LLM editorial decisions) that operates completely locally to ensure data privacy.",
    tech: ["TypeScript", "LLMs", "Whisper", "Adobe UXP", "CEP/ExtendScript"],
    status: "completed",
    badge: "Beta Version",
    liveUrl: null,
    githubUrl: "https://github.com/Robelob/Ambar-AI-Video-Editor-Plugin-For-Premiere-Pro",
  },
  {
    title: "Autonomous Bug Resolution Pipeline — Atos Poland",
    description:
      "An end-to-end pipeline that takes a bug report from submission to a ready-to-merge pull request — with minimal engineer involvement. Users file reports through a Vue.js app; an LLM immediately enhances the raw input, researches the likely root cause, and drafts a proposed fix with supporting context. Octokit then opens a fully structured GitHub Issue and automatically assigns GitHub Copilot to implement the fix, pre-loaded with all of the LLM's research. By the time an engineer is notified, a draft PR is already waiting for review — they read, validate, and merge. Reduced mean incident resolution time from 4h to 2.8h (30%) not by making engineers faster, but by removing triage and initial implementation from their workload entirely.",
    tech: ["Vue.js", "Node.js", "Firestore", "Octokit", "GitHub Copilot", "GCP"],
    status: "completed",
    badge: "Internal · Atos",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Service Request Platform — Atos Poland",
    description:
      "Built to replace fragmented email threads and spreadsheet-based tracking that were causing coordination failures across 4+ cross-functional teams at Atos Poland. The platform (Vue.js + Node.js + Firestore) centralised all service requests into a single structured queue with automated routing, real-time status tracking, and team-specific dashboards — no process changes required from end users. At peak, handling 200+ requests/month across IT, Infrastructure, and Application teams. Eliminated 15+ hours of weekly coordination overhead that previously went into chasing updates and manually reassigning tasks.",
    tech: ["Vue.js", "Node.js", "Firestore", "REST APIs"],
    status: "completed",
    badge: "Internal · Atos",
    liveUrl: null,
    githubUrl: null,
  },
];
