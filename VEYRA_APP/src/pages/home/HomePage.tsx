import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThreeCanvas } from '../../components/three/ThreeCanvas';
import { ProductCard3D } from '../../components/catalog/ProductCard3D';
import { useStore } from '../../store/useStore';
import {
  ArrowRight,
  Sparkles,
  Camera,
  Compass,
  Layers,
  Shield,
  RotateCw,
} from 'lucide-react';

import { SEO } from '../../components/common/SEO';

export const HomePage: React.FC = () => {
  const products = useStore((state) => state.products);
  const heroSettings = useStore((state) => state.homepageHeroSettings);

  // Atelier Interactive Section State (Shifted down)
  const [atelierGarmentType, setAtelierGarmentType] = useState<'t-shirts' | 'shirts'>('t-shirts');
  const [atelierColorHex, setAtelierColorHex] = useState('#6c8a66');
  const [atelierColorName, setAtelierColorName] = useState('Botanical Sage');

  const atelierColors = [
    { name: 'Botanical Sage', hex: '#6c8a66' },
    { name: 'Earthy Terracotta', hex: '#c45b38' },
    { name: 'Ivory Linen', hex: '#faf8f5' },
    { name: 'Capri Sky Blue', hex: '#4a7c9f' },
    { name: 'Vintage Burgundy', hex: '#722f37' },
    { name: 'Warm Sand', hex: '#d8caa8' },
  ];

  const featuredTees = products.filter((p) => p.category === 't-shirts' && p.status === 'published').slice(0, 4);
  const featuredShirts = products.filter((p) => p.category === 'shirts' && p.status === 'published').slice(0, 4);

  return (
    <div style={{ minHeight: '100vh' }}>
      <SEO
        title="VEYRA — Luxury Garment Atelier & Haute Couture"
        description="Explore the future of quiet luxury fashion. Peruvian Supima cotton, pure Normandy linen, and real-time 3D tailoring."
      />
      {/* 1. EDITORIAL CAMPAIGN HERO (Clean High-Fashion Editorial Photography) */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '80px',
          background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            className="responsive-grid-hero"
            style={{
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Campaign Typography */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.95rem',
                  background: 'rgba(184, 134, 11, 0.08)',
                  border: '1px solid rgba(184, 134, 11, 0.22)',
                  borderRadius: '9999px',
                  color: 'var(--accent-gold)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                }}
              >
                <Sparkles size={13} />
                <span>{heroSettings?.tag || 'Summer Atelier 2026'}</span>
              </div>

              <h1
                className="font-display"
                style={{
                  fontSize: 'var(--font-size-hero)',
                  lineHeight: 1.04,
                  color: 'var(--text-primary)',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.035em',
                }}
              >
                {heroSettings?.headline || 'THE ART OF'} <br />
                <span className="gold-gradient-text">{heroSettings?.headlineHighlight || 'FORM & TEXTURE.'}</span>
              </h1>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.08rem',
                  lineHeight: 1.68,
                  maxWidth: '520px',
                  marginBottom: '2.5rem',
                }}
              >
                {heroSettings?.subtitle || 'Long-staple Peruvian Supima cotton and pure Normandy linen cut with architectural drape. Tailored with sculptural precision for effortless modern luxury.'}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  marginBottom: '2.5rem',
                }}
              >
                <Link
                  to="/catalog"
                  className="btn btn-gold"
                  style={{
                    padding: '0.8rem clamp(1.25rem, 3vw, 2rem)',
                    fontSize: '0.9rem',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/find-your-colors"
                  className="btn btn-outline"
                  style={{
                    padding: '0.8rem clamp(1.1rem, 2.5vw, 1.6rem)',
                    fontSize: '0.9rem',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <Sparkles size={16} />
                  <span>Find Your Palette</span>
                </Link>
              </div>

              {/* Editorial Guarantees Line */}
              <div
                style={{
                  display: 'flex',
                  gap: 'clamp(1rem, 2.5vw, 2.5rem)',
                  flexWrap: 'wrap',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1.75rem',
                }}
              >
                <div style={{ minWidth: '80px' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>100%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Organic Flax & Pima
                  </div>
                </div>
                <div style={{ minWidth: '80px' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹0</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Express Pan-India Shipping
                  </div>
                </div>
                <div style={{ minWidth: '80px' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>30-Day</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Atelier Return Window
                  </div>
                </div>
              </div>
            </div>

            {/* Right Campaign Editorial Imagery Frame */}
            <div
              className="glass-panel"
              style={{
                height: 'clamp(320px, 45vw, 540px)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-gold)',
                boxShadow: 'var(--shadow-lg)',
                width: '100%',
                minWidth: 0,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85"
                alt="VEYRA Campaign Editorial"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.04) brightness(0.98)',
                  transition: 'transform 0.8s var(--ease-luxury)',
                }}
              />

              {/* Floating Atelier Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  left: '1.5rem',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--accent-gold)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Signature Collection
              </div>

              {/* Floating Story Caption */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', fontWeight: 700 }}>
                    Peruvian Supima Series
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Architectural Relaxed Cut
                  </div>
                </div>

                <Link
                  to="/catalog?category=t-shirts"
                  className="btn btn-gold"
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.78rem',
                    minHeight: '36px',
                  }}
                >
                  <span>Explore</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIND YOUR PALETTE (Complexion Consultation Teaser) */}
      <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 0', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
        <div className="container" style={{ overflow: 'hidden' }}>
          <div
            className="glass-panel responsive-grid-hero"
            style={{
              padding: 'clamp(1.25rem, 3.5vw, 3rem)',
              alignItems: 'center',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(243,239,232,0.85) 100%)',
              border: '1px solid var(--border-gold)',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ minWidth: 0, width: '100%' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: 'var(--accent-gold)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                <Sparkles size={15} />
                <span>Atelier Color Consultation</span>
              </div>

              <h2 className="font-display" style={{ fontSize: 'var(--font-size-h2)', color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1rem' }}>
                Wardrobe Shades Tailored <br />
                to Your Natural Tone
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                Every complexion holds subtle golden, rosy, or olive undertones. Discover the chromatic palette designed to naturally elevate your facial structure and wardrobe confidence.
              </p>

              <Link
                to="/find-your-colors"
                className="btn btn-gold"
                style={{
                  padding: '0.75rem clamp(1rem, 2.5vw, 1.5rem)',
                  width: 'fit-content',
                  maxWidth: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  boxSizing: 'border-box',
                }}
              >
                <Camera size={17} />
                <span>Explore Your Color Palette</span>
              </Link>
            </div>

            {/* Editorial Palette Swatch Matrix */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 'clamp(0.4rem, 1.2vw, 0.75rem)',
                minWidth: 0,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              {[
                { name: 'Botanical Sage', hex: '#6c8a66', match: 'Olive & Warm' },
                { name: 'Earthy Terracotta', hex: '#c45b38', match: 'Golden Honey' },
                { name: 'Capri Sky Blue', hex: '#4a7c9f', match: 'Cool Rosy' },
                { name: 'Ivory Linen', hex: '#faf8f5', match: 'Universal' },
                { name: 'Sunlit Coral', hex: '#d96b58', match: 'Rich Bronze' },
                { name: 'Vintage Burgundy', hex: '#722f37', match: 'Fair Porcelain' },
              ].map((swatch) => (
                <div
                  key={swatch.name}
                  className="glass-card"
                  style={{
                    padding: 'clamp(0.6rem, 1.5vw, 1.1rem) clamp(0.2rem, 0.8vw, 0.5rem)',
                    textAlign: 'center',
                    borderRadius: 'var(--radius-md)',
                    minWidth: 0,
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      width: 'clamp(28px, 6.5vw, 42px)',
                      height: 'clamp(28px, 6.5vw, 42px)',
                      borderRadius: '50%',
                      background: swatch.hex,
                      margin: '0 auto 0.4rem auto',
                      border: swatch.hex === '#faf8f5' ? '1px solid #ddd' : 'none',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                  <div style={{ fontSize: 'clamp(0.68rem, 1.8vw, 0.8rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15, wordBreak: 'break-word' }}>
                    {swatch.name}
                  </div>
                  <div style={{ fontSize: 'clamp(0.58rem, 1.5vw, 0.65rem)', color: 'var(--text-muted)', marginTop: '0.2rem', wordBreak: 'break-word' }}>
                    {swatch.match}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE T-SHIRTS COLLECTION (Interactive Product Cards) */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                Peruvian Supima Cotton
              </span>
              <h2 className="font-display" style={{ fontSize: 'var(--font-size-h2)', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                Signature T-Shirts
              </h2>
            </div>

            <Link
              to="/catalog?category=t-shirts"
              className="btn btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              <span>Explore All T-Shirts</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            className="product-catalog-grid"
            style={{
              display: 'grid',
              gap: '2rem',
            }}
          >
            {featuredTees.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE ATELIER FITTING EXPERIENCE (Shifted Canvas Section with Interactive Swatches) */}
      <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div
            className="responsive-grid-hero"
            style={{
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Description & Controls */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: 'var(--accent-gold)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                <Sparkles size={14} />
                <span>Interactive Lookbook</span>
              </div>

              <h2 className="font-display" style={{ fontSize: 'var(--font-size-h2)', color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                The Atelier Draping Studio
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.68, marginBottom: '2rem' }}>
                Rotate and observe how pure French flax and organic Peruvian Supima drape naturally across silhouette contours in natural studio lighting.
              </p>

              {/* Garment Switcher */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                  Silhouette Category
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setAtelierGarmentType('t-shirts')}
                    style={{
                      padding: '0.6rem 1.4rem',
                      borderRadius: 'var(--radius-full)',
                      background: atelierGarmentType === 't-shirts' ? 'var(--text-primary)' : 'var(--bg-card)',
                      color: atelierGarmentType === 't-shirts' ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    T-Shirts
                  </button>
                  <button
                    onClick={() => setAtelierGarmentType('shirts')}
                    style={{
                      padding: '0.6rem 1.4rem',
                      borderRadius: 'var(--radius-full)',
                      background: atelierGarmentType === 'shirts' ? 'var(--text-primary)' : 'var(--bg-card)',
                      color: atelierGarmentType === 'shirts' ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Shirts
                  </button>
                </div>
              </div>

              {/* Swatch Selector */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
                    Active Fabric Shade: <span style={{ color: 'var(--accent-gold)' }}>{atelierColorName}</span>
                  </label>
                </div>
                <div className="swatch-group" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {atelierColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        setAtelierColorHex(c.hex);
                        setAtelierColorName(c.name);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: c.hex,
                        border: atelierColorHex === c.hex ? '2px solid var(--accent-gold)' : '1px solid rgba(40,30,20,0.15)',
                        transform: atelierColorHex === c.hex ? 'scale(1.2)' : 'scale(1)',
                        boxShadow: atelierColorHex === c.hex ? '0 0 10px rgba(184, 134, 11, 0.4)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <Link to="/studio" className="btn btn-gold" style={{ padding: '0.8rem clamp(1.25rem, 3vw, 2rem)', maxWidth: '100%', boxSizing: 'border-box' }}>
                <span>Open Full Fitting Atelier</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right Shifted Canvas */}
            <div
              className="glass-panel three-canvas-container"
              style={{
                height: 'clamp(340px, 45vw, 520px)',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-gold)',
                background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-secondary) 100%)',
              }}
            >
              <ThreeCanvas
                garmentType={atelierGarmentType}
                garmentColorHex={atelierColorHex}
                isFemale={false}
              />

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
                <span>Drag to Rotate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARTISANAL SHIRTS COLLECTION */}
      <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                Normandy Flax & Oxford Basketweave
              </span>
              <h2 className="font-display" style={{ fontSize: 'var(--font-size-h2)', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                Artisanal Tailored Shirts
              </h2>
            </div>

            <Link
              to="/catalog?category=shirts"
              className="btn btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              <span>Explore All Shirts</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            className="product-catalog-grid"
            style={{
              display: 'grid',
              gap: '2rem',
            }}
          >
            {featuredShirts.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. ATELIER PHILOSOPHY & CRAFTSMANSHIP BANNER */}
      <section style={{ padding: 'clamp(3rem, 6vw, 6rem) 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div
            style={{
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent-gold)', display: 'block', marginBottom: '0.5rem' }}>
              The VEYRA Standard
            </span>
            <h2 className="font-display" style={{ fontSize: 'var(--font-size-h2)', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Sculptural Precision in Everyday Wardrobe
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              We reject fleeting trends in pursuit of timeless proportions, bio-polished natural yarns, and artisanal hand-finishing that endures for years.
            </p>

            <div className="responsive-guarantees-grid">
              <div>
                <Compass size={28} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  European Flax
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sourced from certified organic growers in Normandy</p>
              </div>
              <div>
                <Layers size={28} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  280 GSM Density
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Heavyweight organic cotton with double-needle seams</p>
              </div>
              <div>
                <Shield size={28} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Lifetime Fit Guarantee
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Pre-shrunk fibers that retain structural memory</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
