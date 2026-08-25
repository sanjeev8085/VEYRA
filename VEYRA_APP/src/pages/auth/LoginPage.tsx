import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { authService } from '../../services/authService';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
  ShoppingBag,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || (location.state as any)?.from?.pathname || '/account';

  const loginCustomer = useStore((state) => state.loginCustomer);
  const initGuestSession = useStore((state) => state.initGuestSession);

  const [email, setEmail] = useState('alexander@veyra.luxury');
  const [password, setPassword] = useState('LuxuryVIP2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const demoAccounts = authService.getDemoAccounts().filter((a) => a.role === 'customer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await loginCustomer({
      email,
      password,
      rememberMe,
    });

    setIsLoading(false);

    if (res.success) {
      navigate(redirectTarget, { replace: true });
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleDemoSelect = (accountEmail: string, accountPass: string) => {
    setEmail(accountEmail);
    setPassword(accountPass);
    setErrorMsg(null);
  };

  const handleContinueAsGuest = () => {
    initGuestSession();
    navigate(redirectTarget === '/account' ? '/catalog' : redirectTarget, { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.08) 0%, var(--bg-primary) 70%)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: 'clamp(1.25rem, 3.5vw, 2.5rem) clamp(1rem, 3vw, 2.25rem)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          margin: '0 clamp(0.5rem, 2vw, 1rem)',
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem auto',
            }}
          >
            <Sparkles size={22} />
          </div>

          <span
            className="font-display gold-gradient-text"
            style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.15em' }}
          >
            VEYRA
          </span>
          <h2
            className="font-display"
            style={{
              fontSize: '1.25rem',
              color: '#fff',
              marginTop: '0.25rem',
              fontWeight: 600,
            }}
          >
            VIP Client Sign In
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Access your curated bespoke wardrobe & orders
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <UserCheck size={13} />
            <span>Fast Demo Sign In (1-Click)</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleDemoSelect(acc.email, acc.pass)}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: email === acc.email ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                  color: email === acc.email ? '#000' : 'var(--text-primary)',
                  border: email === acc.email ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontWeight: email === acc.email ? 700 : 500,
                  transition: 'all 0.2s ease',
                }}
              >
                {acc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(220, 38, 38, 0.12)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              color: '#f87171',
              fontSize: '0.825rem',
              marginBottom: '1.25rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxury.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-primary)',
                }}
              >
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--accent-gold)',
                  textDecoration: 'none',
                }}
              >
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 2.75rem 0.75rem 2.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent-gold)' }}
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-gold"
            style={{
              padding: '0.85rem',
              fontSize: '0.9rem',
              marginTop: '0.35rem',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to VIP Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Separator / Guest Option */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Or
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        <button
          type="button"
          onClick={handleContinueAsGuest}
          className="btn btn-outline"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <ShoppingBag size={15} />
          <span>Continue as Guest Shopper</span>
        </button>

        {/* Register CTA */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          <span>Not yet a VIP member? </span>
          <Link
            to={`/auth/register${redirectTarget !== '/account' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
            style={{ color: 'var(--accent-gold)', fontWeight: 700, textDecoration: 'none' }}
          >
            Register for Atelier Privileges
          </Link>
        </div>

        {/* Security badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            marginTop: '1.5rem',
          }}
        >
          <ShieldCheck size={13} color="var(--accent-gold)" />
          <span>End-to-End Cryptographic Session Security</span>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
