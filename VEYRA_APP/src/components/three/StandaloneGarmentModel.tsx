import React, { useMemo } from 'react';
import * as THREE from 'three';

interface StandaloneGarmentModelProps {
  garmentType: 't-shirts' | 'shirts' | 'jackets' | 'trousers' | string;
  colorHex: string;
}

export const StandaloneGarmentModel: React.FC<StandaloneGarmentModelProps> = ({
  garmentType = 't-shirts',
  colorHex = '#6c8a66',
}) => {
  // PBR Garment Material
  const garmentMaterial = useMemo(() => {
    const isLinenOrCotton = garmentType === 't-shirts' || garmentType === 'shirts';
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      roughness: isLinenOrCotton ? 0.68 : 0.42,
      metalness: isLinenOrCotton ? 0.02 : 0.12,
    });
  }, [colorHex, garmentType]);

  const collarRibMaterial = useMemo(() => {
    const baseColor = new THREE.Color(colorHex);
    baseColor.offsetHSL(0, 0, -0.06);
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.85,
      metalness: 0.01,
    });
  }, [colorHex]);

  const pearlButtonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f6f4ee',
      roughness: 0.25,
      metalness: 0.35,
    });
  }, []);

  const goldHangerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#c59b27',
      roughness: 0.2,
      metalness: 0.85,
    });
  }, []);

  const shoulderSpan = 0.58;
  const chestDepth = 0.24;

  // 1. STANDALONE T-SHIRT (Peruvian Supima Crewneck)
  if (garmentType === 't-shirts') {
    return (
      <group position={[0, 0, 0]}>
        {/* Minimalist Floating Atelier Gold Hanger */}
        <group position={[0, 0.76, 0]}>
          <mesh position={[0, 0.14, 0]} material={goldHangerMaterial}>
            <torusGeometry args={[0.055, 0.005, 16, 24, Math.PI * 1.3]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} rotation={[0, 0, Math.PI / 2]} material={goldHangerMaterial}>
            <cylinderGeometry args={[0.007, 0.007, 0.52, 16]} />
          </mesh>
        </group>

        {/* Ribbed Crewneck Collar */}
        <mesh position={[0, 0.72, 0.01]} rotation={[0.28, 0, 0]} material={collarRibMaterial} castShadow>
          <torusGeometry args={[0.095, 0.018, 20, 48]} />
        </mesh>

        {/* Neckline Interior Depth */}
        <mesh position={[0, 0.70, -0.01]} rotation={[0.28, 0, 0]} material={collarRibMaterial}>
          <cylinderGeometry args={[0.082, 0.082, 0.03, 32, 1, true]} />
        </mesh>

        {/* Upper Chest & Shoulders */}
        <mesh position={[0, 0.60, 0]} scale={[shoulderSpan * 0.98, 0.24, chestDepth * 1.02]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.82, 0.98, 1, 36]} />
        </mesh>

        {/* Natural Left Shoulder Cap */}
        <mesh position={[-shoulderSpan * 0.44, 0.63, 0]} rotation={[0, 0, 0.22]} scale={[0.15, 0.16, chestDepth * 0.92]} material={garmentMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Natural Right Shoulder Cap */}
        <mesh position={[shoulderSpan * 0.44, 0.63, 0]} rotation={[0, 0, -0.22]} scale={[0.15, 0.16, chestDepth * 0.92]} material={garmentMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Main Torso & Waist Drape */}
        <mesh position={[0, 0.32, 0]} scale={[shoulderSpan * 0.92, 0.38, chestDepth * 0.98]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.98, 0.92, 1, 36]} />
        </mesh>

        {/* Lower Torso & Flare at Hem */}
        <mesh position={[0, 0.04, 0]} scale={[shoulderSpan * 0.94, 0.24, chestDepth * 1.02]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.92, 0.98, 1, 36]} />
        </mesh>

        {/* Finished Bottom Hem Band */}
        <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} material={collarRibMaterial}>
          <torusGeometry args={[shoulderSpan * 0.44, 0.012, 16, 36]} />
        </mesh>

        {/* Left Short Sleeve */}
        <group position={[-shoulderSpan * 0.48, 0.58, 0]}>
          <mesh position={[-0.07, -0.14, 0]} rotation={[0, 0, 0.38]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.088, 0.078, 0.26, 24]} />
          </mesh>
          <mesh position={[-0.13, -0.24, 0]} rotation={[Math.PI / 2, 0, 0.38]} material={collarRibMaterial}>
            <torusGeometry args={[0.076, 0.008, 16, 24]} />
          </mesh>
        </group>

        {/* Right Short Sleeve */}
        <group position={[shoulderSpan * 0.48, 0.58, 0]}>
          <mesh position={[0.07, -0.14, 0]} rotation={[0, 0, -0.38]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.088, 0.078, 0.26, 24]} />
          </mesh>
          <mesh position={[0.13, -0.24, 0]} rotation={[Math.PI / 2, 0, -0.38]} material={collarRibMaterial}>
            <torusGeometry args={[0.076, 0.008, 16, 24]} />
          </mesh>
        </group>
      </group>
    );
  }

  // 2. STANDALONE SHIRT (Normandy Linen & Oxford Button-Down)
  if (garmentType === 'shirts') {
    return (
      <group position={[0, 0, 0]}>
        {/* Floating Gold Hanger */}
        <group position={[0, 0.76, 0]}>
          <mesh position={[0, 0.14, 0]} material={goldHangerMaterial}>
            <torusGeometry args={[0.055, 0.005, 16, 24, Math.PI * 1.3]} />
          </mesh>
          <mesh position={[0, 0.04, 0]} rotation={[0, 0, Math.PI / 2]} material={goldHangerMaterial}>
            <cylinderGeometry args={[0.007, 0.007, 0.54, 16]} />
          </mesh>
        </group>

        {/* Left Pointed Collar Leaf */}
        <mesh position={[-0.07, 0.72, 0.10]} rotation={[0.3, 0.24, -0.2]} material={garmentMaterial} castShadow>
          <boxGeometry args={[0.12, 0.085, 0.018]} />
        </mesh>

        {/* Right Pointed Collar Leaf */}
        <mesh position={[0.07, 0.72, 0.10]} rotation={[0.3, -0.24, 0.2]} material={garmentMaterial} castShadow>
          <boxGeometry args={[0.12, 0.085, 0.018]} />
        </mesh>

        {/* Collar Neck Band */}
        <mesh position={[0, 0.72, 0]} rotation={[0.26, 0, 0]} material={garmentMaterial}>
          <torusGeometry args={[0.092, 0.02, 16, 36]} />
        </mesh>

        {/* Upper Chest & Shoulders */}
        <mesh position={[0, 0.58, 0]} scale={[shoulderSpan * 0.96, 0.24, chestDepth * 1.02]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.82, 0.96, 1, 36]} />
        </mesh>

        {/* Left Tailored Shoulder */}
        <mesh position={[-shoulderSpan * 0.44, 0.60, 0]} rotation={[0, 0, 0.2]} scale={[0.14, 0.15, chestDepth * 0.9]} material={garmentMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Right Tailored Shoulder */}
        <mesh position={[shoulderSpan * 0.44, 0.60, 0]} rotation={[0, 0, -0.2]} scale={[0.14, 0.15, chestDepth * 0.9]} material={garmentMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Main Fitted Shirt Body */}
        <mesh position={[0, 0.30, 0]} scale={[shoulderSpan * 0.90, 0.38, chestDepth * 0.98]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.96, 0.88, 1, 36]} />
        </mesh>

        {/* Lower Body & Curved Hem */}
        <mesh position={[0, 0.02, 0]} scale={[shoulderSpan * 0.92, 0.24, chestDepth * 1.0]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.88, 0.96, 1, 36]} />
        </mesh>

        {/* Vertical Front Button Placket */}
        <mesh position={[0, 0.30, chestDepth * 0.51]} material={garmentMaterial} castShadow>
          <boxGeometry args={[0.038, 0.76, 0.012]} />
        </mesh>

        {/* 5 Mother-of-Pearl Buttons */}
        <mesh position={[0, 0.62, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>
        <mesh position={[0, 0.46, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>
        <mesh position={[0, 0.30, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>
        <mesh position={[0, 0.14, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>
        <mesh position={[0, -0.02, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>

        {/* Left Long Sleeve & Cuff */}
        <group position={[-shoulderSpan * 0.46, 0.58, 0]}>
          <mesh position={[-0.07, -0.28, 0]} rotation={[0, 0, 0.2]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.082, 0.065, 0.58, 24]} />
          </mesh>
          <mesh position={[-0.14, -0.58, 0]} rotation={[0, 0, 0.2]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.066, 0.066, 0.06, 24]} />
          </mesh>
        </group>

        {/* Right Long Sleeve & Cuff */}
        <group position={[shoulderSpan * 0.46, 0.58, 0]}>
          <mesh position={[0.07, -0.28, 0]} rotation={[0, 0, -0.2]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.082, 0.065, 0.58, 24]} />
          </mesh>
          <mesh position={[0.14, -0.58, 0]} rotation={[0, 0, -0.2]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.066, 0.066, 0.06, 24]} />
          </mesh>
        </group>
      </group>
    );
  }

  // 3. JACKET / OUTERWEAR
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.30, 0]} scale={[shoulderSpan * 1.05, 0.86, chestDepth * 1.15]} material={garmentMaterial} castShadow>
        <cylinderGeometry args={[0.88, 0.98, 1, 36]} />
      </mesh>
      <group position={[-shoulderSpan * 0.52, 0.58, 0]}>
        <mesh position={[-0.08, -0.3, 0]} rotation={[0, 0, 0.18]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.092, 0.075, 0.62, 24]} />
        </mesh>
      </group>
      <group position={[shoulderSpan * 0.52, 0.58, 0]}>
        <mesh position={[0.08, -0.3, 0]} rotation={[0, 0, -0.18]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.092, 0.075, 0.62, 24]} />
        </mesh>
      </group>
    </group>
  );
};
