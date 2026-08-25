import React, { Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
import { useProgress, Html } from '@react-three/drei';
import { Sparkles } from 'lucide-react';


/**
 * Utility to verify WebGL capability on the current device
 */
export const checkWebGLSupport = (): { isSupported: boolean; version: string; renderer?: string } => {
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'WebGL 2.0 Hardware';
      return { isSupported: true, version: 'WebGL 2.0', renderer };
    }

    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl1) {
      return { isSupported: true, version: 'WebGL 1.0', renderer: 'WebGL 1.0 Hardware' };
    }

    return { isSupported: false, version: 'None' };
  } catch {
    return { isSupported: false, version: 'None' };
  }
};

/**
 * Hook to provide smoothed progressive loading progress and phase descriptions
 */
export const useProgressiveLoader = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (!active && progress === 100) {
      setDisplayProgress(100);
      return;
    }

    const target = Math.min(100, Math.max(0, Math.round(progress)));
    const timer = setTimeout(() => {
      setDisplayProgress((prev) => {
        if (prev < target) {
          return Math.min(target, prev + Math.ceil((target - prev) * 0.3) || 1);
        }
        return target;
      });
    }, 30);

    return () => clearTimeout(timer);
  }, [progress, active]);

  let phase = 'Initializing 3D Atelier...';
  if (displayProgress > 20 && displayProgress <= 50) {
    phase = 'Loading PBR Mesh Geometry...';
  } else if (displayProgress > 50 && displayProgress <= 80) {
    phase = 'Draping Luxury Fabric Textures...';
  } else if (displayProgress > 80 && displayProgress < 100) {
    phase = 'Calibrating Photorealistic Lighting...';
  } else if (displayProgress >= 100) {
    phase = 'Haute Couture Studio Ready';
  }

  return {
    active: active || displayProgress < 100,
    progress: displayProgress,
    rawProgress: progress,
    phase,
    item,
    loaded,
    total,
    hasError: errors.length > 0,
  };
};

/**
 * In-Canvas Progress Loader (Rendered using @react-three/drei Html)
 */
export const CanvasProgressLoader: React.FC<{ message?: string }> = ({ message }) => {
  const { progress, phase } = useProgressiveLoader();

  return (
    <Html center zIndexRange={[100, 0]}>
      <div
        style={{
          width: '260px',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg, 16px)',
          background: 'rgba(7, 7, 9, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          textAlign: 'center',
          color: '#fff',
          fontFamily: 'inherit',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {/* Animated Gold Ring Spinner */}
        <div style={{ position: 'relative', width: '56px', height: '56px', margin: '0 auto 1rem auto' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid rgba(212, 175, 55, 0.15)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: 'var(--accent-gold, #d4af37)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold, #d4af37)',
            }}
          >
            <Sparkles size={18} />
          </div>
        </div>

        {/* Progress Text */}
        <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-gold, #d4af37)', marginBottom: '0.35rem' }}>
          {message || `Loading 3D Experience... ${Math.round(progress)}%`}
        </div>

        {/* Phase subtitle */}
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted, #8c857b)', marginBottom: '0.85rem' }}>
          {phase}
        </div>

        {/* Smooth Linear Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #d4af37, #f3e5ab)',
              borderRadius: '2px',
              transition: 'width 0.25s ease-out',
            }}
          />
        </div>
      </div>
    </Html>
  );
};

/**
 * 2D Fallback View when WebGL is unavailable or encountering a GPU error
 */
interface WebGLFallbackViewProps {
  garmentType?: string;
  garmentColorHex?: string;
  onRetry?: () => void;
  height?: string;
}

export const WebGLFallbackView: React.FC<WebGLFallbackViewProps> = ({
  garmentType = 't-shirts',
  garmentColorHex = '#6c8a66',
  height = '100%',
}) => {
  return (
    <div
      style={{
        width: '100%',
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-secondary) 100%)',
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        style={{
          width: '68%',
          height: '68%',
          filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.15))',
          transform: 'rotate(-5deg)',
        }}
      >
        {garmentType === 'shirts' ? (
          <path
            d="M 50 42 L 78 36 L 96 56 L 104 56 L 122 36 L 150 42 L 180 88 L 155 98 L 144 72 L 144 168 L 56 168 L 56 72 L 45 98 L 20 88 Z"
            fill={garmentColorHex}
          />
        ) : (
          <path
            d="M 45 42 L 78 36 L 100 56 L 122 36 L 155 42 L 185 88 L 158 98 L 146 72 L 146 168 L 54 168 L 54 72 L 42 98 L 15 88 Z"
            fill={garmentColorHex}
          />
        )}
        {/* Ribbed Collar Arc */}
        <path
          d="M 78 36 Q 100 64 122 36"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="3"
          fill="none"
        />
        {/* Subtle Atelier Gold Tag */}
        <rect x="94" y="66" width="12" height="4" rx="1" fill="#c59b27" />
      </svg>
    </div>
  );
};

/**
 * React Error Boundary for 3D Scenes
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  garmentType?: string;
  garmentColorHex?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[VEYRA 3D Engine] WebGL rendering error trapped by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <WebGLFallbackView
          garmentType={this.props.garmentType}
          garmentColorHex={this.props.garmentColorHex}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
