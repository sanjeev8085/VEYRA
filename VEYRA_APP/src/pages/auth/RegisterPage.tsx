import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { authService } from '../../services/authService';
import {
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';


export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/account';

  const registerCustomer = useStore((state) => state.registerCustomer);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Password Strength Evaluation
  const strength = useMemo(() => {
    return authService.validatePasswordStrength(password);
  }, [password]);

  const strengthColor = useMemo(() => {
    if (strength.score <= 1) return '#ef4444'; // Red
    if (strength.score === 2) return '#f59e0b'; // Amber
    if (strength.score === 3) return '#3b82f6'; // Blue
    return '#10b981'; // Green
  }, [strength.score]);

  const strengthLabel = useMemo(() => {
    if (!password) return 'None';
    if (strength.score <= 1) return 'Weak';
    if (strength.score === 2) return 'Fair';
    if (strength.score === 3) return 'Strong';
    return 'Flawless & Atelier-Grade';
  }, [password, strength.score]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (!strength.isValid) {
      setErrorMsg(`Password requirements not satisfied: ${strength.feedback.join(', ')}`);
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please agree to the VIP Atelier terms and conditions.');
      return;
    }

    setIsLoading(true);

    const res = await registerCustomer({
      name,
      email,
      password,
      phone: phone || undefined,
    });

    setIsLoading(false);

    if (res.success) {
      navigate(redirectTarget, { replace: true });
    } else {
      setErrorMsg(res.error || 'Registration failed. Please try again.');
    }
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
          maxWidth: '520px',
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
            Create VIP Client Profile
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Enjoy bespoke fittings, 3D try-on saves, and concierge checkout
          </p>
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

        {/* Registration Form */}
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
              Full Legal Name
            </label>
            <div style={{ position: 'relative' }}>
              <UserIcon
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lord Julian Sterling"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@luxury.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.825rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

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
                Phone (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.825rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

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
              Security Password
            </label>
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
                placeholder="Min 8 chars, 1 uppercase, 1 symbol"
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
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Live Password Strength Meter */}
            {password.length > 0 && (
              <div style={{ marginTop: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Strength:</span>
                  <span style={{ color: strengthColor, fontWeight: 700 }}>{strengthLabel}</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(strength.score / 4) * 100}%`,
                      background: strengthColor,
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

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
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: confirmPassword && confirmPassword !== password ? '1px solid #ef4444' : '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ accentColor: 'var(--accent-gold)', marginTop: '0.2rem' }}
            />
            <span>
              I agree to the VEYRA Atelier Terms of VIP Membership, Confidentiality, and Privileged Communications.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-gold"
            style={{
              padding: '0.85rem',
              fontSize: '0.9rem',
              marginTop: '0.5rem',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <span>Creating VIP Profile...</span>
            ) : (
              <>
                <span>Complete VIP Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Existing Client Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          <span>Already registered? </span>
          <Link
            to={`/auth/login${redirectTarget !== '/account' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
            style={{ color: 'var(--accent-gold)', fontWeight: 700, textDecoration: 'none' }}
          >
            Sign In to Existing Account
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
          <span>Encrypted Credentials · Zero Third-Party Tracking</span>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
