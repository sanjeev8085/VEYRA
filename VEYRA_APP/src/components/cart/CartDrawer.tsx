import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const isOpen = useStore((state) => state.isCartDrawerOpen);
  const onClose = () => useStore.getState().setCartDrawerOpen(false);

  const cart = useStore((state) => state.cart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const getCartSubtotal = useStore((state) => state.getCartSubtotal);
  const getCartDiscount = useStore((state) => state.getCartDiscount);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const appliedCoupon = useStore((state) => state.appliedCoupon);

  if (!isOpen) return null;

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 5, 8, 0.82)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Slide Sheet */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 111,
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Cart Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              Your Atelier Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(212, 175, 55, 0.08)', borderBottom: '1px solid rgba(212, 175, 55, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span>
              {subtotal >= 10000 ? (
                <strong style={{ color: 'var(--accent-gold)' }}>✓ Free White-Glove Shipping Unlocked</strong>
              ) : (
                `Add ₹${(10000 - subtotal).toLocaleString('en-IN')} for Free White-Glove Shipping`
              )}
            </span>
            <span>₹10,000</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 999 }}>
            <div
              style={{
                width: `${Math.min(100, (subtotal / 10000) * 100)}%`,
                height: '100%',
                background: 'var(--accent-gold)',
                borderRadius: 999,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', color: 'rgba(255,255,255,0.2)' }} />
              <p style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Your shopping bag is empty</p>
              <p style={{ fontSize: '0.8rem', marginBottom: '1.5rem' }}>Explore our 3D couture pieces and create your customized look.</p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  onClose();
                  navigate('/catalog');
                }}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {/* Product Thumbnail */}
                <img
                  src={item.image}
                  alt={item.productName}
                  style={{
                    width: '84px',
                    height: '104px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    background: '#121218',
                  }}
                />

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <span>Size: <strong>{item.size}</strong></span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.colorHex, border: '1px solid #fff' }} />
                        {item.colorName}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          padding: '0.3rem 0.5rem',
                          cursor: 'pointer',
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 0.4rem', minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fff',
                          padding: '0.3rem 0.5rem',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              background: '#0a0a0f',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Subtotal</span>
              <span style={{ color: '#fff' }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--status-success)', marginBottom: '0.5rem' }}>
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0.85rem 0' }}>
              <span>Total Estimated</span>
              <span style={{ color: 'var(--accent-gold)' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              className="btn btn-gold"
              onClick={handleCheckout}
              style={{ width: '100%', padding: '0.9rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.75rem' }}>
              <ShieldCheck size={14} color="var(--status-success)" />
              <span>Complimentary Insurance & Carbon Neutral Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
