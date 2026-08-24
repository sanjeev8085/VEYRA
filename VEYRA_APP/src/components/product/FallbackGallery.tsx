import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Sparkles,
  Eye,
} from 'lucide-react';

interface FallbackGalleryProps {
  garmentType?: string;
  garmentColorHex?: string;
  garmentColorName?: string;
  images?: string[];
  productName?: string;
  height?: string | number;
  onSwitchTo3D?: () => void;
  canSwitchTo3D?: boolean;
  show360DegreeScrubber?: boolean;
  className?: string;
}

// Curated high-resolution editorial angle datasets per garment category
const CATEGORY_ANGLE_SETS: Record<string, string[]> = {
  't-shirts': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=85',
  ],
  shirts: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200&auto=format&fit=crop&q=85',
  ],
  jackets: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=1200&auto=format&fit=crop&q=85',
  ],
  trousers: [
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=1200&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1200&auto=format&fit=crop&q=85',
  ],
};

const ANGLE_LABELS = [
  'Editorial Front Profile (0°)',
  'Quarter Three-Fourths (90°)',
  'Back Tailoring Silhouette (180°)',
  'Detail Macro Drape (270°)',
];

export const FallbackGallery: React.FC<FallbackGalleryProps> = ({
  garmentType = 't-shirts',
  garmentColorHex = '#d4af37',
  garmentColorName = 'Bespoke Atelier',
  images,
  productName = 'Luxury Garment',
  height = '100%',
  onSwitchTo3D,
  canSwitchTo3D = false,
  show360DegreeScrubber = true,
  className = '',
}) => {
  // Determine active angle dataset
  const normalizedCategory = garmentType.toLowerCase().replace(/[^a-z-]/g, '');
  const baseCategory = Object.keys(CATEGORY_ANGLE_SETS).find((k) => normalizedCategory.includes(k)) || 't-shirts';
  const defaultImages = CATEGORY_ANGLE_SETS[baseCategory] || CATEGORY_ANGLE_SETS['t-shirts'];
  const galleryImages = images && images.length > 0 ? images : defaultImages;

  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [currentAngleDegrees, setCurrentAngleDegrees] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Preload all angle images for instant 360° transitions
  useEffect(() => {
    galleryImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [galleryImages]);

  // Update angle index from drag position or 360 degree slider
  const updateAngleFromProgress = useCallback(
    (degrees: number) => {
      const normalized = ((degrees % 360) + 360) % 360;
      setCurrentAngleDegrees(normalized);
      const index = Math.min(
        galleryImages.length - 1,
        Math.floor((normalized / 360) * galleryImages.length)
      );
      setActiveAngleIndex(index);
    },
    [galleryImages.length]
  );

  // Mouse / Touch Drag 360 Sequence Handlers
  const handleStartDrag = (clientX: number) => {
    if (isZoomed) return;
    setIsDragging(true);
    setDragStartX(clientX);
  };

  const handleMoveDrag = (clientX: number) => {
    if (!isDragging || isZoomed) return;
    const deltaX = clientX - dragStartX;
    if (Math.abs(deltaX) > 8) {
      const sensitivity = 0.75;
      const newDegrees = currentAngleDegrees + deltaX * sensitivity;
      updateAngleFromProgress(newDegrees);
      setDragStartX(clientX);
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  // Magnifier Zoom Position Tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPosition({ x, y });

    if (isDragging) {
      handleMoveDrag(e.clientX);
    }
  };

  const activeImage = galleryImages[activeAngleIndex] || galleryImages[0];
  const activeLabel = ANGLE_LABELS[activeAngleIndex % ANGLE_LABELS.length] || `Angle ${activeAngleIndex + 1}`;

  return (
    <div
      ref={containerRef}
      className={`fallback-gallery-container ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEndDrag}
      onTouchEnd={handleEndDrag}
      style={{
        width: '100%',
        height,
        minHeight: '440px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'radial-gradient(circle at center, rgba(35, 30, 26, 0.45) 0%, rgba(10, 10, 14, 0.95) 100%)',
        borderRadius: 'var(--radius-lg, 18px)',
        overflow: 'hidden',
        border: '1px solid var(--border-gold, rgba(212, 175, 55, 0.25))',
        userSelect: 'none',
      }}
    >
      {/* Top Overlay Badge Bar */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        {/* Atelier Photography Mode Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-full, 999px)',
            background: 'rgba(10, 10, 14, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: 'var(--accent-gold, #d4af37)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            pointerEvents: 'auto',
          }}
        >
          <Eye size={13} />
          <span>High-Res 360° Studio Lookbook</span>
        </div>

        {/* 3D Switch Action if available */}
        {canSwitchTo3D && onSwitchTo3D && (
          <button
            onClick={onSwitchTo3D}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full, 999px)',
              background: 'linear-gradient(135deg, #d4af37, #8c6508)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
              pointerEvents: 'auto',
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={13} />
            <span>Switch to 3D Canvas</span>
          </button>
        )}
      </div>

      {/* Main Image Stage with 360 Drag and Magnifier Zoom */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: isZoomed ? 'zoom-out' : isDragging ? 'grabbing' : 'grab',
          padding: '2.5rem 1rem 1rem 1rem',
        }}
        onMouseDown={(e) => handleStartDrag(e.clientX)}
        onTouchStart={(e) => handleStartDrag(e.touches[0].clientX)}
        onTouchMove={(e) => handleMoveDrag(e.touches[0].clientX)}
        onClick={() => {
          if (!isDragging) {
            setIsZoomed(!isZoomed);
          }
        }}
      >
        {/* Main Photograph */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxHeight: '440px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            ref={imageRef}
            src={activeImage}
            alt={`${productName} — ${activeLabel}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md, 12px)',
              filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.6))',
              transform: isZoomed
                ? `scale(2.4) translate(${(50 - zoomPosition.x) * 0.45}%, ${(50 - zoomPosition.y) * 0.45}%)`
                : 'scale(1)',
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              transition: isZoomed ? 'transform 0.1s ease-out' : 'transform 0.4s var(--ease-luxury, cubic-bezier(0.16, 1, 0.3, 1))',
            }}
            draggable={false}
          />

          {/* Color Tint Subtle Glow Ambience */}
          <div
            style={{
              position: 'absolute',
              bottom: '15%',
              width: '60%',
              height: '30%',
              borderRadius: '50%',
              background: garmentColorHex,
              opacity: 0.12,
              filter: 'blur(45px)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Drag Helper Tooltip */}
        {!isZoomed && isHovered && (
          <div
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '0.35rem 0.8rem',
              borderRadius: 'var(--radius-full, 999px)',
              background: 'rgba(7, 7, 9, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#f6f5f3',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              pointerEvents: 'none',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <RotateCcw size={12} color="var(--accent-gold, #d4af37)" />
            <span>Drag horizontally for 360° rotation • Click to Zoom</span>
          </div>
        )}
      </div>

      {/* Floating Action Buttons (Zoom / Navigation) */}
      <div
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 20,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(10, 10, 14, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: 'var(--accent-gold, #d4af37)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
          title={isZoomed ? 'Reset Zoom' : 'Zoom In'}
          aria-label="Toggle Zoom"
        >
          {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const nextIdx = (activeAngleIndex + 1) % galleryImages.length;
            setActiveAngleIndex(nextIdx);
            setCurrentAngleDegrees((nextIdx / galleryImages.length) * 360);
          }}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(10, 10, 14, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f6f5f3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Next Angle"
          aria-label="Next Angle"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Bottom Controls: 360 Scrubber Bar & Angle Thumbnails */}
      <div
        style={{
          background: 'rgba(10, 10, 14, 0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          zIndex: 20,
        }}
      >
        {/* 360° Angle Slider Bar */}
        {show360DegreeScrubber && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #8c857b)', fontWeight: 600, minWidth: '32px' }}>
              0°
            </span>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="range"
                min="0"
                max="359"
                value={Math.round(currentAngleDegrees)}
                onChange={(e) => updateAngleFromProgress(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  accentColor: 'var(--accent-gold, #d4af37)',
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
                aria-label="360 rotation degree slider"
              />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold, #d4af37)', fontWeight: 700, minWidth: '40px', textAlign: 'right' }}>
              {Math.round(currentAngleDegrees)}°
            </span>
          </div>
        )}

        {/* Thumbnail Angle Strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {galleryImages.map((src, idx) => {
              const isSelected = idx === activeAngleIndex;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveAngleIndex(idx);
                    setCurrentAngleDegrees((idx / galleryImages.length) * 360);
                  }}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: isSelected ? '2px solid var(--accent-gold, #d4af37)' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#070709',
                    padding: 0,
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  title={`View angle ${idx + 1}`}
                >
                  <img src={src} alt={`Angle ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              );
            })}
          </div>

          {/* Active Shade & Angle Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: garmentColorHex,
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.3)',
              }}
              title={garmentColorName}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-primary, #f6f5f3)', fontWeight: 600 }}>
              {activeLabel.split('(')[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
