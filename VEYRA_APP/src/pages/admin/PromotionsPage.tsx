import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Coupon } from '../../types';
import {
  Tag,
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Percent,
  Search,
  X,
} from 'lucide-react';


export const PromotionsPage: React.FC = () => {
  const coupons = useStore((state) => state.coupons);
  const addCoupon = useStore((state) => state.addCoupon);
  const deleteCoupon = useStore((state) => state.deleteCoupon);
  const addToast = useStore((state) => state.addToast);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState<number>(20);
  const [newMinSpend, setNewMinSpend] = useState<number>(3000);
  const [newMaxDiscount, setNewMaxDiscount] = useState<number>(10000);
  const [newExpiry, setNewExpiry] = useState<string>('2026-12-31');

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      addToast('error', 'Invalid Code', 'Please provide a valid coupon voucher code.');
      return;
    }

    const created: Coupon = {
      id: `cpn_${newCode.toLowerCase()}_${Date.now().toString(36)}`,
      code: newCode.trim().toUpperCase(),
      type: newType,
      value: newValue,
      minCartValue: newMinSpend > 0 ? newMinSpend : undefined,
      maxDiscount: newType === 'percentage' && newMaxDiscount > 0 ? newMaxDiscount : undefined,
      validUntil: `${newExpiry}T23:59:59Z`,
      isActive: true,
      usageCount: 0,
    };

    addCoupon(created);
    addToast('success', 'Promotion Activated', `Voucher ${created.code} is now live.`);
    setShowCreateModal(false);
    setNewCode('');
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to deactivate and remove coupon ${code}?`)) {
      deleteCoupon(id);
      addToast('info', 'Promotion Removed', `Coupon ${code} has been decommissioned.`);
    }
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link to="/admin" style={{ color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} />
            <span>Admin Dashboard</span>
          </Link>
          <span>/</span>
          <span>Promotions & Coupons</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              <Sparkles size={14} />
              <span>Marketing & Client Incentives</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Promotions & Coupons Manager
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Create bespoke promotion codes, set minimum spends, and monitor discount redemptions.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-gold"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>Create New Promo Code</span>
          </button>
        </div>

        {/* Executive Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Active Promotions
              </span>
              <Tag size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {coupons.filter((c) => c.isActive).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Available for customer checkout
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Codes Defined
              </span>
              <Percent size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {coupons.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Lifetime promotional campaigns
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '1.75rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search promo code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Coupons Table */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div className="table-responsive" style={{ border: 'none', borderRadius: 0, marginBottom: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Voucher Code</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Benefit Value</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Spend Threshold</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Expiry Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ padding: '0.35rem 0.65rem', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                          {coupon.code}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '1.25rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {coupon.type === 'percentage' ? `${coupon.value}% Off` : `₹${coupon.value} Flat Off`}
                      </strong>
                      {coupon.maxDiscount && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Max cap: ₹{coupon.maxDiscount.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {coupon.minCartValue ? `Min Spend: ₹${coupon.minCartValue.toLocaleString('en-IN')}` : 'No minimum spend'}
                    </td>

                    <td style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} />
                        <span>{new Date(coupon.validUntil || '').toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          background: coupon.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: coupon.isActive ? 'var(--status-success)' : '#ef4444',
                        }}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.35rem' }}
                        title="Deactivate Coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CREATE COUPON MODAL */}
        {showCreateModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 110,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
          >
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-gold)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <Tag size={14} />
                  <span>Create Promotion Voucher</span>
                </div>
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                    Voucher Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AUTUMN30"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-gold)',
                      color: 'var(--accent-gold)',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                      Discount Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as 'percentage' | 'fixed')}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Flat Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                      Value ({newType === 'percentage' ? '%' : '₹'})
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newValue}
                      onChange={(e) => setNewValue(parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                      Min Cart Spend (₹)
                    </label>
                    <input
                      type="number"
                      value={newMinSpend}
                      onChange={(e) => setNewMinSpend(parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                      Max Discount Cap (₹)
                    </label>
                    <input
                      type="number"
                      value={newMaxDiscount}
                      onChange={(e) => setNewMaxDiscount(parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                      Valid Until Date
                    </label>
                    <input
                      type="date"
                      value={newExpiry}
                      onChange={(e) => setNewExpiry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-gold" style={{ flex: 1, padding: '0.75rem' }}>
                    Activate Voucher
                  </button>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost" style={{ padding: '0.75rem 1rem' }}>
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

export default PromotionsPage;
