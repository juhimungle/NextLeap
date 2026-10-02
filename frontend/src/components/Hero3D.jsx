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
      <ambientLight intensity={isDark ? 0.8 : 1.0} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 1.4 : 1.6} />
      <pointLight position={[-4, -4, -4]} intensity={0.6} color="#818cf8" />

      <Float speed={reduceMotion ? 0 : 2} rotationIntensity={reduceMotion ? 0 : 0.5} floatIntensity={reduceMotion ? 0 : 0.6}>
        {/* Core Distorted Financial Sphere - Scaled to stay safely within viewport */}
        <Sphere ref={meshRef} args={[0.85, 48, 48]}>
          <MeshDistortMaterial
            color={sphereColor}
            wireframe
            distort={reduceMotion ? 0 : 0.2}
            speed={reduceMotion ? 0 : 1.2}
            roughness={0.2}
          />
        </Sphere>

        {/* Outer Orbiting Ring 1 - Contained within canvas frustum */}
        <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.35, 0.018, 16, 80]} />
          <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={0.6} />
        </mesh>

        {/* Outer Orbiting Ring 2 - Contained within canvas frustum */}
        <mesh ref={ringRef2} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[1.55, 0.014, 16, 80]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

// Fallback component for WebGL unsupported or error state
function FallbackHero({ isDark }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className={`w-28 h-28 rounded-full filter blur-xl opacity-70 animate-pulse ${
        isDark ? 'bg-indigo-600/40' : 'bg-indigo-400/40'
      }`} />
      <div className={`absolute w-24 h-24 rounded-full border-2 border-dashed animate-spin ${
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
    <div className="w-full h-full relative overflow-hidden pointer-events-none select-none flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'low-power', antialias: true }}
      >
        <FloatingFinanceSphere isDark={isDark} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
