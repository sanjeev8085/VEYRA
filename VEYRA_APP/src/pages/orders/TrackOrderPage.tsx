import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { OrderStatus } from '../../types';
import { Search, CheckCircle2 } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const orders = useStore((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState(orders[0]?.orderNumber || '#ORD-10025');
  const [activeOrder, setActiveOrder] = useState(orders[0]);

  const stages: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'Confirmed', label: 'Order Confirmed', desc: 'Atelier received your bespoke specifications' },
    { key: 'Processing', label: 'Couturier Tailoring', desc: 'Master tailor hand-assembling garments' },
    { key: 'Packed', label: 'Quality Inspected & Packed', desc: 'Sealed in signature Veyra garment case' },
    { key: 'Shipped', label: 'Dispatched via White Glove', desc: 'In transit with climate-controlled courier' },
    { key: 'Delivered', label: 'Delivered to Doorstep', desc: 'Handed over with private fitting consultation' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
        o.trackingNumber?.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (match) {
      setActiveOrder(match);
    }
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'pending':
      case 'Confirmed':
        return 0;
      case 'Processing':
      case 'processing':
        return 1;
      case 'Packed':
        return 2;
      case 'Shipped':
      case 'shipped':
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIdx = activeOrder ? getStageIndex(activeOrder.orderStatus || activeOrder.status) : 0;

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700 }}>
            Live Atelier Logistics
          </span>
          <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.5rem', color: '#fff' }}>
            Track Your Order
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Real-time status updates from our European atelier to your door.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem' }}>
          <input
            type="text"
            placeholder="Enter Order # (e.g. #ORD-10025) or Tracking Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1.25rem',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          <button type="submit" className="btn btn-gold" style={{ padding: '0.85rem 1.75rem' }}>
            <Search size={18} />
            <span>Track</span>
          </button>
        </form>

        {activeOrder && (
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Reference</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{activeOrder.orderNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Carrier & Tracking</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                  {activeOrder.courierName} ({activeOrder.trackingNumber})
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Estimated Arrival</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>{activeOrder.estimatedDeliveryDate}</div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', paddingLeft: '1rem' }}>
              {/* Vertical line indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  bottom: '24px',
                  left: '26px',
                  width: '2px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 1,
                }}
              />

              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: isPassed ? 'var(--accent-gold)' : '#181824',
                        color: isPassed ? '#070709' : 'rgba(255, 255, 255, 0.3)',
                        border: isCurrent ? '3px solid #fff' : isPassed ? 'none' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        boxShadow: isCurrent ? '0 0 15px rgba(212, 175, 55, 0.7)' : 'none',
                      }}
                    >
                      {isPassed ? <CheckCircle2 size={18} /> : <span>{idx + 1}</span>}
                    </div>

                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: isPassed ? '#fff' : 'var(--text-muted)' }}>
                        {stage.label}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: isPassed ? 'var(--text-secondary)' : 'var(--text-muted)', marginTop: '2px' }}>
                        {stage.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ordered Items Summary */}
            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Items in This Shipment
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {activeOrder.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={item.imageUrl || item.image || ''} alt={item.productName} style={{ width: '44px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{item.productName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Size: {item.size} · Color: {item.colorName}</div>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      ₹{(item.totalPrice || item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
