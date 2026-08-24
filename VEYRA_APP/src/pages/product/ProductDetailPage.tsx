import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_PRODUCTS } from '../../data/seedData';
import { ThreeCanvas } from '../../components/three/ThreeCanvas';
import { ViewportControls } from '../../components/three/ViewportControls';
import { FallbackGallery } from '../../components/product/FallbackGallery';
import { ReviewSection } from '../../components/product/ReviewSection';
import { useStore } from '../../store/useStore';
import {
  Heart,
  ShoppingBag,
  Ruler,
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCw,
  Eye,
  Box,
} from 'lucide-react';

import { SEO } from '../../components/common/SEO';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const products = useStore((state) => state.products);
  const product = products.find((p) => p.slug === slug) || products[0] || SEED_PRODUCTS[0];

  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const inWishlist = isInWishlist(product.id);

  // Active user selections
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedSize, setSelectedSize] = useState(product.variants[0].size);
  const [selectedColorHex, setSelectedColorHex] = useState(product.variants[0].colorHex);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewFormat, setViewFormat] = useState<'3d' | 'lookbook360'>('3d');

  // Modals & Accordions
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<'fabric' | 'shipping' | 'reviews' | null>('fabric');

  // Unique sizes and colors available for this product
  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const uniqueColors = Array.from(
    new Map(product.variants.map((v) => [v.colorHex, { name: v.colorName, hex: v.colorHex }])).values()
  );

  const handleColorChange = (hex: string) => {
    setSelectedColorHex(hex);
    const matchingVariant =
      product.variants.find((v) => v.colorHex === hex && v.size === selectedSize) ||
      product.variants.find((v) => v.colorHex === hex) ||
      product.variants[0];
    setSelectedVariant(matchingVariant);
  };

  const handleSizeChange = (size: any) => {
    setSelectedSize(size);
    const matchingVariant =
      product.variants.find((v) => v.size === size && v.colorHex === selectedColorHex) ||
      product.variants.find((v) => v.size === size) ||
      product.variants[0];
    setSelectedVariant(matchingVariant);
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <SEO
        title={`${product.name} — VEYRA Luxury Fashion`}
        description={product.description || 'Luxury bespoke tailoring crafted with sustainable natural fibers.'}
        image={product.images[0]}
        type="product"
        productSchema={{
          name: product.name,
          description: product.description,
          image: product.images[0] || '',
          price: product.price,
          currency: 'INR',
          brand: product.brand,
          sku: (product as any).sku || product.id,
          availability: product.variants.some((v) => v.stock > 0) ? 'InStock' : 'OutOfStock',
        }}
      />
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to={`/catalog?category=${product.category}`} style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
            {product.category.replace('-', ' ')}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div
          className="responsive-grid-pdp"
          style={{
            alignItems: 'start',
          }}
        >
          {/* Left Column: Interactive Garment Viewport & Thumbnails */}
          <div>
            <div
              className="glass-panel"
              style={{
                height: '580px',
                position: 'relative',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1px solid var(--border-gold)',
                background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-secondary) 100%)',
              }}
            >
              {viewFormat === '3d' ? (
                <>
                  {/* Natural Interactive Garment Canvas */}
                  <ThreeCanvas
                    garmentType={product.category}
                    garmentColorHex={selectedColorHex}
                    isFemale={false}
                  />

                  {/* Viewport Lighting & View Controls */}
                  <ViewportControls />

                  {/* Drag to Rotate Indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      left: '1.25rem',
                      padding: '0.4rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-glass)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      zIndex: 10,
                    }}
                  >
                    <RotateCw size={13} />
                    <span>Drag to Rotate 3D</span>
                  </div>
                </>
              ) : (
                <FallbackGallery
                  garmentType={product.category}
                  garmentColorHex={selectedColorHex}
                  garmentColorName={selectedVariant.colorName}
                  images={product.images}
                  productName={product.name}
                  height="100%"
                  onSwitchTo3D={() => setViewFormat('3d')}
                  canSwitchTo3D={true}
                />
              )}

              {/* Top Right Mode Toggle Switch (3D Atelier <-> 360° Studio Lookbook) */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  zIndex: 25,
                  display: 'flex',
                  background: 'rgba(10, 10, 14, 0.8)',
                  backdropFilter: 'blur(12px)',
                  padding: '3px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => setViewFormat('3d')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: viewFormat === '3d' ? 'var(--accent-gold)' : 'transparent',
                    color: viewFormat === '3d' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Interactive 3D WebGL Canvas"
                >
                  <Box size={13} />
                  <span>3D Atelier</span>
                </button>
                <button
                  onClick={() => setViewFormat('lookbook360')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: viewFormat === 'lookbook360' ? 'var(--accent-gold)' : 'transparent',
                    color: viewFormat === 'lookbook360' ? '#fff' : 'var(--text-muted)',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="High-Res 360° Multi-Angle Lookbook"
                >
                  <Eye size={13} />
                  <span>360° Photo</span>
                </button>
              </div>
            </div>

            {/* Editorial Lookbook Angles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    height: '110px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeImageIndex === idx ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <img src={img} alt={`${product.name} editorial ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Garment Information & Sizing */}
          <div>
            <div style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700 }}>
              {product.brand}
            </div>

            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', color: 'var(--text-primary)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.15 }}>
              {product.name}
            </h1>

            {/* Price & Rating */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercentage && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--status-success)', background: 'rgba(21,128,61,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <Star size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
                <span style={{ fontWeight: 700 }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviewCount} reviews)</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.68, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Color Swatches */}
            <div style={{ marginBottom: '1.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                  Shade: <span style={{ color: 'var(--accent-gold)' }}>{selectedVariant.colorName}</span>
                </label>

                <Link
                  to="/find-your-colors"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Sparkles size={13} />
                  <span>Will this suit my tone?</span>
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {uniqueColors.map((color) => {
                  const isSelected = selectedColorHex === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => handleColorChange(color.hex)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: color.hex,
                        border: isSelected ? '3px solid var(--accent-gold)' : '1px solid rgba(40,30,20,0.15)',
                        boxShadow: isSelected ? '0 0 10px rgba(184, 134, 11, 0.35)' : 'none',
                        cursor: 'pointer',
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                  Select Size
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-gold)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                  }}
                >
                  <Ruler size={14} />
                  <span>Measurement Guide (cm/in)</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      style={{
                        minWidth: '54px',
                        height: '46px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--text-primary)' : 'var(--bg-card)',
                        color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                        border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-light)',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Wishlist */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
              <button
                onClick={() => {
                  addToCart(
                    product,
                    selectedSize,
                    selectedVariant.colorName,
                    selectedColorHex
                  );
                }}
                className="btn btn-gold"
                style={{ flex: 1, padding: '1rem 2rem', fontSize: '1rem' }}
              >
                <ShoppingBag size={19} />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="btn btn-outline"
                style={{
                  width: '54px',
                  height: '54px',
                  padding: 0,
                  color: inWishlist ? '#ef4444' : 'var(--text-primary)',
                }}
                aria-label="Wishlist toggle"
              >
                <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} />
              </button>
            </div>

            {/* Guarantees Strip */}
            <div className="responsive-guarantees-grid" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <Truck size={20} color="var(--accent-gold)" style={{ margin: '0 auto 0.35rem auto' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>Complimentary Express Shipping</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ShieldCheck size={20} color="var(--accent-gold)" style={{ margin: '0 auto 0.35rem auto' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>100% Organic Yarns</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <RotateCw size={20} color="var(--accent-gold)" style={{ margin: '0 auto 0.35rem auto' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>30-Day Hassle-Free Returns</div>
              </div>
            </div>

            {/* Information Accordion */}
            <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'fabric' ? null : 'fabric')}
                  style={{
                    width: '100%',
                    padding: '1.1rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  <span>Fabric & Care Specifications</span>
                  {activeAccordion === 'fabric' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeAccordion === 'fabric' && (
                  <div style={{ paddingBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    <p style={{ marginBottom: '0.5rem' }}><strong>Material:</strong> {product.fabricDetails}</p>
                    <p><strong>Care:</strong> {product.careInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Star Ratings */}
        <ReviewSection
          productId={product.id}
          productName={product.name}
          initialRating={product.rating}
          initialReviewCount={product.reviewCount}
        />

        {/* Size Guide Modal */}
        {isSizeGuideOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--bg-overlay)',
              backdropFilter: 'blur(10px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              className="glass-panel modal-dialog-responsive"
              style={{
                width: '100%',
                maxWidth: '620px',
                padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                  Size & Measurement Chart
                </h3>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="btn btn-ghost"
                  style={{ padding: '0.4rem 0.8rem' }}
                >
                  Close
                </button>
              </div>

              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--accent-gold)' }}>
                      <th style={{ padding: '0.75rem' }}>Size</th>
                      <th style={{ padding: '0.75rem' }}>Chest (Inches)</th>
                      <th style={{ padding: '0.75rem' }}>Length (Inches)</th>
                      <th style={{ padding: '0.75rem' }}>Shoulder (Inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'S', chest: '38 - 40"', len: '27.5"', sh: '17.5"' },
                      { size: 'M', chest: '40 - 42"', len: '28.5"', sh: '18.5"' },
                      { size: 'L', chest: '42 - 44"', len: '29.5"', sh: '19.5"' },
                      { size: 'XL', chest: '44 - 46"', len: '30.5"', sh: '20.5"' },
                    ].map((row) => (
                      <tr key={row.size} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 700 }}>{row.size}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{row.chest}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{row.len}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{row.sh}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
