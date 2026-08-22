import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

interface MannequinModelProps {
  isFemale?: boolean;
}

export const MannequinModel: React.FC<MannequinModelProps> = ({ isFemale = false }) => {
  const theme = useStore((state) => state.theme);

  // Haute Couture Tailor's Dress Form Materials
  const bustMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? '#1c1c24' : '#ebe7df',
      roughness: 0.5,
      metalness: 0.05,
    });
  }, [theme]);

  const brassGoldMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? '#d4af37' : '#c59b27',
      roughness: 0.25,
      metalness: 0.85,
    });
  }, [theme]);

  const walnutWoodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? '#12100e' : '#3a2b20',
      roughness: 0.6,
      metalness: 0.05,
    });
  }, [theme]);

  const shoulderSpan = isFemale ? 0.50 : 0.58;
  const chestDepth = isFemale ? 0.26 : 0.24;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. BRASS NECK FINIAL (Atelier Haute Couture Cap) */}
      <group position={[0, 1.42, 0]}>
        <mesh position={[0, 0.04, 0]} material={brassGoldMaterial} castShadow>
          <cylinderGeometry args={[0.038, 0.045, 0.06, 32]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} material={brassGoldMaterial}>
          <sphereGeometry args={[0.024, 24, 24]} />
        </mesh>
      </group>

      {/* 2. ELEGANT CONTOURED NECK */}
      <mesh position={[0, 1.30, 0]} material={bustMaterial} castShadow>
        <cylinderGeometry args={[0.052, 0.068, 0.18, 32]} />
      </mesh>

      {/* 3. SCULPTED CHEST & NATURAL SHOULDERS */}
      <group position={[0, 1.05, 0]}>
        {/* Upper Chest / Shoulder Arch */}
        <mesh position={[0, 0.12, 0]} scale={[shoulderSpan, 0.22, chestDepth]} material={bustMaterial} castShadow>
          <cylinderGeometry args={[0.82, 0.96, 1, 32]} />
        </mesh>

        {/* Natural Left Shoulder Contour */}
        <mesh position={[-shoulderSpan * 0.44, 0.14, 0]} rotation={[0, 0, 0.18]} scale={[0.16, 0.16, chestDepth * 0.85]} material={bustMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Natural Right Shoulder Contour */}
        <mesh position={[shoulderSpan * 0.44, 0.14, 0]} rotation={[0, 0, -0.18]} scale={[0.16, 0.16, chestDepth * 0.85]} material={bustMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Mid Torso Curve */}
        <mesh position={[0, -0.14, 0]} scale={[shoulderSpan * 0.88, 0.32, chestDepth * 0.95]} material={bustMaterial} castShadow>
          <cylinderGeometry args={[0.96, 0.84, 1, 32]} />
        </mesh>
      </group>

      {/* 4. SCULPTED TAPERED WAIST & HIP FLARE */}
      <group position={[0, 0.68, 0]}>
        {/* Natural Waist Incurve */}
        <mesh position={[0, 0.08, 0]} scale={[shoulderSpan * 0.74, 0.22, chestDepth * 0.82]} material={bustMaterial} castShadow>
          <cylinderGeometry args={[0.84, 0.88, 1, 32]} />
        </mesh>

        {/* Tailor's Dress Form Hip Base */}
        <mesh position={[0, -0.12, 0]} scale={[shoulderSpan * 0.82, 0.24, chestDepth * 0.9]} material={bustMaterial} castShadow>
          <cylinderGeometry args={[0.88, 0.98, 1, 32]} />
        </mesh>

        {/* Clean Wooden / Brass Trim Ring at Bust Bottom */}
        <mesh position={[0, -0.25, 0]} material={brassGoldMaterial}>
          <cylinderGeometry args={[shoulderSpan * 0.42, shoulderSpan * 0.42, 0.02, 32]} />
        </mesh>
      </group>

      {/* 5. MINIMALIST ATELIER FLOOR STAND */}
      <group position={[0, 0.42, 0]}>
        {/* Central Brushed Brass Pole */}
        <mesh position={[0, -0.55, 0]} material={brassGoldMaterial} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 1.1, 24]} />
        </mesh>

        {/* Height Adjustment Screw Knob */}
        <mesh position={[0, -0.28, 0.02]} rotation={[Math.PI / 2, 0, 0]} material={brassGoldMaterial}>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 16]} />
        </mesh>

        {/* Minimalist Circular Cast Base */}
        <mesh position={[0, -1.1, 0]} material={walnutWoodMaterial} receiveShadow>
          <cylinderGeometry args={[0.26, 0.28, 0.035, 36]} />
        </mesh>
        <mesh position={[0, -1.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={brassGoldMaterial}>
          <torusGeometry args={[0.26, 0.008, 16, 36]} />
        </mesh>
      </group>
    </group>
  );
};
