import React, { useState } from 'react';
import { ThreeCanvas } from '../../components/three/ThreeCanvas';
import { ViewportControls } from '../../components/three/ViewportControls';
import { FallbackGallery } from '../../components/product/FallbackGallery';
import { SEED_AVATARS } from '../../data/seedData';
import { useStore } from '../../store/useStore';
import { ShoppingBag, Sparkles, User, Layers, Palette, RotateCw, Eye, Box } from 'lucide-react';

export const Studio3DPage: React.FC = () => {
  const activeAvatarId = useStore((state) => state.activeAvatarId);
  const setActiveAvatarId = useStore((state) => state.setActiveAvatarId);
  const addToCart = useStore((state) => state.addToCart);
  const products = useStore((state) => state.products);

  // Active outfit pieces & view mode
  const [activeCategory, setActiveCategory] = useState<'t-shirts' | 'shirts' | 'jackets' | 'trousers'>('t-shirts');
  const [selectedGarmentColor, setSelectedGarmentColor] = useState('#6c8a66');
  const [selectedGarmentColorName, setSelectedGarmentColorName] = useState('Botanical Sage');
  const [viewFormat, setViewFormat] = useState<'3d' | 'lookbook360'>('3d');

  // Selected avatar object
  const currentAvatar = SEED_AVATARS.find((a) => a.id === activeAvatarId) || SEED_AVATARS[0];
  const isFemale = currentAvatar.gender === 'female';

  // Products filtered by active category & avatar compatibility
  const categoryProducts = products.filter(
    (p) => p.category === activeCategory && p.status === 'published'
  );
  const [selectedProduct, setSelectedProduct] = useState(categoryProducts[0] || products[0]);

  const studioColorPalette = [
    { name: 'Botanical Sage', hex: '#6c8a66' },
    { name: 'Earthy Terracotta', hex: '#c45b38' },
    { name: 'Ivory Linen', hex: '#faf8f5' },
    { name: 'Capri Sky Blue', hex: '#4a7c9f' },
    { name: 'Vintage Burgundy', hex: '#722f37' },
    { name: 'Warm Sand', hex: '#d8caa8' },
    { name: 'Sunlit Coral', hex: '#d96b58' },
    { name: 'Midnight Navy', hex: '#1f3044' },
  ];

  return (
    <div
      style={{
        paddingTop: '76px',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1fr) 420px',
        }}
        className="studio-grid"
      >
        {/* Left Fullscreen Fitting Atelier Canvas */}
        <div
          style={{
            position: 'relative',
            background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-secondary) 100%)',
            minHeight: '520px',
            overflow: 'hidden',
          }}
        >
          {viewFormat === '3d' ? (
            <>
              {/* Main Canvas Scene */}
              <ThreeCanvas
                garmentType={activeCategory}
                garmentColorHex={selectedGarmentColor}
                isFemale={isFemale}
              />

              {/* Viewport Controls */}
              <ViewportControls />

              {/* Silhouette Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  zIndex: 10,
                }}
              >
                <RotateCw size={13} />
                <span>Fitting: {currentAvatar.name.split('—')[0]}</span>
              </div>
            </>
          ) : (
            <FallbackGallery
              garmentType={activeCategory}
              garmentColorHex={selectedGarmentColor}
              garmentColorName={selectedGarmentColorName}
              productName={selectedProduct?.name}
              height="100%"
              onSwitchTo3D={() => setViewFormat('3d')}
              canSwitchTo3D={true}
            />
          )}

          {/* Mode Switcher on Top Right */}
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
              title="High-Res 360° Studio Lookbook"
            >
              <Eye size={13} />
              <span>360° Photo</span>
            </button>
          </div>
        </div>

        {/* Right Studio Outfit & Customization Control Panel */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: '2.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.35rem' }}>
              <Sparkles size={14} />
              <span>Interactive Dressing Room</span>
            </div>

            <h2 className="font-display" style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '1.75rem' }}>
              The Fitting Atelier
            </h2>

            {/* 1. Avatar Model Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <User size={14} />
                <span>Choose Model Silhouette</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {SEED_AVATARS.map((avatar) => {
                  const isSelected = activeAvatarId === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => setActiveAvatarId(avatar.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(184, 134, 11, 0.12)' : 'var(--bg-primary)',
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <img
                        src={avatar.previewImageUrl}
                        alt={avatar.name}
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {avatar.name.split('—')[0]}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {avatar.gender} • {avatar.heightCm} cm
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Garment Category Tabs */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Layers size={14} />
                <span>Garment Category</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {(['t-shirts', 'shirts', 'jackets', 'trousers'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      const catProds = products.filter((p) => p.category === cat && p.status === 'published');
                      if (catProds.length > 0) setSelectedProduct(catProds[0]);
                    }}
                    style={{
                      padding: '0.6rem 0.25rem',
                      borderRadius: 'var(--radius-sm)',
                      background: activeCategory === cat ? 'var(--text-primary)' : 'var(--bg-primary)',
                      color: activeCategory === cat ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Real-Time Material Color Swatches */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Palette size={14} />
                  <span>Garment Shade</span>
                </label>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  {selectedGarmentColorName}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {studioColorPalette.map((color) => {
                  const isSelected = selectedGarmentColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => {
                        setSelectedGarmentColor(color.hex);
                        setSelectedGarmentColorName(color.name);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: color.hex,
                        border: isSelected ? '2px solid var(--accent-gold)' : '1px solid rgba(40,30,20,0.15)',
                        boxShadow: isSelected ? '0 0 10px rgba(184, 134, 11, 0.4)' : 'none',
                        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
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

          {/* Active Piece Summary & Add to Cart */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                  Selected Style
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedProduct?.name || 'Selected Garment'}
                </div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                ₹{(selectedProduct?.price || 1799).toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedProduct) {
                  addToCart(
                    selectedProduct,
                    'M',
                    selectedGarmentColorName,
                    selectedGarmentColor
                  );
                }
              }}
              className="btn btn-gold"
              style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
            >
              <ShoppingBag size={18} />
              <span>Add Look to Shopping Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
