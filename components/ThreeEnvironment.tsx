
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Extend the React JSX IntrinsicElements to include Three.js elements from @react-three/fiber.
// Using the React.JSX namespace augmentation ensures we merge with React's standard HTML 
// element definitions (div, span, button, etc.) instead of overwriting them globally.
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

// Torii component for the sanctuary environment
const Torii = () => {
  // 將鳥居位置下移並移至中心 z 軸深處，確保與地平線對齊
  return (
    <group position={[0, -3.5, -10]}>
      {/* Pillars */}
      <mesh position={[-2.2, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 5, 16]} />
        <meshStandardMaterial color="#631414" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[2.2, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.28, 5, 16]} />
        <meshStandardMaterial color="#631414" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Lower Beam (Nuki) */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[5.2, 0.25, 0.25]} />
        <meshStandardMaterial color="#631414" />
      </mesh>

      {/* Upper Beam (Kasagi) */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <boxGeometry args={[6.2, 0.35, 0.45]} />
        <meshStandardMaterial color="#631414" />
      </mesh>
      
      {/* Top Cap */}
      <mesh position={[0, 5.05, 0]}>
        <boxGeometry args={[6.5, 0.15, 0.55]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
    </group>
  );
};

// Sakura particle system for atmosphere
const SakuraParticles = ({ count = 200 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        speed: 0.005 + Math.random() * 0.01,
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 25,
        z: (Math.random() - 0.5) * 30,
        rotationSpeed: {
          x: Math.random() * 0.01,
          y: Math.random() * 0.01,
          z: Math.random() * 0.01
        },
        size: 0.04 + Math.random() * 0.08,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const windX = Math.sin(time * 0.2) * 1.5;

    particles.forEach((particle, i) => {
      particle.y -= particle.speed * 4;
      particle.x += Math.sin(time + particle.t) * 0.01 + windX * 0.004;
      
      if (particle.y < -6) {
        particle.y = 20;
        particle.x = (Math.random() - 0.5) * 40;
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.rotation.x += particle.rotationSpeed.x;
      dummy.rotation.y += particle.rotationSpeed.y;
      dummy.rotation.z += particle.rotationSpeed.z;
      dummy.scale.set(particle.size, particle.size, particle.size);
      
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffcbd1" transparent opacity={0.5} side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

// The interactive Omikuji object (rhombus shape)
const RhombusOmikuji = ({ shaking }: { shaking: boolean }) => {
  const boxRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (boxRef.current) {
      if (shaking) {
        boxRef.current.position.x = Math.sin(Date.now() * 0.2) * 0.15;
        boxRef.current.position.y = -0.5 + Math.cos(Date.now() * 0.25) * 0.15;
        boxRef.current.rotation.z = Math.sin(Date.now() * 0.3) * 0.3;
      } else {
        boxRef.current.position.x = 0;
        boxRef.current.position.y = THREE.MathUtils.lerp(boxRef.current.position.y, -0.5, 0.1);
        boxRef.current.rotation.y += 0.01;
        boxRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.05;
      }
    }
  });

  return (
    <group ref={boxRef} position={[0, -0.5, 0]}>
      {/* 菱形主體 - 啞光黃銅材質 */}
      <mesh castShadow>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#a67c52" 
          metalness={0.4} 
          roughness={0.8} 
          emissive="#221100"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* 柔和的點光源，避免過強反差 */}
      <pointLight color="#daa520" intensity={0.5} distance={4} />
    </group>
  );
};

// Main environment component using R3F
export const ThreeEnvironment: React.FC<{ shaking?: boolean }> = ({ shaking = false }) => {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas shadows gl={{ antialias: true }}>
        {/* 調整攝像機視角，使地平線下移 */}
        <PerspectiveCamera makeDefault position={[0, 0.5, 8]} fov={40} />
        <fog attach="fog" args={['#020108', 4, 25]} />
        
        <ambientLight intensity={0.6} />
        <hemisphereLight intensity={0.4} groundColor="#000000" color="#ffffff" />
        <directionalLight 
          position={[0, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[512, 512]}
        />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <RhombusOmikuji shaking={shaking} />
        </Float>

        <Torii />
        <SakuraParticles count={180} />
        <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.3} />
        
        {/* Ground - 顯著降低 y 軸位置 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial 
            color="#050505" 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      </Canvas>
    </div>
  );
};
