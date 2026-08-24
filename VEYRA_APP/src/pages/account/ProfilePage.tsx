import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Address } from '../../types';
import { authService } from '../../services/authService';
import {
  User,
  MapPin,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Sparkles,
  Home,
  Eye,
  EyeOff,
  Package,
  Heart,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const user = useStore((state) => state.user);

  const addresses = useStore((state) => state.addresses);
  const orders = useStore((state) => state.orders);
  const addAddress = useStore((state) => state.addAddress);
  const updateAddress = useStore((state) => state.updateAddress);
  const deleteAddress = useStore((state) => state.deleteAddress);
  const setDefaultAddress = useStore((state) => state.setDefaultAddress);
  const updateCustomerProfile = useStore((state) => state.updateCustomerProfile);
  const changePassword = useStore((state) => state.changePassword);
  const addToast = useStore((state) => state.addToast);

  // Profile Editor State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Password Change State
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);

  // Address Modal / Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrFullName, setAddrFullName] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '+91 98765 43210');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Mumbai');
  const [addrState, setAddrState] = useState('Maharashtra');
  const [addrPostalCode, setAddrPostalCode] = useState('400001');
  const [addrCountry, setAddrCountry] = useState('India');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Live Password Strength Evaluation
  const passStrength = useMemo(() => {
    return authService.validatePasswordStrength(newPass);
  }, [newPass]);

  const strengthColor = useMemo(() => {
    if (passStrength.score <= 1) return '#ef4444';
    if (passStrength.score === 2) return '#f59e0b';
    if (passStrength.score === 3) return '#3b82f6';
    return '#10b981';
  }, [passStrength.score]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateCustomerProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
    });
    setIsEditingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    if (!passStrength.isValid) {
      setPassError(`Password requirements not met: ${passStrength.feedback.join(', ')}`);
      return;
    }

    setIsSubmittingPass(true);
    const res = await changePassword(currentPass, newPass);
    setIsSubmittingPass(false);

    if (res.success) {
      setIsChangingPass(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassError(res.error || 'Failed to change password. Please verify current password.');
    }
  };

  const handleOpenNewAddress = () => {
    setEditingAddressId(null);
    setAddrFullName(user?.name || '');
    setAddrPhone(user?.phone || '+91 98765 43210');
    setAddrStreet('');
    setAddrCity('Mumbai');
    setAddrState('Maharashtra');
    setAddrPostalCode('400001');
    setAddrCountry('India');
    setAddrIsDefault(addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrStreet(addr.street);
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPostalCode(addr.postalCode);
    setAddrCountry(addr.country);
    setAddrIsDefault(!!addr.isDefault);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!addrFullName || !addrStreet || !addrCity || !addrPostalCode) {
      addToast('error', 'Incomplete Details', 'Please fill in all mandatory address fields.');
      return;
    }

    if (editingAddressId) {
      // Update existing address
      updateAddress(editingAddressId, {
        fullName: addrFullName,
        phone: addrPhone,
        street: addrStreet,
        city: addrCity,
        state: addrState,
        postalCode: addrPostalCode,
        country: addrCountry,
        isDefault: addrIsDefault,
      });
      if (addrIsDefault) {
        setDefaultAddress(editingAddressId);
      }
      addToast('success', 'Address Updated', 'Delivery address details modified.');
    } else {
      // Create new address
      const newAddrId = `addr_${Date.now()}`;
      const newAddr: Address = {
        id: newAddrId,
        userId: user?.id || 'usr_client',
        fullName: addrFullName,
        phone: addrPhone,
        street: addrStreet,
        city: addrCity,
        state: addrState,
        postalCode: addrPostalCode,
        country: addrCountry,
        isDefault: addrIsDefault || addresses.length === 0,
      };
      addAddress(newAddr);
      if (addrIsDefault || addresses.length === 0) {
        setDefaultAddress(newAddrId);
      }
      addToast('success', 'Address Added', 'New delivery destination saved to address book.');
    }

    setIsAddressModalOpen(false);
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb & Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              <Sparkles size={14} />
              <span>VIP Atelier Client Portal</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Profile & Delivery Destinations
            </h1>
          </div>

          {/* Quick Subnav Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              to="/account"
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <Home size={14} />
              <span>Overview</span>
            </Link>
            <Link
              to="/account/orders"
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <Package size={14} />
              <span>My Orders ({orders.length})</span>
            </Link>
            <Link
              to="/wishlist"
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <Heart size={14} />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>

        {/* 1. VIP ACCOUNT STATS SUMMARY */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
              Membership Tier
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.35rem' }}>
              VIP Atelier Client
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Complimentary White-Glove Shipping & Bespoke Tailoring
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
              Saved Destinations
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {addresses.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {addresses.find((a) => a.isDefault)?.city || 'Global Destinations'}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
              Atelier Orders Placed
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {orders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              <Link to="/account/orders" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>
                View complete order history →
              </Link>
            </div>
          </div>
        </div>

        {/* 2. TWO-COLUMN LAYOUT: Left = Profile & Security, Right = Address Book */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 420px) 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Left Column: Personal Credentials & Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Personal Details Panel */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="var(--accent-gold)" />
                  <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    Personal Details
                  </h3>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setName(user?.name || '');
                      setPhone(user?.phone || '');
                      setIsEditingProfile(true);
                    }}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: 'unset' }}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      VIP Identifier (Email)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      Direct Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="submit" className="btn btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                      <Save size={14} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="btn btn-ghost"
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Name:</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {user?.name}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email:</span>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {user?.email}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone:</span>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {user?.phone || 'Not provided'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Panel */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} color="var(--accent-gold)" />
                  <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    Security & Password
                  </h3>
                </div>
                {!isChangingPass && (
                  <button
                    onClick={() => {
                      setIsChangingPass(true);
                      setPassError(null);
                    }}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: 'unset' }}
                  >
                    Change
                  </button>
                )}
              </div>

              {isChangingPass ? (
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {passError && (
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(220, 38, 38, 0.12)',
                        border: '1px solid rgba(220, 38, 38, 0.4)',
                        color: '#f87171',
                        fontSize: '0.78rem',
                      }}
                    >
                      {passError}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                      Current Password
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="••••••••••••"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>New Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                        <span>{showPass ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />

                    {newPass.length > 0 && (
                      <div style={{ marginTop: '0.4rem' }}>
                        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${(passStrength.score / 4) * 100}%`,
                              background: strengthColor,
                              transition: 'all 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>
                      Confirm New Password
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Re-enter new password"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingPass}
                      className="btn btn-gold"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      {isSubmittingPass ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPass(false)}
                      className="btn btn-ghost"
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Your VIP credentials are encrypted using SHA-256 with user-specific cryptographic salts.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Saved Delivery Address Book */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="var(--accent-gold)" />
                <h3 className="font-display" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  Delivery Address Book ({addresses.length})
                </h3>
              </div>

              <button
                onClick={handleOpenNewAddress}
                className="btn btn-gold"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                <Plus size={15} />
                <span>Add Destination</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                <MapPin size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.35rem' }}>No addresses saved yet</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
                  Add your residences or suites for fast white-glove checkout.
                </p>
                <button onClick={handleOpenNewAddress} className="btn btn-gold" style={{ padding: '0.6rem 1.25rem' }}>
                  Add First Address
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: addr.isDefault ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      background: addr.isDefault ? 'rgba(212, 175, 55, 0.04)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {addr.fullName}
                        </h4>
                        {addr.isDefault && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              background: 'var(--accent-gold)',
                              color: '#000',
                              fontWeight: 800,
                              letterSpacing: '0.05em',
                            }}
                          >
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {addr.street}
                        <br />
                        {addr.city}, {addr.state} - {addr.postalCode}
                        <br />
                        {addr.country}
                        <br />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Phone: {addr.phone}</span>
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1.25rem',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      {!addr.isDefault ? (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-gold)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Primary Shipping</span>
                      )}

                      <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            fontSize: '0.75rem',
                          }}
                          title="Edit Address"
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete address for ${addr.fullName}?`)) {
                              deleteAddress(addr.id);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--status-error)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            fontSize: '0.75rem',
                          }}
                          title="Delete Address"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. ADD / EDIT ADDRESS MODAL */}
        {isAddressModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(10px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: '2.25rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-gold)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="font-display" style={{ fontSize: '1.3rem', color: '#fff' }}>
                  {editingAddressId ? 'Edit Delivery Destination' : 'Add New Delivery Destination'}
                </h3>
                <button
                  onClick={() => setIsAddressModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    placeholder="e.g. Lord Alexander Vane"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Street Address & Suite / Penthouse
                  </label>
                  <input
                    type="text"
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="42 Mayfair Boulevard, Suite 8B"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="Mumbai"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      State / Province
                    </label>
                    <input
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="Maharashtra"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      Postal Code / PIN
                    </label>
                    <input
                      type="text"
                      required
                      value={addrPostalCode}
                      onChange={(e) => setAddrPostalCode(e.target.value)}
                      placeholder="400001"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={addrCountry}
                      onChange={(e) => setAddrCountry(e.target.value)}
                      placeholder="India"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                    Contact Phone for Delivery Logistics
                  </label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    style={{ accentColor: 'var(--accent-gold)' }}
                  />
                  <span>Set as default primary delivery address</span>
                </label>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <button type="submit" className="btn btn-gold" style={{ flex: 1, padding: '0.75rem' }}>
                    <span>{editingAddressId ? 'Update Destination' : 'Save New Address'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="btn btn-ghost"
                    style={{ padding: '0.75rem 1.25rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
