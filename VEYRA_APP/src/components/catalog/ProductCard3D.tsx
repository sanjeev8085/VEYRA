import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ThreeCanvas } from '../three/ThreeCanvas';
import { useStore } from '../../store/useStore';
import {
  Heart,
  ShoppingBag,
  User,
  ArrowUpRight,
} from 'lucide-react';

interface ProductCard3DProps {
  product: Product;
  initialColorHex?: string;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  initialColorHex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const inWishlist = isInWishlist(product.id);
  const addToCart = useStore((state) => state.addToCart);

  // Active color & view mode on the card
  const defaultVariant = product.variants.find(
    (v) => initialColorHex && v.colorHex.toLowerCase() === initialColorHex.toLowerCase()
  ) || product.variants[0];

  const [selectedColorHex, setSelectedColorHex] = useState(defaultVariant.colorHex);
  const [selectedColorName, setSelectedColorName] = useState(defaultVariant.colorName);
  const [cardMode, setCardMode] = useState<'standalone' | 'avatar'>('standalone');
  const [isInteracting, setIsInteracting] = useState(false);

  // Extract unique color variants for live on-card swatching
  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.colorHex, { name: v.colorName, hex: v.colorHex }])).values()
  );

  // Viewport intersection observer for 60fps lazy WebGL mounting
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '250px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleColorClick = (e: React.MouseEvent, color: { name: string; hex: string }) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorHex(color.hex);
    setSelectedColorName(color.name);
  };

  const handleModeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCardMode(cardMode === 'standalone' ? 'avatar' : 'standalone');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const matchingVariant =
      product.variants.find((v) => v.colorHex === selectedColorHex) || product.variants[0];
    addToCart(product, matchingVariant.size, selectedColorName, selectedColorHex);
  };

  return (
    <div
      ref={containerRef}
      className="glass-card"
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.4s var(--ease-luxury)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* 1. PRIMARY FASHION VIEWPORT (Interactive Garment Experience) */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(240px, 20vw, 320px)',
          background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-secondary) 100%)',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
      >
        {/* Real Interactive WebGL Garment (Lazy mounted for peak performance) */}
        {isVisible ? (
          <ThreeCanvas
            garmentType={product.category}
            garmentColorHex={selectedColorHex}
            modelUrl={product.threeDClothingUrl}
            mode={cardMode}
            autoRotate={!isInteracting}
            interactive={true}
            enableZoom={false}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '2px solid var(--accent-gold)',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        )}

        {/* View Mode Switcher: Standalone <-> On Silhouette */}
        <button
          onClick={handleModeToggle}
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.7rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            zIndex: 10,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          title="Toggle view"
        >
          {cardMode === 'standalone' ? (
            <>
              <User size={12} />
              <span>Silhouette</span>
            </>
          ) : (
            <span>Draped</span>
          )}
        </button>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: inWishlist ? '#ef4444' : 'var(--text-primary)',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          aria-label="Wishlist toggle"
        >
          <Heart size={15} fill={inWishlist ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* 2. EDITORIAL DETAILS & REAL-TIME COLOR SWATCHES */}
      <div
        style={{
          padding: 'clamp(0.85rem, 2vw, 1.4rem)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Collection / Fabric Line */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.35rem',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                fontWeight: 700,
              }}
            >
              {product.brand}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            style={{
              fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0.2rem 0 0.4rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              lineHeight: 1.3,
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
            <ArrowUpRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </Link>

          {/* Fabric Specification */}
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              marginBottom: '0.75rem',
            }}
          >
            {product.shortDescription || product.description.slice(0, 50) + '...'}
          </p>

          {/* Interactive Color Swatches */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                Shade: <strong style={{ color: 'var(--text-primary)' }}>{selectedColorName}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {uniqueColors.map((color) => {
                const isSelected = selectedColorHex.toLowerCase() === color.hex.toLowerCase();
                return (
                  <button
                    key={color.hex}
                    onClick={(e) => handleColorClick(e, color)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: color.hex,
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid rgba(40,30,20,0.12)',
                      transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: isSelected ? '0 0 8px rgba(184, 134, 11, 0.35)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. PRICE & ACTIONS */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.75rem',
            gap: '0.4rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 800, color: 'var(--accent-gold)' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <Link
              to={`/product/${product.slug}`}
              className="btn btn-outline"
              style={{
                padding: '0.35rem 0.65rem',
                minHeight: '34px',
                minWidth: 'auto',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              <span>View</span>
            </Link>

            <button
              onClick={handleQuickAdd}
              className="btn btn-gold"
              style={{
                padding: '0.35rem 0.65rem',
                minHeight: '34px',
                minWidth: 'auto',
                fontSize: '0.72rem',
              }}
              title="Add to Shopping Bag"
            >
              <ShoppingBag size={13} />
              <span>Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
