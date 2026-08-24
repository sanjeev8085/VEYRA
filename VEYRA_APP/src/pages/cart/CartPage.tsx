import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { SEED_COUPONS } from '../../data/seedData';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const getCartSubtotal = useStore((state) => state.getCartSubtotal);
  const getCartDiscount = useStore((state) => state.getCartDiscount);
  const getCartTax = useStore((state) => state.getCartTax);
  const getCartShipping = useStore((state) => state.getCartShipping);
  const getCartTotal = useStore((state) => state.getCartTotal);

  const appliedCoupon = useStore((state) => state.appliedCoupon);
  const applyCoupon = useStore((state) => state.applyCoupon);
  const removeCoupon = useStore((state) => state.removeCoupon);
  const addToast = useStore((state) => state.addToast);

  const [couponInput, setCouponInput] = useState('');

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const tax = getCartTax();
  const shipping = getCartShipping();
  const total = getCartTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const match = SEED_COUPONS.find(
      (c) => c.code.toUpperCase() === couponInput.trim().toUpperCase() && c.isActive
    );
    if (match) {
      const minVal = match.minCartValue || match.minOrderAmount;
      if (minVal && subtotal < minVal) {
        addToast('error', 'Minimum Cart Not Met', `Coupon requires minimum order of ₹${minVal.toLocaleString('en-IN')}`);
        return;
      }
      applyCoupon(match);
      setCouponInput('');
    } else {
      addToast('error', 'Invalid Coupon', 'Code not recognized or expired. Try SUMMER30 or WELCOME10.');
    }
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700 }}>
            Order Bag
          </span>
          <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.5rem', color: '#fff' }}>
            Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto 1.5rem', color: 'rgba(255,255,255,0.2)' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Your Bag is Empty</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>Discover our tailored 3D fashion pieces.</p>
            <Link to="/catalog" className="btn btn-primary">
              Shop Collections
            </Link>
          </div>
        ) : (
          <div
            className="responsive-grid-checkout"
            style={{
              alignItems: 'start',
            }}
          >
            {/* Left Items Table */}
            <div className="glass-panel" style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      paddingBottom: '1.5rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <img
                      src={item.imageUrl || item.image || ''}
                      alt={item.productName}
                      style={{ width: 'clamp(64px, 18vw, 90px)', height: 'clamp(80px, 22vw, 112px)', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div style={{ flex: '1 1 180px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
                        {item.productName}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                        <span>Size: <strong>{item.size}</strong></span>
                        <span>Color: <strong>{item.colorName}</strong></span>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.4rem 0.6rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '0.4rem 0.6rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 className="font-display" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem' }}>
                Summary
              </h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Promo code (e.g. SUMMER30)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.65rem 0.85rem',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
                <button type="submit" className="btn btn-outline" style={{ minHeight: 'unset', padding: '0.65rem 1rem', fontSize: '0.8rem' }}>
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#10b981' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Tag size={14} />
                    <span>{appliedCoupon.code} Applied</span>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span style={{ color: '#fff' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                    <span>Promotion Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated GST (12%)</span>
                  <span style={{ color: '#fff' }}>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>White-Glove Shipping</span>
                  <span style={{ color: shipping === 0 ? 'var(--accent-gold)' : '#fff' }}>
                    {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
                  </span>
                </div>
                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--accent-gold)' }}>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-gold"
                style={{ width: '100%', padding: '0.95rem' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
