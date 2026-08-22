import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { SEED_PRODUCTS } from '../../data/seedData';
import { ProductCard3D } from '../../components/catalog/ProductCard3D';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const wishlistIds = useStore((state) => state.wishlist);
  const wishlistProducts = SEED_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700 }}>
            Curated Favorites
          </span>
          <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
            Private Wishlist ({wishlistProducts.length})
          </h1>
        </div>

        {wishlistProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)' }}>
            <Heart size={48} strokeWidth={1} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>Save your favorite 3D garments to review later.</p>
            <Link to="/catalog" className="btn btn-gold">
              Explore 3D Collection
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {wishlistProducts.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
