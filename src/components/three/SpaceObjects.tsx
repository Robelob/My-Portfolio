import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Hero-inspired lighting: warm key + cyan rim + hemisphere ─────────────── */
function HeroLights() {
  return (
    <>
      <hemisphereLight args={["#111120", "#000000", 0.4]} />
      <spotLight position={[4, 6, 3]} angle={0.55} penumbra={0.6} intensity={90} color="#fff4e0" />
      <directionalLight position={[-3, 1, -4]} intensity={6} color="#00d4ff" />
    </>
  );
}

/* ── Fake-glow orb: no post-processing needed, works with alpha canvas ─────── */
function GlowOrb({
  position = [0, 0, 0] as [number, number, number],
  color    = "#00d4ff",
  size     = 0.1,
}: {
  position?: [number, number, number];
  color?:    string;
  size?:     number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.12;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <group ref={ref} position={position}>
      <pointLight color={color} intensity={6} distance={9} decay={2} />
      <mesh>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 2.5, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 5.5, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── Section canvas with IntersectionObserver lazy-mount ────────────────────── */
export function SectionCanvas({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "400px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ pointerEvents: "none" }}>
      {visible && (
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}

/* ── About: tumbling icosahedron ─────────────────────────────────────────────── */
export function AsteroidObject() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += 0.003 * d * 60;
      ref.current.rotation.y += 0.002 * d * 60;
      ref.current.rotation.z += 0.001 * d * 60;
    }
  });
  return (
    <>
      <HeroLights />
      <Float speed={0.6} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={ref} scale={0.52}>
          <icosahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial color="#9090a8" roughness={0.12} metalness={0.92} emissive="#000a14" emissiveIntensity={1} />
        </mesh>
        <GlowOrb position={[0.65, 0.55, 0.3]} color="#00d4ff" size={0.09} />
        <GlowOrb position={[-0.4, 0.7, -0.2]} color="#ffffff" size={0.06} />
      </Float>
    </>
  );
}

/* ── Experience: low-poly sphere (moon) ──────────────────────────────────────── */
export function MoonObject() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += 0.001 * d * 60; });
  return (
    <>
      <HeroLights />
      <Float speed={0.35} floatIntensity={0.3}>
        <mesh ref={ref} scale={0.8}>
          <sphereGeometry args={[1, 6, 5]} />
          <meshPhysicalMaterial color="#858598" roughness={0.18} metalness={0.88} emissive="#000610" emissiveIntensity={1} />
        </mesh>
        <GlowOrb position={[0.9, 0.7, 0.6]} color="#00d4ff" size={0.1} />
        <GlowOrb position={[-0.6, -0.4, 0.3]} color="#ffffff" size={0.05} />
      </Float>
    </>
  );
}

/* ── Skills: orbiting crystal shards ────────────────────────────────────────── */
function CrystalShard({ position, scale, rx, ry }: { position: [number, number, number]; scale: number; rx: number; ry: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) { ref.current.rotation.x += rx * d * 60; ref.current.rotation.y += ry * d * 60; }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial color="#6878a8" roughness={0.08} metalness={0.96} emissive="#001828" emissiveIntensity={2.5} />
    </mesh>
  );
}

export function CrystalShards() {
  return (
    <>
      <HeroLights />
      <Float speed={0.9} rotationIntensity={0.5}>
        <CrystalShard position={[-0.5,  0.3,  0]}   scale={0.22} rx={0.013} ry={0.008} />
        <CrystalShard position={[ 0.6, -0.2, -0.5]} scale={0.32} rx={0.008} ry={0.014} />
        <CrystalShard position={[-0.2, -0.4,  0.3]} scale={0.26} rx={0.020} ry={0.006} />
        <CrystalShard position={[ 0.3,  0.5, -0.2]} scale={0.18} rx={0.011} ry={0.018} />
      </Float>
      <GlowOrb position={[0.1, 0.1, 0]} color="#00d4ff" size={0.07} />
      <GlowOrb position={[-0.3, 0.4, 0.2]} color="#ffffff" size={0.04} />
    </>
  );
}

/* ── Projects: rotating torus ───────────────────────────────────────────────── */
export function RingObject() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += 0.004 * d * 60; });
  return (
    <>
      <HeroLights />
      <Float speed={0.45} floatIntensity={0.2}>
        <mesh ref={ref} scale={0.62} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1, 0.1, 6, 14]} />
          <meshPhysicalMaterial color="#5577b0" roughness={0.08} metalness={0.96} emissive="#001840" emissiveIntensity={3} />
        </mesh>
      </Float>
      <GlowOrb position={[0, 0, 0]} color="#00d4ff" size={0.08} />
    </>
  );
}

/* ── Contact: distant planet with atmosphere ────────────────────────────────── */
export function DistantPlanet() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += 0.0004 * d * 60; });
  return (
    <>
      <hemisphereLight args={["#080818", "#000000", 0.5]} />
      <directionalLight position={[5, 3, 3]}  intensity={8} color="#fff4e0" />
      <directionalLight position={[-4, 0, -5]} intensity={4} color="#00d4ff" />
      <mesh ref={ref} scale={3.5} position={[0, 0, -14]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshPhysicalMaterial color="#263550" roughness={0.45} metalness={0.65} emissive="#001a3a" emissiveIntensity={1} />
      </mesh>
      <mesh scale={4.4} position={[0, 0, -14]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.05} side={THREE.BackSide} toneMapped={false} depthWrite={false} />
      </mesh>
      <GlowOrb position={[2.5, 1.5, -10]} color="#ffffff" size={0.28} />
      <GlowOrb position={[-1, 0.5, -12]} color="#00d4ff" size={0.15} />
    </>
  );
}
