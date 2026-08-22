import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileMenuDrawer } from './components/layout/MobileMenuDrawer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

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

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AddProductWizard } from './pages/admin/AddProductWizard';

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

      {/* Application Routes */}
      <main style={{ flex: 1 }}>
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
          <Route path="/account" element={<AccountPage />} />

          {/* Secure Admin Portal */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <AdminProtectedRoute>
                <AddProductWizard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <AdminProtectedRoute>
                <AddProductWizard />
              </AdminProtectedRoute>
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
