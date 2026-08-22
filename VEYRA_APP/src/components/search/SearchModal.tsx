import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { SEED_PRODUCTS } from '../../data/seedData';
import { Search, X, ArrowRight, Box } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const isOpen = useStore((state) => state.isSearchOpen);
  const onClose = () => useStore.getState().setSearchOpen(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SEED_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.variants.some((v) => v.colorName.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5rem 1rem 2rem 1rem',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 5, 8, 0.88)',
          backdropFilter: 'blur(16px)',
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 121,
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={22} color="var(--accent-gold)" />
          <input
            type="text"
            placeholder="Search obsidian jackets, silk shirts, collections..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1.1rem',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#fff',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>

        {/* Search Results / Suggestions */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '1.25rem' }}>
          {query.trim() === '' ? (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                Trending Searches
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Obsidian Trench', 'Cyber Bomber', 'Haute Silk', '3D Fitting Studio', 'Monaco Riviera'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.4rem 0.9rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              No garments found matching "{query}". Try searching for jackets, shirts, or colors.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{product.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{product.brand}</span>
                        <span>·</span>
                        <span style={{ color: 'var(--accent-gold)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                        {product.threeDClothingUrl && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--accent-gold)' }}>
                            <Box size={12} /> 3D
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
