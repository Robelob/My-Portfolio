# Robel Kebede — Portfolio

Personal portfolio site for Robel Kebede, Full-Stack & AI Tooling Engineer.

## Stack

| Layer | Tech |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (TanStack Router + Vite) |
| Language | TypeScript (strict) |
| 3D / WebGL | React Three Fiber, Drei, Postprocessing |
| Styling | Tailwind v4 (CSS-variable driven, no config file) |
| Animation | GSAP + ScrollTrigger, Framer Motion |
| Deployment | Cloudflare Pages via Wrangler |

## Project structure

```
src/
  components/
    hero/         — cinematic scroll-driven 3D hero
    sections/     — About, Experience, Skills, Projects, Contact
    three/        — shared R3F scene helpers
    effects/      — ambient post-processing overlays
    layout/       — Navbar, Footer
  data/
    portfolio.ts  — single source of truth for all CV content
  hooks/
    useScrollAnimation.ts  — GSAP ScrollTrigger helpers
    usePerformanceMode.ts  — disables heavy 3D on low-end devices
  routes/
    index.tsx     — main page route
```

## Local dev

```bash
bun install
bun run dev
```

## Deploy

```bash
bun run build
bunx wrangler pages deploy dist/client
```
