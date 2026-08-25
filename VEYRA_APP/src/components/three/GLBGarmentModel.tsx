import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { StandaloneGarmentModel } from './StandaloneGarmentModel';

interface GLBGarmentModelProps {
  modelUrl: string;
  colorHex?: string;
  garmentType?: string;
  isFemale?: boolean;
}

const GLBViewer: React.FC<{ url: string; colorHex: string }> = ({ url, colorHex }) => {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Auto-center and normalize bounding box
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = maxDim > 0 ? 0.95 / maxDim : 1;

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
          const nodeName = (mesh.name || '').toLowerCase();
          const isGoldAccent =
            nodeName.includes('logo') ||
            nodeName.includes('gold') ||
            nodeName.includes('tag') ||
            nodeName.includes('piping') ||
            nodeName.includes('label');

          if (isGoldAccent) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#d4af37'),
              roughness: 0.25,
              metalness: 0.85,
            });
          } else if (nodeName.includes('collar') || nodeName.includes('hem') || nodeName.includes('ribbed')) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: ribColor,
              roughness: 0.85,
              metalness: 0.01,
            });
          } else {
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

export const GLBGarmentModel: React.FC<GLBGarmentModelProps> = ({
  modelUrl,
  colorHex = '#6c8a66',
  garmentType = 't-shirts',
}) => {
  // Resolve base path for Vite / GitHub Pages
  const resolvedUrl = useMemo(() => {
    if (!modelUrl) return '';
    if (modelUrl.startsWith('http') || modelUrl.startsWith('data:') || modelUrl.startsWith('blob:')) {
      return modelUrl;
    }
    const baseUrl = ((import.meta as any).env?.BASE_URL || '/').replace(/\/$/, '');
    const cleanPath = modelUrl.replace(/^\.?\//, '');
    return `${baseUrl}/${cleanPath}`;
  }, [modelUrl]);

  try {
    return <GLBViewer url={resolvedUrl} colorHex={colorHex} />;
  } catch (err) {
    console.warn('[VEYRA 3D Engine] Fallback to procedural 3D garment:', err);
    return <StandaloneGarmentModel garmentType={garmentType} colorHex={colorHex} />;
  }
};

