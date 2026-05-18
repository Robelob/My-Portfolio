# UI_DESIGN.md — Cinematic Universe Edition
# Robel Kebede Portfolio — Updated from hero screenshot

---

## The Vision

The hero says everything: monochrome, sculptural, cinematic, alive.
A low-poly classical bust dissolving at the top — fragments floating,
cyan sparks firing at random intervals like embers in the dark.
When you scroll, you travel through the model and emerge into the cosmos.

This is the experience the whole site must deliver.
Not a portfolio. An expedition through space.
The visitor should feel like they are watching a film, not browsing a website.

---

## Core Aesthetic: Cinematic Monochrome + Selective Cyan

This is the single most important rule for the entire site.

```
The world is black, white, and deep grey.
Colour exists in ONE form only: cold cyan (#00d4ff).
Everything else — text, cards, borders, backgrounds — is greyscale.
Colour is used like a cinematographer uses a single light source:
sparingly, intentionally, to direct the eye.
```

### Colour System

```css
/* Paste into globals.css — REPLACES all previous colour variables */
:root {
  /* The void */
  --bg:          #060608;    /* base page background */
  --surface-1:   #0d0d0f;   /* card backgrounds */
  --surface-2:   #141416;   /* elevated surfaces */

  /* Greyscale — the monochrome film */
  --grey-700:    #2a2a2e;
  --grey-600:    #3d3d42;
  --grey-500:    #5a5a61;
  --grey-400:    #7f7f88;
  --grey-300:    #a8a8b3;
  --grey-200:    #c8c8d0;
  --grey-100:    #e8e8ec;
  --white:       #f2f2f4;

  /* THE ONLY COLOUR — used sparingly */
  --cyan:        #00d4ff;
  --cyan-dim:    #0891b2;
  --cyan-ghost:  rgba(0, 212, 255, 0.08);
  --cyan-glow:   rgba(0, 212, 255, 0.15);

  /* Borders */
  --border:         rgba(255, 255, 255, 0.06);
  --border-bright:  rgba(255, 255, 255, 0.12);
  --border-cyan:    rgba(0, 212, 255, 0.2);
}
```

### When to use --cyan (strictly)
1. Light flares / sparks throughout site — like in the hero
2. Active nav link state
3. One or two key words spotlighted in headings
4. The "%" in stat numbers (30%, 20%)
5. Timeline dots pulse colour
6. Submit button background (only filled surface)
7. Blinking "live" dot on the project card status badge
8. Hover: icon links in footer turn cyan

NEVER on: body text, backgrounds, large surfaces, general labels.

---

## Typography

```css
font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Generous spacing — cinematic breathing room */
letter-spacing: 0.02em;    /* base body */
letter-spacing: 0.12em;   /* section labels uppercase */
letter-spacing: 0.06em;   /* hero name */

/* Scale */
--text-hero:    clamp(4.5rem, 10vw, 8rem);
--text-section: clamp(2.2rem, 5vw, 3.5rem);
--text-body:    1.0625rem;     /* 17px */
--text-caption: 0.8125rem;    /* 13px */
--text-label:   0.6875rem;    /* 11px */

/* Weight: 300 display, 400 body, 500 emphasis. Never 600 or 700. */
```

---

## The Cyan Flare / Spark Effect

The signature of the entire site. Present subtly in every section.
In the hero: fires on the geometry at random.
Everywhere else: ambient particles drifting in section backgrounds.

```typescript
// src/components/effects/AmbientFlares.tsx
// CREATE THIS FILE — reusable in every section

// Each flare is a circular particle:
//   shape: circle
//   background: radial-gradient(circle, #00d4ff 0%, transparent 70%)
//   position: absolute, pointer-events: none, z-index: 0
//   blur: CSS filter blur(3px to 8px)
//   animation: appear (opacity 0→1, scale 0.2→1) then disappear (opacity→0, scale→0.3)
//   timing: appear over 400ms, hold 200–1000ms, disappear over 800ms
//   repeat delay: 5000–15000ms random per flare (they stagger organically)
//   size: 6px to 16px diameter

// Optional: 1 in 5 flares is a "streak" instead of a dot:
//   2px × 24px, rotated randomly 0–360deg, same cyan, same animation
//   Mimics micro-shooting-stars

// Props:
//   count: number (3–6 per section)
//   intensity: 'low' | 'medium' | 'high'
//     low    = smaller flares, longer delays (about, contact)
//     medium = standard (experience, skills)
//     high   = more active (hero border area)

// The flares in each section should be positioned:
//   - Mostly near edges and corners — not centre where text lives
//   - Some partially behind cards (z-index ordering)
//   - A few in open space
```

---

## Hero Section — Text Overlay & Finishing Touches

The model, scroll-zoom, and star travel already exist. Add:

### 1. Name & Title Text Overlay

```tsx
// Position: bottom-left quadrant of viewport, above canvas
// z-index: 10, pointer-events: none

// Layout (vertical stack):
//
// ┌─────────────────────────────────┐
// │                                 │  ← empty top half = model's face
// │  ROBEL                          │
// │  KEBEDE                         │  ← lower third
// │                                 │
// │  FULL-STACK ENGINEER            │
// │  AI · DEVOPS · CLOUD            │
// │                                 │
// │         ↓  scroll to explore    │
// └─────────────────────────────────┘

// Styles:
// "ROBEL" / "KEBEDE":
//   font-size: clamp(4rem, 10vw, 7rem)
//   font-weight: 300
//   color: rgba(255,255,255,0.92)
//   letter-spacing: 0.06em
//   line-height: 0.95
//   text-transform: uppercase

// "FULL-STACK ENGINEER":
//   font-size: clamp(0.7rem, 1.5vw, 0.9rem)
//   font-weight: 400
//   color: var(--grey-400)
//   letter-spacing: 0.22em
//   text-transform: uppercase
//   margin-top: 20px

// "AI · DEVOPS · CLOUD":
//   font-size: clamp(0.6rem, 1.2vw, 0.75rem)
//   font-weight: 400
//   color: var(--grey-600)
//   letter-spacing: 0.28em
//   text-transform: uppercase

// Entrance animation:
//   Each line: translateY(50px)→0, opacity 0→1
//   Stagger delays: 600ms, 750ms, 1000ms, 1150ms after model loads
//   Easing: cubic-bezier(0.16, 1, 0.3, 1) — smooth decel

// Scroll-away animation (Framer Motion useScroll + useTransform):
//   scrollY 0–20vh → opacity 1→0, y 0→-50px
//   useTransform, no snap
```

### 2. Film Timestamp (Top-Left)

```tsx
// "2026  ·  ŁÓDŹ, POLAND"
// position: fixed, top: 28px, left: 28px
// font: monospace, 10px, var(--grey-600), letter-spacing: 0.18em
// pointer-events: none
// Fades in 1200ms after load
// Disappears when nav scrolls into sticky mode (after 100px)
```

### 3. Scroll Indicator (Bottom-Centre)

```tsx
// "SCROLL TO EXPLORE"
// font: 9px, monospace, var(--grey-600), letter-spacing: 0.25em
// A thin 1px vertical line BELOW the text, height 32px
// @keyframes breathe: scaleY 0.3 → 1 → 0.3, 2.5s infinite, ease-in-out
// transform-origin: top
// Whole element fades out after first scroll event (opacity → 0, 0.5s)
```

### 4. Enhance Existing Flares on Model

```
The cyan sparks already exist on the geometry. Add:
- 2–3 additional flares that appear slightly OUTSIDE the model silhouette
  (in the surrounding black void, near the shoulders/edges)
- These "escape sparks" make it feel like energy radiating off the form
- Same animation as existing flares, just positioned outside the mesh bounds
```

---

## Universe Background Canvas

```typescript
// src/components/three/UniverseBackground.tsx
// CREATE THIS FILE

// A Three.js Canvas fixed to the viewport, z-index: -1
// Renders continuously behind ALL page sections
// The stars the hero zooms into are part of THIS canvas (or unified)

// STAR FIELD:
//   Count: 2000 Points
//   Distribution: random sphere, radius 80
//   Colours (mix):
//     60% → rgba(255,255,255,0.5)  (pure white)
//     25% → rgba(200,200,220,0.35) (cool white)
//     15% → rgba(180,230,255,0.3)  (faint cyan tint — like the hero's ambient)
//   Sizes: 0.008 to 0.03, varied per star
//   Rotation: rotation.y += 0.00006 per frame (imperceptibly slow)
//   Twinkling: 30 random stars oscillate opacity via Math.sin(clock + randomOffset)
//     amplitude: 0.3–0.7, frequency: varies per star

// CANVAS SETTINGS:
//   dpr: [1, 1.3] — limit for performance
//   alpha: true — transparent bg, CSS sets --bg
//   antialias: false — stars don't need it, saves performance
//   No postprocessing on this layer — that's for hero only

// MOBILE:
//   if (window.innerWidth < 768 || navigator.hardwareConcurrency < 4)
//   → render null, return a CSS background instead:
//     background: radial-gradient(ellipse at 50% 50%, #0a0a14 0%, #060608 100%)
//     with a few CSS-animated pseudo-element dots as fake stars
```

---

## Floating Space Objects

```typescript
// src/components/three/SpaceObjects.tsx
// CREATE THIS FILE

// All objects: low-poly grey sculpture aesthetic — matching the hero bust
// Material for all: MeshStandardMaterial({
//   color: '#888888',
//   roughness: 0.85,
//   metalness: 0.05,
// })
// Lighting for these: one dim AmbientLight (0.3) + one directional from above-right (0.6)
// No emissive, no texture, no colour — pure form

// ASTEROID (About section background)
//   Geometry: IcosahedronGeometry(1, 0) — zero subdivisions, very craggy
//   Scale: 0.45
//   Position: right edge, partially off-screen
//   Rotation: slow tumble on all axes (0.003, 0.002, 0.001 per frame)
//   Float: gentle drift, Drei <Float> speed=0.5 rotationIntensity=0.4

// MOON (Experience section)
//   Geometry: SphereGeometry(1, 5, 4) — barely round, very faceted
//   Scale: 0.7
//   Position: upper-right corner, partially cropped
//   Rotation: very slow Y-axis only (0.001 per frame)
//   Float: <Float> speed=0.3

// CRYSTAL SHARDS (Skills section)
//   Geometry: OctahedronGeometry(1, 0) × 4 instances
//   Scales: 0.18, 0.28, 0.22, 0.15 — varied
//   Positions: scattered in background, different Z depths (z: -2 to -5)
//   These mimic the exploding geometry of the hero's crown
//   Each rotates on a different axis at different speeds

// RING (Projects section)
//   Geometry: TorusGeometry(1, 0.12, 4, 7) — very low segments, polygonal
//   Scale: 0.55
//   Tilt: rotation.x = Math.PI / 3 (60deg tilt, like Saturn seen from angle)
//   Rotation: slow spin on Y axis (0.004 per frame)
//   Position: centre-right, partially visible

// DISTANT PLANET (Contact section)
//   Geometry: SphereGeometry(1, 7, 5) — low poly
//   Scale: 3.5 — large but very far back
//   Position: z: -18, upper-left area
//   The scale + distance makes it look enormous and far away
//   Rotation: imperceptibly slow (0.0003 per frame)

// ALL OBJECTS:
//   - Only render when their section is within ±300px of viewport
//     Use IntersectionObserver or GSAP ScrollTrigger to toggle visibility
//   - Fade in/out on section enter/leave (mesh.material.opacity, transparent: true)
//   - Mobile: render at most 1 object (the asteroid only), half scale
//   - Wrapped in <Suspense fallback={null}>
```

---

## Navbar

```
Style: Fully transparent. No background ever.
       The cosmos shows through. This is intentional.

Logo:
  Text "RK" only — no box, no shape
  font: 15px, weight 300, white, letter-spacing: 0.18em
  On hover: color: var(--cyan), transition: 0.4s

Nav links:
  font: 11px, uppercase, letter-spacing: 0.18em, weight 400
  Rest state: var(--grey-500)
  Hover: var(--grey-100), transition: 0.3s
  Active: var(--white) + 1px solid var(--cyan) underline (bottom, 4px gap)

After 80px scroll:
  Add: border-bottom: 1px solid rgba(255,255,255,0.04)
  Still NO background — just the faint line separating nav from content

Mobile:
  Full-screen overlay: background: rgba(0,0,0,0.97)
  Links: 26px, weight 300, centered, letter-spacing: 0.1em
  Separated by 1px solid rgba(255,255,255,0.04)
  Close: "×" top-right, var(--grey-500)
  Framer Motion: overlay fades in 0.3s, links translateY 20px→0 staggered
```

---

## Section Markers — Film Reel Chapter Headers

Every section starts with this pattern (EXACT format):

```
────────────  001 · ABOUT
```

Implementation:
```tsx
// A flex row: horizontal rule + text
<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '40px',
}}>
  <div style={{ width: '48px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />
  <span style={{
    fontFamily: 'monospace',
    fontSize: '10px',
    color: 'var(--grey-600)',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  }}>
    001 · ABOUT
  </span>
</div>

// Numbers per section:
// About:      001 · ABOUT
// Experience: 002 · EXPERIENCE
// Skills:     003 · SKILLS
// Projects:   004 · PROJECTS
// Contact:    005 · CONTACT
```

---

## About Section

```
Background layer (z:0): AmbientFlares count=4 intensity="low"
Background layer (z:-1): Asteroid SpaceObject
Content (z:1):

Layout: centered column, max-width: 720px, padding: 160px 0

Section marker: 001 · ABOUT

Heading (2 lines):
  Line 1: "Passionate about" — var(--grey-100), weight 300, clamp(2.2rem,5vw,3.5rem)
  Line 2: "building things" — same style
  The word "things" → color: var(--cyan)  [spotlight word]
  line-height: 1.1, letter-spacing: 0.02em

Body text:
  var(--grey-300), 17px, line-height: 1.9, max-width: 540px
  2 short paragraphs (use summary from portfolio.ts)

Stat row (3 items, no card boxes):
  Separated by: 1px solid rgba(255,255,255,0.06) vertical dividers
  Each item:
    Number: var(--white), 52px, weight: 300
    The "%" suffix: var(--cyan)
    Label: var(--grey-500), 11px, uppercase, letter-spacing: 0.15em
  Items: "4+" years / "30%" resolution / "20%" time

Right column card (languages + education):
  border: 1px solid var(--border)
  background: rgba(255,255,255,0.02)
  NO backdrop-filter/blur
  border-radius: 2px (nearly square — cinematic, not rounded)
  padding: 32px

  Languages: border-only pills, 1px solid rgba(255,255,255,0.1)
             text: var(--grey-300), 12px
  
  Education block (below divider):
    Degree: var(--white), 15px, weight: 300
    Uni: var(--grey-500), 13px, monospace
    GPA: "5.0" standalone — var(--white), 32px, weight: 300
    Award: var(--grey-400), 13px, italic
  
  Mouse tilt: Framer Motion useMotionValue, max ±8deg
              No glow — just the subtle perspective shift

Entrance: all content fades up on scroll, GSAP ScrollTrigger
```

---

## Experience Section

```
Background: AmbientFlares count=3 + Moon SpaceObject (upper right)

Section marker: 002 · EXPERIENCE

Layout: max-width: 760px, centered, padding: 160px 0

Heading: "Where I've worked" — weight 300, clamp(2.2rem,5vw,3.5rem)

Tab switcher (no border boxes):
  "Full-Stack Development  ·  DevOps & Cloud"
  Active word: var(--white), weight: 400
  Inactive: var(--grey-600)
  The "·" separator: var(--grey-700)
  Switch with Framer Motion AnimatePresence crossfade 0.3s

Timeline:
  Left edge: 1px solid rgba(255,255,255,0.07) vertical rule
  GSAP: fills with var(--cyan) as you scroll (strokeDashoffset on SVG line)
  
  Dot (at each bullet start):
    4px circle, var(--cyan)
    On hover: expands to 12px + fading ring animation (cyan, scale 3, opacity 0→0)
    CSS: @keyframes pulse-ring {
      0%   { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(3); opacity: 0; }
    }
    This is the "dying star" pulse.
  
  Bullet text: var(--grey-300), 15px, line-height: 1.8
  Metrics (30%, 20%): var(--cyan), weight: 400
  
  Entrance: each bullet slides in from left (x: -20px → 0), stagger 100ms
```

---

## Skills Section

```
Background: AmbientFlares count=5 + Crystal Shards SpaceObjects

Section marker: 003 · SKILLS

Heading: "What I work with"

Layout: 3-col grid (desktop), 2-col tablet, 1-col mobile, gap: 16px

Each skill card:
  background: rgba(255,255,255,0.02)
  border: 1px solid rgba(255,255,255,0.06)
  border-radius: 2px
  border-top-width: 2px
  
  Top border colours by category (ALL others use white variants):
    Frontend:    var(--cyan)             ← only cyan border in the grid
    Backend:     rgba(255,255,255,0.22)
    Cloud:       rgba(255,255,255,0.16)
    Monitoring:  rgba(255,255,255,0.12)
    Data:        rgba(255,255,255,0.09)
    Tools:       rgba(255,255,255,0.06)
  
  On hover:
    border-color: rgba(255,255,255,0.14)
    transform: translateY(-4px)
    A tiny ::after pseudo-element cyan flare appears and fades

  Category label: var(--grey-500), 10px, uppercase, monospace, letter-spacing: 0.15em
  
  Skill pills:
    border: 1px solid rgba(255,255,255,0.09)
    background: transparent
    text: var(--grey-300), 12px
    On hover: border rgba(255,255,255,0.22), text: var(--white)
    border-radius: 2px (square corners)

Entrance: opacity 0, scale 0.96 → 1, GSAP stagger 60ms
```

---

## Projects Section

```
Background: AmbientFlares count=3 + Ring SpaceObject (partially visible)

Section marker: 004 · PROJECTS

Heading: "What I'm building"

Featured card (AI Finance Agent):
  Full width card (or dominant left on 2-col)
  border: 1px solid rgba(255,255,255,0.08)
  border-top: 2px solid var(--cyan)   ← the cyan line
  background: rgba(255,255,255,0.015)
  border-radius: 2px

  Status badge (top-right):
    NO colour fill — border: 1px solid rgba(255,255,255,0.18), text: var(--grey-300)
    A 4px cyan circle before text — blinks: @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
    Blink speed: 2.5s infinite
    Text: "IN PROGRESS" — 9px, monospace, letter-spacing: 0.15em

  Title: var(--white), 22px, weight: 300
  Description: var(--grey-300), 15px, line-height: 1.8
  
  Tech pills: border-only (no fill), var(--grey-300), border-radius: 2px
  
  Buttons: text-only links, var(--grey-500), 12px, uppercase, letter-spacing: 0.1em
           Hover: var(--white)
           Tooltip "coming soon": dark pill, var(--grey-700) bg, var(--grey-400) text
  
  RIGHT SIDE of card: embedded small Three.js canvas (200px × 200px)
    Renders one crystal shard geometry, slowly rotating
    Transparent background, no controls
    This makes the card feel alive and connected to the universe theme

Placeholder card:
  border: 1px dashed rgba(255,255,255,0.06)
  background: transparent
  Centered: "· · ·" — var(--grey-600), 20px, letter-spacing: 0.4em
  On hover: border solid rgba(255,255,255,0.1)
```

---

## Contact Section

```
Background: AmbientFlares count=4 + Distant Planet SpaceObject (large, far back)

Section marker: 005 · CONTACT

Layout: max-width: 520px, centered, padding: 160px 0

Heading: "Let's work" + line break + "together" — weight 300, clamp(2.2rem,5vw,3.5rem)
The word "together" → italic variant (font-style: italic) not cyan — different spotlight technique

Subtext: var(--grey-400), 16px, line-height: 1.7, margin-bottom: 48px

Contact links:
  font: monospace, 14px, var(--grey-300), letter-spacing: 0.05em
  On hover: var(--cyan), text-decoration: underline (1px, var(--cyan), offset 4px)
  NO icons

Form — UNDERLINE STYLE:
  Each input:
    background: transparent
    border: none (no sides, no top)
    border-bottom: 1px solid rgba(255,255,255,0.1)
    border-radius: 0
    padding: 14px 0
    color: var(--white), font-size: 16px
    placeholder: var(--grey-600)
    On focus: border-bottom: 1px solid var(--cyan)
              no box-shadow, no glow

  Submit button:
    background: var(--cyan)         ← FULL CYAN FILL (rare, intentional)
    color: #000000
    border: none
    border-radius: 0                ← square, cinematic
    height: 54px, width: 100%
    font: 11px, uppercase, letter-spacing: 0.25em, weight: 400
    On hover: background: rgba(0,212,255,0.85)
    Loading: background: rgba(0,212,255,0.4), text fades
    Success: background: transparent, border: 1px solid var(--cyan),
             text: "MESSAGE SENT", color: var(--cyan)
```

---

## Footer

```
border-top: 1px solid rgba(255,255,255,0.05)
padding: 28px 40px
background: transparent (the void shows through)
flex, space-between, align-center

Left:   "RK" — var(--white), 15px, weight: 300, letter-spacing: 0.18em
Center: "© 2026 ROBEL KEBEDE" — var(--grey-600), 10px, monospace, letter-spacing: 0.15em
Right:  3 icon links (Mail, Github, Linkedin via lucide-react)
        Rest: var(--grey-600), size: 17px
        Hover: var(--cyan), scale: 1.1, transition: 0.25s

NO gradients. NO decorative elements. The page ends and space continues.
```

---

## Scroll Dissolve Between Sections

```typescript
// Sections should feel like drifting through regions of space — not hard cuts.

// Implementation:
// 1. No solid backgrounds on section wrappers (background: transparent)
//    The UniverseBackground canvas shows through everything
// 2. Section content (text, cards) fades OUT as it scrolls out of view
//    GSAP ScrollTrigger on each section: onLeave → opacity → 0
// 3. Next section's content fades IN: onEnter → opacity → 1
// 4. The space objects for each section fade out as that section leaves
// 5. This creates a continuous space journey — you are always in space,
//    and different objects drift past you as you travel

// The effect: the page feels like a single continuous environment,
// not separate "sections" you jump between.

// Global scroll progress (0–1) can drive:
// - Star field slowly brightening (more stars visible deeper in)
// - Space objects rotating slightly faster as you scroll faster
// - Very subtle parallax on the stars vs foreground content
```

---

## The Monochrome Discipline — Rules for Claude Code

```
RULE 1: The previous spec used blue (#2563EB) and violet (#7c3aed). BOTH ARE GONE.
        The ONLY colour is --cyan (#00d4ff). No exceptions.

RULE 2: If adding a colour anywhere, ask: is this a flare, a glow, or a primary action?
        If none of those: use a grey. Always.

RULE 3: No gradient text, no gradient backgrounds, no gradient buttons.
        Only one gradient: inside AmbientFlares (radial, cyan→transparent).

RULE 4: No backdrop-filter: blur() anywhere on the site.
        Glassmorphism is CANCELLED. It conflicts with the aesthetic and kills performance.

RULE 5: No shadows (box-shadow) anywhere except focus rings on form inputs.
        Depth comes from opacity and Z-layering, not shadows.

RULE 6: border-radius: 2px maximum on cards and buttons.
        Square edges. Rounded corners are not cinematic.
        Pills (tags) can use border-radius: 2px still — no pill shapes.

RULE 7: All 3D objects: grey material, low-poly, no texture, no emissive colour.
        They are sculptures in space, not light sources.

RULE 8: Typography weight: 300 large display, 400 body/labels, 500 only for emphasis.
        Lightness is elegance. Heavy fonts break the cinematic feel.

RULE 9: Generous letter-spacing everywhere.
        Minimum 0.05em on all text. Film titles breathe.

RULE 10: The cyan flare IS the heartbeat of the site.
         It should feel alive — random, organic, not on a fixed loop.
         Randomise durations and delays, never perfectly periodic.
```

---

## New Files to Create

```
src/components/effects/
  AmbientFlares.tsx          ← cyan spark particles, used in every section

src/components/three/
  UniverseBackground.tsx     ← fixed star field canvas behind all content
  SpaceObjects.tsx           ← asteroid, moon, crystals, ring, planet

src/hooks/
  useScrollAnimation.ts      ← GSAP ScrollTrigger helper (already planned)
  useParallax.ts             ← NEW: parallax values from scroll for 3D objects
```

## Files to Update

```
globals.css / index.css      ← replace blue/violet vars with grey/cyan system
Navbar.tsx                   ← transparent, no blur, monochrome links
About.tsx                    ← remove glassmorphism, apply new aesthetic
Experience.tsx               ← timeline dot pulse, cyan metrics
Skills.tsx                   ← square corners, border-top category system
Projects.tsx                 ← cyan top border, blink dot, embedded 3D canvas
Contact.tsx                  ← underline inputs, square cyan button
Footer.tsx                   ← minimal void footer
```

## Performance Budget

```
Desktop:
  Hero canvas: full res + Bloom postprocessing
  UniverseBackground canvas: dpr 1.3 max, no postprocessing
  SpaceObjects: all 5 types active (section-dependent visibility)
  AmbientFlares: CSS animation only (no canvas needed)

Mobile (< 768px or hardwareConcurrency < 4):
  Hero canvas: dpr 1.0, disable Bloom
  UniverseBackground: DISABLED — use CSS radial-gradient fallback
  SpaceObjects: max 1 object (asteroid), half geometry
  AmbientFlares: max 2 per section, CSS only

Detection:
  const isLowPower = navigator.hardwareConcurrency < 4 || window.innerWidth < 768
  Export this boolean from a shared hook: usePerformanceMode()
  Use it in all Three.js components to switch render mode
```
