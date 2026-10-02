import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Sparkles, OrbitControls } from '@react-three/drei';

function SatelliteNode({ radius, speed, color, offsetAngle = 0, isLoading }) {
  const nodeRef = useRef();

  useFrame((state) => {
    if (nodeRef.current) {
      const t = state.clock.getElapsedTime() * (isLoading ? speed * 2.5 : speed) + offsetAngle;
      nodeRef.current.position.x = Math.cos(t) * radius;
      nodeRef.current.position.z = Math.sin(t) * radius;
      nodeRef.current.position.y = Math.sin(t * 1.5) * 0.35;
    }
  });

  return (
    <mesh ref={nodeRef}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isLoading ? 2.0 : 1.2}
      />
    </mesh>
  );
}

function FloatingFinanceSphere({ isDark, reduceMotion, isLoading }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  useFrame((state, delta) => {
    // 1. Mouse-following inertia & tilt
    if (groupRef.current && !reduceMotion) {
      const targetRotY = state.pointer.x * 0.45;
      const targetRotX = -state.pointer.y * 0.35;
      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
    }

    // 2. Active rotations (accelerated 3x when AI is searching)
    const speedMult = isLoading ? 3.0 : 1.0;
    if (!reduceMotion) {
      if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.25 * speedMult;
        meshRef.current.rotation.x += delta * 0.15 * speedMult;
      }
      if (ringRef1.current) {
        ringRef1.current.rotation.z += delta * 0.35 * speedMult;
        ringRef1.current.rotation.x += delta * 0.2 * speedMult;
      }
      if (ringRef2.current) {
        ringRef2.current.rotation.y += delta * 0.3 * speedMult;
        ringRef2.current.rotation.z -= delta * 0.25 * speedMult;
      }
    }
  });

  // Dynamic colors based on AI thinking state
  const sphereColor = isLoading
    ? "#10b981" // Emerald green when actively searching verified facts
    : (isDark ? "#6366f1" : "#4f46e5");

  const ring1Color = isLoading ? "#34d399" : (isDark ? "#38bdf8" : "#0284c7");
  const ring2Color = isLoading ? "#06b6d4" : "#a855f7";

  return (
    <group ref={groupRef}>
      <ambientLight intensity={isDark ? 0.9 : 1.1} />
      <directionalLight position={[5, 5, 5]} intensity={isLoading ? 2.0 : 1.5} />
      <pointLight position={[-4, -4, -4]} intensity={0.8} color={isLoading ? "#34d399" : "#818cf8"} />

      {/* Floating Sparkle Field around the 3D core */}
      <Sparkles
        count={isLoading ? 50 : 25}
        scale={2.8}
        size={isLoading ? 3 : 1.8}
        speed={isLoading ? 1.5 : 0.4}
        color={isLoading ? "#10b981" : "#38bdf8"}
        opacity={0.6}
      />

      <Float speed={reduceMotion ? 0 : (isLoading ? 4 : 2)} rotationIntensity={reduceMotion ? 0 : 0.4} floatIntensity={reduceMotion ? 0 : 0.5}>
        {/* Core Distorted Financial Hologram */}
        <Sphere ref={meshRef} args={[0.82, 48, 48]}>
          <MeshDistortMaterial
            color={sphereColor}
            wireframe
            distort={isLoading ? 0.4 : (reduceMotion ? 0 : 0.18)}
            speed={isLoading ? 3.5 : (reduceMotion ? 0 : 1.2)}
            roughness={0.2}
          />
        </Sphere>

        {/* Orbiting Ring 1 (AMC / SEBI Data Track) */}
        <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.32, 0.018, 16, 80]} />
          <meshStandardMaterial
            color={ring1Color}
            emissive={ring1Color}
            emissiveIntensity={isLoading ? 1.4 : 0.65}
          />
        </mesh>

        {/* Orbiting Ring 2 (AMFI Verification Track) */}
        <mesh ref={ringRef2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[1.52, 0.014, 16, 80]} />
          <meshStandardMaterial
            color={ring2Color}
            emissive={ring2Color}
            emissiveIntensity={isLoading ? 1.2 : 0.55}
          />
        </mesh>

        {/* Satellite Telemetry Nodes (HDFC AMC, SEBI, AMFI streams) */}
        <SatelliteNode radius={1.15} speed={0.8} color="#10b981" offsetAngle={0} isLoading={isLoading} />
        <SatelliteNode radius={1.42} speed={0.6} color="#38bdf8" offsetAngle={Math.PI * 0.7} isLoading={isLoading} />
        <SatelliteNode radius={1.65} speed={0.5} color="#c084fc" offsetAngle={Math.PI * 1.4} isLoading={isLoading} />
      </Float>
    </group>
  );
}

// Fallback component for WebGL unsupported or error state
function FallbackHero({ isDark, isLoading }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className={`w-28 h-28 rounded-full filter blur-xl opacity-70 animate-pulse ${
        isLoading ? 'bg-emerald-500/50' : (isDark ? 'bg-indigo-600/40' : 'bg-indigo-400/40')
      }`} />
      <div className={`absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin ${
        isLoading ? 'border-emerald-400' : (isDark ? 'border-indigo-400/50' : 'border-indigo-600/50')
      }`} style={{ animationDuration: isLoading ? '6s' : '20s' }} />
    </div>
  );
}

export default function Hero3D({ isDark = true, reduceMotion = false, isLoading = false }) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <FallbackHero isDark={isDark} isLoading={isLoading} />;
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none flex items-center justify-center cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'low-power', antialias: true }}
      >
        <FloatingFinanceSphere isDark={isDark} reduceMotion={reduceMotion} isLoading={isLoading} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 2.6}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
