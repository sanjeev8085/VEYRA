import { Product, Order, User, Coupon, ThreeDModelAsset } from '../../types';
import { SEED_PRODUCTS, SEED_COUPONS, SEED_AVATARS } from '../../data/seedData';


/**
 * Storage & Local Database Repository Layer
 * Modular repository services providing persistent CRUD operations,
 * filtering, pagination, and relational lookups across all platform entities.
 */

export interface QueryOptions<T> {
  filter?: (item: T) => boolean;
  sort?: (a: T, b: T) => number;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Generic Base Repository providing localStorage persistence
 */
export class BaseRepository<T extends { id: string }> {
  protected storageKey: string;
  protected initialSeed: T[];

  constructor(storageKey: string, initialSeed: T[] = []) {
    this.storageKey = `veyra_db_${storageKey}`;
    this.initialSeed = initialSeed;
    this.initialize();
  }

  private initialize(): void {
    try {
      const existing = localStorage.getItem(this.storageKey);
      if (!existing && this.initialSeed.length > 0) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.initialSeed));
      }
    } catch (err) {
      console.warn(`[DB Repository] LocalStorage init failed for ${this.storageKey}:`, err);
    }
  }

  protected getAllRaw(): T[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return this.initialSeed;
  }

  protected saveAll(items: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (err) {
      console.warn(`[DB Repository] LocalStorage write failed for ${this.storageKey}:`, err);
    }
  }

  public async findById(id: string): Promise<T | null> {
    const items = this.getAllRaw();
    return items.find((item) => item.id === id) || null;
  }

  public async findAll(options: QueryOptions<T> = {}): Promise<PaginatedResult<T>> {
    let items = this.getAllRaw();

    if (options.filter) {
      items = items.filter(options.filter);
    }

    if (options.sort) {
      items = items.sort(options.sort);
    }

    const total = items.length;
    const page = Math.max(1, options.page || 1);
    const limit = options.limit ? Math.max(1, options.limit) : total || 1;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async create(entity: T): Promise<T> {
    const items = this.getAllRaw();
    const exists = items.some((i) => i.id === entity.id);
    if (exists) {
      throw new Error(`Entity with ID ${entity.id} already exists.`);
    }
    const updated = [entity, ...items];
    this.saveAll(updated);
    return entity;
  }

  public async update(id: string, partial: Partial<T>): Promise<T> {
    const items = this.getAllRaw();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Entity with ID ${id} not found.`);
    }
    const updatedEntity = { ...items[index], ...partial };
    items[index] = updatedEntity;
    this.saveAll(items);
    return updatedEntity;
  }

  public async delete(id: string): Promise<boolean> {
    const items = this.getAllRaw();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) {
      return false;
    }
    this.saveAll(filtered);
    return true;
  }

  public async count(filter?: (item: T) => boolean): Promise<number> {
    const items = this.getAllRaw();
    return filter ? items.filter(filter).length : items.length;
  }
}

/**
 * Specialized Product Repository
 */
export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('products', SEED_PRODUCTS);
  }

  public async findBySlug(slug: string): Promise<Product | null> {
    const items = this.getAllRaw();
    return items.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  public async findByCategory(category: string): Promise<Product[]> {
    const items = this.getAllRaw();
    return items.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase() && p.status === 'published'
    );
  }

  public async findByCollection(collectionId: string): Promise<Product[]> {
    const items = this.getAllRaw();
    return items.filter((p) => p.collectionIds.includes(collectionId) && p.status === 'published');
  }

  public async updateInventory(productId: string, variantId: string, newStock: number): Promise<Product> {
    const product = await this.findById(productId);
    if (!product) throw new Error(`Product ${productId} not found.`);

    const updatedVariants = product.variants.map((v) =>
      v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
    );

    return this.update(productId, { variants: updatedVariants });
  }
}

/**
 * Specialized Order Repository
 */
export interface ReturnTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  createdAt: string;
  items: { productId: string; productName: string; size: string; quantity: number; price: number }[];
  reason: string;
  additionalNotes?: string;
  refundMethod: 'original_payment' | 'store_credit';
  status: 'requested' | 'approved' | 'in_transit' | 'refunded';
  refundAmount: number;
}

export class OrderRepository extends BaseRepository<Order> {
  private returnStorageKey = 'veyra_db_returns';

  constructor() {
    super('orders', []);
  }

  public async findByUserId(userId: string): Promise<Order[]> {
    const items = this.getAllRaw();
    return items.filter((o) => o.userId === userId);
  }

  public async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const items = this.getAllRaw();
    return items.find((o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()) || null;
  }

  public async createReturnRequest(ticket: ReturnTicket): Promise<ReturnTicket> {
    try {
      const existing = JSON.parse(localStorage.getItem(this.returnStorageKey) || '[]');
      const updated = [ticket, ...existing];
      localStorage.setItem(this.returnStorageKey, JSON.stringify(updated));

      // Update order status if found
      const order = await this.findById(ticket.orderId);
      if (order) {
        await this.update(ticket.orderId, { orderStatus: 'Return Requested' });
      }

      return ticket;
    } catch {
      return ticket;
    }
  }

  public async getReturnRequests(userId?: string): Promise<ReturnTicket[]> {
    try {
      const existing: ReturnTicket[] = JSON.parse(localStorage.getItem(this.returnStorageKey) || '[]');
      if (userId) {
        // If order belongs to user
        const userOrders = await this.findByUserId(userId);
        const userOrderIds = new Set(userOrders.map((o) => o.id));
        return existing.filter((r) => userOrderIds.has(r.orderId));
      }
      return existing;
    } catch {
      return [];
    }
  }

}

/**
 * Specialized Customer & CRM Repository
 */
export class CustomerRepository extends BaseRepository<User> {
  constructor() {
    super('customers', []);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const items = this.getAllRaw();
    return items.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
}

/**
 * Specialized Coupon Repository
 */
export class CouponRepository extends BaseRepository<Coupon> {
  constructor() {
    super('coupons', SEED_COUPONS);
  }

  public async findByCode(code: string): Promise<Coupon | null> {
    const items = this.getAllRaw();
    return items.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive) || null;
  }

  public async incrementUsage(code: string): Promise<void> {
    const coupon = await this.findByCode(code);
    if (coupon) {
      await this.update(coupon.id, { usageCount: (coupon.usageCount || 0) + 1 });
    }
  }
}

/**
 * Specialized 3D Asset Repository
 */
export class AssetRepository extends BaseRepository<ThreeDModelAsset> {
  constructor() {
    super('assets_3d', SEED_AVATARS);
  }

  public async findAvatars(): Promise<ThreeDModelAsset[]> {
    const items = this.getAllRaw();
    return items.filter((a) => a.type === 'human_avatar');
  }

  public async findGarments(): Promise<ThreeDModelAsset[]> {
    const items = this.getAllRaw();
    return items.filter((a) => a.type === 'clothing_garment');
  }
}

// Global Database Singletons
export const db = {
  products: new ProductRepository(),
  orders: new OrderRepository(),
  customers: new CustomerRepository(),
  coupons: new CouponRepository(),
  assets: new AssetRepository(),
};

export default db;
