import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Order, Address } from '../../types';
import { ShieldCheck, Lock, UserCheck } from 'lucide-react';
import { notifyOrderPlaced, notifyPaymentReceived } from '../../services/notificationService';


export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const addresses = useStore((state) => state.addresses);
  const addOrder = useStore((state) => state.addOrder);
  const clearCart = useStore((state) => state.clearCart);
  const registerCustomer = useStore((state) => state.registerCustomer);

  const getCartSubtotal = useStore((state) => state.getCartSubtotal);
  const getCartDiscount = useStore((state) => state.getCartDiscount);
  const getCartTax = useStore((state) => state.getCartTax);
  const getCartShipping = useStore((state) => state.getCartShipping);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const appliedCoupon = useStore((state) => state.appliedCoupon);

  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(addresses[0]?.phone || '+91 98765 43210');
  const [street, setStreet] = useState(addresses[0]?.street || '42 Mayfair Boulevard, Penthouse 8B');
  const [city, setCity] = useState(addresses[0]?.city || 'Mumbai');
  const [stateName, setStateName] = useState(addresses[0]?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(addresses[0]?.postalCode || '400001');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'upi' | 'net_banking' | 'cod'>('credit_card');
  const [createAccount, setCreateAccount] = useState(false);
  const [newPassword, setNewPassword] = useState('');


  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const tax = getCartTax();
  const shipping = getCartShipping();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '80vh', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>No items in checkout</h2>
        <button onClick={() => navigate('/catalog')} className="btn btn-primary">
          Browse Collection
        </button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    const shippingAddress: Address = {
      id: `addr_${Date.now()}`,
      userId: user?.id || 'guest',
      fullName,
      phone,
      street,
      city,
      state: stateName,
      postalCode,
      country: 'India',
    };

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `#ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user?.id || 'guest_user',
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      items: cart.map((i) => ({
        id: i.id || `${i.productId}-${i.size}-${i.colorHex}`,
        productId: i.productId,
        productName: i.productName,
        brand: i.brand || 'VEYRA',
        price: i.price,
        imageUrl: i.imageUrl || i.image || '',
        image: i.image || i.imageUrl || '',
        size: i.size,
        colorName: i.colorName,
        colorHex: i.colorHex,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.price * i.quantity,
      })),
      subtotal,
      discount: discount,
      discountAmount: discount,
      couponCode: appliedCoupon?.code,
      shipping: shipping,
      shippingFee: shipping,
      taxAmount: tax,
      total: total,
      totalAmount: total,
      status: 'Confirmed',
      orderStatus: 'Confirmed',
      paymentMethod: paymentMethod as any,
      paymentStatus: 'paid',
      trackingNumber: `VYR-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      courierName: 'Veyra White Glove Courier',
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (createAccount && newPassword && !isAuthenticated) {
      registerCustomer({
        name: fullName,
        email,
        password: newPassword,
        phone,
      }).catch((e) => console.error('Auto registration failed:', e));
    }

    setTimeout(() => {
      addOrder(newOrder);
      notifyOrderPlaced(newOrder);
      notifyPaymentReceived(newOrder);
      clearCart();
      setIsProcessing(false);
      navigate(`/order-confirmation/${newOrder.id}`);
    }, 1500);
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Guest vs VIP Banner */}
        {!isAuthenticated && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid var(--border-gold)',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <UserCheck size={18} color="var(--accent-gold)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Checking out as <strong>Guest</strong>. Have a VIP Client account?
              </span>
            </div>
            <Link
              to="/auth/login?redirect=/checkout"
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem', minHeight: 'unset' }}
            >
              Sign In for VIP Privileges
            </Link>
          </div>
        )}

        <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700 }}>
            Secure Checkout
          </span>
          <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.5rem', color: '#fff' }}>
            Atelier Checkout
          </h1>
        </div>


        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '3.5rem',
            alignItems: 'start',
          }}
          className="cart-grid"
        >
          {/* Left Form: Steps */}
          <div>
            {/* Step 1: Delivery Address */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-gold)', color: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  1
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem', color: '#fff' }}>
                  Delivery Address & Contact
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Street Address</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>State / Postal Code</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="State"
                      style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Pincode"
                      style={{ width: '100px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Optional Guest-to-VIP Account Creation */}
              {!isAuthenticated && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      style={{ accentColor: 'var(--accent-gold)' }}
                    />
                    <span>Create a VIP Atelier Account to track orders and save bespoke measurements</span>
                  </label>

                  {createAccount && (
                    <div style={{ marginTop: '0.85rem', maxWidth: '350px' }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                        Set Account Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--border-gold)',
                            borderRadius: 'var(--radius-sm)',
                            color: '#fff',
                            fontSize: '0.825rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* Step 2: Payment Gateway Selection */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-gold)', color: '#070709', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  2
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem', color: '#fff' }}>
                  Select Payment Method
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'credit_card', label: 'Credit / Debit Card (Visa, Mastercard, Amex)', desc: '256-bit encrypted card gateway' },
                  { key: 'upi', label: 'UPI / Instant QR (GPay, PhonePe, Paytm)', desc: 'Zero surcharge instant payment' },
                  { key: 'net_banking', label: 'Net Banking (HDFC, ICICI, Axis, SBI)', desc: 'Direct bank transfer' },
                  { key: 'cod', label: 'White Glove Cash / Card on Delivery', desc: 'Pay at your doorstep upon fitting' },
                ].map((m) => {
                  const isSelected = paymentMethod === m.key;
                  return (
                    <div
                      key={m.key}
                      onClick={() => setPaymentMethod(m.key as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.03)',
                        border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isSelected ? 'var(--accent-gold)' : '#fff' }}>
                          {m.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{m.desc}</div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: isSelected ? '5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.3)' }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Order Summary & Authorize Button */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="font-display" style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem' }}>
              Order Review ({cart.length} items)
            </h3>

            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.productName} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.size} · Qty {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST (12%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span>
              </div>
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                <span>Total Due</span>
                <span style={{ color: 'var(--accent-gold)' }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="btn btn-gold"
              style={{ width: '100%', padding: '1rem' }}
            >
              {isProcessing ? (
                <span>Authorizing Payment...</span>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Authorize & Place Order</span>
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1rem' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>256-Bit Encrypted High Security Atelier Gateway</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
