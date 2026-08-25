import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface GLBGarmentModelProps {
  modelUrl: string;
  colorHex?: string;
  isFemale?: boolean;
}

export const GLBGarmentModel: React.FC<GLBGarmentModelProps> = ({
  modelUrl,
  colorHex = '#6c8a66',
}) => {
  const { scene } = useGLTF(modelUrl);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Auto-center and normalize bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = maxDim > 0 ? 1.0 / maxDim : 1;

    clone.scale.setScalar(targetScale);
    clone.position.set(-center.x * targetScale, 0.45 - center.y * targetScale, -center.z * targetScale);

    // Apply color tinting to primary cotton meshes
    const primaryColor = new THREE.Color(colorHex);
    const ribColor = new THREE.Color(colorHex).offsetHSL(0, 0, -0.06);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const originalMat = mesh.material as THREE.MeshStandardMaterial;
          const nodeName = mesh.name.toLowerCase();

          if (nodeName.includes('collar') || nodeName.includes('hem')) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: ribColor,
              roughness: 0.85,
              metalness: 0.01,
            });
          } else if (!nodeName.includes('label') && originalMat.color) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: primaryColor,
              roughness: 0.65,
              metalness: 0.02,
            });
          }
        }
      }
    });

    return clone;
  }, [scene, colorHex]);

  return <primitive object={clonedScene} />;
};

useGLTF.preload('./models/garments/veyra_signature_tshirt.glb');
