import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = useStore((state) => state.user);

  if (!isOpen) return null;

  const links = [
    { label: 'Home', path: '/' },
    { label: 'T-Shirts Collection', path: '/catalog?category=t-shirts' },
    { label: 'Artisanal Shirts', path: '/catalog?category=shirts' },
    { label: 'All Collections', path: '/catalog' },
    { label: 'Find Your Palette', path: '/find-your-colors', highlight: true },
    { label: 'The Fitting Atelier', path: '/studio' },
    { label: 'Track Your Order', path: '/orders/track' },
    { label: 'Customer Account', path: user?.role.includes('admin') ? '/admin' : '/account' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Slide Drawer */}
      <div
        style={{
          position: 'relative',
          width: '85%',
          maxWidth: '360px',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          zIndex: 101,
          animation: 'fadeIn 0.25s ease-out',
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <div className="font-display gold-gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.18em' }}>
              VEYRA
            </div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
              Atelier Menswear
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              padding: '0.5rem',
              cursor: 'pointer',
            }}
            aria-label="Close drawer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, overflowY: 'auto' }}>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: link.highlight
                    ? 'rgba(184, 134, 11, 0.1)'
                    : isActive
                    ? 'var(--bg-card)'
                    : 'transparent',
                  border: link.highlight ? '1px solid rgba(184, 134, 11, 0.3)' : '1px solid transparent',
                  color: link.highlight || isActive ? 'var(--accent-gold)' : 'var(--text-primary)',
                  fontWeight: link.highlight || isActive ? 700 : 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {link.highlight && <Sparkles size={16} />}
                  <span>{link.label}</span>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </Link>
            );
          })}
        </nav>

        {/* Drawer Bottom Concierge info */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Need style advice?
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
            concierge@veyra-atelier.com
          </div>
        </div>
      </div>
    </div>
  );
};
