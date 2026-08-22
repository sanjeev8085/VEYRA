import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  User as UserIcon,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const setCartDrawerOpen = useStore((state) => state.setCartDrawerOpen);
  const setSearchOpen = useStore((state) => state.setSearchOpen);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'T-Shirts', path: '/catalog?category=t-shirts' },
    { label: 'Shirts', path: '/catalog?category=shirts' },
    { label: 'Collections', path: '/catalog' },
    { label: 'Fitting Atelier', path: '/studio' },
    { label: 'Find Your Palette', path: '/find-your-colors', highlight: true },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.4s var(--ease-luxury)',
        background: isScrolled
          ? 'var(--bg-glass)'
          : 'linear-gradient(to bottom, var(--bg-primary) 0%, rgba(250, 248, 245, 0.4) 100%)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Left: Mobile Menu Trigger & Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={onOpenMobileMenu}
            className="mobile-only-btn btn btn-ghost"
            style={{
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
            }}
            aria-label="Open menu"
          >
            <Menu size={22} color="var(--text-primary)" />
          </button>

          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
            }}
          >
            <span
              className="font-display gold-gradient-text"
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
              }}
            >
              VEYRA
            </span>
          </Link>
        </div>

        {/* Center: Clean Luxury Editorial Navigation */}
        <nav
          className="desktop-nav"
          style={{
            alignItems: 'center',
            gap: '2.5rem',
          }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            if (link.highlight) {
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(184, 134, 11, 0.08)',
                    border: '1px solid rgba(184, 134, 11, 0.25)',
                    color: 'var(--accent-gold)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Sparkles size={13} />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  transition: 'color 0.25s ease',
                  position: 'relative',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions (Theme Toggle, Search, Wishlist, Bag, Account) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="btn btn-ghost"
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              color: 'var(--text-primary)',
              minWidth: '40px',
              minHeight: '40px',
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#d4af37" />}
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="btn btn-ghost"
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              color: 'var(--text-primary)',
              minWidth: '40px',
              minHeight: '40px',
            }}
            aria-label="Search catalog"
          >
            <Search size={18} />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="btn btn-ghost"
            style={{
              position: 'relative',
              padding: '0.5rem',
              borderRadius: '50%',
              color: 'var(--text-primary)',
              minWidth: '40px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Wishlist"
          >
            <Heart size={18} />
            {wishlist.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'var(--accent-terracotta)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Shopping Bag */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="btn btn-ghost"
            style={{
              position: 'relative',
              padding: '0.5rem',
              borderRadius: '50%',
              color: 'var(--text-primary)',
              minWidth: '40px',
              minHeight: '40px',
            }}
            aria-label="Shopping bag"
          >
            <ShoppingBag size={18} />
            {totalCartItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'var(--accent-gold)',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Account */}
          <Link
            to="/account"
            className="btn btn-ghost"
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              color: 'var(--text-primary)',
              minWidth: '40px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="User account"
          >
            <UserIcon size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
};
