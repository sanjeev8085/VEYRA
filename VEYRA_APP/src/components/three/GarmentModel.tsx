import React, { useMemo } from 'react';
import * as THREE from 'three';

interface GarmentModelProps {
  garmentType: 't-shirts' | 'shirts' | 'jackets' | 'trousers' | string;
  colorHex: string;
  isFemale?: boolean;
}

export const GarmentModel: React.FC<GarmentModelProps> = ({
  garmentType = 't-shirts',
  colorHex = '#6c8a66',
  isFemale = false,
}) => {
  // PBR Garment Fabric Material
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

  const shoulderSpan = isFemale ? 0.52 : 0.60;
  const chestDepth = isFemale ? 0.28 : 0.26;

  // 1. SIGNATURE T-SHIRT (Peruvian Supima Cotton Crewneck)
  if (garmentType === 't-shirts') {
    return (
      <group position={[0, 0, 0]}>
        {/* Ribbed Crewneck Collar */}
        <mesh position={[0, 1.28, 0.01]} rotation={[0.28, 0, 0]} material={collarRibMaterial} castShadow>
          <torusGeometry args={[0.095, 0.018, 20, 48]} />
        </mesh>

        {/* Neckline Interior Shadow Ring */}
        <mesh position={[0, 1.25, -0.01]} rotation={[0.28, 0, 0]} material={collarRibMaterial}>
          <cylinderGeometry args={[0.082, 0.082, 0.03, 32, 1, true]} />
        </mesh>

        {/* Upper Chest & Sloped Natural Shoulders */}
        <mesh position={[0, 1.15, 0]} scale={[shoulderSpan * 0.98, 0.24, chestDepth * 1.02]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.82, 0.98, 1, 36]} />
        </mesh>

        {/* Natural Left Shoulder Cap */}
        <mesh position={[-shoulderSpan * 0.44, 1.18, 0]} rotation={[0, 0, 0.22]} scale={[0.15, 0.16, chestDepth * 0.92]} material={garmentMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Natural Right Shoulder Cap */}
        <mesh position={[shoulderSpan * 0.44, 1.18, 0]} rotation={[0, 0, -0.22]} scale={[0.15, 0.16, chestDepth * 0.92]} material={garmentMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Main Torso & Waist Drape */}
        <mesh position={[0, 0.88, 0]} scale={[shoulderSpan * 0.92, 0.38, chestDepth * 0.98]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.98, 0.92, 1, 36]} />
        </mesh>

        {/* Lower Torso & Flare at Hem */}
        <mesh position={[0, 0.60, 0]} scale={[shoulderSpan * 0.94, 0.24, chestDepth * 1.02]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.92, 0.98, 1, 36]} />
        </mesh>

        {/* Finished Bottom Hem Band */}
        <mesh position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]} material={collarRibMaterial}>
          <torusGeometry args={[shoulderSpan * 0.44, 0.012, 16, 36]} />
        </mesh>

        {/* Left Draped Short Sleeve */}
        <group position={[-shoulderSpan * 0.48, 1.14, 0]}>
          <mesh position={[-0.07, -0.14, 0]} rotation={[0, 0, 0.38]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.088, 0.078, 0.26, 24]} />
          </mesh>
          {/* Sleeve Cuff Hem */}
          <mesh position={[-0.13, -0.24, 0]} rotation={[Math.PI / 2, 0, 0.38]} material={collarRibMaterial}>
            <torusGeometry args={[0.076, 0.008, 16, 24]} />
          </mesh>
        </group>

        {/* Right Draped Short Sleeve */}
        <group position={[shoulderSpan * 0.48, 1.14, 0]}>
          <mesh position={[0.07, -0.14, 0]} rotation={[0, 0, -0.38]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.088, 0.078, 0.26, 24]} />
          </mesh>
          {/* Sleeve Cuff Hem */}
          <mesh position={[0.13, -0.24, 0]} rotation={[Math.PI / 2, 0, -0.38]} material={collarRibMaterial}>
            <torusGeometry args={[0.076, 0.008, 16, 24]} />
          </mesh>
        </group>
      </group>
    );
  }

  // 2. ARTISANAL TAILORED SHIRT (Normandy Linen & Oxford Weave)
  if (garmentType === 'shirts') {
    return (
      <group position={[0, 0, 0]}>
        {/* Left Pointed Collar Leaf */}
        <mesh position={[-0.07, 1.28, 0.10]} rotation={[0.3, 0.24, -0.2]} material={garmentMaterial} castShadow>
          <boxGeometry args={[0.12, 0.085, 0.018]} />
        </mesh>

        {/* Right Pointed Collar Leaf */}
        <mesh position={[0.07, 1.28, 0.10]} rotation={[0.3, -0.24, 0.2]} material={garmentMaterial} castShadow>
          <boxGeometry args={[0.12, 0.085, 0.018]} />
        </mesh>

        {/* Collar Neck Band */}
        <mesh position={[0, 1.28, 0]} rotation={[0.26, 0, 0]} material={garmentMaterial}>
          <torusGeometry args={[0.092, 0.02, 16, 36]} />
        </mesh>

        {/* Upper Chest & Shoulders */}
        <mesh position={[0, 1.14, 0]} scale={[shoulderSpan * 0.96, 0.24, chestDepth * 1.02]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.82, 0.96, 1, 36]} />
        </mesh>

        {/* Left Tailored Shoulder */}
        <mesh position={[-shoulderSpan * 0.44, 1.16, 0]} rotation={[0, 0, 0.2]} scale={[0.14, 0.15, chestDepth * 0.9]} material={garmentMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Right Tailored Shoulder */}
        <mesh position={[shoulderSpan * 0.44, 1.16, 0]} rotation={[0, 0, -0.2]} scale={[0.14, 0.15, chestDepth * 0.9]} material={garmentMaterial} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>

        {/* Main Fitted Shirt Body */}
        <mesh position={[0, 0.86, 0]} scale={[shoulderSpan * 0.90, 0.38, chestDepth * 0.98]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.96, 0.88, 1, 36]} />
        </mesh>

        {/* Lower Body & Curved Shirttail Hem */}
        <mesh position={[0, 0.58, 0]} scale={[shoulderSpan * 0.92, 0.24, chestDepth * 1.0]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.88, 0.96, 1, 36]} />
        </mesh>

        {/* Vertical Front Button Placket */}
        <mesh position={[0, 0.86, chestDepth * 0.51]} material={garmentMaterial} castShadow>
          <boxGeometry args={[0.038, 0.76, 0.012]} />
        </mesh>

        {/* 5 Genuine Mother-of-Pearl Buttons */}
        <mesh position={[0, 1.18, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>
        <mesh position={[0, 1.02, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>
        <mesh position={[0, 0.86, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>
        <mesh position={[0, 0.70, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>
        <mesh position={[0, 0.54, chestDepth * 0.52]} rotation={[Math.PI / 2, 0, 0]} material={pearlButtonMaterial}>
          <cylinderGeometry args={[0.007, 0.007, 0.004, 16]} />
        </mesh>

        {/* Left Long Sleeve & Crisp French Cuff */}
        <group position={[-shoulderSpan * 0.46, 1.14, 0]}>
          <mesh position={[-0.07, -0.28, 0]} rotation={[0, 0, 0.2]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.082, 0.065, 0.58, 24]} />
          </mesh>
          <mesh position={[-0.14, -0.58, 0]} rotation={[0, 0, 0.2]} material={garmentMaterial} castShadow>
            <cylinderGeometry args={[0.066, 0.066, 0.06, 24]} />
          </mesh>
        </group>

        {/* Right Long Sleeve & Crisp French Cuff */}
        <group position={[shoulderSpan * 0.46, 1.14, 0]}>
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

  // 3. OUTERWEAR / JACKETS
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.88, 0]} scale={[shoulderSpan * 1.05, 0.86, chestDepth * 1.15]} material={garmentMaterial} castShadow>
        <cylinderGeometry args={[0.88, 0.98, 1, 36]} />
      </mesh>
      <group position={[-shoulderSpan * 0.52, 1.15, 0]}>
        <mesh position={[-0.08, -0.3, 0]} rotation={[0, 0, 0.18]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.092, 0.075, 0.62, 24]} />
        </mesh>
      </group>
      <group position={[shoulderSpan * 0.52, 1.15, 0]}>
        <mesh position={[0.08, -0.3, 0]} rotation={[0, 0, -0.18]} material={garmentMaterial} castShadow>
          <cylinderGeometry args={[0.092, 0.075, 0.62, 24]} />
        </mesh>
      </group>
    </group>
  );
};
