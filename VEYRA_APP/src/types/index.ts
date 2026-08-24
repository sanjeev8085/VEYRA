export type Role = 'customer' | 'super_admin' | 'product_manager' | 'order_manager';

export type AdminRole = 'super_admin' | 'product_manager' | 'order_manager';

export type Permission =
  | 'manage_products'
  | 'delete_products'
  | 'manage_inventory'
  | 'manage_orders'
  | 'view_customers'
  | 'manage_coupons'
  | 'manage_cms'
  | 'manage_settings'
  | 'manage_admins'
  | 'view_analytics';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  isGuest?: boolean;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
  issuedAt: string;
}

export type AdminAuthSession = AuthSession;

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  session?: AuthSession;
}

export interface PasswordResetRequest {
  email: string;
  token?: string;
  newPassword?: string;
}


export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type GarmentCategory = 't-shirts' | 'shirts' | 'jackets' | 'trousers' | 'footwear' | 'accessories';

export type ColorFamily =
  | 'Black'
  | 'White'
  | 'Ivory'
  | 'Cream'
  | 'Beige'
  | 'Brown'
  | 'Grey'
  | 'Navy'
  | 'Blue'
  | 'Sky Blue'
  | 'Green'
  | 'Sage'
  | 'Olive'
  | 'Red'
  | 'Burgundy'
  | 'Pink'
  | 'Orange'
  | 'Terracotta'
  | 'Yellow'
  | 'Mustard'
  | 'Purple'
  | 'Lavender';

export type FitType = 'Slim' | 'Regular' | 'Relaxed' | 'Oversized';
export type FabricType = 'Cotton' | 'Organic Cotton' | 'Linen' | 'Linen Blend' | 'Silk' | 'Wool' | 'Cotton Blend' | 'Other';
export type PatternType = 'Solid' | 'Striped' | 'Checked' | 'Printed' | 'Textured' | 'Graphic';
export type SleeveType = 'Short' | 'Long' | 'Half' | 'Sleeveless';
export type NeckType = 'Crew' | 'V-Neck' | 'Polo' | 'Mandarin' | 'Pointed Collar' | 'Camp Collar' | 'Other';
export type GenderCategory = 'men' | 'women' | 'unisex';

export interface ColorTaxonomy {
  family: ColorFamily;
  displayName: string;
  hex: string;
  undertoneMatch?: string;
}

export interface ProductVariant {
  id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | string;
  colorName: string;
  colorHex: string;
  colorFamily?: ColorFamily;
  sku: string;
  stock: number;
  priceOverride?: number;
  textureMapUrl?: string;
}

export interface ThreeDModelAsset {
  id: string;
  name: string;
  type: 'human_avatar' | 'clothing_garment';
  gender?: 'male' | 'female' | 'unisex';
  fileUrl: string;
  format: 'glb' | 'gltf';
  fileSizeBytes: number;
  polyCount?: number;
  compatibleModelIds?: string[];
  defaultPose?: string;
  heightCm?: number;
  status: 'active' | 'draft' | 'archived';
  previewImageUrl: string;
  validationStatus?: 'valid' | 'warning' | 'invalid';
  validationMessage?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: GarmentCategory;
  productType?: string;
  collectionIds: string[];
  description: string;
  shortDescription?: string;
  fabricDetails: string;
  fabricType?: FabricType;
  careInstructions: string;
  fit?: FitType;
  pattern?: PatternType;
  sleeve?: SleeveType;
  neck?: NeckType;
  gender?: GenderCategory;
  season?: string;
  occasion?: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  discountPercentage?: number;
  images: string[];
  threeDAssetId?: string;
  threeDClothingUrl?: string;
  compatibleAvatarIds: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isLimitedEdition?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  status: 'published' | 'draft' | 'archived' | 'ready';
  createdAt: string;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  featuredProductIds: string[];
  status: 'active' | 'scheduled' | 'hidden';
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  price: number;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  imageUrl?: string;
  image?: string;
  unitPrice?: number;
  totalPrice?: number;
  sku?: string;
  maxStock?: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'Confirmed'
  | 'Packed'
  | 'Out for Delivery'
  | 'Shipped'
  | 'Delivered'
  | 'Pending'
  | string;

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  discountAmount?: number;
  shipping?: number;
  shippingFee?: number;
  taxAmount?: number;
  total?: number;
  totalAmount?: number;
  status: OrderStatus;
  orderStatus?: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'upi' | 'cod' | 'credit_card' | 'net_banking' | string;
  shippingAddress: Address;
  trackingNumber?: string;
  courierName?: string;
  estimatedDeliveryDate?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;

  description?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  type?: 'percentage' | 'fixed';
  value?: number;
  minOrderAmount?: number;
  minCartValue?: number;
  maxDiscountAmount?: number;
  maxDiscount?: number;
  expiryDate?: string;
  validUntil?: string;
  usageLimit?: number;
  usageCount?: number;
  isActive: boolean;
}

export interface FashionColorOption {
  name: string;
  hex: string;
  description: string;
  family?: ColorFamily;
  category?: string;
}

export type SkinToneCategory =
  | 'fair_porcelain'
  | 'warm_golden'
  | 'cool_rosy'
  | 'olive_neutral'
  | 'deep_amber'
  | 'rich_bronze';

export interface SkinToneRecommendation {
  toneKey?: SkinToneCategory;
  toneName?: string;
  undertone: 'Warm' | 'Cool' | 'Olive' | 'Neutral';
  paletteName: string;
  title: string;
  description: string;
  recommendedColors: FashionColorOption[];
  avoidColors?: FashionColorOption[];
  matchingProductSlugs?: string[];
}

export type FitFeedback = 'Runs Small' | 'True to Size' | 'Runs Large';

export interface ProductReview {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 - 5
  title?: string;
  comment: string;
  fitFeedback?: FitFeedback;
  isVerifiedBuyer: boolean;
  status: 'approved' | 'pending' | 'rejected';
  helpfulCount: number;
  createdAt: string;
}

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push';

export type NotificationType =
  | 'order_placed'
  | 'payment_received'
  | 'order_shipped'
  | 'out_for_delivery'
  | 'order_delivered'
  | 'promotion_broadcast'
  | 'price_drop'
  | 'return_update';

export interface CustomerNotification {
  id: string;
  userId?: string;
  recipientEmail?: string;
  recipientName?: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  htmlContent?: string;
  metadata?: {
    orderId?: string;
    orderNumber?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    courierName?: string;
    promoCode?: string;
    discountPercent?: number;
    amount?: number;
  };
  isRead: boolean;
  sentAt: string;
}

