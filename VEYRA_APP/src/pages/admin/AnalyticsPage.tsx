import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  TrendingUp,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Box,
  Eye,
  RotateCw,
  Award,
  Layers,
  ArrowUpRight,
} from 'lucide-react';


export const AnalyticsPage: React.FC = () => {
  const products = useStore((state) => state.products);
  const orders = useStore((state) => state.orders);

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  // Revenue & Order Calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Category Breakdown
  const categoryRevenue = useMemo(() => {
    const map: Record<string, { revenue: number; count: number }> = {
      't-shirts': { revenue: 0, count: 0 },
      shirts: { revenue: 0, count: 0 },
      jackets: { revenue: 0, count: 0 },
      trousers: { revenue: 0, count: 0 },
    };

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const cat = prod?.category || 't-shirts';
        if (map[cat]) {
          map[cat].revenue += (item.totalPrice || item.price * item.quantity);
          map[cat].count += item.quantity;
        }
      });
    });

    return map;
  }, [orders, products]);

  // Top Performing Products
  const topProducts = useMemo(() => {
    const countMap: Record<string, { name: string; quantity: number; revenue: number; category: string }> = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!countMap[item.productId]) {
          countMap[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
            category: 'Garment',
          };
        }
        countMap[item.productId].quantity += item.quantity;
        countMap[item.productId].revenue += (item.totalPrice || item.price * item.quantity);
      });
    });

    return Object.values(countMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

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
          <span>Analytics & 3D Insights</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              <Sparkles size={14} />
              <span>Executive Commerce Intelligence</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Sales & 3D Interaction Analytics
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Real-time revenue metrics, product velocity, and 3D digital try-on conversion performance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All Time' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id as '7d' | '30d' | 'all')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  background: timeRange === tab.id ? 'var(--accent-gold)' : 'transparent',
                  color: timeRange === tab.id ? '#000' : 'var(--text-secondary)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. CORE COMMERCE METRICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Gross Revenue
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>₹</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowUpRight size={13} />
              <span>+24.6% vs previous period</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Orders Fulfilled
              </span>
              <ShoppingBag size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalOrdersCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              100% on-time dispatch
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Average Order Value (AOV)
              </span>
              <TrendingUp size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{averageOrderValue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              High VIP basket density
            </div>
          </div>
        </div>

        {/* 2. 3D INTERACTION & DIGITAL TRY-ON ANALYTICS */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            <Box size={16} />
            <span>3D Interactive Experience Performance</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Eye size={15} />
                <span>3D Scene Interactions</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0.2rem 0' }}>
                1,480
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Full-screen 3D inspect sessions
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <TrendingUp size={15} />
                <span>3D-to-Bag Lift</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-success)', margin: '0.5rem 0 0.2rem 0' }}>
                +38.4%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Higher conversion than 2D photography
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <RotateCw size={15} />
                <span>Avg 3D Inspect Duration</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0.2rem 0' }}>
                48.2s
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Interactive rotation & fabric inspection
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Layers size={15} />
                <span>Live Color Swaps in 3D</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0.2rem 0' }}>
                3,210
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Palette colorway preview triggers
              </div>
            </div>
          </div>
        </div>

        {/* 3. CATEGORY & PRODUCT LEADERBOARD */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }} className="studio-grid">
          {/* Category Revenue Distribution */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Category Revenue Share
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: 'T-Shirts & Polos', key: 't-shirts', color: 'var(--accent-gold)' },
                { label: 'Button-Downs & Overshirts', key: 'shirts', color: '#60a5fa' },
                { label: 'Outerwear & Overcoats', key: 'jackets', color: '#f59e0b' },
                { label: 'Trousers & Bottoms', key: 'trousers', color: '#10b981' },
              ].map((cat) => {
                const data = categoryRevenue[cat.key] || { revenue: 0, count: 0 };
                const pct = totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 25;

                return (
                  <div key={cat.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{cat.label}</strong>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                        ₹{data.revenue.toLocaleString('en-IN')} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: '999px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Award size={14} />
              <span>Velocity Ranking</span>
            </div>
            <h3 className="font-display" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Best-Selling Luxury Pieces
            </h3>

            {topProducts.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No product orders recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {topProducts.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: idx === 0 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                          color: idx === 0 ? '#000' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>
                          {p.name}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {p.quantity} units purchased
                        </span>
                      </div>
                    </div>

                    <strong style={{ fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                      ₹{p.revenue.toLocaleString('en-IN')}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
