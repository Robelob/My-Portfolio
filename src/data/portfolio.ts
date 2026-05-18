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
  liveUrl: string | null;
  githubUrl: string | null;
}

/* ─── Data ────────────────────────────────────────────────────────────────── */

export const personalInfo: PersonalInfo = {
  name: "Robel Kebede",
  title: "Full-Stack Software Engineer",
  subtitle: "DevOps & Cloud",
  location: "Łódź, Poland",
  email: "robel.mukebede@gmail.com",
  phone: "+48 729 320 690",
  tagline: "Building scalable web apps and AI-powered developer tools",
};

export const summary =
  `Full-Stack and DevOps Engineer with 4+ years building scalable ` +
  `web applications and developer tooling at Atos Poland. Delivers end-to-end products — ` +
  `React/Vue.js frontends, Node.js APIs, and containerised GCP services. Reduced incident ` +
  `resolution time by 30% through AI-driven automation and cut stakeholder reporting effort by 20%.`;

export const experience: ExperienceEntry[] = [
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
];

export const skills: SkillsMap = {
  Frontend: ["React.js", "Vue.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"],
  Backend: ["Node.js", "Express.js", "REST APIs"],
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
    title: "AI Finance Agent",
    description:
      "RAG-powered personal finance assistant using Claude API and pgvector. Users chat with an AI that retrieves and reasons over their real spending data.",
    tech: ["React", "Node.js", "Claude API", "Supabase", "pgvector"],
    status: "in-progress",
    liveUrl: null,
    githubUrl: null,
  },
];
