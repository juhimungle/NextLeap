import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// 3D Ascending Growth Pillar Bar
function GrowthBar({ position, height, color, capColor, delay, isLoading, label }) {
  const meshRef = useRef();
  const capRef = useRef();

  useFrame((state) => {
    if (meshRef.current && capRef.current) {
      const t = state.clock.getElapsedTime();
      // Subtle breathing pulse for mutual fund NAV growth
      const wave = Math.sin(t * (isLoading ? 4 : 1.5) + delay) * (isLoading ? 0.15 : 0.05);
      const targetScaleY = 1 + wave;
      meshRef.current.scale.y = targetScaleY;
      capRef.current.position.y = position[1] + (height / 2) * targetScaleY + 0.05;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Main Glass Bar Column */}
      <mesh ref={meshRef} position={[0, position[1], 0]}>
        <boxGeometry args={[0.28, height, 0.28]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.4}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Glowing Neon Top Cap */}
      <mesh ref={capRef} position={[0, position[1] + height / 2 + 0.05, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.3]} />
        <meshStandardMaterial
          color={capColor}
          emissive={capColor}
          emissiveIntensity={isLoading ? 2.5 : 1.2}
        />
      </mesh>
    </group>
  );
}

// 3D Floating Rupee / Wealth Coin Token
function WealthToken({ isLoading }) {
  const tokenRef = useRef();

  useFrame((state, delta) => {
    if (tokenRef.current) {
      const rotSpeed = isLoading ? 3.0 : 0.8;
      tokenRef.current.rotation.y += delta * rotSpeed;
    }
  });

  return (
    <group ref={tokenRef} position={[0, 0.85, 0]}>
      {/* Outer Coin Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.06, 32]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={isLoading ? 1.5 : 0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Inner Accent Core */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.07, 32]} />
        <meshStandardMaterial
          color="#064e3b"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Rupee Symbol ₹ (3D Text Facing Both Sides) */}
      <Text
        position={[0, 0, 0.04]}
        fontSize={0.32}
        color="#34d399"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        ₹
      </Text>
      <Text
        position={[0, 0, -0.04]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.32}
        color="#34d399"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        ₹
      </Text>
    </group>
  );
}

// 3D Ascending Growth Trendline Weaving Through Schemes
function GrowthTrendLine({ isLoading }) {
  const lineRef = useRef();

  useFrame((state) => {
    if (lineRef.current) {
      const t = state.clock.getElapsedTime();
      lineRef.current.material.emissiveIntensity = isLoading 
        ? 1.8 + Math.sin(t * 8) * 0.6 
        : 1.0 + Math.sin(t * 2) * 0.3;
    }
  });

  // Curve connecting NAV progression of schemes
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.0, -0.4, 0.2),
    new THREE.Vector3(-0.35, -0.05, 0.05),
    new THREE.Vector3(0.35, 0.3, -0.1),
    new THREE.Vector3(1.0, 0.75, -0.25)
  ]);

  return (
    <mesh ref={lineRef}>
      <tubeGeometry args={[curve, 32, 0.022, 8, false]} />
      <meshStandardMaterial
        color="#34d399"
        emissive="#10b981"
        emissiveIntensity={1.2}
      />
    </mesh>
  );
}

// Main Mutual Fund 3D Scene
function MutualFundVisualizer({ isDark, reduceMotion, isLoading }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current && !reduceMotion) {
      const targetY = state.pointer.x * 0.45;
      const targetX = -state.pointer.y * 0.35;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      <ambientLight intensity={isDark ? 0.9 : 1.1} />
      <directionalLight position={[5, 6, 4]} intensity={isLoading ? 2.0 : 1.5} />
      <pointLight position={[-4, 2, -2]} intensity={0.7} color="#34d399" />
      <pointLight position={[0, 2, 2]} intensity={0.6} color="#38bdf8" />

      {/* Floating Sparkles (Wealth Growth Dust) */}
      <Sparkles
        count={isLoading ? 40 : 20}
        scale={[3, 2, 2]}
        size={isLoading ? 3 : 1.8}
        speed={isLoading ? 1.6 : 0.5}
        color={isLoading ? "#34d399" : "#38bdf8"}
        opacity={0.6}
      />

      <Float speed={reduceMotion ? 0 : (isLoading ? 3.5 : 1.8)} rotationIntensity={reduceMotion ? 0 : 0.3} floatIntensity={reduceMotion ? 0 : 0.4}>
        {/* Central Floating Rupee Wealth Token */}
        <WealthToken isLoading={isLoading} />

        {/* 4 Scheme Growth Pillars: ELSS, Flexi Cap, Large Cap, Mid-Cap */}
        <GrowthBar
          position={[-0.95, -0.35, 0.2]}
          height={0.65}
          color="#3b82f6"
          capColor="#60a5fa"
          delay={0}
          isLoading={isLoading}
          label="ELSS"
        />
        <GrowthBar
          position={[-0.32, -0.2, 0.05]}
          height={0.95}
          color="#6366f1"
          capColor="#818cf8"
          delay={0.8}
          isLoading={isLoading}
          label="Flexi"
        />
        <GrowthBar
          position={[0.32, -0.05, -0.1]}
          height={1.25}
          color="#0ea5e9"
          capColor="#38bdf8"
          delay={1.6}
          isLoading={isLoading}
          label="Large"
        />
        <GrowthBar
          position={[0.95, 0.15, -0.25]}
          height={1.65}
          color="#10b981"
          capColor="#34d399"
          delay={2.4}
          isLoading={isLoading}
          label="Mid-Cap"
        />

        {/* Dynamic Growth Trendline */}
        <GrowthTrendLine isLoading={isLoading} />

        {/* Floating Asset Allocation Concentric Glowing Rings (Circular, No Box) */}
        <mesh position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.014, 16, 80]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={isLoading ? 1.6 : 0.7}
          />
        </mesh>
        <mesh position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.65, 0.01, 16, 80]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={isLoading ? 1.4 : 0.5}
          />
        </mesh>

        {/* Soft Ambient Ground Bloom Disc */}
        <mesh position={[0, -0.74, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.6, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.07} />
        </mesh>
      </Float>
    </group>
  );
}

// Fallback for WebGL disabled or slow devices
function FallbackHero({ isDark, isLoading }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl text-emerald-400 border border-emerald-500/30 ${
        isLoading ? 'bg-emerald-500/20 animate-pulse' : 'bg-slate-800'
      }`}>
        ₹
      </div>
      <span className="text-[11px] font-mono text-slate-400 mt-2">
        Mutual Fund NAV Visualizer
      </span>
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
        camera={{ position: [0, 0.5, 4.3], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'low-power', antialias: true }}
      >
        <MutualFundVisualizer isDark={isDark} reduceMotion={reduceMotion} isLoading={isLoading} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.6}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
