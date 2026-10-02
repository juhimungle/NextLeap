import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// 3D Ascending Growth Pillar Bar representing an HDFC Mutual Fund Scheme
function GrowthPillar({
  position,
  height,
  color,
  capColor,
  delay,
  isLoading,
  label,
  schemeId,
  isSelected,
  onSelect
}) {
  const meshRef = useRef();
  const capRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current && capRef.current) {
      const t = state.clock.getElapsedTime();
      // Fast, lively pulse for real-time NAV movement
      const pulseSpeed = isLoading ? 6 : 2.5;
      const pulseAmp = isLoading ? 0.12 : (hovered ? 0.08 : 0.04);
      const wave = Math.sin(t * pulseSpeed + delay) * pulseAmp;
      
      const targetScaleY = (isSelected ? 1.08 : (hovered ? 1.05 : 1)) + wave;
      meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, targetScaleY, 12, delta);
      
      const targetCapY = position[1] + (height / 2) * meshRef.current.scale.y + 0.06;
      capRef.current.position.y = THREE.MathUtils.damp(capRef.current.position.y, targetCapY, 12, delta);
    }
  });

  return (
    <group
      position={[position[0], 0, position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(schemeId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Translucent Glass Pillar Body */}
      <mesh ref={meshRef} position={[0, position[1], 0]}>
        <boxGeometry args={[0.32, height, 0.32]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.45}
          roughness={0.1}
          metalness={0.25}
          transparent
          opacity={isSelected ? 0.98 : (hovered ? 0.92 : 0.82)}
        />
      </mesh>

      {/* Glowing Neon Top Cap */}
      <mesh ref={capRef} position={[0, position[1] + height / 2 + 0.06, 0]}>
        <boxGeometry args={[0.35, 0.08, 0.35]} />
        <meshStandardMaterial
          color={capColor}
          emissive={capColor}
          emissiveIntensity={isSelected ? 3.0 : (hovered ? 2.5 : (isLoading ? 2.2 : 1.4))}
        />
      </mesh>

      {/* Floating 3D Scheme Name Badge Plate (Always Prominent & Readable) */}
      <group position={[0, position[1] + height / 2 + 0.28, 0]}>
        {/* Backing Badge */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.66, 0.22]} />
          <meshBasicMaterial
            color={isSelected ? "#022c22" : (hovered ? "#0f172a" : "#090d16")}
            transparent
            opacity={0.88}
          />
        </mesh>
        
        {/* Border Accent Line */}
        <mesh position={[0, -0.1, 0]}>
          <planeGeometry args={[0.66, 0.02]} />
          <meshBasicMaterial color={capColor} />
        </mesh>

        {/* Crisp Text Label */}
        <Text
          position={[0, 0.02, 0.01]}
          fontSize={0.11}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.012}
          outlineColor="#050811"
        >
          {label}
        </Text>
      </group>

      {/* Ground Reflector Ring under Pillar */}
      <mesh position={[0, -0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.24, 32]} />
        <meshBasicMaterial
          color={capColor}
          transparent
          opacity={isSelected ? 0.9 : (hovered ? 0.7 : 0.35)}
        />
      </mesh>
    </group>
  );
}

// 3D Floating Dual-Tone Gold & Emerald Rupee Coin
function WealthCoin({ isLoading }) {
  const tokenRef = useRef();

  useFrame((state, delta) => {
    if (tokenRef.current) {
      // Snappy, swift spin
      const rotSpeed = isLoading ? 4.5 : 1.6;
      tokenRef.current.rotation.y += delta * rotSpeed;
    }
  });

  return (
    <group ref={tokenRef} position={[0, 0.92, 0]}>
      {/* Outer Coin Edge Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.07, 36]} />
        <meshStandardMaterial
          color="#00D09C"
          emissive="#059669"
          emissiveIntensity={isLoading ? 1.8 : 0.8}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Inner Core Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.08, 36]} />
        <meshStandardMaterial
          color="#064e3b"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Front Rupee Symbol ₹ */}
      <Text
        position={[0, 0, 0.046]}
        fontSize={0.34}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.015}
        outlineColor="#064e3b"
      >
        ₹
      </Text>

      {/* Back Rupee Symbol ₹ */}
      <Text
        position={[0, 0, -0.046]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.34}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.015}
        outlineColor="#064e3b"
      >
        ₹
      </Text>
    </group>
  );
}

// 3D Ascending NAV Trendline with Traveling Real-time Data Pulse
function NavTrendline({ isLoading }) {
  const lineRef = useRef();
  const pulseRef = useRef();

  // Curve connecting NAV progression of the 4 schemes
  const curve = React.useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.05, -0.38, 0.22),
      new THREE.Vector3(-0.35, -0.06, 0.05),
      new THREE.Vector3(0.35, 0.32, -0.1),
      new THREE.Vector3(1.05, 0.82, -0.26)
    ]);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (lineRef.current) {
      lineRef.current.material.emissiveIntensity = isLoading 
        ? 2.2 + Math.sin(t * 10) * 0.8 
        : 1.3 + Math.sin(t * 3.5) * 0.35;
    }

    if (pulseRef.current) {
      // Traveling pulse dot moving smoothly from left to right across NAV peaks
      const progress = (t * (isLoading ? 1.4 : 0.6)) % 1;
      const pt = curve.getPointAt(progress);
      pulseRef.current.position.set(pt.x, pt.y, pt.z);
    }
  });

  return (
    <group>
      {/* Main Glowing Neon Tube */}
      <mesh ref={lineRef}>
        <tubeGeometry args={[curve, 40, 0.024, 10, false]} />
        <meshStandardMaterial
          color="#00D09C"
          emissive="#10b981"
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Traveling Data Pulse Bead */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#34d399"
          emissiveIntensity={3.5}
        />
      </mesh>
    </group>
  );
}

// Futuristic Telemetry Radar Base
function RadarBase({ isLoading }) {
  const radarSweepRef = useRef();

  useFrame((state, delta) => {
    if (radarSweepRef.current) {
      radarSweepRef.current.rotation.z += delta * (isLoading ? 3.0 : 1.2);
    }
  });

  return (
    <group position={[0, -0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Concentric Calibration Rings */}
      <mesh>
        <ringGeometry args={[0.8, 0.81, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.35, 1.365, 64]} />
        <meshBasicMaterial color="#00D09C" transparent opacity={0.4} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.75, 1.76, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.25} />
      </mesh>

      {/* Rotating Radar Sweep Line */}
      <group ref={radarSweepRef}>
        <mesh position={[0.75, 0, 0]}>
          <planeGeometry args={[1.5, 0.015]} />
          <meshBasicMaterial color="#00D09C" transparent opacity={0.45} />
        </mesh>
      </group>

      {/* Ambient Floor Glow Disc */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[1.75, 32]} />
        <meshBasicMaterial color="#00D09C" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

// Main Mutual Fund Visualizer Scene
function MutualFundVisualizer({ isDark, reduceMotion, isLoading, selectedScheme, onSelectScheme }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current && !reduceMotion) {
      // Super responsive, crisp damping (0.12 factor instead of sluggish 0.05)
      const targetY = state.pointer.x * 0.4;
      const targetX = -state.pointer.y * 0.28;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.12;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.22, 0]}>
      <ambientLight intensity={isDark ? 0.95 : 1.2} />
      <directionalLight position={[5, 6, 4]} intensity={isLoading ? 2.2 : 1.7} />
      <pointLight position={[-4, 2, -2]} intensity={0.9} color="#00D09C" />
      <pointLight position={[4, 2, 2]} intensity={0.8} color="#38bdf8" />

      {/* Fast Floating Sparks */}
      <Sparkles
        count={isLoading ? 45 : 24}
        scale={[3.2, 2.2, 2]}
        size={isLoading ? 3.2 : 2.0}
        speed={reduceMotion ? 0 : (isLoading ? 2.4 : 1.0)}
        color={isLoading ? "#00D09C" : "#38bdf8"}
        opacity={0.65}
      />

      <Float
        speed={reduceMotion ? 0 : (isLoading ? 4.0 : 2.2)}
        rotationIntensity={reduceMotion ? 0 : 0.25}
        floatIntensity={reduceMotion ? 0 : 0.35}
      >
        {/* Floating Dual-Tone Rupee Coin */}
        <WealthCoin isLoading={isLoading} />

        {/* 4 Verified HDFC Schemes as Ascending Growth Pillars */}
        {/* 1. HDFC ELSS Tax Saver */}
        <GrowthPillar
          position={[-1.02, -0.36, 0.22]}
          height={0.68}
          color="#6366f1"
          capColor="#a5b4fc"
          delay={0}
          isLoading={isLoading}
          label="ELSS TAX"
          schemeId="HDFC ELSS Tax Saver"
          isSelected={selectedScheme === "HDFC ELSS Tax Saver"}
          onSelect={onSelectScheme}
        />

        {/* 2. HDFC Flexi Cap Fund */}
        <GrowthPillar
          position={[-0.34, -0.2, 0.05]}
          height={1.02}
          color="#00D09C"
          capColor="#34d399"
          delay={0.6}
          isLoading={isLoading}
          label="FLEXI CAP"
          schemeId="HDFC Flexi Cap Fund"
          isSelected={selectedScheme === "HDFC Flexi Cap Fund"}
          onSelect={onSelectScheme}
        />

        {/* 3. HDFC Large Cap Fund */}
        <GrowthPillar
          position={[0.34, -0.04, -0.1]}
          height={1.34}
          color="#0284c7"
          capColor="#38bdf8"
          delay={1.2}
          isLoading={isLoading}
          label="LARGE CAP"
          schemeId="HDFC Large Cap Fund"
          isSelected={selectedScheme === "HDFC Large Cap Fund"}
          onSelect={onSelectScheme}
        />

        {/* 4. HDFC Mid-Cap Opportunities */}
        <GrowthPillar
          position={[1.02, 0.18, -0.26]}
          height={1.72}
          color="#d97706"
          capColor="#fbbf24"
          delay={1.8}
          isLoading={isLoading}
          label="MID-CAP"
          schemeId="HDFC Mid-Cap Opportunities Fund"
          isSelected={selectedScheme === "HDFC Mid-Cap Opportunities Fund"}
          onSelect={onSelectScheme}
        />

        {/* NAV Connecting Trendline with Moving Pulse */}
        <NavTrendline isLoading={isLoading} />

        {/* Radar Telemetry Base Grid */}
        <RadarBase isLoading={isLoading} />
      </Float>
    </group>
  );
}

// Fallback for devices without WebGL
function FallbackHero({ isDark, isLoading }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl text-emerald-400 border border-emerald-500/30 ${
        isLoading ? 'bg-emerald-500/20 animate-pulse' : 'bg-slate-800'
      }`}>
        ₹
      </div>
      <span className="text-[11px] font-mono text-slate-400 mt-2">
        HDFC Mutual Fund 3D Telemetry
      </span>
    </div>
  );
}

export default function Hero3D({
  isDark = true,
  reduceMotion = false,
  isLoading = false,
  selectedScheme,
  onSelectScheme
}) {
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
        camera={{ position: [0, 0.45, 4.1], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'high-performance', antialias: true }}
      >
        <MutualFundVisualizer
          isDark={isDark}
          reduceMotion={reduceMotion}
          isLoading={isLoading}
          selectedScheme={selectedScheme}
          onSelectScheme={onSelectScheme}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.7}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}
