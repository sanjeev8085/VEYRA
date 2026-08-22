import React from 'react';
import { useStore } from '../../store/useStore';
import { RotateCw, Sun, Sunset, Zap, Maximize2 } from 'lucide-react';

interface ViewportControlsProps {
  onToggleFullscreen?: () => void;
}

export const ViewportControls: React.FC<ViewportControlsProps> = ({
  onToggleFullscreen,
}) => {
  const isAutoRotate = useStore((state) => state.isAutoRotate);
  const toggleAutoRotate = useStore((state) => state.toggleAutoRotate);
  const lightingPreset = useStore((state) => state.activeLightingPreset);
  const setLightingPreset = useStore((state) => state.setActiveLightingPreset);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.35rem 0.75rem',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 10,
      }}
    >
      {/* Auto Rotate Button */}
      <button
        onClick={toggleAutoRotate}
        title={isAutoRotate ? 'Pause Rotation' : 'Rotate'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.35rem 0.75rem',
          background: isAutoRotate ? 'rgba(184, 134, 11, 0.15)' : 'transparent',
          border: isAutoRotate ? '1px solid var(--accent-gold)' : '1px solid transparent',
          color: isAutoRotate ? 'var(--accent-gold)' : 'var(--text-secondary)',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <RotateCw size={13} />
        <span>Rotate</span>
      </button>

      <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

      {/* Lighting Preset Toggles */}
      <button
        onClick={() => setLightingPreset('studio')}
        title="Studio Lighting"
        style={{
          padding: '0.4rem',
          background: lightingPreset === 'studio' ? 'var(--text-primary)' : 'transparent',
          color: lightingPreset === 'studio' ? 'var(--bg-primary)' : 'var(--text-muted)',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sun size={14} />
      </button>

      <button
        onClick={() => setLightingPreset('sunset')}
        title="Golden Sunset"
        style={{
          padding: '0.4rem',
          background: lightingPreset === 'sunset' ? 'var(--accent-terracotta)' : 'transparent',
          color: lightingPreset === 'sunset' ? '#ffffff' : 'var(--text-muted)',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Sunset size={14} />
      </button>

      <button
        onClick={() => setLightingPreset('runway')}
        title="Runway Spotlight"
        style={{
          padding: '0.4rem',
          background: lightingPreset === 'runway' ? 'var(--accent-gold)' : 'transparent',
          color: lightingPreset === 'runway' ? '#ffffff' : 'var(--text-muted)',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Zap size={14} />
      </button>

      {onToggleFullscreen && (
        <>
          <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />
          <button
            onClick={onToggleFullscreen}
            title="Toggle Fullscreen"
            style={{
              padding: '0.4rem',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Maximize2 size={14} />
          </button>
        </>
      )}
    </div>
  );
};
