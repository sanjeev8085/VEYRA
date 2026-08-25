import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ProductCard3D } from '../../components/catalog/ProductCard3D';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const activeCollection = searchParams.get('collection') || 'all';

  const products = useStore((state) => state.products);

  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedFit, setSelectedFit] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');

  const categories = [
    { id: 'all', label: 'All Garments' },
    { id: 't-shirts', label: 'T-Shirts' },
    { id: 'shirts', label: 'Shirts' },
    { id: 'jackets', label: 'Outerwear' },
  ];

  const colorPaletteFilters = [
    { name: 'all', label: 'All Shades', hex: 'transparent' },
    { name: 'Sage', label: 'Botanical Sage', hex: '#6c8a66' },
    { name: 'Terracotta', label: 'Earthy Terracotta', hex: '#c45b38' },
    { name: 'Ivory', label: 'Ivory Linen', hex: '#faf8f5' },
    { name: 'Sky Blue', label: 'Capri Sky Blue', hex: '#4a7c9f' },
    { name: 'Navy', label: 'Midnight Navy', hex: '#1f3044' },
    { name: 'Burgundy', label: 'Vintage Burgundy', hex: '#722f37' },
    { name: 'Sand', label: 'Warm Sand', hex: '#d8caa8' },
  ];

  const sizes = ['all', 'S', 'M', 'L', 'XL'];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Exclude archived/drafts from customer catalog unless published
        if (product.status === 'archived' || product.status === 'draft') {
          return false;
        }
        // Category filter
        if (activeCategory !== 'all' && product.category !== activeCategory) {
          return false;
        }
        // Collection filter
        if (activeCollection !== 'all' && !product.collectionIds.includes(activeCollection)) {
          return false;
        }
        // Size filter
        if (selectedSize !== 'all' && !product.variants.some((v) => v.size === selectedSize)) {
          return false;
        }
        // Color filter
        if (
          selectedColor !== 'all' &&
          !product.variants.some(
            (v) =>
              v.colorName.toLowerCase().includes(selectedColor.toLowerCase()) ||
              (v.colorFamily && v.colorFamily.toLowerCase() === selectedColor.toLowerCase())
          )
        ) {
          return false;
        }
        // Fit filter
        if (selectedFit !== 'all' && product.fit !== selectedFit) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, activeCategory, activeCollection, selectedSize, selectedColor, selectedFit, sortBy]);

  const handleCategoryChange = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Catalog Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            <Sparkles size={14} />
            <span>Complete Wardrobe Collection</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.35rem', color: 'var(--text-primary)' }}>
            The Full Catalog
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '560px', marginTop: '0.5rem' }}>
            Explore our artisanal collection of Peruvian Supima T-Shirts and Normandy Linen Shirts with real-time silhouette views and dynamic color swatches.
          </p>
        </div>

        {/* Category Pill Tabs */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  padding: '0.65rem 1.35rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--text-primary)' : 'var(--bg-card)',
                  color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                  border: isActive ? '1px solid var(--text-primary)' : '1px solid var(--border-light)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar (Colors, Sizes, Sort) */}
        <div
          className="glass-panel"
          style={{
            padding: 'clamp(1rem, 2.5vw, 1.5rem)',
            marginBottom: '3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            overflow: 'hidden',
          }}
        >
          {/* Color Swatch Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              Shade:
            </span>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {colorPaletteFilters.map((c) => {
                const isSelected = selectedColor === c.name;
                if (c.name === 'all') {
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor('all')}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        background: isSelected ? 'var(--text-primary)' : 'transparent',
                        color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      All
                    </button>
                  );
                }

                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: c.hex,
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid rgba(40,30,20,0.15)',
                      transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: isSelected ? '0 0 8px rgba(184, 134, 11, 0.35)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    title={c.label}
                  />
                );
              })}
            </div>
          </div>

          {/* Size & Sorting Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {/* Fit Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Fit:
              </span>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {['all', 'Relaxed', 'Regular', 'Oversized'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFit(f)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedFit === f ? 'var(--text-primary)' : 'var(--bg-card)',
                      color: selectedFit === f ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Size:
              </span>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedSize === s ? 'var(--text-primary)' : 'var(--bg-card)',
                      color: selectedSize === s ? 'var(--bg-primary)' : 'var(--text-primary)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={14} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Sparkles size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Garments Match Your Filter
            </h3>
            <p style={{ fontSize: '0.9rem' }}>Try clearing your shade or size filters to view more styles.</p>
            <button
              onClick={() => {
                setSelectedSize('all');
                setSelectedColor('all');
                handleCategoryChange('all');
              }}
              className="btn btn-outline"
              style={{ marginTop: '1.5rem' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
