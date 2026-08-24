import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Order, CartItem } from '../../types';
import { ReturnRequestModal } from '../../components/orders/ReturnRequestModal';
import {
  Package,
  Search,
  Truck,
  RotateCcw,
  FileText,
  Sparkles,
  Home,
  User,
  Heart,
  CheckCircle2,
  Printer,
  X,
  Undo2,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const orders = useStore((state) => state.orders);
  const reorderItems = useStore((state) => state.reorderItems);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<Order | null>(null);


  // Metrics Calculations
  const totalOrders = orders.length;
  const inTransitCount = orders.filter((o) => {
    const s = (o.orderStatus || o.status || '').toLowerCase();
    return s === 'shipped' || s === 'out for delivery' || s === 'processing';
  }).length;
  const deliveredCount = orders.filter((o) => {
    const s = (o.orderStatus || o.status || '').toLowerCase();
    return s === 'delivered';
  }).length;
  const lifetimeValue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.items.some((i) => i.productName.toLowerCase().includes(searchTerm.toLowerCase()));

      const orderStatus = (order.orderStatus || order.status || '').toLowerCase();
      let matchStatus = true;
      if (statusFilter === 'confirmed') matchStatus = orderStatus === 'confirmed' || orderStatus === 'pending';
      else if (statusFilter === 'processing') matchStatus = orderStatus === 'processing' || orderStatus === 'packed';
      else if (statusFilter === 'shipped') matchStatus = orderStatus === 'shipped' || orderStatus === 'out for delivery';
      else if (statusFilter === 'delivered') matchStatus = orderStatus === 'delivered';

      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleReorder = (items: CartItem[]) => {
    reorderItems(items);
  };

  const getStatusBadgeStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) {
      return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', text: '#10b981' };
    }
    if (s.includes('shipped') || s.includes('out for delivery')) {
      return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', text: '#60a5fa' };
    }
    if (s.includes('processing') || s.includes('packed')) {
      return { bg: 'rgba(212, 175, 55, 0.15)', border: 'rgba(212, 175, 55, 0.4)', text: 'var(--accent-gold)' };
    }
    return { bg: 'rgba(140, 133, 123, 0.15)', border: 'rgba(140, 133, 123, 0.3)', text: 'var(--text-muted)' };
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              <Sparkles size={14} />
              <span>VIP Atelier Client Portal</span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Order History & Invoices
            </h1>
          </div>

          {/* Quick Subnav Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              to="/account"
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <Home size={14} />
              <span>Overview</span>
            </Link>
            <Link
              to="/account/profile"
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <User size={14} />
              <span>Profile & Addresses</span>
            </Link>
            <Link
              to="/wishlist"
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <Heart size={14} />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>

        {/* 1. ORDER METRICS SUMMARY */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Orders
              </span>
              <Package size={18} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {totalOrders}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Lifetime bespoke acquisitions
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                In Transit / Tailoring
              </span>
              <Truck size={18} color="#60a5fa" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60a5fa', marginTop: '0.35rem' }}>
              {inTransitCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Active white-glove shipments
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Delivered
              </span>
              <CheckCircle2 size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
              {deliveredCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              In your private wardrobe
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Expenditure
              </span>
              <Sparkles size={18} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.35rem' }}>
              ₹{lifetimeValue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              VIP client cumulative value
            </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER CONTROLS */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'processing', label: 'Tailoring' },
              { key: 'shipped', label: 'In Transit' },
              { key: 'delivered', label: 'Delivered' },
            ].map((tab) => {
              const isSelected = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    background: isSelected ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected ? '#000' : 'var(--text-primary)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by Order #, Item, Tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-primary)',
                fontSize: '0.825rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* 3. ORDER CARDS LIST */}
        {filteredOrders.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <Package size={42} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters or search criteria.'
                : 'Explore our latest luxury drop and tailor your bespoke wardrobe.'}
            </p>
            <Link to="/catalog" className="btn btn-gold" style={{ padding: '0.75rem 1.5rem' }}>
              Browse New Arrivals
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {filteredOrders.map((order) => {
              const statusStyle = getStatusBadgeStyle(order.orderStatus || order.status);
              const orderTotal = order.totalAmount || order.total || 0;

              return (
                <div
                  key={order.id}
                  className="glass-panel"
                  style={{
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {/* Order Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '1.25rem',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Reference:
                        </span>
                        <strong style={{ color: 'var(--accent-gold)', fontSize: '1.1rem' }}>{order.orderNumber}</strong>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            background: statusStyle.bg,
                            border: `1px solid ${statusStyle.border}`,
                            color: statusStyle.text,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {order.orderStatus || order.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} · Payment: {order.paymentMethod.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order Total:</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                        ₹{orderTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Itemized Garments Row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.25rem',
                          padding: '0.75rem',
                          background: 'rgba(255,255,255,0.02)',
                          borderRadius: 'var(--radius-sm)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <img
                          src={item.imageUrl || item.image || ''}
                          alt={item.productName}
                          style={{
                            width: '56px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        />

                        <div style={{ flex: 1, minWidth: '180px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {item.productName}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            <span>Size: <strong>{item.size}</strong></span>
                            <span>·</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.colorHex, display: 'inline-block' }} />
                              <span>{item.colorName}</span>
                            </div>
                            <span>·</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            ₹{(item.totalPrice || item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            ₹{item.price.toLocaleString('en-IN')} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Action Bar */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '1.25rem',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Shipping to: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.state})
                      {order.trackingNumber && (
                        <span style={{ display: 'block', marginTop: '0.2rem', color: 'var(--text-secondary)' }}>
                          Courier: <strong>{order.courierName || 'Veyra White-Glove'}</strong> · Tracking: <strong>{order.trackingNumber}</strong>
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <Link
                        to="/orders/track"
                        className="btn btn-outline"
                        style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', minHeight: 'unset' }}
                      >
                        <Truck size={14} />
                        <span>Track Shipment</span>
                      </Link>

                      <button
                        onClick={() => handleReorder(order.items)}
                        className="btn btn-gold"
                        style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', minHeight: 'unset' }}
                        title="Add items back to cart"
                      >
                        <RotateCcw size={14} />
                        <span>Reorder All</span>
                      </button>

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="btn btn-ghost"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', minHeight: 'unset' }}
                        title="View Official Atelier Invoice"
                      >
                        <FileText size={14} />
                        <span>Invoice</span>
                      </button>

                      <button
                        onClick={() => setSelectedReturnOrder(order)}
                        className="btn btn-ghost"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', minHeight: 'unset', color: 'var(--text-secondary)' }}
                        title="Request Return or Exchange"
                      >
                        <Undo2 size={14} />
                        <span>Return / Exchange</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Return / Exchange Modal */}
        {selectedReturnOrder && (
          <ReturnRequestModal
            order={selectedReturnOrder}
            onClose={() => setSelectedReturnOrder(null)}
            onSuccess={() => setSelectedReturnOrder(null)}
          />
        )}


        {/* 4. LUXURY INVOICE POPUP MODAL */}
        {selectedInvoiceOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 100,
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
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.5rem',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-gold)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                position: 'relative',
              }}
            >
              {/* Modal Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} color="var(--accent-gold)" />
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--accent-gold)', fontWeight: 800 }}>
                    Official Atelier Tax Invoice
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handlePrintInvoice}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', minHeight: 'unset' }}
                    title="Print or Save PDF"
                  >
                    <Printer size={14} />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setSelectedInvoiceOrder(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Invoice Content */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                {/* Brand Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <h2 className="font-display gold-gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.15em', margin: 0 }}>
                      VEYRA
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>
                      Luxury Atelier & Bespoke Couturier
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.4 }}>
                      GSTIN: 27AABCV8812K1Z8<br />
                      Bespoke Atelier, Bandra West, Mumbai 400050
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Invoice No.</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      INV-{selectedInvoiceOrder.orderNumber.replace('#', '')}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Bill To / Ship To */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Billed To</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem' }}>
                      {selectedInvoiceOrder.customerName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {selectedInvoiceOrder.customerEmail}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Shipped Destination</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                      {selectedInvoiceOrder.shippingAddress.street}<br />
                      {selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.state} - {selectedInvoiceOrder.shippingAddress.postalCode}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      <th style={{ padding: '0.65rem 0', textAlign: 'left' }}>Item Description</th>
                      <th style={{ padding: '0.65rem 0', textAlign: 'center' }}>Size/Shade</th>
                      <th style={{ padding: '0.65rem 0', textAlign: 'center' }}>Qty</th>
                      <th style={{ padding: '0.65rem 0', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoiceOrder.items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.75rem 0', color: '#fff', fontWeight: 500 }}>{item.productName}</td>
                        <td style={{ padding: '0.75rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>{item.size} · {item.colorName}</td>
                        <td style={{ padding: '0.75rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>{item.quantity}</td>
                        <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          ₹{(item.totalPrice || item.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Financial Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxWidth: '280px', marginLeft: 'auto', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoiceOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {(selectedInvoiceOrder.discountAmount || selectedInvoiceOrder.discount || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-success)' }}>
                      <span>VIP Privilege Discount:</span>
                      <span>-₹{(selectedInvoiceOrder.discountAmount || selectedInvoiceOrder.discount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>White Glove Courier:</span>
                    <span>{(selectedInvoiceOrder.shippingFee || selectedInvoiceOrder.shipping || 0) === 0 ? 'COMPLIMENTARY' : `₹${selectedInvoiceOrder.shippingFee || selectedInvoiceOrder.shipping}`}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Integrated GST (12%):</span>
                    <span>₹{(selectedInvoiceOrder.taxAmount || 0).toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-gold)', paddingTop: '0.65rem', marginTop: '0.4rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    <span>Grand Total:</span>
                    <span>₹{(selectedInvoiceOrder.totalAmount || selectedInvoiceOrder.total || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Footer seal */}
                <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  Thank you for being a privileged patron of the VEYRA Atelier. All garments crafted under master artisan certification.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default OrdersPage;
