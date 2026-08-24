import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileMenuDrawer } from './components/layout/MobileMenuDrawer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { AdminAuthGuard, CustomerAuthGuard, GuestOnlyGuard } from './middleware/authGuard';

// Storefront Pages
import { HomePage } from './pages/home/HomePage';
import { CatalogPage } from './pages/catalog/CatalogPage';
import { ProductDetailPage } from './pages/product/ProductDetailPage';
import { Studio3DPage } from './pages/studio/Studio3DPage';
import { FindYourColorsPage } from './pages/recommend/FindYourColorsPage';
import { WishlistPage } from './pages/wishlist/WishlistPage';
import { CartPage } from './pages/cart/CartPage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrderConfirmationPage } from './pages/checkout/OrderConfirmationPage';
import { TrackOrderPage } from './pages/orders/TrackOrderPage';
import { AccountPage } from './pages/account/AccountPage';
import { ProfilePage } from './pages/account/ProfilePage';
import { OrdersPage } from './pages/account/OrdersPage';

// Authentication Pages

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AddProductWizard } from './pages/admin/AddProductWizard';
import { CustomersPage } from './pages/admin/CustomersPage';
import { HomepageCMSPage } from './pages/admin/HomepageCMSPage';
import { PromotionsPage } from './pages/admin/PromotionsPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';


import { SkipToContent } from './components/common/SkipToContent';
import { LiveAnnouncer } from './components/common/LiveAnnouncer';

export const App: React.FC = () => {
  const location = useLocation();
  const theme = useStore((state) => state.theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Hide standard storefront header & footer on studio or admin pages
  const isAdminOrStudioPage = location.pathname.startsWith('/admin') || location.pathname === '/studio';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Accessible Skip To Content for Screen Readers & Keyboard Users */}
      <SkipToContent targetId="main-content" />

      {/* ARIA Live Region Announcements Engine */}
      <LiveAnnouncer />

      {/* Global Header Navigation */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Global Mobile Drawer */}
      <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Global Slide Cart Drawer */}
      <CartDrawer />

      {/* Global Live Search Modal */}
      <SearchModal />

      {/* Global Toast Alerts */}
      <ToastContainer />

      {/* Application Main Landmark */}
      <main id="main-content" style={{ flex: 1 }}>
        <Routes>
          {/* Customer Storefront */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/studio" element={<Studio3DPage />} />
          <Route path="/find-your-colors" element={<FindYourColorsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/orders/track" element={<TrackOrderPage />} />

          {/* Customer Authentication */}
          <Route
            path="/auth/login"
            element={
              <GuestOnlyGuard>
                <LoginPage />
              </GuestOnlyGuard>
            }
          />
          <Route
            path="/login"
            element={
              <GuestOnlyGuard>
                <LoginPage />
              </GuestOnlyGuard>
            }
          />
          <Route
            path="/auth/register"
            element={
              <GuestOnlyGuard>
                <RegisterPage />
              </GuestOnlyGuard>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnlyGuard>
                <RegisterPage />
              </GuestOnlyGuard>
            }
          />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/account"
            element={
              <CustomerAuthGuard>
                <AccountPage />
              </CustomerAuthGuard>
            }
          />
          <Route
            path="/account/profile"
            element={
              <CustomerAuthGuard>
                <ProfilePage />
              </CustomerAuthGuard>
            }
          />
          <Route
            path="/account/orders"
            element={
              <CustomerAuthGuard>
                <OrdersPage />
              </CustomerAuthGuard>
            }
          />


          {/* Secure Admin Portal */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminAuthGuard>
                <AdminDashboard />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminAuthGuard allowedRoles={['super_admin', 'product_manager']}>
                <AdminDashboard />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <AdminAuthGuard allowedRoles={['super_admin', 'product_manager']}>
                <AddProductWizard />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminAuthGuard allowedRoles={['super_admin', 'order_manager']}>
                <CustomersPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/cms"
            element={
              <AdminAuthGuard allowedRoles={['super_admin', 'product_manager']}>
                <HomepageCMSPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/promotions"
            element={
              <AdminAuthGuard allowedRoles={['super_admin', 'product_manager']}>
                <PromotionsPage />
              </AdminAuthGuard>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminAuthGuard allowedRoles={['super_admin', 'product_manager', 'order_manager']}>
                <AnalyticsPage />
              </AdminAuthGuard>
            }
          />
        </Routes>

      </main>

      {/* Global Luxury Footer */}
      {!isAdminOrStudioPage && <Footer />}
    </div>
  );
};
export default App;
