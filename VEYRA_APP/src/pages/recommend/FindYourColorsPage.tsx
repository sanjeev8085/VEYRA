import React, { useState, useRef } from 'react';
import {
  analyzeSkinToneFromImage,
  VEYRA_PALETTE,
} from '../../services/colorRecommendationEngine';
import { SkinToneRecommendation, FashionColorOption, Product } from '../../types';
import { SEED_PRODUCTS } from '../../data/seedData';
import { ProductCard3D } from '../../components/catalog/ProductCard3D';
import {
  Sparkles,
  Upload,
  Camera,
  RefreshCw,
  Check,
  Palette,
} from 'lucide-react';

export const FindYourColorsPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<SkinToneRecommendation | null>(null);
  const [activeSelectedColor, setActiveSelectedColor] = useState<FashionColorOption | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset portrait sample models for instant demo exploration
  const sampleProfiles = [
    {
      label: 'Warm Golden',
      img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    },
    {
      label: 'Cool Rosy',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    },
    {
      label: 'Olive Neutral',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    },
    {
      label: 'Deep Amber',
      img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    },
  ];

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setSelectedImage(src);
      runAnalysis(src);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    runAnalysis(imgUrl);
  };

  const runAnalysis = (imageSrc: string) => {
    setIsAnalyzing(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      const result = await analyzeSkinToneFromImage(img);
      setTimeout(() => {
        setRecommendation(result);
        setActiveSelectedColor(result.recommendedColors[0] || VEYRA_PALETTE.sage);
        setIsAnalyzing(false);
      }, 900);
    };
    img.src = imageSrc;
  };

  // Find products available in the selected active color
  const matchedProducts: Product[] = activeSelectedColor
    ? SEED_PRODUCTS.filter((p) =>
        p.variants.some(
          (v) =>
            v.colorHex.toLowerCase() === activeSelectedColor.hex.toLowerCase() ||
            v.colorName.toLowerCase().includes(activeSelectedColor.name.toLowerCase().split(' ')[0])
        )
      )
    : [];

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '1120px' }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'rgba(184, 134, 11, 0.1)',
              border: '1px solid rgba(184, 134, 11, 0.3)',
              borderRadius: '9999px',
              color: 'var(--accent-gold)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={15} />
            <span>Smart Color Consultation</span>
          </div>

          <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', color: 'var(--text-primary)', lineHeight: 1.15 }}>
            Find Your Signature Colors
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '620px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Upload a portrait photo or select a profile to discover natural wardrobe palettes that illuminate your skin tone, undertones, and facial presence.
          </p>
        </div>

        {/* Upload & Portrait Selection Zone */}
        {!recommendation && (
          <div
            className="glass-panel"
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto 3rem auto',
            }}
          >
            {isAnalyzing ? (
              <div style={{ padding: '3rem 0' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: '3px solid var(--accent-gold)',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1.5rem auto',
                  }}
                />
                <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Analyzing Complexion Undertones...
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Mapping chromatic spectrum against VEYRA's Mediterranean & Botanical fashion palettes.
                </p>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    background: 'rgba(184, 134, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <Camera size={32} />
                </div>

                <h3 className="font-display" style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Upload Your Portrait Photo
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem', maxWidth: '440px', margin: '0 auto 2rem auto' }}>
                  Natural daylight photos with clear facial visibility provide the most flattering color match.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-gold"
                    style={{ padding: '0.85rem 2rem' }}
                  >
                    <Upload size={18} />
                    <span>Upload Photo (JPG, PNG, WEBP)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file);
                    }}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Or Explore with Sample Profiles */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '1.25rem' }}>
                    Or Try Instant Sample Complexions
                  </span>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {sampleProfiles.map((sample) => (
                      <div
                        key={sample.label}
                        onClick={() => handleSelectSample(sample.img)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-md)',
                          transition: 'all 0.2s ease',
                        }}
                        className="glass-card"
                      >
                        <img
                          src={sample.img}
                          alt={sample.label}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--border-light)',
                          }}
                        />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {sample.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Consultation Board */}
        {recommendation && (
          <div>
            {/* Consultation Overview Card */}
            <div
              className="glass-panel studio-grid"
              style={{
                padding: '2.5rem',
                marginBottom: '3.5rem',
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 280px) 1fr',
                gap: '2.5rem',
                alignItems: 'center',
              }}
            >
              {/* Left Photo & Tone Badge */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 1.25rem auto' }}>
                  <img
                    src={selectedImage || ''}
                    alt="Analyzed Portrait"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--accent-gold)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: 'var(--accent-gold)',
                      color: '#fff',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={18} />
                  </div>
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '999px',
                    background: 'rgba(184, 134, 11, 0.15)',
                    color: 'var(--accent-gold)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {recommendation.undertone} Undertone
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => {
                      setRecommendation(null);
                      setSelectedImage(null);
                    }}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    <RefreshCw size={14} />
                    <span>Try Another Photo</span>
                  </button>
                </div>
              </div>

              {/* Right Stylist Editorial Recommendation */}
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                  {recommendation.paletteName}
                </span>
                <h2 className="font-display" style={{ fontSize: 'var(--font-size-h2)', color: 'var(--text-primary)', margin: '0.35rem 0 0.75rem 0' }}>
                  {recommendation.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                  {recommendation.description}
                </p>

                {/* Clickable Recommended Color Swatches */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>
                    Select a Recommended Shade to View Matching Styles:
                  </label>
                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                    {recommendation.recommendedColors.map((color) => {
                      const isSelected = activeSelectedColor?.hex === color.hex;
                      return (
                        <button
                          key={color.hex}
                          onClick={() => setActiveSelectedColor(color)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.55rem 0.9rem',
                            borderRadius: 'var(--radius-full)',
                            background: isSelected ? 'var(--text-primary)' : 'var(--bg-card)',
                            color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                            border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-light)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                          }}
                        >
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: color.hex,
                              border: color.hex === '#faf8f5' ? '1px solid #ccc' : '1px solid rgba(255,255,255,0.4)',
                            }}
                          />
                          <span style={{ fontSize: '0.825rem', fontWeight: 700 }}>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Product Showcase Filtered by Selected Color */}
            {activeSelectedColor && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      <Palette size={16} />
                      <span>Matching Pieces in {activeSelectedColor.name}</span>
                    </div>
                    <h3 className="font-display" style={{ fontSize: 'var(--font-size-h2)', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
                      Curated Styles for Your Palette
                    </h3>
                  </div>

                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {matchedProducts.length} Atelier Styles Available
                  </span>
                </div>

                {/* Matching 3D Product Cards Grid (True 3D WebGL Cards!) */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2.5rem',
                  }}
                >
                  {matchedProducts.map((product) => (
                    <ProductCard3D
                      key={product.id}
                      product={product}
                      initialColorHex={activeSelectedColor.hex}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
