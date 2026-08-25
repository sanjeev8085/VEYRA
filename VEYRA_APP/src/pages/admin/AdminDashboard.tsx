import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { OrderStatus, Coupon, AdminRole } from '../../types';
import { hasPermission } from '../../middleware/authGuard';
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  Plus,
  Search,
  Copy,
  Trash2,
  Eye,
  LogOut,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Box,
  Users,
  Tag,
  LayoutTemplate,
  Save,
  Shield,
} from 'lucide-react';


export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const products = useStore((state) => state.products);
  const duplicateProduct = useStore((state) => state.duplicateProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const publishProduct = useStore((state) => state.publishProduct);
  const archiveProduct = useStore((state) => state.archiveProduct);
  const updateInventory = useStore((state) => state.updateInventory);

  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);

  const customers = useStore((state) => state.customers);
  const coupons = useStore((state) => state.coupons);
  const addCoupon = useStore((state) => state.addCoupon);
  const toggleCouponStatus = useStore((state) => state.toggleCouponStatus);
  const deleteCoupon = useStore((state) => state.deleteCoupon);

  const homepageHeroSettings = useStore((state) => state.homepageHeroSettings);
  const updateHomepageHeroSettings = useStore((state) => state.updateHomepageHeroSettings);

  const adminLogout = useStore((state) => state.adminLogout);
  const adminSession = useStore((state) => state.adminSession);

  const currentRole = (adminSession?.user.role as AdminRole) || 'super_admin';
  const canManageProducts = hasPermission(currentRole, 'manage_products');
  const canDeleteProducts = hasPermission(currentRole, 'delete_products');
  const canManageOrders = hasPermission(currentRole, 'manage_orders');
  const canViewCustomers = hasPermission(currentRole, 'view_customers');
  const canManageCoupons = hasPermission(currentRole, 'manage_coupons');
  const canManageCMS = hasPermission(currentRole, 'manage_cms');
  const canManageInventory = hasPermission(currentRole, 'manage_inventory');

  // Active Admin View Tab: 'products' | 'orders' | 'inventory' | 'customers' | 'coupons' | 'cms'
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory' | 'customers' | 'coupons' | 'cms'>(() => {
    if (currentRole === 'order_manager') return 'orders';
    return 'products';
  });

  // Adjust active tab if role changes
  useEffect(() => {
    if (currentRole === 'order_manager' && (activeTab === 'products' || activeTab === 'inventory' || activeTab === 'cms' || activeTab === 'coupons')) {
      setActiveTab('orders');
    } else if (currentRole === 'product_manager' && (activeTab === 'orders' || activeTab === 'customers')) {
      setActiveTab('products');
    }
  }, [currentRole]);


  // Product Table Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Order Table Filters & Search
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Customer Table Search
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  // Coupon Creator Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState<number>(20);
  const [newCouponMinCart, setNewCouponMinCart] = useState<number>(1999);
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState<number>(1000);

  // CMS Form State
  const [cmsTag, setCmsTag] = useState(homepageHeroSettings.tag);
  const [cmsHeadline, setCmsHeadline] = useState(homepageHeroSettings.headline);
  const [cmsHighlight, setCmsHighlight] = useState(homepageHeroSettings.headlineHighlight);
  const [cmsSubtitle, setCmsSubtitle] = useState(homepageHeroSettings.subtitle);

  // Metrics Calculations
  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.status === 'published').length;
  const draftProducts = products.filter((p) => p.status === 'draft').length;

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => {
      const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
      return totalStock > 0 && totalStock <= 15;
    });
  }, [products]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);
  }, [orders]);

  // Filtered Products Table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Filtered Orders Table
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()));

      const currentStatus = (o.orderStatus || o.status || '').toLowerCase();
      const matchesStatus = orderStatusFilter === 'all' || currentStatus === orderStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchTerm, orderStatusFilter]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      return (
        c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        (c.phone && c.phone.includes(customerSearchTerm))
      );
    });
  }, [customers, customerSearchTerm]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const handleDuplicate = (id: string) => {
    duplicateProduct(id);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the database?`)) {
      deleteProduct(id);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const coupon: Coupon = {
      id: `cpn_${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      description: `${newCouponType === 'percentage' ? `${newCouponValue}% OFF` : `₹${newCouponValue} OFF`} on luxury orders`,
      discountType: newCouponType,
      discountValue: newCouponValue,
      type: newCouponType,
      value: newCouponValue,
      minCartValue: newCouponMinCart,
      minOrderAmount: newCouponMinCart,
      maxDiscount: newCouponMaxDiscount,
      maxDiscountAmount: newCouponMaxDiscount,
      isActive: true,
      usageCount: 0,
    };

    addCoupon(coupon);
    setNewCouponCode('');
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageHeroSettings({
      tag: cmsTag,
      headline: cmsHeadline,
      headlineHighlight: cmsHighlight,
      subtitle: cmsSubtitle,
    });
  };

  return (
    <div style={{ paddingTop: '96px', minHeight: '100vh', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Admin Portal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-gold)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                <Sparkles size={14} />
                <span>Atelier Management Portal</span>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background:
                    currentRole === 'super_admin'
                      ? 'rgba(212, 175, 55, 0.2)'
                      : currentRole === 'product_manager'
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(16, 185, 129, 0.2)',
                  color:
                    currentRole === 'super_admin'
                      ? 'var(--accent-gold)'
                      : currentRole === 'product_manager'
                      ? '#60a5fa'
                      : '#34d399',
                  border: `1px solid ${
                    currentRole === 'super_admin'
                      ? 'var(--border-gold)'
                      : currentRole === 'product_manager'
                      ? 'rgba(59, 130, 246, 0.4)'
                      : 'rgba(16, 185, 129, 0.4)'
                  }`,
                }}
              >
                {currentRole.replace('_', ' ')}
              </span>
            </div>
            <h1 className="font-display" style={{ fontSize: 'var(--font-size-h1)', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              Executive Dashboard
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Logged in as <strong>{adminSession?.user.name || 'Admin'}</strong> ({adminSession?.user.email})
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {canManageProducts && (
              <Link
                to="/admin/products/new"
                className="btn btn-gold"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} />
                <span>Add New Garment</span>
              </Link>
            )}

            <button
              onClick={() => {
                adminLogout();
                navigate('/admin/login');
              }}
              className="btn btn-outline"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
              title="Switch RBAC Role"
            >
              <Shield size={16} />
              <span>Switch Role</span>
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-ghost"
              style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}
              title="Secure Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>


        {/* 1. KEY ATELIER METRICS CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Total Garments */}
          <div
            onClick={() => setActiveTab('products')}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              border: activeTab === 'products' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Garments in Catalog
              </span>
              <Package size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalProducts}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {publishedProducts} Published · {draftProducts} Drafts
            </div>
          </div>

          {/* Customer Orders */}
          <div
            onClick={() => setActiveTab('orders')}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              border: activeTab === 'orders' ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Active Orders
              </span>
              <ShoppingBag size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {orders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--status-success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <TrendingUp size={13} />
              <span>100% On-Schedule Fulfillment</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Total Revenue
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>₹</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              INR Gateway Active
            </div>
          </div>

          {/* Low Stock Attention */}
          <div
            onClick={() => setActiveTab('inventory')}
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              border: activeTab === 'inventory' ? '1px solid var(--accent-gold)' : lowStockProducts.length > 0 ? '1px solid rgba(196, 91, 56, 0.3)' : '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Low Stock Alerts
              </span>
              <AlertTriangle size={20} color="var(--accent-terracotta)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: lowStockProducts.length > 0 ? 'var(--accent-terracotta)' : 'var(--text-primary)' }}>
              {lowStockProducts.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {lowStockProducts.length > 0 ? 'Requires atelier re-order' : 'All sizes well-stocked'}
            </div>
          </div>
        </div>

        {/* 2. ADMIN NAVIGATION TABS */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', overflowX: 'auto' }}>
          {canManageProducts && (
            <button
              onClick={() => setActiveTab('products')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'products' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'products' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Package size={15} />
              <span>Garments Catalog ({products.length})</span>
            </button>
          )}

          {canManageOrders && (
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'orders' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'orders' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <ShoppingBag size={15} />
              <span>Orders & Fulfillment ({orders.length})</span>
            </button>
          )}

          {canManageInventory && (
            <button
              onClick={() => setActiveTab('inventory')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'inventory' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'inventory' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Box size={15} />
              <span>Variant Stock Matrix</span>
            </button>
          )}

          {canViewCustomers && (
            <button
              onClick={() => setActiveTab('customers')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'customers' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'customers' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Users size={15} />
              <span>Customers CRM ({customers.length})</span>
            </button>
          )}

          {canManageCoupons && (
            <button
              onClick={() => setActiveTab('coupons')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'coupons' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'coupons' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Tag size={15} />
              <span>Promotions & Coupons ({coupons.length})</span>
            </button>
          )}

          {canManageCMS && (
            <button
              onClick={() => setActiveTab('cms')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: activeTab === 'cms' ? 'var(--text-primary)' : 'transparent',
                color: activeTab === 'cms' ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <LayoutTemplate size={15} />
              <span>Editorial CMS</span>
            </button>
          )}
        </div>


        {/* 3. TAB 1: PRODUCT MANAGEMENT TABLE */}
        {activeTab === 'products' && (
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                  Garments Management ({filteredProducts.length})
                </h2>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', minWidth: '220px' }}>
                  <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-primary)',
                      fontSize: '0.825rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.825rem',
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="t-shirts">T-Shirts</option>
                  <option value="shirts">Shirts</option>
                  <option value="jackets">Outerwear</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.825rem',
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Product</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Category</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Shades</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Sizes</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Stock</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Retail Price</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>3D Asset</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                    const uniqueColors = Array.from(new Set(product.variants.map((v) => v.colorHex)));

                    return (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <div>
                            <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.9rem' }}>
                              {product.name}
                            </strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{product.brand}</span>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', textTransform: 'capitalize' }}>
                          {product.category.replace('-', ' ')}
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {uniqueColors.map((hex) => (
                              <span key={hex} style={{ width: 14, height: 14, borderRadius: '50%', background: hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                            ))}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {Array.from(new Set(product.variants.map((v) => v.size))).join(', ')}
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span
                            style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: totalStock > 15 ? 'rgba(21, 128, 61, 0.1)' : 'rgba(196, 91, 56, 0.1)',
                              color: totalStock > 15 ? 'var(--status-success)' : 'var(--accent-terracotta)',
                            }}
                          >
                            {totalStock} units
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--status-success)', fontWeight: 700 }}>
                            <CheckCircle2 size={13} />
                            <span>PBR Ready</span>
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background: product.status === 'published' ? 'rgba(21, 128, 61, 0.1)' : 'rgba(140, 133, 123, 0.1)',
                              color: product.status === 'published' ? 'var(--status-success)' : 'var(--text-muted)',
                            }}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <Link
                              to={`/product/${product.slug}`}
                              className="btn btn-ghost"
                              style={{ padding: '0.35rem', minWidth: '32px', minHeight: '32px' }}
                              title="Preview Storefront"
                            >
                              <Eye size={15} />
                            </Link>

                            <button
                              onClick={() => handleDuplicate(product.id)}
                              className="btn btn-ghost"
                              style={{ padding: '0.35rem', minWidth: '32px', minHeight: '32px' }}
                              title="Duplicate Product"
                            >
                              <Copy size={15} />
                            </button>

                            {product.status === 'published' ? (
                              <button
                                onClick={() => archiveProduct(product.id)}
                                className="btn btn-ghost"
                                style={{ padding: '0.35rem 0.6rem', minHeight: '32px', fontSize: '0.75rem' }}
                                title="Unpublish to Draft/Archive"
                              >
                                Unpublish
                              </button>
                            ) : (
                              <button
                                onClick={() => publishProduct(product.id)}
                                className="btn btn-gold"
                                style={{ padding: '0.35rem 0.6rem', minHeight: '32px', fontSize: '0.75rem' }}
                                title="Publish Live"
                              >
                                Publish
                              </button>
                            )}

                            {canDeleteProducts && (
                              <button
                                onClick={() => handleDelete(product.id, product.name)}
                                className="btn btn-ghost"
                                style={{ padding: '0.35rem', minWidth: '32px', minHeight: '32px', color: 'var(--status-error)' }}
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>

                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. TAB 2: ORDER FULFILLMENT MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                  Customer Orders & Fulfillment ({filteredOrders.length})
                </h2>
              </div>

              {/* Order Search & Status Filter */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', minWidth: '240px' }}>
                  <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by Order ID, name..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-primary)',
                      fontSize: '0.825rem',
                    }}
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.825rem',
                  }}
                >
                  <option value="all">All Order Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Order Number</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Customer</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Garments</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Total Amount</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Fulfillment Status</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Courier Tracking</th>
                    <th style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const status = order.orderStatus || order.status;
                    const itemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <div>
                            <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{order.customerName}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.customerEmail}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          {itemsCount} item{itemsCount > 1 ? 's' : ''} ({order.items.map((i) => i.productName).join(', ')})
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>
                          ₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.6rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: status === 'Delivered' || status === 'delivered' ? 'rgba(21, 128, 61, 0.1)' : 'rgba(184, 134, 11, 0.1)',
                              color: status === 'Delivered' || status === 'delivered' ? 'var(--status-success)' : 'var(--accent-gold)',
                            }}
                          >
                            {status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {order.trackingNumber || 'Pending Dispatch'}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                          <select
                            value={status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus, order.trackingNumber || `VYR-EXP-${Math.floor(100000 + Math.random() * 900000)}`)}
                            style={{
                              padding: '0.35rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-primary)',
                              border: '1px solid var(--border-light)',
                              color: 'var(--text-primary)',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. TAB 3: REAL-TIME INVENTORY CONTROL */}
        {activeTab === 'inventory' && (
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                Variant Stock Matrix & Direct Adjuster
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Directly edit available unit inventory across all colorways and size specifications.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {products.map((product) => (
                <div key={product.id} style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{product.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginLeft: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                        {product.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Total Stock: {product.variants.reduce((s, v) => s + v.stock, 0)} units
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        style={{
                          padding: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-card)',
                          border: variant.stock <= 5 ? '1px solid rgba(196, 91, 56, 0.4)' : '1px solid var(--border-light)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: variant.colorHex }} />
                            <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{variant.colorName}</span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Size: {variant.size}</span>
                        </div>

                        <input
                          type="number"
                          min={0}
                          value={variant.stock}
                          onChange={(e) => updateInventory(product.id, variant.id, parseInt(e.target.value) || 0)}
                          style={{
                            width: '54px',
                            padding: '0.3rem',
                            textAlign: 'center',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-primary)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB 4: CUSTOMERS CRM */}
        {activeTab === 'customers' && (
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                  Customer Records & VIP Relations ({filteredCustomers.length})
                </h2>
              </div>

              <div style={{ position: 'relative', minWidth: '240px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search customer name, email..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.825rem',
                  }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Customer Name</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Email Address</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Phone</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Account Role</th>
                    <th style={{ padding: '0.85rem 0.5rem' }}>Registered Since</th>
                    <th style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>Total Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((cust) => {
                    const custOrders = orders.filter((o) => o.userId === cust.id || o.customerEmail === cust.email);
                    const custTotal = custOrders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);

                    return (
                      <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {cust.name}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                          {cust.email}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                          {cust.phone || '+91 98765 43210'}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span
                            style={{
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background: cust.role === 'super_admin' ? 'rgba(184, 134, 11, 0.15)' : 'rgba(255,255,255,0.08)',
                              color: cust.role === 'super_admin' ? 'var(--accent-gold)' : 'var(--text-primary)',
                            }}
                          >
                            {cust.role}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {new Date(cust.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                          <strong style={{ color: 'var(--accent-gold)' }}>{custOrders.length} orders</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                            ₹{custTotal.toLocaleString('en-IN')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. TAB 5: PROMOTIONS & COUPONS MANAGER */}
        {activeTab === 'coupons' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '2rem' }} className="studio-grid">
            {/* Create Coupon Card */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h3 className="font-display" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Create Promotion Code
              </h3>

              <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                    Promo Code (e.g. SUMMER30) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="AUTUMN20"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--accent-gold)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      letterSpacing: '0.05em',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                      Discount Type
                    </label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Flat Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                      Min Cart Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newCouponMinCart}
                      onChange={(e) => setNewCouponMinCart(parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                      Max Cap (₹)
                    </label>
                    <input
                      type="number"
                      value={newCouponMaxDiscount}
                      onChange={(e) => setNewCouponMaxDiscount(parseInt(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
                  <Plus size={16} />
                  <span>Activate Promo Code</span>
                </button>
              </form>
            </div>

            {/* Coupons List Table */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h3 className="font-display" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                Active Promotional Codes ({coupons.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-primary)',
                      border: c.isActive ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.08em' }}>
                          {c.code}
                        </span>
                        <span
                          style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: c.isActive ? 'rgba(21, 128, 61, 0.15)' : 'rgba(255,255,255,0.08)',
                            color: c.isActive ? 'var(--status-success)' : 'var(--text-muted)',
                          }}
                        >
                          {c.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {c.discountType === 'percentage' ? `${c.discountValue || c.value}% Discount` : `₹${c.discountValue || c.value} Flat Off`} · Min Cart ₹{c.minCartValue || c.minOrderAmount || 0}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => toggleCouponStatus(c.code)}
                        className="btn btn-ghost"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        {c.isActive ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => deleteCoupon(c.code)}
                        className="btn btn-ghost"
                        style={{ padding: '0.4rem', color: 'var(--status-error)' }}
                        title="Delete Promo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. TAB 6: EDITORIAL HOMEPAGE CMS */}
        {activeTab === 'cms' && (
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)', maxWidth: '780px' }}>
            <h2 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Homepage Campaign Visuals & Typography CMS
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Edit live homepage campaign tag, bold headline, highlight gradient text, and editorial story without code deployments.
            </p>

            <form onSubmit={handleSaveCMS} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Top Campaign Tag
                </label>
                <input
                  type="text"
                  value={cmsTag}
                  onChange={(e) => setCmsTag(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                    Main Headline (Line 1)
                  </label>
                  <input
                    type="text"
                    value={cmsHeadline}
                    onChange={(e) => setCmsHeadline(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                    Headline Gradient Highlight (Line 2)
                  </label>
                  <input
                    type="text"
                    value={cmsHighlight}
                    onChange={(e) => setCmsHighlight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--accent-gold)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Editorial Subtitle Story
                </label>
                <textarea
                  rows={3}
                  value={cmsSubtitle}
                  onChange={(e) => setCmsSubtitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button type="submit" className="btn btn-gold" style={{ padding: '0.85rem 2rem', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                <Save size={16} />
                <span>Save & Publish Live to Storefront</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
