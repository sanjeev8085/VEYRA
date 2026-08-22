import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { User, MapPin, Package, ShieldCheck, Trash2 } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const user = useStore((state) => state.user);
  const addresses = useStore((state) => state.addresses);
  const orders = useStore((state) => state.orders);
  const deleteAddress = useStore((state) => state.deleteAddress);

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* User Greeting Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700 }}>
              VIP Client Profile
            </span>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: '#fff' }}>
              Welcome, {user?.name || 'Client'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</p>
          </div>

          {user?.role.includes('admin') && (
            <Link to="/admin" className="btn btn-gold" style={{ padding: '0.75rem 1.5rem' }}>
              <ShieldCheck size={18} />
              <span>Enter Admin Atelier Portal</span>
            </Link>
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          {[
            { key: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { key: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
            { key: 'profile', label: 'Security & Preferences', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  border: isSelected ? '1px solid var(--accent-gold)' : '1px solid transparent',
                  color: isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order.id} className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reference:</span>{' '}
                    <strong style={{ color: 'var(--accent-gold)' }}>{order.orderNumber}</strong>
                    <span style={{ margin: '0 0.5rem', color: 'rgba(255,255,255,0.2)' }}>|</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#10b981',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {order.orderStatus}
                    </span>

                    <Link to={`/orders/track`} className="btn btn-outline" style={{ padding: '0.4rem 0.9rem', minHeight: 'unset', fontSize: '0.75rem' }}>
                      Track Shipment
                    </Link>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={item.imageUrl || item.image || ''} alt={item.productName} style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{item.productName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Size: {item.size} · Color: {item.colorName} · Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        ₹{(item.totalPrice || item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {addresses.map((addr) => (
              <div key={addr.id} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{addr.fullName}</h4>
                    {addr.isDefault && (
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(212, 175, 55, 0.2)', color: 'var(--accent-gold)', fontWeight: 700 }}>
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {addr.street}<br />
                    {addr.city}, {addr.state} - {addr.postalCode}<br />
                    {addr.country}<br />
                    Phone: {addr.phone}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Security & Preferences */}
        {activeTab === 'profile' && (
          <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '600px' }}>
            <h3 className="font-display" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem' }}>
              Account Credentials
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                <input type="text" value={user?.name || ''} readOnly style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
                <input type="email" value={user?.email || ''} readOnly style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Role Level</label>
                <input type="text" value={user?.role.toUpperCase() || 'CUSTOMER'} readOnly style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-gold)', fontWeight: 700 }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
