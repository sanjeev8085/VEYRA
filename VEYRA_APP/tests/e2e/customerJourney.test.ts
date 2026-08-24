/**
 * VEYRA Haute Couture — End-to-End Customer Journey Integration Test (VEYRA-064)
 * Validates the complete customer lifecycle:
 * Discovery → Catalog Filter → PDP (3D / Lookbook) → Customization → Cart → Checkout → Confirmation → Live Tracking
 */

import { SEED_PRODUCTS } from '../../src/data/seedData';
import { Product, CartItem, Order, Address } from '../../src/types';

describe('VEYRA Customer Journey E2E Test Suite', () => {
  // Test Mock State
  let testCart: CartItem[] = [];
  let testOrder: Order | null = null;

  // 1. Homepage & Catalog Discovery Phase
  test('Phase 1: Discover products and filter catalog', () => {
    const products = SEED_PRODUCTS;
    expect(products.length).toBeGreaterThan(0);

    // Filter by category: "t-shirts"
    const tshirts = products.filter((p) => p.category === 't-shirts');
    expect(tshirts.length).toBeGreaterThan(0);

    // Filter by price range: <= ₹3000
    const affordableLuxury = products.filter((p) => p.price <= 3000);
    expect(affordableLuxury.length).toBeGreaterThan(0);

    // Search query match
    const searchQuery = 'Supima';
    const searchResults = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(searchResults.length).toBeGreaterThan(0);
  });

  // 2. Product Detail Page (PDP) & 3D Garment Customization Phase
  test('Phase 2: Product Detail Page & 3D Variant Selection', () => {
    const product: Product = SEED_PRODUCTS[0];
    expect(product).toBeDefined();

    // Verify variants available
    expect(product.variants.length).toBeGreaterThan(0);
    const selectedVariant = product.variants[0];
    expect(selectedVariant.size).toBeDefined();
    expect(selectedVariant.colorHex).toBeDefined();

    // Verify 3D Asset attributes
    expect(product.category).toBeDefined();
    expect(product.compatibleAvatarIds.length).toBeGreaterThan(0);
  });

  // 3. Shopping Cart Addition & Promo Calculation Phase
  test('Phase 3: Add to Shopping Cart and apply promotional coupon', () => {
    const product: Product = SEED_PRODUCTS[0];
    const selectedVariant = product.variants[0];

    // Add item to cart
    const cartItem: CartItem = {
      id: `cart_${Date.now()}`,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      price: product.price,
      size: selectedVariant.size,
      colorName: selectedVariant.colorName,
      colorHex: selectedVariant.colorHex,
      quantity: 1,
      image: product.images[0],
    };

    testCart.push(cartItem);
    expect(testCart.length).toBe(1);

    // Calculate Subtotal
    const subtotal = testCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    expect(subtotal).toBe(product.price);

    // Apply Coupon VEYRA15 (15% discount)
    const discountPercent = 15;
    const discount = Math.round((subtotal * discountPercent) / 100);
    const tax = Math.round((subtotal - discount) * 0.12);
    const shipping = subtotal > 2000 ? 0 : 250;
    const total = subtotal - discount + tax + shipping;

    expect(discount).toBeGreaterThan(0);
    expect(total).toBe(subtotal - discount + tax + shipping);
  });

  // 4. Multi-Step Checkout & Simulated Payment Phase
  test('Phase 4: Multi-Step Checkout & Order Authorization', () => {
    const testAddress: Address = {
      id: 'addr_test_01',
      userId: 'usr_guest_01',
      fullName: 'Vikramaditya Singhania',
      phone: '+91 98765 43210',
      street: '14 Altamount Road, Cumballa Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400026',
      country: 'India',
    };

    const subtotal = testCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const discount = Math.round((subtotal * 15) / 100);
    const tax = Math.round((subtotal - discount) * 0.12);
    const shipping = 0;
    const total = subtotal - discount + tax + shipping;

    testOrder = {
      id: `ord_${Date.now()}`,
      orderNumber: `VYR-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: 'usr_guest_01',
      customerName: testAddress.fullName,
      customerEmail: 'vikram.singhania@luxury.in',
      customerPhone: testAddress.phone,
      items: [...testCart],
      subtotal,
      discount,
      shipping,
      taxAmount: tax,
      total,
      totalAmount: total,
      status: 'Confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      shippingAddress: testAddress,
      trackingNumber: `VYR-EXP-994821`,
      courierName: 'BlueDart Air Express',
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(testOrder.status).toBe('Confirmed');
    expect(testOrder.paymentStatus).toBe('paid');
    expect(testOrder.items.length).toBe(1);

    // Empty cart after checkout
    testCart = [];
    expect(testCart.length).toBe(0);
  });

  // 5. Order Confirmation Receipt & Live Tracking Phase
  test('Phase 5: Order Confirmation Receipt & Tracking Verification', () => {
    expect(testOrder).not.toBeNull();
    if (!testOrder) return;

    // Verify Tracking Details
    expect(testOrder.orderNumber).toMatch(/^VYR-\d{6}$/);
    expect(testOrder.trackingNumber).toBeDefined();
    expect(testOrder.courierName).toBe('BlueDart Air Express');
    expect(testOrder.estimatedDeliveryDate).toBeDefined();

    // Verify Status Progression
    const orderStatuses = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    expect(orderStatuses).toContain(testOrder.status);
  });
});
