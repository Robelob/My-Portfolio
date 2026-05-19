# Portfolio — Claude Code Instructions

## Stack
- **Framework:** TanStack Start (TanStack Router + Vite)
- **Language:** TypeScript (strict) — no `any`
- **3D:** React Three Fiber, Drei, Postprocessing
- **Styling:** Tailwind v4 — CSS variables in `src/styles.css`, no config file
- **Animation:** GSAP + ScrollTrigger, Framer Motion
- **Package manager:** `bun` — never `npm`
- **Deployment:** Cloudflare Pages (wrangler.jsonc)

## Critical rules
- Never modify `src/components/FaceHero.tsx` or `src/components/three/UniverseBackground.tsx`
- Never add Google Fonts `<link>` tags — use system font stack
- Never use inline styles when a Tailwind class works
- All CV content lives in `src/data/portfolio.ts` — edit there first, components read from it
- Keep components under 200 lines; split if larger
- Mobile-first, always

## Design tokens (defined in `src/styles.css`)
- Background: `#0a0a0f`, Surface: `#0f0f1a`
- Accent: `var(--cyan)` (`#00d4ff`)
- Text primary: `#f1f5f9`, muted: `#94a3b8`
- Border: `rgba(255,255,255,0.08)`
