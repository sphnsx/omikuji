
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Vector3, MathUtils } from 'three';
import { AppState, OmikujiRank } from '../types';
import { COLORS } from '../constants';

interface OmikujiModelProps {
  status: AppState;
  onCylinderClick: () => void;
}

export const OmikujiModel: React.FC<OmikujiModelProps> = ({ status, onCylinderClick }) => {
  const cylinderRef = useRef<Group>(null);
  const slipRef = useRef<Group>(null);
  const particlesRef = useRef<any>(null);

  // Animation logic
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (cylinderRef.current) {
      if (status === AppState.SHAKING) {
        // Shaking animation
        cylinderRef.current.rotation.z = Math.sin(time * 30) * 0.2;
        cylinderRef.current.position.y = Math.abs(Math.sin(time * 30)) * 0.1;
      } else {
        cylinderRef.current.rotation.z = MathUtils.lerp(cylinderRef.current.rotation.z, 0, 0.1);
        cylinderRef.current.position.y = MathUtils.lerp(cylinderRef.current.position.y, 0, 0.1);
      }
    }

    if (slipRef.current) {
      if (status === AppState.DRAWING) {
        // Slip rising out
        slipRef.current.position.y = MathUtils.lerp(slipRef.current.position.y, 2.5, 0.05);
        slipRef.current.rotation.y += 0.02;
      } else if (status === AppState.SHOWING) {
        // Zoomed in view
        slipRef.current.position.y = 1.5;
        slipRef.current.position.z = 1.5;
        slipRef.current.rotation.x = MathUtils.lerp(slipRef.current.rotation.x, -0.2, 0.1);
        slipRef.current.rotation.y = MathUtils.lerp(slipRef.current.rotation.y, 0, 0.1);
      } else if (status === AppState.DISSOLVING) {
        // Move away or scale down
        slipRef.current.scale.setScalar(MathUtils.lerp(slipRef.current.scale.x, 0, 0.1));
      } else {
        // Hidden or reset
        slipRef.current.position.y = -0.5;
        slipRef.current.position.z = 0;
        slipRef.current.scale.setScalar(1);
      }
    }

    // Particle Dissolve Logic
    if (particlesRef.current && status === AppState.DISSOLVING) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i+1] -= 0.02; // gravity
        positions[i] += (Math.random() - 0.5) * 0.02;
        positions[i+2] += (Math.random() - 0.5) * 0.02;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.material.opacity = MathUtils.lerp(particlesRef.current.material.opacity, 0, 0.05);
    }
  });

  const particleInitialPos = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 1] = 1.5 + (Math.random() - 0.5) * 1.5;
      arr[i * 3 + 2] = 1.5 + (Math.random() - 0.5) * 0.5;
    }
    return arr;
  }, []);

  return (
    <group position={[0, 0.5, 2]}>
      {/* The Cylinder */}
      <group 
        ref={cylinderRef} 
        onClick={(e) => { e.stopPropagation(); onCylinderClick(); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 1.2, 6]} />
          <meshStandardMaterial color={COLORS.WOOD} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.05, 6]} />
          <meshStandardMaterial color={COLORS.DARK} />
        </mesh>
      </group>

      {/* The Slip */}
      <group ref={slipRef}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 1.8, 0.02]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
        {/* Decorative Text Texture (Simplified) */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.08, 1.6]} />
          <meshStandardMaterial color="#78350f" opacity={0.6} transparent />
        </mesh>
      </group>

      {/* Dissolve Particles */}
      {status === AppState.DISSOLVING && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute 
              attach="attributes-position"
              count={particleInitialPos.length / 3}
              array={particleInitialPos}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.03} color={COLORS.GOLD} transparent opacity={1} />
        </points>
      )}
    </group>
  );
};
