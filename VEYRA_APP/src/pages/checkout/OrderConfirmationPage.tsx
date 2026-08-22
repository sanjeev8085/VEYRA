import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Truck } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const orders = useStore((state) => state.orders);
  const order = orders.find((o) => o.id === orderId) || orders[0];

  useEffect(() => {
    // Trigger luxury celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#ffffff', '#e5c158', '#b28f24'],
    });
  }, []);

  if (!order) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '70vh', textAlign: 'center' }}>
        <h2 style={{ color: '#fff' }}>Order not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Homepage</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Celebration Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <CheckCircle2 size={38} />
          </div>
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700 }}>
            Order Successfully Placed
          </span>
          <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.5rem', color: '#fff' }}>
            Thank You, {order.customerName.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Your tailored pieces are now being prepared by our master couturiers.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          {/* Order Header Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Number</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{order.orderNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tracking Number</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{order.trackingNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Estimated Delivery</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#10b981' }}>{order.estimatedDeliveryDate}</div>
            </div>
          </div>

          {/* Ordered Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <img src={item.imageUrl || item.image || ''} alt={item.productName} style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>{item.productName}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Size: {item.size} · Color: {item.colorName} · Qty: {item.quantity}
                  </div>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  ₹{(item.totalPrice || item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address & Total Breakdown */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                Delivery Destination
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>{order.shippingAddress.fullName}</strong><br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
                Phone: {order.shippingAddress.phone}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {(order.discountAmount || order.discount || 0) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount</span>
                  <span>-₹{(order.discountAmount || order.discount || 0).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST Tax (12%)</span>
                <span>₹{(order.taxAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--accent-gold)' }}>COMPLIMENTARY</span>
              </div>
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.35rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                <span>Paid Total</span>
                <span style={{ color: 'var(--accent-gold)' }}>₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders/track" className="btn btn-gold" style={{ padding: '0.85rem 1.75rem' }}>
            <Truck size={18} />
            <span>Track Order Progress</span>
          </Link>
          <Link to="/catalog" className="btn btn-outline" style={{ padding: '0.85rem 1.75rem' }}>
            <span>Continue Shopping</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
