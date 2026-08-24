import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { User } from '../../types';
import {
  Users,
  Search,
  Sparkles,
  ShoppingBag,
  Mail,
  Phone,
  Calendar,
  Shield,
  ChevronRight,
  ArrowLeft,
  X,
} from 'lucide-react';


export const CustomersPage: React.FC = () => {
  const customers = useStore((state) => state.customers);
  const orders = useStore((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Compute LTV and Order History for each customer
  const customerAnalytics = useMemo(() => {
    return customers.map((customer) => {
      const customerOrders = orders.filter(
        (o) => o.userId === customer.id || o.customerEmail?.toLowerCase() === customer.email.toLowerCase()
      );
      const totalSpend = customerOrders.reduce(
        (sum, o) => sum + (o.totalAmount || o.total || 0),
        0
      );
      const totalOrdersCount = customerOrders.length;

      // VIP Tier calculation
      let tier: 'Platinum VIP' | 'Gold VIP' | 'Silver VIP' | 'Atelier Member' = 'Atelier Member';
      if (totalSpend >= 25000 || totalOrdersCount >= 5) {
        tier = 'Platinum VIP';
      } else if (totalSpend >= 10000 || totalOrdersCount >= 3) {
        tier = 'Gold VIP';
      } else if (totalSpend > 0 || totalOrdersCount >= 1) {
        tier = 'Silver VIP';
      }

      return {
        customer,
        orders: customerOrders,
        totalSpend,
        totalOrdersCount,
        tier,
      };
    });
  }, [customers, orders]);

  // Filtered List
  const filteredCustomers = useMemo(() => {
    return customerAnalytics.filter((item) => {
      const matchesSearch =
        item.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer.phone && item.customer.phone.includes(searchTerm));

      const matchesTier =
        tierFilter === 'all' || item.tier.toLowerCase().replace(' ', '-') === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [customerAnalytics, searchTerm, tierFilter]);

  // Executive Stats
  const totalClients = customers.length;
  const platinumCount = customerAnalytics.filter((c) => c.tier === 'Platinum VIP').length;
  const totalLTV = customerAnalytics.reduce((sum, c) => sum + c.totalSpend, 0);
  const averageLTV = totalClients > 0 ? Math.round(totalLTV / totalClients) : 0;

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
          <span>Customers CRM</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              <Sparkles size={14} />
              <span>VIP Client Relations & Analytics</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Customer CRM Directory
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Inspect client lifetime value, purchasing timelines, delivery preferences, and membership tiers.
            </p>
          </div>
        </div>

        {/* 1. CRM EXECUTIVE STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Registered Clients
              </span>
              <Users size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalClients}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-success)', marginTop: '0.25rem' }}>
              100% active client retention
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Platinum VIP Members
              </span>
              <Sparkles size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {platinumCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Spend &gt; ₹25,000 threshold
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Average Customer LTV
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>₹</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              ₹{averageLTV.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Lifetime Value per client
            </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER BAR */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by client name, email, or phone..."
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

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Tiers' },
              { id: 'platinum-vip', label: 'Platinum VIP' },
              { id: 'gold-vip', label: 'Gold VIP' },
              { id: 'silver-vip', label: 'Silver VIP' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTierFilter(t.id)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: tierFilter === t.id ? 'var(--text-primary)' : 'rgba(255,255,255,0.04)',
                  color: tierFilter === t.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. CUSTOMER RECORDS TABLE */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Client Profile</th>
                  <th style={{ padding: '1rem 1.25rem' }}>VIP Tier</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Orders Placed</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Lifetime Value (LTV)</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Member Since</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(({ customer, totalSpend, totalOrdersCount, tier }) => {
                  const initials = customer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .substring(0, 2);

                  return (
                    <tr
                      key={customer.id}
                      style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s ease' }}
                    >
                      <td style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: '50%',
                              background: 'var(--border-gold)',
                              color: 'var(--bg-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>
                              {customer.name}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {customer.email} {customer.phone ? `· ${customer.phone}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            background:
                              tier === 'Platinum VIP'
                                ? 'rgba(212, 175, 55, 0.15)'
                                : tier === 'Gold VIP'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(255, 255, 255, 0.06)',
                            color:
                              tier === 'Platinum VIP'
                                ? 'var(--accent-gold)'
                                : tier === 'Gold VIP'
                                ? '#f59e0b'
                                : 'var(--text-secondary)',
                            border: `1px solid ${
                              tier === 'Platinum VIP'
                                ? 'rgba(212, 175, 55, 0.3)'
                                : tier === 'Gold VIP'
                                ? 'rgba(245, 158, 11, 0.3)'
                                : 'var(--border-subtle)'
                            }`,
                          }}
                        >
                          {tier}
                        </span>
                      </td>

                      <td style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>
                          <ShoppingBag size={14} color="var(--text-muted)" />
                          <span>{totalOrdersCount} orders</span>
                        </div>
                      </td>

                      <td style={{ padding: '1.25rem' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--accent-gold)' }}>
                          ₹{totalSpend.toLocaleString('en-IN')}
                        </strong>
                      </td>

                      <td style={{ padding: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </td>

                      <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="btn btn-outline"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', minHeight: 'unset' }}
                        >
                          <span>Inspect Record</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. CLIENT PROFILE DRAWER / MODAL */}
        {selectedCustomer && (
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
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-gold)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <Shield size={14} />
                  <span>VIP Client Profile Record</span>
                </div>
                <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'var(--border-gold)',
                    color: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  {selectedCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                    {selectedCustomer.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Customer ID: {selectedCustomer.id}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
                  <Mail size={15} color="var(--accent-gold)" />
                  <span>{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
                    <Phone size={15} color="var(--accent-gold)" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={15} color="var(--accent-gold)" />
                  <span>Member Since: {new Date(selectedCustomer.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Order History Summary */}
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Purchase Activity
                </h4>
                {orders.filter((o) => o.userId === selectedCustomer.id || o.customerEmail?.toLowerCase() === selectedCustomer.email.toLowerCase()).length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No historical orders recorded yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {orders
                      .filter((o) => o.userId === selectedCustomer.id || o.customerEmail?.toLowerCase() === selectedCustomer.email.toLowerCase())
                      .map((o) => (
                        <div
                          key={o.id}
                          style={{
                            padding: '0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--accent-gold)' }}>{o.orderNumber}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items
                            </div>
                          </div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            ₹{(o.totalAmount || o.total || 0).toLocaleString('en-IN')}
                          </strong>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button onClick={() => setSelectedCustomer(null)} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem' }}>
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
