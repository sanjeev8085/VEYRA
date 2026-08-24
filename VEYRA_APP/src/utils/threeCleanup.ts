import * as THREE from 'three';
import { useEffect, useState, RefObject } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Recursively disposes a Three.js material and any attached textures
 */
export const disposeMaterial = (material: THREE.Material | THREE.Material[]): void => {
  if (Array.isArray(material)) {
    material.forEach((mat) => disposeMaterial(mat));
    return;
  }

  if (!material) return;

  // List of standard texture slot names in Three.js materials
  const textureSlots: Array<keyof THREE.Material | string> = [
    'map',
    'alphaMap',
    'aoMap',
    'bumpMap',
    'displacementMap',
    'emissiveMap',
    'envMap',
    'lightMap',
    'metalnessMap',
    'normalMap',
    'roughnessMap',
    'clearcoatMap',
    'clearcoatNormalMap',
    'clearcoatRoughnessMap',
    'transmissionMap',
    'thicknessMap',
    'specularMap',
    'specularIntensityMap',
    'specularColorMap',
    'sheenColorMap',
    'sheenRoughnessMap',
    'gradientMap',
  ];

  textureSlots.forEach((slot) => {
    const texture = (material as Record<string, any>)[slot];
    if (texture && typeof texture.dispose === 'function') {
      texture.dispose();
    }
  });

  if (typeof material.dispose === 'function') {
    material.dispose();
  }
};

/**
 * Recursively disposes a Three.js Object3D (Mesh, Group, Line, Points, etc.),
 * freeing its geometry, material(s), and child nodes from WebGL GPU memory.
 */
export const disposeThreeObject = (object: THREE.Object3D | null | undefined): void => {
  if (!object) return;

  // Traverse bottom-up (children first)
  while (object.children.length > 0) {
    const child = object.children[0];
    disposeThreeObject(child);
    object.remove(child);
  }

  // Dispose Geometry
  const mesh = object as THREE.Mesh;
  if (mesh.geometry && typeof mesh.geometry.dispose === 'function') {
    mesh.geometry.dispose();
  }

  // Dispose Material(s)
  if (mesh.material) {
    disposeMaterial(mesh.material);
  }

  // Dispose Skeleton / Bones if SkinnedMesh
  const skinned = object as THREE.SkinnedMesh;
  if (skinned.skeleton && typeof skinned.skeleton.dispose === 'function') {
    skinned.skeleton.dispose();
  }
};

/**
 * Deeply disposes a Three.js Scene, cleaning up all meshes, lights, helpers, and background textures.
 */
export const deepDisposeScene = (scene: THREE.Scene | THREE.Object3D): void => {
  if (!scene) return;

  if (scene instanceof THREE.Scene) {
    if (scene.background && (scene.background as THREE.Texture).dispose) {
      (scene.background as THREE.Texture).dispose();
    }
    if (scene.environment && (scene.environment as THREE.Texture).dispose) {
      (scene.environment as THREE.Texture).dispose();
    }
  }

  disposeThreeObject(scene);
};

/**
 * Fully disposes a WebGLRenderer, cleaning render targets and releasing WebGL contexts.
 */
export const disposeRenderer = (renderer: THREE.WebGLRenderer | null | undefined): void => {
  if (!renderer) return;

  try {
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement && renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  } catch (err) {
    console.warn('[VEYRA 3D Engine] Warning during WebGLRenderer disposal:', err);
  }
};

/**
 * Optimizes texture mipmapping and anisotropic filtering based on GPU capability
 */
export const optimizeTexture = (
  texture: THREE.Texture,
  renderer?: THREE.WebGLRenderer | null,
  options: { maxAnisotropy?: number; generateMipmaps?: boolean } = {}
): THREE.Texture => {
  if (!texture) return texture;

  const { generateMipmaps = true, maxAnisotropy } = options;

  texture.generateMipmaps = generateMipmaps;
  texture.minFilter = generateMipmaps ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  if (renderer) {
    const maxSupportedAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const targetAnisotropy = maxAnisotropy ? Math.min(maxAnisotropy, maxSupportedAnisotropy) : Math.min(4, maxSupportedAnisotropy);
    texture.anisotropy = targetAnisotropy;
  }

  texture.needsUpdate = true;
  return texture;
};

/**
 * Checks if the current client is a low-power device (mobile, battery saver, low hardware concurrency, low memory)
 */
export const isLowPowerDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  // 1. Check Data Saver mode
  const connection = (navigator as any).connection;
  if (connection && connection.saveData) {
    return true;
  }

  // 2. Check low hardware concurrency (e.g. <= 4 logical cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    return true;
  }

  // 3. Check low device memory if available
  const deviceMemory = (navigator as any).deviceMemory;
  if (deviceMemory && deviceMemory <= 4) {
    return true;
  }

  // 4. Check coarse pointer (touch device) with smaller viewport
  if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth <= 768) {
    return true;
  }

  return false;
};

/**
 * Calculates adaptive DPR scaling for WebGL to guarantee stable 60fps across heterogeneous devices
 */
export const getAdaptiveDPR = (qualityTier?: 'low' | 'medium' | 'high' | 'auto'): [number, number] => {
  if (typeof window === 'undefined') return [1, 2];

  const systemDPR = window.devicePixelRatio || 1;
  const isLowPower = isLowPowerDevice();

  if (qualityTier === 'low' || (qualityTier === 'auto' && isLowPower && systemDPR > 1.5)) {
    return [1, 1.25];
  }

  if (qualityTier === 'medium' || (qualityTier === 'auto' && isLowPower)) {
    return [1, 1.5];
  }

  if (qualityTier === 'high') {
    return [1, Math.min(2, systemDPR)];
  }

  // Auto default
  return [1, Math.min(1.75, systemDPR)];
};

/**
 * Hook to pause WebGL canvas render loop when scrolled offscreen via IntersectionObserver
 */
export const useCanvasIntersectionObserver = (
  containerRef: RefObject<HTMLElement>,
  options: { rootMargin?: string; threshold?: number | number[] } = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasEnteredViewport(true);
        }
      },
      {
        rootMargin: options.rootMargin || '120px',
        threshold: options.threshold !== undefined ? options.threshold : 0.05,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, options.rootMargin, options.threshold]);

  return { isIntersecting, hasEnteredViewport };
};

/**
 * React Three Fiber Scene Cleanup Manager
 * Disposes all scene meshes, geometries, materials and textures upon unmount
 */
export const SceneCleanupManager: React.FC = () => {
  const { scene, gl } = useThree();

  useEffect(() => {
    return () => {
      // Deep dispose scene graph on unmount
      if (scene) {
        deepDisposeScene(scene);
      }
      // Note: gl.dispose is handled when canvas unmounts, but we clear render state
      if (gl && (gl as any).renderLists) {
        (gl as any).renderLists.dispose();
      }
    };
  }, [scene, gl]);

  return null;
};
