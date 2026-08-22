import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '5rem 0 2.5rem 0',
        marginTop: '6rem',
        transition: 'background-color 0.4s ease',
      }}
    >
      <div className="container">
        {/* Luxury Guarantees Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(184, 134, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>White-Glove Delivery</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Complimentary over ₹1,999</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(184, 134, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Bespoke Fitting</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Silhouette drape & palette styling</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(184, 134, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
              }}
            >
              <RefreshCw size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>30-Day Atelier Returns</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Doorstep courier pickup</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(184, 134, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>100% Organic Yarns</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Peruvian Supima & French Flax</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1.5fr) repeat(auto-fit, minmax(160px, 1fr))',
            gap: '3rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Brand Info & Newsletter */}
          <div>
            <span className="font-display gold-gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.2em' }}>
              VEYRA
            </span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: '1rem 0 1.5rem 0', maxWidth: '340px' }}>
              Sculptural contemporary menswear tailored with Peruvian Supima cotton and Normandy linen.
            </p>

            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                Atelier Journal & Private Releases
              </label>
              <div style={{ display: 'flex', maxWidth: '360px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button
                  className="btn btn-gold"
                  style={{
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    padding: '0 1.25rem',
                    minWidth: 'unset',
                  }}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Column 1: Wardrobe */}
          <div>
            <h4 style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Collection
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/catalog?category=t-shirts" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Peruvian Supima Tees
              </Link>
              <Link to="/catalog?category=shirts" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Normandy Linen Shirts
              </Link>
              <Link to="/catalog?category=shirts" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Oxford Button-Downs
              </Link>
              <Link to="/find-your-colors" style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                Find Your Palette
              </Link>
            </div>
          </div>

          {/* Column 2: Atelier Services */}
          <div>
            <h4 style={{ fontSize: '0.825rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Concierge
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/orders/track" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Track Order
              </Link>
              <Link to="/account" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Customer Account
              </Link>
              <Link to="/admin" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Atelier CMS Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} VEYRA Atelier Pvt Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Atelier Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
