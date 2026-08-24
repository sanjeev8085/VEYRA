import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  Shield,
  Layers,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

import { AdminRole } from '../../types';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/admin';

  const adminLogin = useStore((state) => state.adminLogin);

  const [email, setEmail] = useState('admin@veyra.luxury');
  const [password, setPassword] = useState('atelier_admin_2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const adminRolesInfo: {
    role: AdminRole;
    label: string;
    email: string;
    pass: string;
    icon: typeof Shield;
    desc: string;
  }[] = [
    {
      role: 'super_admin',
      label: 'Super Admin',
      email: 'admin@veyra.luxury',
      pass: 'atelier_admin_2026',
      icon: ShieldCheck,
      desc: 'Full Atelier control (Catalog, Orders, CMS, Inventory, Team)',
    },
    {
      role: 'product_manager',
      label: 'Product Manager',
      email: 'pm@veyra.luxury',
      pass: 'pm_luxury_2026',
      icon: Layers,
      desc: 'Catalog CRUD, 3D Assets, Inventory Matrix, Coupons, CMS',
    },
    {
      role: 'order_manager',
      label: 'Order Manager',
      email: 'orders@veyra.luxury',
      pass: 'orders_atelier_2026',
      icon: ShoppingBag,
      desc: 'Orders pipeline, fulfillment dispatch, customer CRM',
    },
  ];

  const handleRoleSelect = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await adminLogin(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-primary) 100%)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2.5rem 2.25rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-lg)',
          margin: '0 1rem',
        }}
      >
        {/* Header Icon & Brand */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(184, 134, 11, 0.12)',
              border: '1px solid rgba(184, 134, 11, 0.3)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <Lock size={24} />
          </div>

          <span className="font-display gold-gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.18em' }}>
            VEYRA
          </span>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.25rem' }}>
            Atelier Management & RBAC Portal
          </div>
        </div>

        {/* Role Presets Switcher */}
        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} />
            <span>Select Role for Testing (1-Click Switch)</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {adminRolesInfo.map((info) => {
              const Icon = info.icon;
              const isSelected = email === info.email;
              return (
                <button
                  key={info.role}
                  type="button"
                  onClick={() => handleRoleSelect(info.email, info.pass)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.04)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={16} color={isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)'} />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                        {info.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{info.desc}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'var(--accent-gold)', color: '#000', fontWeight: 800 }}>
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: 'var(--status-error)',
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
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Atelier Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@veyra.luxury"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.8rem',
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
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.8rem',
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-gold"
            style={{
              padding: '0.85rem',
              fontSize: '0.9rem',
              marginTop: '0.4rem',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Enter Atelier Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1.5rem' }}>
          <ShieldCheck size={13} color="var(--accent-gold)" />
          <span>Encrypted Session · Role-Based Access Control</span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textDecoration: 'none' }}>
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AdminLoginPage;
