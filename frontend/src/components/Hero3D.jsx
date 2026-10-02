import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function FloatingFinanceSphere({ isDark, reduceMotion }) {
  const meshRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();

  useFrame((state, delta) => {
    if (!reduceMotion) {
      if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.25;
        meshRef.current.rotation.x += delta * 0.15;
      }
      if (ringRef1.current) {
        ringRef1.current.rotation.z += delta * 0.35;
        ringRef1.current.rotation.x += delta * 0.2;
      }
      if (ringRef2.current) {
        ringRef2.current.rotation.y += delta * 0.3;
        ringRef2.current.rotation.z -= delta * 0.25;
      }
    }
  });

  const sphereColor = isDark ? "#6366f1" : "#4f46e5";
  const ringColor = isDark ? "#38bdf8" : "#0284c7";

  return (
    <group>
      <ambientLight intensity={isDark ? 0.7 : 0.9} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.2 : 1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#818cf8" />

      <Float speed={reduceMotion ? 0 : 2} rotationIntensity={reduceMotion ? 0 : 0.8} floatIntensity={reduceMotion ? 0 : 1}>
        {/* Core Distorted Sphere */}
        <Sphere ref={meshRef} args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color={sphereColor}
            wireframe
            distort={reduceMotion ? 0 : 0.25}
            speed={reduceMotion ? 0 : 1.5}
            roughness={0.2}
          />
        </Sphere>

        {/* Outer Orbiting Ring 1 */}
        <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.0, 0.02, 16, 100]} />
          <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={0.6} />
        </mesh>

        {/* Outer Orbiting Ring 2 */}
        <mesh ref={ringRef2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[2.3, 0.015, 16, 100]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

// Fallback component for WebGL unsupported or error state
function FallbackHero({ isDark }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className={`w-40 h-40 rounded-full filter blur-2xl opacity-70 animate-pulse ${
        isDark ? 'bg-indigo-600/40' : 'bg-indigo-400/40'
      }`} />
      <div className={`absolute w-32 h-32 rounded-full border-2 border-dashed animate-spin ${
        isDark ? 'border-indigo-400/50' : 'border-indigo-600/50'
      }`} style={{ animationDuration: '20s' }} />
    </div>
  );
}

export default function Hero3D({ isDark = true, reduceMotion = false }) {
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
    return <FallbackHero isDark={isDark} />;
  }

  return (
    <div className="w-full h-full min-h-[180px] md:min-h-[260px] relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'low-power', antialias: true }}
      >
        <FloatingFinanceSphere isDark={isDark} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
