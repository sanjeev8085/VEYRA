import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import { MannequinModel } from './MannequinModel';
import { GarmentModel } from './GarmentModel';
import { StandaloneGarmentModel } from './StandaloneGarmentModel';
import { useStore } from '../../store/useStore';

interface ThreeCanvasProps {
  garmentType?: 't-shirts' | 'shirts' | 'jackets' | 'trousers' | string;
  garmentColorHex?: string;
  overrideColor?: string;
  autoRotate?: boolean;
  interactive?: boolean;
  avatarId?: string;
  isFemale?: boolean;
  mode?: 'avatar' | 'standalone';
  enableZoom?: boolean;
  height?: string;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  garmentType = 't-shirts',
  garmentColorHex,
  overrideColor,
  autoRotate,
  interactive = true,
  avatarId,
  isFemale: isFemaleProp,
  mode = 'avatar',
  enableZoom = true,
  height = '100%',
}) => {
  const isAutoRotate = useStore((state) => (autoRotate !== undefined ? autoRotate : state.isAutoRotate));
  const activeColor = garmentColorHex || overrideColor || useStore((state) => state.activeColorHex);
  const activeAvatar = useStore((state) => avatarId || state.activeAvatarId);
  const lightingPreset = useStore((state) => state.activeLightingPreset);
  const theme = useStore((state) => state.theme);

  const isFemale = isFemaleProp !== undefined ? isFemaleProp : activeAvatar.includes('female');

  return (
    <div style={{ width: '100%', height, position: 'relative', overflow: 'hidden' }}>
      <Canvas
        camera={{
          position: mode === 'standalone' ? [0, 0.35, 1.8] : [0, 0.95, 2.3],
          fov: mode === 'standalone' ? 40 : 42,
        }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Refined Studio 3-Point Lighting Rig */}
        {lightingPreset === 'studio' && (
          <>
            <ambientLight intensity={theme === 'dark' ? 0.6 : 0.85} color="#fffcf5" />
            <directionalLight position={[3, 4, 3.5]} intensity={1.4} color="#ffffff" castShadow />
            <directionalLight position={[-3, 2, -2]} intensity={0.55} color="#e8d8b5" />
            <pointLight position={[0, -0.5, 2]} intensity={0.3} color="#ffffff" />
            <directionalLight position={[0, 4, -3]} intensity={0.4} color="#ffffff" />
          </>
        )}

        {lightingPreset === 'sunset' && (
          <>
            <ambientLight intensity={0.6} color="#3d2a26" />
            <directionalLight position={[3.5, 3, 2]} intensity={2.0} color="#ffbe76" />
            <directionalLight position={[-3.5, 1, -2]} intensity={0.7} color="#c56cf0" />
            <pointLight position={[0, 1, 1]} intensity={0.4} color="#ff9f43" />
          </>
        )}

        {lightingPreset === 'runway' && (
          <>
            <ambientLight intensity={0.4} />
            <spotLight position={[0, 6, 2.5]} angle={0.45} penumbra={0.8} intensity={3.0} color="#ffffff" castShadow />
            <directionalLight position={[2.5, -0.5, -2]} intensity={1.1} color="#67e8f9" />
            <directionalLight position={[-2.5, -0.5, -2]} intensity={1.1} color="#f472b6" />
          </>
        )}

        <Suspense fallback={null}>
          <Float speed={isAutoRotate ? 1.2 : 0} rotationIntensity={0.03} floatIntensity={0.05}>
            {mode === 'standalone' ? (
              <group position={[0, 0, 0]}>
                <StandaloneGarmentModel
                  garmentType={garmentType}
                  colorHex={activeColor}
                />
              </group>
            ) : (
              <group position={[0, 0, 0]}>
                {/* Haute Couture Tailor's Dress Form */}
                <MannequinModel isFemale={isFemale} />

                {/* Draped Organic Garment */}
                <GarmentModel
                  garmentType={garmentType}
                  colorHex={activeColor}
                  isFemale={isFemale}
                />
              </group>
            )}
          </Float>

          {/* Soft Studio Floor Shadow */}
          <ContactShadows
            position={[0, mode === 'standalone' ? -0.75 : -0.72, 0]}
            opacity={0.45}
            scale={mode === 'standalone' ? 2.8 : 3.5}
            blur={2.4}
            far={1.6}
            color={theme === 'dark' ? '#000000' : '#4a3d28'}
          />
        </Suspense>

        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={enableZoom}
            enableRotate={true}
            autoRotate={isAutoRotate}
            autoRotateSpeed={1.4}
            target={mode === 'standalone' ? [0, 0.35, 0] : [0, 0.95, 0]}
            minDistance={mode === 'standalone' ? 1.2 : 1.5}
            maxDistance={mode === 'standalone' ? 3.0 : 3.8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.75}
            dampingFactor={0.06}
          />
        )}
      </Canvas>
    </div>
  );
};
