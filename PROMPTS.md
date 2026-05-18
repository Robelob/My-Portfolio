# Claude Code Prompts — Portfolio Build
# Use these prompts IN ORDER inside VS Code terminal with `claude` running.
# Copy-paste each prompt exactly. Wait for Claude to finish before moving on.

# ─────────────────────────────────────────────────────────────────────────────
# SETUP (run these shell commands BEFORE starting Claude Code)
# ─────────────────────────────────────────────────────────────────────────────

# 1. Open your project in VS Code:
#    code /path/to/starry-eye-experience

# 2. Open the VS Code terminal (Ctrl + `)

# 3. Install missing animation packages:
bun add gsap framer-motion
bun add -d @types/gsap

# 4. Start Claude Code:
claude

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 1 — Read the project (always start here)
# ─────────────────────────────────────────────────────────────────────────────

Read CLAUDE.md carefully. Then explore the full project structure:
- List all files in src/
- Read the main route file (likely src/routes/index.tsx or similar)
- Read the existing Hero component
- Read vite.config.ts and tsconfig.json

Do NOT create any files yet. Just report back:
1. What the current file structure looks like
2. What the Hero section is doing (3D setup, components used)
3. Which route file renders the page
4. Any potential conflicts or issues I should know about

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 2 — Create data file and hook
# ─────────────────────────────────────────────────────────────────────────────

Create two files exactly as specified in CLAUDE.md:

1. `src/data/portfolio.ts` — copy the full TypeScript data from CLAUDE.md exactly,
   including all CV content, experience bullets, skills, projects, and personal info.
   Add proper TypeScript interfaces at the top of the file.

2. `src/hooks/useScrollAnimation.ts` — a custom hook that:
   - Takes a ref and animation options
   - Uses GSAP ScrollTrigger to animate elements into view (fade up by default)
   - Exports a `useStaggerAnimation` variant for animating lists of children
   - Handles cleanup on unmount
   - Respects prefers-reduced-motion

Run `bun run build` and confirm zero TypeScript errors before telling me it's done.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 3 — Navbar
# ─────────────────────────────────────────────────────────────────────────────

Create `src/components/layout/Navbar.tsx`:

Design specs:
- Fixed top, full width, z-index 50
- Initially transparent, adds backdrop-blur + dark bg on scroll
- Logo: "RK" in a small gradient box (blue to violet) on the left
- Nav links on the right: About, Experience, Skills, Projects, Contact
- Smooth scroll to each section when clicked (use href="#section-id")
- Mobile: hamburger menu that slides down the links
- Use Framer Motion for the mobile menu open/close animation
- Tailwind classes only, no inline styles

Use the design system colours from CLAUDE.md.
Run `bun run build` after — zero errors required.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 4 — About section
# ─────────────────────────────────────────────────────────────────────────────

Create `src/components/sections/About.tsx`:

Design specs:
- Section id="about", min-height: 100vh, centered vertically
- Two-column layout on desktop, single column on mobile
- LEFT column:
  - Section label: small uppercase "About Me" in accent blue
  - Heading: "Passionate about building" — large, bold, gradient text (blue→violet)
  - Paragraph: use personalInfo.tagline + summary from portfolio.ts
  - Three stat cards in a row:  "4+" years, "30%" faster incidents, "20%" time saved
    Each card: glassmorphism style, number large and gradient, label below
- RIGHT column:
  - A floating card with a subtle 3D tilt on mouse hover (use Framer Motion useMotionValue)
  - Inside: display the languages as pills (Amharic Native / English C2 / Polish A2)
  - Below: education block — degree name, university, GPA badge, Rector's Award tag
  - Card has a glowing blue border on hover

- Animate section in with useScrollAnimation hook (fade up, stagger children)
- Background: subtle radial gradient from #0a0a0f to #0f0f1a

Run `bun run build` after — zero errors required.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 5 — Experience section
# ─────────────────────────────────────────────────────────────────────────────

Create `src/components/sections/Experience.tsx`:

Design specs:
- Section id="experience", padding top/bottom 120px
- Section label + heading: "Where I've Worked"
- Two tab buttons at the top: "Full-Stack Development" | "DevOps & Cloud"
  Clicking switches which set of bullets is shown (use React state, not shadcn tabs)
  Active tab has blue underline and white text; inactive is muted
- Below tabs: vertical timeline
  - Company name + role on the left
  - Dates on the right
  - Bullet points below, each with a small blue dot
  - Bullets with `highlight` values: wrap that word/number in a gradient span
    e.g. "30%" renders with blue→violet gradient text, slightly larger font
- Each bullet animates in with GSAP ScrollTrigger stagger on scroll
- Timeline line: 2px vertical line, blue gradient, animates drawing down on scroll

Import experience data from portfolio.ts.
Run `bun run build` after — zero errors required.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 6 — Skills section
# ─────────────────────────────────────────────────────────────────────────────

Create `src/components/sections/Skills.tsx`:

Design specs:
- Section id="skills", padding top/bottom 120px
- Section label + heading: "What I Work With"
- Display skills as a responsive grid of category cards
- Each card:
  - Glassmorphism: rgba(255,255,255,0.03) bg, blur(12px), thin border
  - Category name as card header (e.g. "Frontend") with a coloured icon dot
  - Skills listed as pill tags inside: rounded-full, bg rgba(37,99,235,0.15),
    text accent blue, small padding
  - On hover: card lifts (translateY -4px), border glows blue
  - Use Framer Motion for hover animation
- Animate cards in with stagger on scroll (useScrollAnimation)
- Grid: 2 columns mobile, 3 columns tablet, 3 columns desktop
- Colour-code category headers: Frontend=blue, Backend=violet, Cloud=emerald, Data=amber, Tools=pink

Import skills data from portfolio.ts.
Run `bun run build` after — zero errors required.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 7 — Projects section
# ─────────────────────────────────────────────────────────────────────────────

Create `src/components/sections/Projects.tsx`:

Design specs:
- Section id="projects", padding top/bottom 120px
- Section label + heading: "What I'm Building"
- Project cards in a grid (1 col mobile, 2 col desktop)
- For the "AI Finance Agent" card (status: "in-progress"):
  - Glassmorphism card with a gradient top border (blue→violet, 2px)
  - Top-right badge: "In Progress" — amber/orange pill
  - Title, description, tech stack pills (same style as skills pills)
  - Bottom row: GitHub and Live buttons — disabled/greyed out with tooltip "Coming Soon"
  - Subtle animated gradient shimmer on the card border (CSS animation)
- Add a second placeholder card: "More projects coming soon"
  - Dashed border, centered text, slightly muted
  - On hover: border becomes solid blue

- Animate cards in with stagger on scroll
Run `bun run build` after — zero errors required.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 8 — Contact section
# ─────────────────────────────────────────────────────────────────────────────

Create `src/components/sections/Contact.tsx`:

Design specs:
- Section id="contact", padding top/bottom 120px, min-height 80vh
- Centered layout, max-width 600px
- Section label + heading: "Let's Work Together"
- Subtext: "Open to full-stack, frontend, and AI engineering roles."
- Contact info row: email + phone as clickable links with icons (use lucide-react)
- Form below:
  - Fields: Name, Email, Message (textarea)
  - All inputs: glassmorphism style, blue focus ring, dark bg
  - Submit button: full-width, gradient blue→violet, hover lifts + glows
  - Form uses React useState for controlled inputs
  - On submit: show a success message ("Message sent! I'll be in touch soon.")
  - For now, just log to console (EmailJS integration is a separate step)
- Background: subtle grid pattern (CSS background-image with tiny dots)

Run `bun run build` after — zero errors required.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 9 — Footer
# ─────────────────────────────────────────────────────────────────────────────

Create `src/components/layout/Footer.tsx`:

Design specs:
- Simple, clean — not cluttered
- "RK" logo left, copyright right: "© 2026 Robel Kebede"
- Center: three icon links — Email, GitHub (github.com/Robelob), LinkedIn
  Use lucide-react icons. On hover: icon turns accent blue, subtle scale up
- Top border: 1px, rgba(255,255,255,0.08)
- Padding 32px vertical

Run `bun run build` after — zero errors required.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 10 — Wire everything together
# ─────────────────────────────────────────────────────────────────────────────

Now wire all sections into the main page. Find the route file that renders the
home page (likely src/routes/index.tsx).

Add all sections in this exact order, keeping the existing Hero untouched:
1. Navbar (fixed, outside scroll flow)
2. Hero (existing — import as-is)
3. About
4. Experience
5. Skills
6. Projects
7. Contact
8. Footer

Also add:
- A smooth CSS scroll-behavior: smooth on the html element (in globals.css)
- A scroll-to-top button (fixed, bottom-right) that appears after scrolling 400px,
  uses Framer Motion AnimatePresence for enter/exit, blue gradient background

Run `bun run dev` and verify:
- No TypeScript errors
- All sections visible and in order
- Navbar links scroll to correct sections
- Animations trigger on scroll
- Mobile layout looks clean

Report any issues found.

# ─────────────────────────────────────────────────────────────────────────────
# PROMPT 11 — Polish & QA
# ─────────────────────────────────────────────────────────────────────────────

Do a full quality pass on the entire portfolio:

1. Check all sections have consistent spacing (120px top/bottom padding on desktop,
   60px on mobile)
2. Check all text is readable — minimum contrast ratio on dark backgrounds
3. Ensure no horizontal scroll on mobile (max-width: 100vw, overflow-x: hidden on body)
4. Add a subtle page-load animation: the Navbar fades in from top, Hero content
   fades in after 300ms delay
5. Ensure all Framer Motion animations have proper exit states
6. Add `loading="lazy"` to any images
7. Update the HTML title tag to: "Robel Kebede — Full-Stack Engineer"
8. Add a meta description: "Portfolio of Robel Kebede, Full-Stack Software Engineer
   specialising in React, Node.js, AI tooling, and GCP."

Run `bun run build` one final time. Report the bundle size and confirm zero errors.

# ─────────────────────────────────────────────────────────────────────────────
# OPTIONAL — EmailJS integration (do this after everything else works)
# ─────────────────────────────────────────────────────────────────────────────

# 1. Sign up at emailjs.com (free tier = 200 emails/month)
# 2. Create a service, template, and get your keys
# 3. Then tell Claude Code:

Install emailjs-com and wire up the Contact form:
bun add @emailjs/browser

In Contact.tsx, replace the console.log on submit with:
emailjs.send(
  "YOUR_SERVICE_ID",
  "YOUR_TEMPLATE_ID",
  { name, email, message },
  "YOUR_PUBLIC_KEY"
)

Add loading state on the button during send.
Show success or error message based on the result.
Keep my service ID, template ID, and public key as environment variables
in a .env file (VITE_EMAILJS_SERVICE_ID etc.) — never hardcode them.

# ─────────────────────────────────────────────────────────────────────────────
# DEPLOY to Cloudflare Pages
# ─────────────────────────────────────────────────────────────────────────────

# The wrangler.jsonc is already set up. When ready to deploy:
bun run build
bunx wrangler pages deploy dist

# Or connect the GitHub repo to Cloudflare Pages dashboard for auto-deploy on push.


# ─────────────────────────────────────────────────────────────────────────────
# ★ NEW PROMPTS — Universe & Monochrome Update
# Run these AFTER completing original Prompts 1–11
# OR start fresh from Prompt 1 and use these when you reach the right section
# ─────────────────────────────────────────────────────────────────────────────

# PROMPT A — Update colour system (run before any section work)
# ─────────────────────────────────────────────────────────────

Read UI_DESIGN.md section "Colour System" carefully.

Update globals.css (or index.css):
1. REMOVE all CSS variables referencing blue (#2563EB) or violet (#7c3aed)
2. ADD the new greyscale + cyan variable system exactly as written in UI_DESIGN.md
3. Add the typography variables (font-size scale, letter-spacing)
4. Add: html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--grey-100); overflow-x: hidden; }
        ::selection { background: var(--cyan-ghost); }

Run `bun run build` — zero errors required.

# PROMPT B — Hero text overlay & finishing touches
# ─────────────────────────────────────────────────

Read UI_DESIGN.md section "Hero Section — Finishing Touches" carefully.

DO NOT touch any existing Three.js code, model loading, or scroll behaviour.
ADD ONLY:

1. A new component `src/components/hero/HeroText.tsx`:
   - Name display: "ROBEL" + "KEBEDE" — huge, weight 300, white, letter-spacing 0.06em
   - Title: "FULL-STACK ENGINEER" — grey-400, 11px, monospace, uppercase, letter-spacing 0.22em
   - Subtitle: "AI · DEVOPS · CLOUD" — grey-600, 9px, monospace, uppercase, letter-spacing 0.28em
   - Positioned: bottom-left of viewport, z-index 10, pointer-events: none
   - Entrance: each line staggered translateY(50px)→0, opacity 0→1
     delays: 600ms, 750ms, 1000ms, 1150ms after mount
   - Scroll-away: Framer Motion useScroll + useTransform
     scrollY 0–20vh maps to opacity 1→0, y 0→-50px

2. A film timestamp: "2026  ·  ŁÓDŹ, POLAND"
   - top: 28px, left: 28px, fixed position
   - font: monospace, 10px, var(--grey-600), letter-spacing: 0.18em
   - Fades in 1200ms after load, fades out after 100px scroll

3. A scroll indicator at bottom-centre:
   - Text: "SCROLL TO EXPLORE"
   - A 1px × 32px vertical line below, animated breathe (@keyframes)
   - Disappears on first scroll event

4. In the existing Hero component, add 2–3 extra AmbientFlares positioned
   OUTSIDE the model silhouette (near shoulder edges, in the surrounding void).
   These are the "escape sparks" — same cyan, same animation as model flares.

Run `bun run build` — zero errors.

# PROMPT C — Create AmbientFlares component
# ─────────────────────────────────────────

Read UI_DESIGN.md section "The Cyan Flare / Spark Effect" carefully.

Create `src/components/effects/AmbientFlares.tsx`:

Props interface:
  count: number      (3–6)
  intensity: 'low' | 'medium' | 'high'

Each flare is a div:
  - position: absolute, pointer-events: none, z-index: 0
  - shape: circle (border-radius: 50%)
  - background: radial-gradient(circle, #00d4ff 0%, transparent 70%)
  - CSS filter: blur(Xpx) where X varies 3–8px
  - size: random between 6px–16px (generated once on mount)
  - position: random % within the container (generated on mount)
  - animation: custom @keyframes 'flare-pulse'
    0%   { opacity: 0; transform: scale(0.2); }
    20%  { opacity: var(--flare-peak-opacity); transform: scale(1); }
    65%  { opacity: calc(var(--flare-peak-opacity) * 0.6); transform: scale(0.8); }
    100% { opacity: 0; transform: scale(0.3); }
  - Each flare: random duration (1500–3500ms), random delay (0–12000ms)
  - After animation ends: random delay (6000–16000ms) before repeating
    (Use animationIterationCount: 'infinite' with random animationDelay)
  - intensity controls: peak opacity (low: 0.5, medium: 0.7, high: 1.0)
                       and blur (low: 5–8, medium: 3–6, high: 2–5)

1 in 5 flares (random on mount): a streak instead of a dot:
  - 2px × 20px, no border-radius
  - random rotation: rotate(Ndeg)
  - same cyan, same animation

The parent wrapper div:
  position: absolute, inset: 0, pointer-events: none, overflow: hidden, z-index: 0
  (children need position:absolute relative to this)

Export: default AmbientFlares

Run `bun run build` — zero errors.

# PROMPT D — Create UniverseBackground
# ─────────────────────────────────────

Read UI_DESIGN.md section "Universe Background Canvas" carefully.

Create `src/components/three/UniverseBackground.tsx`:

1. Import usePerformanceMode hook (create this hook too if it doesn't exist):
   `const isLowPower = window.innerWidth < 768 || navigator.hardwareConcurrency < 4`
   Export as `usePerformanceMode(): boolean`

2. If isLowPower: return a CSS div only:
   style: position fixed, inset 0, z-index -2
   background: radial-gradient(ellipse at 50% 40%, #0a0a14 0%, #060608 100%)

3. If desktop: return a Canvas (React Three Fiber):
   style: position fixed, inset 0, z-index -2, pointer-events none
   dpr: [1, 1.3], alpha: true, antialias: false
   
   Inside:
   - <StarField /> child component:
     2000 Points geometry
     Positions: Float32Array of random sphere distribution (radius 80)
     Colours: mixed white/cyan-tint as specified in UI_DESIGN.md
     Sizes: varied Float32Array 0.008–0.028
     useFrame: rotation.y += 0.00006
     Twinkling: for 30 random points, modulate opacity via Math.sin(clock * randomFreq + randomPhase)
   
   - No postprocessing on this canvas

Run `bun run build` — zero errors.

# PROMPT E — Create SpaceObjects
# ────────────────────────────────

Read UI_DESIGN.md section "Floating Space Objects" carefully.

Create `src/components/three/SpaceObjects.tsx`:

Export 5 named components:
  AsteroidObject  — for About section
  MoonObject      — for Experience section
  CrystalShards   — for Skills section (renders 4 instances)
  RingObject      — for Projects section
  DistantPlanet   — for Contact section

All share:
  Material: MeshStandardMaterial, color: '#888888', roughness: 0.85, metalness: 0.05
  Lighting: pointLight (0.6, white, from above-right) + ambientLight (0.25)
  Float wrapper from Drei (slow, subtle)
  useFrame: custom slow rotation on appropriate axes
  transparent: true on material, opacity fades in/out based on section visibility
    (use Framer Motion's useInView or IntersectionObserver on the section wrapper)
  <Suspense fallback={null}> around each

CrystalShards specifically:
  - 4 separate OctahedronGeometry(1,0) meshes
  - Different scales, positions, rotation speeds
  - These mimic the fragments floating off the hero's crown

Each component goes inside a Canvas sized to fit its section area.
Or: create ONE SpaceObjects canvas per section — small, positioned, z-index: 0.
The UniverseBackground is separate (full screen, z: -2).

Run `bun run build` — zero errors.

# PROMPT F — Apply monochrome system to all sections
# ───────────────────────────────────────────────────

Read UI_DESIGN.md sections for About, Experience, Skills, Projects, Contact, Footer.

For EACH section component:
1. Remove ALL glassmorphism (backdrop-filter: blur, glass-card classes)
2. Remove ALL blue and violet colour references
3. Apply the monochrome + selective cyan system per UI_DESIGN.md spec:
   - Section markers (001 · ABOUT etc.)
   - border-radius: 2px on all cards and buttons (not 16px)
   - Square submit button with --cyan background
   - Underline-style contact form inputs
   - Border-top category system on skill cards
   - Blink dot on project status badge
   - Embedded mini Three.js canvas in featured project card (crystal shard)
   - Timeline dot pulse effect in Experience
   - Stat numbers with cyan "%" character

4. Add <AmbientFlares> to each section (count and intensity per spec)
5. Add corresponding SpaceObject component to each section

Run `bun run build` after each section — fix errors before moving on.
Do sections in order: About → Experience → Skills → Projects → Contact → Footer.

# PROMPT G — Final cinematic polish
# ──────────────────────────────────

This is the last pass. Read UI_DESIGN.md "Scroll Dissolve Between Sections".

1. Section wrappers: ensure background: transparent so UniverseBackground shows through
2. Add GSAP ScrollTrigger to each section:
   - onLeave: gsap.to(sectionContent, { opacity: 0, duration: 0.4 })
   - onEnter: gsap.to(sectionContent, { opacity: 1, duration: 0.6 })
   - onLeaveBack / onEnterBack for scrolling up
3. SpaceObjects: fade in/out opacity as their section enters/leaves viewport
4. Ensure Navbar active state updates correctly as sections scroll into view
5. Test: scroll through the entire page — it should feel like drifting through space
   with content materialising and dissolving as you pass through each region

6. Final checks:
   - No horizontal overflow on any viewport width
   - No blue or violet anywhere in the rendered site
   - AmbientFlares fire on every section (check all 5)
   - Hero text disappears smoothly on scroll
   - Film timestamp appears and fades correctly
   - Scroll indicator disappears on first scroll
   - All 3D objects visible and animating
   - Mobile: Three.js universe background disabled, CSS fallback working
   - bun run build: zero TypeScript errors, note the bundle size

Report final bundle size and any issues found.
