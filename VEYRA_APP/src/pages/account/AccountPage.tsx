import React from 'react';
import { useStore } from '../../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Package,
  ShieldCheck,
  LogOut,
  Sparkles,
  Heart,
  Palette,
  ArrowRight,
} from 'lucide-react';


export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const addresses = useStore((state) => state.addresses);
  const orders = useStore((state) => state.orders);
  const wishlist = useStore((state) => state.wishlist);
  const logoutCustomer = useStore((state) => state.logoutCustomer);
  const reorderItems = useStore((state) => state.reorderItems);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const recentOrders = orders.slice(0, 3);

  const handleLogout = () => {
    logoutCustomer();
    navigate('/auth/login');
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* VIP Welcome Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              <Sparkles size={14} />
              <span>VIP Atelier Client Portal</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: '#fff' }}>
              Welcome back, {user?.name || 'Client'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {user?.email} · VIP Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {user?.role && user.role !== 'customer' && (
              <Link to="/admin" className="btn btn-gold" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} />
                <span>Enter Admin Atelier Portal</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 1. PORTAL SHORTCUT CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <Link
            to="/account/orders"
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                  <Package size={20} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {orders.length}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                My Orders & Invoices
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Track active shipments, view official atelier invoices, and reorder.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 700 }}>
              <span>Manage Orders</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link
            to="/account/profile"
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                  <MapPin size={20} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {addresses.length}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                Profile & Address Book
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Manage saved residences, contact phone, and change security password.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 700 }}>
              <span>Edit Details</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
                  <Heart size={20} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {wishlist.length}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                Curated Wishlist
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Your private saved selections reserved for bespoke tailoring.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 700 }}>
              <span>View Saved Pieces</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link
            to="/find-your-colors"
            className="glass-card"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <Palette size={20} />
                </div>
                <Sparkles size={16} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                Color Palette AI
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Explore season recommendations tailored to your unique skin undertone.
              </p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 700 }}>
              <span>Explore Palettes</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>

        {/* 2. RECENT ORDERS & PRIMARY ADDRESS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(300px, 380px)', gap: '2rem', alignItems: 'start' }} className="cart-grid">
          {/* Left: Recent Orders */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} color="var(--accent-gold)" />
                <h3 className="font-display" style={{ fontSize: '1.25rem', color: '#fff' }}>
                  Recent Acquisitions
                </h3>
              </div>
              <Link to="/account/orders" style={{ color: 'var(--accent-gold)', fontSize: '0.825rem', textDecoration: 'none', fontWeight: 700 }}>
                View All ({orders.length}) →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No recent orders placed yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <strong style={{ color: 'var(--accent-gold)', fontSize: '0.95rem' }}>{order.orderNumber}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          fontWeight: 700,
                        }}
                      >
                        {order.orderStatus || order.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <img
                        src={order.items[0]?.imageUrl || order.items[0]?.image || ''}
                        alt="Product"
                        style={{ width: '42px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                          {order.items[0]?.productName}
                          {order.items.length > 1 && ` + ${order.items.length - 1} more item(s)`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Total: <strong>₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <Link to="/orders/track" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: 'unset' }}>
                        Track
                      </Link>
                      <button onClick={() => reorderItems(order.items)} className="btn btn-gold" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', minHeight: 'unset' }}>
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Primary Shipping Address & Concierge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Primary Delivery Address */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color="var(--accent-gold)" />
                  <span>Primary Residence</span>
                </h4>
                <Link to="/account/profile" style={{ color: 'var(--accent-gold)', fontSize: '0.78rem', textDecoration: 'none' }}>
                  Manage Book →
                </Link>
              </div>

              {defaultAddress ? (
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {defaultAddress.fullName}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '0.25rem' }}>
                    {defaultAddress.street}<br />
                    {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}<br />
                    {defaultAddress.country}<br />
                    <span style={{ color: 'var(--text-muted)' }}>Phone: {defaultAddress.phone}</span>
                  </p>
                </div>
              ) : (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  No delivery address saved yet.
                </div>
              )}
            </div>

            {/* Private Atelier Concierge */}
            <div className="glass-panel" style={{ padding: '1.75rem', border: '1px solid var(--border-gold)', background: 'rgba(212, 175, 55, 0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Sparkles size={14} />
                <span>Private VIP Concierge</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
                Dedicated Stylist Support
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Need personalized size recommendations, custom bespoke requests, or private showroom bookings?
              </p>
              <a
                href="mailto:concierge@veyra.luxury"
                className="btn btn-gold"
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
              >
                <span>Contact Private Concierge</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountPage;
