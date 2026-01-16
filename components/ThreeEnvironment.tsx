
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Stars, PerspectiveCamera, Backdrop, Float } from '@react-three/drei';
import * as THREE from 'three';
import { StallType } from '../types';

interface ThreeEnvironmentProps {
  onSelectStall: (type: StallType) => void;
  activeStall: StallType | null;
  isSelecting: boolean;
}

// Glowing Jellyfish Mushrooms
const JellyMushroom = ({ position, scale = 1, color = "#22d3ee", delay = 0 }: any) => {
  const meshRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime + delay;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
      meshRef.current.scale.y = scale * (1 + Math.sin(t * 1.2) * 0.08);
      meshRef.current.rotation.y = t * 0.2;
      if (lightRef.current) {
        lightRef.current.intensity = 0.6 + Math.sin(t * 2.5) * 0.3;
      }
    }
  });

  return (
    <group position={position} ref={meshRef}>
      <mesh castShadow>
        <sphereGeometry args={[0.5, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} transparent opacity={0.8} flatShading />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 0.5, 6, 1, true]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} wireframe />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={1} distance={6} />
    </group>
  );
};

// Different Cat Breeds (Voxel)
const VoxelCat = ({ position, rotation = [0, 0, 0], variant = 'black' }: any) => {
  const group = useRef<THREE.Group>(null);
  const colors: any = {
    black: "#050505",
    calico: "#ef4444", // Using red-ish orange for calico spots in voxel
    tuxedo: "#111111",
    white: "#eeeeee"
  };

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime;
      group.current.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.15;
      // Tail wag
      const tail = group.current.children[3] as THREE.Mesh;
      if (tail) tail.rotation.z = Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation} ref={group} scale={0.3}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 1.5]} />
        <meshStandardMaterial color={variant === 'calico' ? "#f59e0b" : colors[variant]} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.1, 0.6]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={variant === 'calico' ? "#ffffff" : colors[variant]} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.25, 1.6, 0.6]}><boxGeometry args={[0.2, 0.3, 0.2]} /><meshStandardMaterial color={colors[variant]} /></mesh>
      <mesh position={[0.25, 1.6, 0.6]}><boxGeometry args={[0.2, 0.3, 0.2]} /><meshStandardMaterial color={colors[variant]} /></mesh>
      {/* Tail */}
      <mesh position={[0, 0.5, -0.9]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.2, 0.2, 1.2]} />
        <meshStandardMaterial color={colors[variant]} />
      </mesh>
      {/* Patches for Calico/Tuxedo */}
      {variant === 'tuxedo' && (
        <mesh position={[0, 0.4, 0.76]}><boxGeometry args={[0.6, 0.6, 0.05]} /><meshStandardMaterial color="#fff" /></mesh>
      )}
    </group>
  );
};

// Dense 3D Sakura Blizzard
const SakuraFubuki = ({ count = 300 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      t: Math.random() * 100,
      factor: 5 + Math.random() * 15,
      speed: 0.002 + Math.random() * 0.008,
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        Math.random() * 20,
        (Math.random() - 0.5) * 30
      ),
      rot: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    }));
  }, [count]);

  useFrame((state) => {
    particles.forEach((p, i) => {
      p.t += p.speed;
      p.pos.y -= 0.03; // Drift down
      p.pos.x += Math.sin(p.t) * 0.03; // Sway
      p.pos.z += Math.cos(p.t * 0.5) * 0.02;
      
      if (p.pos.y < -5) p.pos.y = 20;

      dummy.position.copy(p.pos);
      dummy.rotation.set(p.rot.x + p.t, p.rot.y + p.t * 0.5, p.rot.z);
      dummy.scale.setScalar(0.08 + Math.sin(p.t) * 0.04);
      dummy.updateMatrix();
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color="#ffc0cb" emissive="#ff69b4" emissiveIntensity={1} transparent opacity={0.7} side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

const MainScene = ({ onSelectStall, isSelecting }: any) => {
  return (
    <group>
      {/* Underground Background Wall */}
      <Backdrop floor={30} segments={25} position={[0, -4, -18]} scale={[60, 30, 15]}>
        <meshStandardMaterial color="#020204" roughness={1} metalness={0} />
      </Backdrop>

      {/* Lake Island - Rocky, Wabi-sabi */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]} receiveShadow>
        <circleGeometry args={[9, 16]} />
        <meshStandardMaterial color="#080808" roughness={1} />
      </mesh>
      
      {/* Scattered Rocks */}
      <mesh position={[-6, -0.2, 4]} scale={[1.5, 0.8, 1.2]}><boxGeometry /><meshStandardMaterial color="#050505" /></mesh>
      <mesh position={[7, -0.2, -2]} scale={[2, 1, 1.8]}><boxGeometry /><meshStandardMaterial color="#030303" /></mesh>
      <mesh position={[2, -0.4, 6]} scale={[1, 0.5, 1]}><boxGeometry /><meshStandardMaterial color="#060606" /></mesh>

      {/* Weathered Torii Gate */}
      <group position={[0, 0, -3]}>
        <mesh position={[-3, 2.5, 0]} castShadow>
          <boxGeometry args={[0.5, 5, 0.5]} />
          <meshStandardMaterial color="#2a0505" roughness={0.95} />
        </mesh>
        <mesh position={[3, 2.5, 0]} castShadow>
          <boxGeometry args={[0.5, 5, 0.5]} />
          <meshStandardMaterial color="#2a0505" roughness={0.95} />
        </mesh>
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[9, 0.8, 0.8]} />
          <meshStandardMaterial color="#220404" />
        </mesh>
        <mesh position={[0, 4.1, 0]}>
          <boxGeometry args={[8, 0.4, 0.4]} />
          <meshStandardMaterial color="#220404" />
        </mesh>
      </group>

      {/* Pillars of Fate (Interaction Points) */}
      {[
        { type: StallType.FOLDING, pos: [-6, 0, 5], label: '前程' },
        { type: StallType.WATER, pos: [-3, 0, 7], label: '智慧' },
        { type: StallType.TRADITIONAL, pos: [0, 0, 8], label: '祈願' },
        { type: StallType.FISHING, pos: [3, 0, 7], label: '緣分' },
        { type: StallType.GOLDEN, pos: [6, 0, 5], label: '豐盛' },
      ].map((stall) => (
        <group key={stall.type} position={stall.pos as any}>
          <mesh 
            onClick={() => isSelecting && onSelectStall(stall.type)}
            onPointerOver={() => { if(isSelecting) document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { document.body.style.cursor = 'default' }}
          >
            <cylinderGeometry args={[0.08, 0.08, 15, 6]} />
            <meshStandardMaterial 
              color="#22d3ee" 
              emissive="#22d3ee" 
              emissiveIntensity={isSelecting ? 2.5 : 0.05} 
              transparent 
              opacity={isSelecting ? 0.4 : 0.02} 
            />
          </mesh>
          {isSelecting && (
            <pointLight color="#22d3ee" intensity={0.2} distance={3} />
          )}
        </group>
      ))}

      {/* Diverse Cats */}
      <VoxelCat position={[-4, -0.4, 2]} variant="calico" rotation={[0, 0.6, 0]} />
      <VoxelCat position={[5, -0.4, 1]} variant="black" rotation={[0, -0.8, 0]} />
      <VoxelCat position={[1, -0.4, -1.5]} variant="tuxedo" rotation={[0, 2.5, 0]} />
      <VoxelCat position={[-1, -0.4, 5]} variant="white" rotation={[0, -0.2, 0]} />

      {/* Bio-luminescent Flora */}
      <JellyMushroom position={[-7, 0.4, -5]} scale={1.4} color="#06b6d4" delay={0} />
      <JellyMushroom position={[8, 0.6, -3]} scale={1.1} color="#22d3ee" delay={1.5} />
      <JellyMushroom position={[4, 0.2, 5]} scale={0.8} color="#67e8f9" delay={3} />
      <JellyMushroom position={[-3, 0.1, 6]} scale={0.6} color="#0891b2" delay={4.5} />
    </group>
  );
};

export const PixelEnvironment: React.FC<ThreeEnvironmentProps> = ({ onSelectStall, activeStall, isSelecting }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#010103]">
      <Canvas 
        shadows 
        gl={{ antialias: false, stencil: false, depth: true }}
        dpr={[0.3, 0.4]} // High pixelation for retro feel
        style={{ imageRendering: 'pixelated' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 18]} fov={30} />
          
          <fog attach="fog" args={['#010103', 10, 28]} />
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 12, 5]} intensity={1.2} color="#164e63" castShadow />
          
          {/* Silent Underground River */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
            <planeGeometry args={[120, 120]} />
            <MeshDistortMaterial 
              color="#010108" 
              roughness={0.02} 
              metalness={0.9} 
              distort={0.2} 
              speed={1.2} 
            />
          </mesh>

          <MainScene onSelectStall={onSelectStall} isSelecting={isSelecting} />
          
          <SakuraFubuki count={350} />
          
          <Stars radius={50} depth={30} count={1200} factor={4} saturation={0} fade speed={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
};
