import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useStore } from '../../store/useStore';
import {
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';


export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const addToast = useStore((state) => state.addToast);

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const res = await authService.requestPasswordReset(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessInfo(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      setStep(2);
      addToast('info', 'Reset Token Generated', 'Check the verification message.');
    } else {
      setErrorMsg('Failed to process reset request.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await authService.resetPassword(email, resetToken, newPassword);
    setIsLoading(false);

    if (res.success) {
      addToast('success', 'Password Reset Successful', 'Your account credentials have been updated.');
      navigate('/auth/login');
    } else {
      setErrorMsg(res.message || 'Failed to update password.');
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
          maxWidth: '480px',
          padding: '2.5rem 2.25rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          margin: '0 1rem',
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
            <KeyRound size={22} />
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
            {step === 1 ? 'Recover VIP Credentials' : 'Set New Secure Password'}
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {step === 1
              ? 'Enter your registered email to receive a recovery token'
              : 'Enter your verification token and your new password'}
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

        {/* Info Banner */}
        {successInfo && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--border-gold)',
              color: 'var(--accent-gold)',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
              lineHeight: 1.5,
            }}
          >
            {successInfo}
          </div>
        )}

        {/* Step 1: Request Token Form */}
        {step === 1 ? (
          <form onSubmit={handleRequestToken} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
                Registered Email Address
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
                  placeholder="alexander@veyra.luxury"
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
                <span>Dispatching Security Token...</span>
              ) : (
                <>
                  <span>Send Recovery Token</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Reset Form */
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
                Verification Token
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="e.g. VYR_RST_..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--accent-gold)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  outline: 'none',
                  letterSpacing: '0.08em',
                }}
              />
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
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
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
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: confirmPassword && confirmPassword !== newPassword ? '1px solid #ef4444' : '1px solid var(--border-light)',
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
                marginTop: '0.5rem',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save New Password & Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link
            to="/auth/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--text-secondary)',
              fontSize: '0.825rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Sign In</span>
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
          <span>Single-Use Cryptographic Reset Tokens</span>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
