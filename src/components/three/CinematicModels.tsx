import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

/* ── Shared mouse + scroll state (module singleton, SSR-safe) ─────────────── */
const inp = { mx: 0, my: 0, vy: 0, _ly: 0 };
if (typeof window !== "undefined") {
  inp._ly = window.scrollY;
  window.addEventListener("mousemove", (e) => {
    inp.mx = (e.clientX / window.innerWidth)  * 2 - 1;
    inp.my = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  window.addEventListener("scroll", () => {
    inp.vy  = window.scrollY - inp._ly;
    inp._ly = window.scrollY;
  }, { passive: true });
}


/* ── Center + scale OBJ to target size ───────────────────────────────────── */
function normalizeObj(root: THREE.Object3D, h = 1.3) {
  const box = new THREE.Box3().setFromObject(root);
  const c = new THREE.Vector3(); const s = new THREE.Vector3();
  box.getCenter(c); box.getSize(s);
  root.position.sub(c);
  root.scale.setScalar(h / Math.max(s.x, s.y, s.z, 0.001));
}

/* ── Hero-quality lighting: warm key + cyan rim ───────────────────────────── */
function SceneLights() {
  return (
    <>
      <hemisphereLight args={["#202040", "#000000", 0.25]} />
      <spotLight position={[4, 6, 4]} angle={0.5} penumbra={0.6} intensity={120} color="#fff4e6" castShadow />
      <directionalLight position={[-2, 1.5, -5]} intensity={3} color="#3fe0ff" />
    </>
  );
}

/* ── Organic blob helper (irregular coastline feel) ─────────────────────── */
function drawBlob(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, seed: number) {
  ctx.beginPath();
  const segs = 22;
  for (let i = 0; i <= segs; i++) {
    const t = (i / segs) * Math.PI * 2;
    const k = 0.84 + 0.1 * Math.sin(t * 3.9 + seed) + 0.06 * Math.cos(t * 2.1 + seed * 1.7);
    const x = cx + rx * k * Math.cos(t);
    const y = cy + ry * k * Math.sin(t);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/* ── Canvas-generated Earth texture ──────────────────────────────────────── */
function makeEarthTex(): THREE.CanvasTexture {
  const W = 512, H = 256;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // Deep ocean with latitude gradient
  const og = ctx.createLinearGradient(0, 0, 0, H);
  og.addColorStop(0, "#061828"); og.addColorStop(0.5, "#0d4d82"); og.addColorStop(1, "#061828");
  ctx.fillStyle = og; ctx.fillRect(0, 0, W, H);

  // Shallow coastal shimmer
  ctx.globalAlpha = 0.12;
  for (const [x, y, rx, ry] of [[115,122,28,14],[345,112,22,11],[88,148,18,9]] as [number,number,number,number][]) {
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3cc8f0"; ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Continents — organic blobs with radial gradient fill
  const lands: [number,number,number,number,number,string,string][] = [
    [72,  82,  48, 62, 0.5, "#2e6a24", "#1c4518"],  // N. America
    [92,  158, 28, 33, 1.1, "#38702c", "#224018"],  // S. America
    [228, 72,  36, 48, 0.3, "#4a7830", "#2e5020"],  // Europe
    [232, 148, 30, 58, 0.9, "#4a6820", "#2e4215"],  // Africa
    [318, 78,  62, 46, 0.2, "#487228", "#2c4a18"],  // Asia
    [388, 162, 36, 24, 1.6, "#567028", "#344418"],  // SE Asia
    [428, 180, 26, 17, 0.8, "#567030", "#344420"],  // Australia
  ];
  for (const [cx,cy,rx,ry,seed,c1,c2] of lands) {
    drawBlob(ctx, cx, cy, rx, ry, seed);
    const lg = ctx.createRadialGradient(cx-rx*0.25, cy-ry*0.25, 0, cx, cy, Math.max(rx,ry)*1.1);
    lg.addColorStop(0, c1); lg.addColorStop(1, c2);
    ctx.fillStyle = lg; ctx.fill();
  }

  // Desert overlays (sandy tan patches)
  ctx.globalAlpha = 0.5;
  for (const [cx,cy,rx,ry,seed] of [[240,128,42,18,0.2],[278,108,20,14,0.6],[430,180,16,11,1.0]] as [number,number,number,number,number][]) {
    drawBlob(ctx, cx, cy, rx, ry, seed);
    ctx.fillStyle = "#b09050"; ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Mountain ranges (subtle darker stripe)
  ctx.globalAlpha = 0.28;
  for (const [cx,cy,rx,ry,seed] of [[348,83,26,7,0.3],[80,88,7,28,0.4],[236,98,7,18,0.5]] as [number,number,number,number,number][]) {
    drawBlob(ctx, cx, cy, rx, ry, seed);
    ctx.fillStyle = "#223018"; ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Ice caps with feathered gradient edge
  for (const [y0, flip] of [[0, false],[228, true]] as [number,boolean][]) {
    const ig = ctx.createLinearGradient(0, flip ? y0+28 : y0, 0, flip ? y0 : y0+28);
    ig.addColorStop(0, "rgba(215,230,255,0)"); ig.addColorStop(0.55, "rgba(215,230,255,0.8)"); ig.addColorStop(1, "rgba(225,238,255,1)");
    ctx.fillStyle = ig; ctx.fillRect(0, y0, W, 28);
  }

  // Cloud layer — irregular wisps at varying latitudes
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#ddeeff";
  for (let i = 0; i < 20; i++) {
    const cx = (i * 28 + 14) % W;
    const cy = 28 + Math.sin(i * 1.35) * 92 + Math.cos(i * 0.75) * 28;
    drawBlob(ctx, cx, cy, 32 + (i % 4) * 6, 8 + (i % 3) * 2, i * 0.6);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ── Canvas-generated Moon texture ───────────────────────────────────────── */
function makeMoonTex(): THREE.CanvasTexture {
  const W = 512, H = 256;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;

  // Base grey
  ctx.fillStyle = "#7e7e84"; ctx.fillRect(0, 0, W, H);

  // Subtle rocky surface noise (many small patches)
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * W, y = Math.random() * H;
    const r = 2 + Math.random() * 14;
    const tone = Math.floor(Math.random() * 38) - 19;
    ctx.globalAlpha = 0.1 + Math.random() * 0.12;
    const v = 126 + tone;
    ctx.fillStyle = `rgb(${v},${v},${v + 4})`;
    ctx.beginPath(); ctx.ellipse(x, y, r, r * (0.5 + Math.random() * 0.5), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Lunar mare (irregular dark seas)
  ctx.globalAlpha = 0.62;
  for (const [cx,cy,rx,ry,seed] of [
    [162,74,62,40,0.3],[282,66,50,33,0.9],[208,88,32,23,0.5],
    [98,138,36,24,1.2],[332,146,52,30,0.7],[207,152,33,20,0.8],
  ] as [number,number,number,number,number][]) {
    drawBlob(ctx, cx, cy, rx, ry, seed);
    ctx.fillStyle = "#474750"; ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Craters: dark floor + bright rim + central peak for large ones
  const craters: [number,number,number][] = [
    [80,55,20],[382,116,24],[244,188,16],[154,186,12],[424,58,18],
    [52,178,14],[302,32,11],[464,198,12],[142,106,9],[312,185,9],
    [468,118,8],[60,110,7],[352,68,8],[438,154,8],[192,36,10],
    [258,150,7],[92,200,8],[352,200,9],[168,144,6],[418,90,7],
    [252,42,6],[136,62,6],[482,74,7],[32,138,8],[498,144,6],
    [182,220,7],[412,222,8],[356,140,6],[458,174,6],[22,70,5],
  ];
  for (const [cx,cy,r] of craters) {
    // Ejecta blanket (bright outer ring)
    if (r >= 10) {
      ctx.globalAlpha = 0.18;
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.7, 0, Math.PI * 2);
      ctx.fillStyle = "#c8c8d0"; ctx.fill();
    }
    // Dark floor
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "#32323c"; ctx.fill();
    // Bright rim
    ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#bcbcc4"; ctx.lineWidth = r * 0.35; ctx.stroke();
    // Central peak (large craters only)
    if (r > 13) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "#d0d0d8"; ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  // Ray systems from major craters
  ctx.globalAlpha = 0.12; ctx.strokeStyle = "#c8c8d0"; ctx.lineWidth = 1.2;
  for (const [cx,cy,len,angles] of [
    [80,55,70,[12,45,78,120,195,272,318]],
    [382,116,55,[28,88,148,238,308]],
  ] as [number,number,number,number[]][]) {
    for (const a of angles) {
      const rad = a * Math.PI / 180;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + len * Math.cos(rad), cy + len * Math.sin(rad));
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Limb darkening vignette
  const ld = ctx.createRadialGradient(W/2, H/2, H * 0.28, W/2, H/2, H * 0.85);
  ld.addColorStop(0, "rgba(0,0,0,0)"); ld.addColorStop(1, "rgba(0,0,0,0.3)");
  ctx.fillStyle = ld; ctx.fillRect(0, 0, W, H);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ── Earth model ──────────────────────────────────────────────────────────── */
function EarthMesh() {
  const obj     = useLoader(OBJLoader, "/models/Earth.obj");
  const grp     = useRef<THREE.Group>(null);
  const earthTex = useMemo(() => makeEarthTex(), []);
  const root = useMemo(() => {
    const r = obj.clone(true);
    const mat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.65,
      metalness: 0.1,
      emissive: new THREE.Color("#081828"),
      emissiveIntensity: 0.35,
    });
    r.traverse(c => { const m = c as THREE.Mesh; if (m.isMesh) m.material = mat; });
    normalizeObj(r, 1.3);
    return r;
  }, [obj, earthTex]);

  useFrame((state, d) => {
    if (!grp.current) return;
    const k = 1 - Math.pow(0.012, d);
    grp.current.rotation.y += 0.003 * d * 60 + inp.vy * 0.012;
    grp.current.rotation.x += (-inp.my * 0.28 - grp.current.rotation.x) * k;
    grp.current.position.x += (inp.mx * 0.18  - grp.current.position.x) * k;
    grp.current.position.y  = Math.sin(state.clock.elapsedTime * 0.4) * 0.07;
    inp.vy *= 0.86;
  });

  return (
    <group ref={grp}>
      <primitive object={root} />
      {/* atmospheric glow via pointLight + halo shells */}
      <pointLight color="#2255ff" intensity={6} distance={3.5} />
      <mesh><sphereGeometry args={[0.73, 32, 32]} /><meshBasicMaterial color="#2266ff" transparent opacity={0.13} side={THREE.BackSide} depthWrite={false} toneMapped={false} /></mesh>
      <mesh><sphereGeometry args={[0.88, 32, 32]} /><meshBasicMaterial color="#4488ff" transparent opacity={0.06} side={THREE.BackSide} depthWrite={false} toneMapped={false} /></mesh>
    </group>
  );
}

/* ── Moon model ───────────────────────────────────────────────────────────── */
function MoonMesh() {
  const obj     = useLoader(OBJLoader, "/models/Moon.obj");
  const grp     = useRef<THREE.Group>(null);
  const moonTex = useMemo(() => makeMoonTex(), []);
  const root = useMemo(() => {
    const r = obj.clone(true);
    const mat = new THREE.MeshStandardMaterial({
      map: moonTex,
      roughness: 0.88,
      metalness: 0.04,
      emissive: new THREE.Color("#0c0c18"),
      emissiveIntensity: 0.18,
    });
    r.traverse(c => { const m = c as THREE.Mesh; if (m.isMesh) m.material = mat; });
    normalizeObj(r, 1.3);
    return r;
  }, [obj, moonTex]);

  useFrame((state, d) => {
    if (!grp.current) return;
    const k = 1 - Math.pow(0.012, d);
    grp.current.rotation.y += 0.002 * d * 60 + inp.vy * 0.008;
    grp.current.rotation.x += (-inp.my * 0.22 - grp.current.rotation.x) * k;
    grp.current.position.x += (-inp.mx * 0.15 - grp.current.position.x) * k;
    grp.current.position.y  = Math.sin(state.clock.elapsedTime * 0.35 + 1.2) * 0.1;
  });

  return (
    <group ref={grp}>
      <primitive object={root} />
      {/* moonlight glow */}
      <pointLight color="#9999cc" intensity={4} distance={3} />
      <mesh><sphereGeometry args={[0.73, 32, 32]} /><meshBasicMaterial color="#aaaacc" transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} toneMapped={false} /></mesh>
      <mesh><sphereGeometry args={[0.86, 32, 32]} /><meshBasicMaterial color="#8888bb" transparent opacity={0.04} side={THREE.BackSide} depthWrite={false} toneMapped={false} /></mesh>
    </group>
  );
}

/* ── Lazy-mount canvas with IntersectionObserver ─────────────────────────── */
// Uses alpha: true so the canvas is transparent — no rectangular border blocks the star field
function CinematicCanvas({ children, className }: {
  children: React.ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVis(e.isIntersecting), { rootMargin: "400px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ pointerEvents: "none" }}>
      {vis && (
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
          <SceneLights />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}

export function EarthScene({ className }: { className?: string }) {
  return <CinematicCanvas className={className}><EarthMesh /></CinematicCanvas>;
}

export function MoonScene({ className }: { className?: string }) {
  return <CinematicCanvas className={className}><MoonMesh /></CinematicCanvas>;
}
