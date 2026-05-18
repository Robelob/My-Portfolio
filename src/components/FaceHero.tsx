import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ------------ helpers ------------ */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/* ------------ Iridescence gradient texture ------------ */
function makeIridescenceTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 8;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  g.addColorStop(0.0, "#ffd6a5"); // gold
  g.addColorStop(0.25, "#ffadad"); // pink
  g.addColorStop(0.5, "#bdb2ff"); // purple
  g.addColorStop(0.75, "#a0c4ff"); // blue
  g.addColorStop(1.0, "#caffbf"); // mint
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 8);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* ------------ Face Layer ------------ */
function FaceLayer({
  progressRef,
  mouseRef,
  scrollStartedRef,
}: {
  progressRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollStartedRef: React.MutableRefObject<boolean>;
}) {
  const obj = useLoader(OBJLoader, "/models/face_model.obj");
  const matRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  const cloned = useMemo(() => {
    const root = obj.clone(true);
    const iridTex = makeIridescenceTexture();
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.2,
      thickness: 0.6,
      ior: 1.4,
      iridescence: 1.0,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 800],
      iridescenceThicknessMap: iridTex,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.2,
      transparent: true,
      opacity: 1,
    });
    matRef.current = mat;
    root.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh) m.material = mat;
    });
    const box = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    root.position.sub(center);
    const scale = 2 / Math.max(size.y, 0.0001);
    root.scale.setScalar(scale);
    return root;
  }, [obj]);

  useFrame((state, delta) => {
    const p = progressRef.current;

    const opacity = 1 - smoothstep(0.68, 0.78, p);
    if (matRef.current) matRef.current.opacity = opacity;
    if (groupRef.current) groupRef.current.visible = opacity > 0.001;

    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // subtle looping idle rotation
      const idleY = Math.sin(t * 0.25) * 0.15;
      const idleX = Math.sin(t * 0.18) * 0.04;

      if (!scrollStartedRef.current) {
        targetRot.current.y = idleY + mouseRef.current.x * 0.45;
        targetRot.current.x = idleX + -mouseRef.current.y * 0.25;
      } else {
        targetRot.current.y = idleY;
        targetRot.current.x = idleX;
      }
      const k = 1 - Math.pow(0.002, delta);
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, targetRot.current.x, k);
      groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetRot.current.y, k);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}

/* ------------ Universe Layer ------------ */
function UniverseLayer({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const sunCoreRef = useRef<THREE.Mesh>(null);
  const sunGlowRef = useRef<THREE.Mesh>(null);
  const sunHaloRef = useRef<THREE.Mesh>(null);
  const sunLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const p = progressRef.current;
    const visible = p >= 0.68;
    if (groupRef.current) groupRef.current.visible = visible;

    const v = smoothstep(0.7, 0.95, p);

    // Fade in sun materials
    [sunCoreRef.current, sunGlowRef.current, sunHaloRef.current].forEach((mesh) => {
      if (mesh) {
        const m = mesh.material as THREE.Material & { opacity: number };
        m.transparent = true;
        m.opacity = v * (mesh === sunCoreRef.current ? 1 : mesh === sunGlowRef.current ? 0.55 : 0.25);
      }
    });
    if (sunLightRef.current) sunLightRef.current.intensity = v * 6;

    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
    // Subtle pulse
    if (sunGlowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
      sunGlowRef.current.scale.setScalar(s);
    }
    if (sunHaloRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8 + 1) * 0.06;
      sunHaloRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* dark sphere shell */}
      <mesh>
        <sphereGeometry args={[400, 32, 32]} />
        <meshBasicMaterial color="#05060f" side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <Stars radius={120} depth={80} count={6000} factor={4} saturation={0} fade speed={1} />

      {/* Glowing sun behind the model */}
      <group position={[0, 0, -8]}>
        {/* Bright core */}
        <mesh ref={sunCoreRef}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshBasicMaterial color="#fff2c2" transparent opacity={0} toneMapped={false} />
        </mesh>
        {/* Inner glow */}
        <mesh ref={sunGlowRef}>
          <sphereGeometry args={[1.9, 48, 48]} />
          <meshBasicMaterial color="#ffb858" transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
        {/* Outer halo */}
        <mesh ref={sunHaloRef}>
          <sphereGeometry args={[3.2, 48, 48]} />
          <meshBasicMaterial color="#ff7a2a" transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
        <pointLight ref={sunLightRef} intensity={0} color="#ffd089" distance={60} decay={1.5} />
      </group>
    </group>
  );
}

/* ------------ Camera Rig ------------ */
function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((_, delta) => {
    const p = clamp01(progressRef.current);
    let z: number;
    if (p < 0.7) {
      // 0 -> 0.7  : Z 5 -> 1
      z = lerp(5, 1, p / 0.7);
    } else {
      // 0.7 -> 1 : Z 1 -> -8 (through the stars)
      z = lerp(1, -8, (p - 0.7) / 0.3);
    }
    const k = 1 - Math.pow(0.005, delta);
    camera.position.x = lerp(camera.position.x, 0, k);
    camera.position.y = lerp(camera.position.y, 0, k);
    camera.position.z = lerp(camera.position.z, z, k);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ------------ Hero ------------ */
export default function FaceHero() {
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollStartedRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(total, Math.max(0, -rect.top));
      const p = total > 0 ? scrolled / total : 0;
      progressRef.current = p;
      if (p > 0.001) scrollStartedRef.current = true;
      setProgress(p);
    };
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 2000 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#03040a"]} />
          <fog attach="fog" args={["#03040a", 8, 30]} />

          {/* Key spotlight — dramatic top-side */}
          <spotLight
            position={[4, 6, 4]}
            angle={0.5}
            penumbra={0.6}
            intensity={120}
            distance={30}
            decay={1.5}
            color="#fff4e6"
            castShadow
          />
          {/* Teal rim light from behind */}
          <directionalLight position={[-2, 1.5, -5]} intensity={3} color="#3fe0ff" />
          {/* Subtle fill so shadows aren't pitch black */}
          <hemisphereLight args={["#202040", "#000000", 0.25]} />

          <Suspense fallback={null}>
            <FaceLayer
              progressRef={progressRef}
              mouseRef={mouseRef}
              scrollStartedRef={scrollStartedRef}
            />
          </Suspense>

          <UniverseLayer progressRef={progressRef} />
          <CameraRig progressRef={progressRef} />

          <EffectComposer>
            <Bloom
              intensity={1.1}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.25}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/60">
          {progress < 0.05 ? "Scroll to enter" : `${Math.round(progress * 100)}%`}
        </div>
      </div>
    </div>
  );
}
