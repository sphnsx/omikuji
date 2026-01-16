
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, BoxGeometry, MeshStandardMaterial, Group } from 'three';
import { COLORS } from '../constants';

const Torii: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Pillars */}
      <mesh position={[-2.5, 2.5, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 5]} />
        <meshStandardMaterial color={COLORS.SHRINE_RED} />
      </mesh>
      <mesh position={[2.5, 2.5, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 5]} />
        <meshStandardMaterial color={COLORS.SHRINE_RED} />
      </mesh>
      {/* Top Bars */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[6, 0.3, 0.3]} />
        <meshStandardMaterial color={COLORS.SHRINE_RED} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <boxGeometry args={[5, 0.2, 0.2]} />
        <meshStandardMaterial color={COLORS.SHRINE_RED} />
      </mesh>
    </group>
  );
};

const Lantern: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color={COLORS.DARK} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.3, 0.2, 4]} />
        <meshStandardMaterial color={COLORS.DARK} />
      </mesh>
    </group>
  );
};

export const ShrineEnvironment: React.FC = () => {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#292524" />
      </mesh>

      {/* Main Shrine Structure (Simplified) */}
      <group position={[0, 0, -8]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[6, 4, 4]} />
          <meshStandardMaterial color={COLORS.WOOD} />
        </mesh>
        <mesh position={[0, 4.5, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[5, 2, 4]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
      </group>

      <Torii position={[0, 0, 0]} />
      <Lantern position={[-3.5, 0, 2]} />
      <Lantern position={[3.5, 0, 2]} />
      <Lantern position={[-3.5, 0, -3]} />
      <Lantern position={[3.5, 0, -3]} />

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <pointLight position={[0, 2, 2]} color={COLORS.GOLD} intensity={0.5} />
    </group>
  );
};
