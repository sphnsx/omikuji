
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, Environment as DreiEnvironment } from '@react-three/drei';
import * as THREE from 'three';

const Torii = () => {
  return (
    <group position={[0, -2, -5]}>
      {/* Pillars */}
      <mesh position={[-2, 2.5, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 5, 12]} />
        <meshStandardMaterial color="#8b1a1a" roughness={0.8} />
      </mesh>
      <mesh position={[2, 2.5, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 5, 12]} />
        <meshStandardMaterial color="#8b1a1a" roughness={0.8} />
      </mesh>
      
      {/* Lower Beam (Nuki) */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[5, 0.2, 0.2]} />
        <meshStandardMaterial color="#8b1a1a" roughness={0.8} />
      </mesh>

      {/* Upper Beam (Kasagi) */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[6, 0.3, 0.4]} />
        <meshStandardMaterial color="#8b1a1a" roughness={0.8} />
      </mesh>
      
      {/* Top Cap */}
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[6.2, 0.1, 0.5]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
    </group>
  );
};

const SakuraParticles = ({ count = 200 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      // Infinite fall
      dummy.position.y = (dummy.position.y - t * 2) % 20;
      if (dummy.position.y < -10) dummy.position.y = 10;

      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.scale.set(0.1, 0.1, 0.1);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffb7c5" transparent opacity={0.6} side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

const OmikujiBox = ({ shaking }: { shaking: boolean }) => {
  const boxRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (boxRef.current) {
      if (shaking) {
        boxRef.current.position.x = Math.sin(Date.now() * 0.1) * 0.1;
        boxRef.current.position.y = Math.cos(Date.now() * 0.15) * 0.1;
        boxRef.current.rotation.z = Math.sin(Date.now() * 0.2) * 0.2;
      } else {
        boxRef.current.position.x = 0;
        boxRef.current.position.y = THREE.MathUtils.lerp(boxRef.current.position.y, 0, 0.1);
        boxRef.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <group ref={boxRef} position={[0, -0.5, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.45, 1.2, 6]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Decorative top */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.4, 0.1, 6]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
};

export const ThreeEnvironment: React.FC<{ shaking?: boolean }> = ({ shaking = false }) => {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 5]} fov={45} />
        <fog attach="fog" args={['#020108', 5, 15]} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#fce7f3" />
        <spotLight position={[0, 5, 2]} angle={0.3} penumbra={1} intensity={2} castShadow />

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <OmikujiBox shaking={shaking} />
        </Float>

        <Torii />
        <SakuraParticles count={150} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
      </Canvas>
    </div>
  );
};
