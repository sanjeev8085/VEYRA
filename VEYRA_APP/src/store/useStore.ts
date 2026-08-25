import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, User, Address, Order, Coupon, AdminAuthSession, LoginCredentials, RegisterData, AuthSession } from '../types';
import { SEED_PRODUCTS, SEED_COUPONS } from '../data/seedData';
import { authService } from '../services/authService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface HomepageHeroSettings {
  tag: string;
  headline: string;
  headlineHighlight: string;
  subtitle: string;
}

interface VeyraState {
  // Authentication & Customer Session
  user: User | null;
  customerSession: AuthSession | null;
  isAuthenticated: boolean;
  addresses: Address[];
  setUser: (user: User | null) => void;
  loginCustomer: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logoutCustomer: () => void;
  updateCustomerProfile: (data: Partial<User>) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  initGuestSession: (name?: string, email?: string) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;


  // Customers CRM
  customers: User[];
  addCustomer: (user: User) => void;

  // Admin Security & Session State
  adminSession: AdminAuthSession | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;


  // Product Catalog CRUD & Inventory Matrix State
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product | null;
  archiveProduct: (id: string) => void;
  publishProduct: (id: string) => void;
  updateInventory: (productId: string, variantId: string, newStock: number) => void;

  // Promotions & Coupons Management
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;

  // Editorial Homepage CMS
  homepageHeroSettings: HomepageHeroSettings;
  updateHomepageHeroSettings: (settings: HomepageHeroSettings) => void;

  // Shopping Cart
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, size: string, colorName: string, colorHex: string, quantity?: number) => void;
  reorderItems: (items: CartItem[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTax: () => number;
  getCartShipping: () => number;
  getCartTotal: () => number;


  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // 3D Viewer & Studio State
  activeAvatarId: string;
  activeGarmentId: string | null;
  activeColorHex: string;
  activeLightingPreset: 'studio' | 'sunset' | 'runway';
  isAutoRotate: boolean;
  setActiveAvatarId: (avatarId: string) => void;
  setActiveGarmentId: (garmentId: string | null) => void;
  setActiveColorHex: (hex: string) => void;
  setActiveLightingPreset: (preset: 'studio' | 'sunset' | 'runway') => void;
  toggleAutoRotate: () => void;

  // UI Modals & Drawers
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  isFilterDrawerOpen: boolean;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  toasts: ToastMessage[];
  setCartDrawerOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setFilterDrawerOpen: (open: boolean) => void;
  setCurrency: (curr: 'INR' | 'USD' | 'EUR' | 'GBP') => void;
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Orders Cache
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNum?: string) => void;
}

export const useStore = create<VeyraState>()(
  persist(
    (set, get) => ({
      // Customer Authentication & Session State
      user: {
        id: 'usr_demo_01',
        name: 'Alexander Vane',
        email: 'alexander@veyra.luxury',
        role: 'customer',
        createdAt: '2026-01-15T00:00:00Z',
      },
      customerSession: {
        token: 'vyr_usr_tok_alexander_vane_demo',
        user: {
          id: 'usr_demo_01',
          name: 'Alexander Vane',
          email: 'alexander@veyra.luxury',
          role: 'customer',
          createdAt: '2026-01-15T00:00:00Z',
        },
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      isAuthenticated: true,
      addresses: [
        {
          id: 'addr_01',
          userId: 'usr_demo_01',
          fullName: 'Alexander Vane',
          phone: '+91 98765 43210',
          street: '42 Mayfair Boulevard, Penthouse 8B',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          isDefault: true,
        },
      ],
      setUser: (user) => set({ user, isAuthenticated: !!user && !user.isGuest }),

      loginCustomer: async (credentials) => {
        const res = await authService.loginCustomer(credentials);
        if (res.success && res.user && res.session) {
          set({
            user: res.user,
            customerSession: res.session,
            isAuthenticated: true,
          });
          get().addToast('success', 'Welcome Back', `Logged in as ${res.user.name}`);
          return { success: true };
        }
        return { success: false, error: res.error || 'Authentication failed' };
      },

      registerCustomer: async (data) => {
        const res = await authService.registerCustomer(data);
        if (res.success && res.user && res.session) {
          set((state) => ({
            user: res.user,
            customerSession: res.session,
            isAuthenticated: true,
            customers: [res.user!, ...state.customers],
          }));
          get().addToast('success', 'VIP Registration Complete', `Welcome to the VEYRA Atelier, ${res.user.name}`);
          return { success: true };
        }
        return { success: false, error: res.error || 'Registration failed' };
      },

      logoutCustomer: () => {
        set({
          user: null,
          customerSession: null,
          isAuthenticated: false,
        });
        get().addToast('info', 'Signed Out', 'You have been safely signed out.');
      },

      updateCustomerProfile: (data) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...data };
          return {
            user: updatedUser,
            customers: state.customers.map((c) => (c.id === updatedUser.id ? { ...c, ...data } : c)),
          };
        });
        get().addToast('success', 'Profile Updated', 'Your profile details have been saved.');
      },

      changePassword: async (oldPass, newPass) => {
        const user = get().user;
        if (!user || !user.email) {
          return { success: false, error: 'User is not authenticated' };
        }
        const res = await authService.changePassword(user.email, oldPass, newPass);
        if (res.success) {
          get().addToast('success', 'Password Updated', 'Your account password has been updated securely.');
          return { success: true };
        }
        return { success: false, error: res.error || 'Failed to update password.' };
      },


      initGuestSession: (name = 'Guest Client', email = 'guest@veyra.luxury') => {
        const guestUser = authService.createGuestUser(name, email);
        set({
          user: guestUser,
          customerSession: null,
          isAuthenticated: false,
        });
      },

      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, address],
        })),
      updateAddress: (id, updated) =>
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...updated } : a)),
        })),
      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),
      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),

      // Customers Directory
      customers: [
        {
          id: 'usr_demo_01',
          name: 'Alexander Vane',
          email: 'alexander@veyra.luxury',
          role: 'customer',
          phone: '+91 98765 43210',
          createdAt: '2026-01-15T00:00:00Z',
        },
        {
          id: 'usr_demo_02',
          name: 'Elena Rostova',
          email: 'elena.r@fashion.co',
          role: 'customer',
          phone: '+91 99887 76655',
          createdAt: '2026-02-10T00:00:00Z',
        },
        {
          id: 'usr_demo_03',
          name: 'Kabir Malhotra',
          email: 'kabir.m@atelier.in',
          role: 'customer',
          phone: '+91 91234 56780',
          createdAt: '2026-03-01T00:00:00Z',
        },
      ],
      addCustomer: (newCustomer) =>
        set((state) => ({ customers: [newCustomer, ...state.customers] })),

      // Admin Security Authentication
      adminSession: {
        token: 'vyr_adm_sec_token_99218',
        user: {
          id: 'adm_001',
          name: 'Master Atelier Admin',
          email: 'admin@veyra.luxury',
          role: 'super_admin',
          createdAt: '2026-01-01T00:00:00Z',
        },
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      isAdminAuthenticated: true,

      adminLogin: async (email, password) => {
        const res = await authService.loginAdmin(email, password);
        if (res.success && res.user && res.session) {
          set({ adminSession: res.session, isAdminAuthenticated: true });
          get().addToast('success', 'Authentication Successful', `Welcome back, ${res.user.name} (${res.user.role.replace('_', ' ').toUpperCase()})`);
          return { success: true };
        }
        return { success: false, error: res.error || 'Invalid administrative credentials.' };
      },

      adminLogout: () => {
        set({ adminSession: null, isAdminAuthenticated: false });
        get().addToast('info', 'Logged Out', 'Admin session terminated securely');
      },


      // Products CRUD
      products: SEED_PRODUCTS,

      addProduct: (newProduct) => {
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
        get().addToast('success', 'Product Created', `${newProduct.name} saved to catalog.`);
      },

      updateProduct: (id, productData) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
          ),
        }));
        get().addToast('success', 'Product Updated', 'Changes saved successfully.');
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        get().addToast('info', 'Product Deleted', 'Item removed from database.');
      },

      duplicateProduct: (id) => {
        const original = get().products.find((p) => p.id === id);
        if (!original) return null;

        const newId = `prod_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`;
        const duplicated: Product = {
          ...original,
          id: newId,
          slug: `${original.slug}-copy-${Date.now().toString(36)}`,
          name: `${original.name} (Copy)`,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          products: [duplicated, ...state.products],
        }));

        get().addToast('success', 'Product Duplicated', `Created draft copy of ${original.name}`);
        return duplicated;
      },

      archiveProduct: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, status: 'archived', updatedAt: new Date().toISOString() } : p
          ),
        }));
        get().addToast('info', 'Product Archived', 'Status set to Archived.');
      },

      publishProduct: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, status: 'published', updatedAt: new Date().toISOString() } : p
          ),
        }));
        get().addToast('success', 'Product Published', 'Product is now live in store catalog.');
      },

      updateInventory: (productId, variantId, newStock) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== productId) return p;
            return {
              ...p,
              variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v)),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      // Promotions & Coupons Management
      coupons: SEED_COUPONS,
      addCoupon: (newCoupon) => {
        set((state) => ({
          coupons: [newCoupon, ...state.coupons],
        }));
        get().addToast('success', 'Promotion Created', `Coupon code ${newCoupon.code} created successfully.`);
      },
      toggleCouponStatus: (code) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c)),
        }));
        get().addToast('info', 'Coupon Status Updated', `Status changed for ${code}`);
      },
      deleteCoupon: (code) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== code),
        }));
        get().addToast('info', 'Coupon Removed', `Code ${code} deleted from system`);
      },

      // Homepage Editorial CMS
      homepageHeroSettings: {
        tag: 'Summer Atelier 2026',
        headline: 'THE ART OF',
        headlineHighlight: 'FORM & TEXTURE.',
        subtitle: 'Long-staple Peruvian Supima cotton and pure Normandy linen cut with architectural drape. Tailored with sculptural precision for effortless modern luxury.',
      },
      updateHomepageHeroSettings: (settings) => {
        set({ homepageHeroSettings: settings });
        get().addToast('success', 'CMS Updated', 'Homepage editorial banner updated live.');
      },

      // Cart State
      cart: [],
      appliedCoupon: null,
      addToCart: (product, size, colorName, colorHex, quantity = 1) => {
        const variant = product.variants.find((v) => v.size === size && v.colorHex === colorHex);
        const maxStock = variant ? variant.stock : 10;
        const cartItemId = `${product.id}-${size}-${colorHex}`;

        set((state) => {
          const existingIndex = state.cart.findIndex((item) => item.id === cartItemId);
          if (existingIndex > -1) {
            const updatedCart = [...state.cart];
            const currentItem = updatedCart[existingIndex];
            const newQty = Math.min(currentItem.quantity + quantity, maxStock);
            updatedCart[existingIndex] = { ...currentItem, quantity: newQty };
            return { cart: updatedCart, isCartDrawerOpen: true };
          } else {
            const newItem: CartItem = {
              id: cartItemId,
              productId: product.id,
              productName: product.name,
              brand: product.brand,
              price: product.price,
              size,
              colorName,
              colorHex,
              quantity: Math.min(quantity, maxStock),
              imageUrl: product.images[0] || '',
            };
            return { cart: [...state.cart, newItem], isCartDrawerOpen: true };
          }
        });

        get().addToast('success', 'Added to Bag', `${product.name} (${size} · ${colorName})`);
      },

      reorderItems: (items) => {
        set((state) => {
          let updatedCart = [...state.cart];
          items.forEach((item) => {
            const existingIndex = updatedCart.findIndex(
              (c) => c.productId === item.productId && c.size === item.size && c.colorHex === item.colorHex
            );
            if (existingIndex > -1) {
              updatedCart[existingIndex] = {
                ...updatedCart[existingIndex],
                quantity: updatedCart[existingIndex].quantity + (item.quantity || 1),
              };
            } else {
              updatedCart.push({
                ...item,
                id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              });
            }
          });
          return { cart: updatedCart, isCartDrawerOpen: true };
        });
        get().addToast('success', 'Items Reordered', `${items.length} item(s) added back to your luxury bag.`);
      },

      removeFromCart: (cartItemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        })),
      updateCartQuantity: (cartItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.id !== cartItemId) };
          }
          return {
            cart: state.cart.map((item) =>
              item.id === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
            ),
          };
        }),
      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
        get().addToast('success', 'Coupon Applied', `${coupon.code} applied successfully!`);
      },
      removeCoupon: () => set({ appliedCoupon: null }),
      clearCart: () => set({ cart: [], appliedCoupon: null }),

      getCartSubtotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartDiscount: () => {
        const subtotal = get().getCartSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        const discountType = coupon.discountType || coupon.type || 'percentage';
        const val = coupon.discountValue ?? coupon.value ?? 0;
        const maxLimit = coupon.maxDiscountAmount ?? coupon.maxDiscount;

        if (discountType === 'percentage') {
          const discount = (subtotal * val) / 100;
          return maxLimit ? Math.min(discount, maxLimit) : discount;
        }
        return Math.min(val, subtotal);
      },
      getCartTax: () => {
        const discountedSubtotal = Math.max(0, get().getCartSubtotal() - get().getCartDiscount());
        return Math.round(discountedSubtotal * 0.12);
      },
      getCartShipping: () => {
        const subtotal = get().getCartSubtotal();
        if (subtotal === 0) return 0;
        return subtotal > 1999 ? 0 : 250;
      },
      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getCartDiscount();
        const tax = get().getCartTax();
        const shipping = get().getCartShipping();
        return Math.max(0, subtotal - discount + tax + shipping);
      },

      // Wishlist State
      wishlist: [],
      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          if (exists) {
            get().addToast('info', 'Removed', 'Item removed from favorites');
            return { wishlist: state.wishlist.filter((id) => id !== productId) };
          } else {
            get().addToast('success', 'Saved', 'Item saved to your private wishlist');
            return { wishlist: [...state.wishlist, productId] };
          }
        });
      },
      isInWishlist: (productId) => get().wishlist.includes(productId),

      // 3D Viewer & Studio State
      activeAvatarId: 'avatar-male-01',
      activeGarmentId: null,
      activeColorHex: '#6c8a66',
      activeLightingPreset: 'studio',
      isAutoRotate: true,
      setActiveAvatarId: (avatarId) => set({ activeAvatarId: avatarId }),
      setActiveGarmentId: (garmentId) => set({ activeGarmentId: garmentId }),
      setActiveColorHex: (hex) => set({ activeColorHex: hex }),
      setActiveLightingPreset: (preset) => set({ activeLightingPreset: preset }),
      toggleAutoRotate: () => set((state) => ({ isAutoRotate: !state.isAutoRotate })),

      // UI State
      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
      isCartDrawerOpen: false,
      isSearchOpen: false,
      isFilterDrawerOpen: false,
      currency: 'INR',
      toasts: [],
      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setFilterDrawerOpen: (open) => set({ isFilterDrawerOpen: open }),
      setCurrency: (curr) => set({ currency: curr }),
      addToast: (type, title, message) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, type, title, message }],
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // Orders State
      orders: [
        {
          id: 'ord_demo_10025',
          orderNumber: '#ORD-10025',
          userId: 'usr_demo_01',
          customerName: 'Alexander Vane',
          customerEmail: 'alexander@veyra.luxury',
          customerPhone: '+91 98765 43210',
          shippingAddress: {
            id: 'addr_01',
            userId: 'usr_demo_01',
            fullName: 'Alexander Vane',
            phone: '+91 98765 43210',
            street: '42 Mayfair Boulevard, Penthouse 8B',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
          },
          items: [
            {
              id: 'item_01',
              productId: 'prod_tee_01',
              productName: 'VEYRA Essential Crew Tee',
              brand: 'VEYRA',
              price: 1599,
              size: 'L',
              colorName: 'Botanical Sage',
              colorHex: '#6c8a66',
              quantity: 2,
            },
          ],
          subtotal: 3198,
          discount: 0,
          shipping: 0,
          total: 3582,
          status: 'shipped',
          paymentStatus: 'paid',
          paymentMethod: 'card',
          trackingNumber: 'VYR-EXP-908214',
          createdAt: '2026-08-20T14:30:00Z',
          updatedAt: '2026-08-22T09:15:00Z',
        },
      ],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status, trackingNum) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  orderStatus: status,
                  ...(trackingNum ? { trackingNumber: trackingNum } : {}),
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        })),
    }),
    {
      name: 'veyra-storage-v5',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        adminSession: state.adminSession,
        isAdminAuthenticated: state.isAdminAuthenticated,
        products: state.products,
        coupons: state.coupons,
        customers: state.customers,
        homepageHeroSettings: state.homepageHeroSettings,
        addresses: state.addresses,
        orders: state.orders,
        activeAvatarId: state.activeAvatarId,
        currency: state.currency,
        theme: state.theme,
      }),
    }
  )
);
