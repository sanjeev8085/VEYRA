import { Product } from '../types';
import { SEED_PRODUCTS, SEED_COLLECTIONS } from '../data/seedData';
import { useStore } from '../store/useStore';


export interface ProductQueryParams {
  category?: string;
  collectionId?: string;
  gender?: 'men' | 'women' | 'unisex' | string;
  sizes?: string[];
  colors?: string[];
  colorFamilies?: string[];
  fit?: string;
  fabric?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'rating' | 'popularity' | 'name';
  page?: number;
  limit?: number;
  status?: 'published' | 'draft' | 'archived' | 'all';
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

export interface PaginatedProductResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  appliedFilters: Partial<ProductQueryParams>;
}

export interface CatalogFacets {
  categories: { id: string; label: string; count: number }[];
  collections: { id: string; title: string; count: number }[];
  colors: { name: string; hex: string; count: number }[];
  sizes: { size: string; count: number }[];
  priceRange: { min: number; max: number };
  fits: { fit: string; count: number }[];
  fabrics: { fabric: string; count: number }[];
}

/**
 * Product Catalog REST Query & API Service
 * High-performance querying, multi-faceted filtering, sorting, and pagination
 */
class ProductService {
  /**
   * Helper to retrieve active product repository from Zustand or fallback to seed data
   */
  private getProductSource(): Product[] {
    try {
      const state = useStore.getState();
      if (state && state.products && state.products.length > 0) {
        return state.products;
      }
    } catch {}
    return SEED_PRODUCTS;
  }

  /**
   * Query catalog products with filters, sorting, and pagination
   */
  public async getProducts(params: ProductQueryParams = {}): Promise<PaginatedProductResponse> {
    // Simulate ultra-fast network delay (<25ms)
    await new Promise((r) => setTimeout(r, 20));

    const allProducts = this.getProductSource();
    const {
      category = 'all',
      collectionId = 'all',
      gender = 'all',
      sizes = [],
      colors = [],
      colorFamilies = [],
      fit = 'all',
      fabric = 'all',
      minPrice,
      maxPrice,
      search = '',
      sortBy = 'newest',
      page = 1,
      limit = 12,
      status = 'published',
      isFeatured,
      isNewArrival,
    } = params;

    const filtered = allProducts.filter((product) => {
      // 1. Status filter
      if (status !== 'all' && product.status !== status) {
        return false;
      }

      // 2. Category filter
      if (category !== 'all' && product.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      // 3. Collection filter
      if (collectionId !== 'all' && !product.collectionIds.includes(collectionId)) {
        return false;
      }

      // 4. Gender filter
      if (gender !== 'all' && product.gender && product.gender !== gender && product.gender !== 'unisex') {
        return false;
      }

      // 5. Fit filter
      if (fit !== 'all' && product.fit && product.fit.toLowerCase() !== fit.toLowerCase()) {
        return false;
      }

      // 6. Fabric filter
      if (fabric !== 'all') {
        const productFabric = (product.fabricType || product.fabricDetails || '').toLowerCase();
        if (!productFabric.includes(fabric.toLowerCase())) {
          return false;
        }
      }


      // 7. Price range
      if (minPrice !== undefined && product.price < minPrice) {
        return false;
      }
      if (maxPrice !== undefined && product.price > maxPrice) {
        return false;
      }

      // 8. Size filter
      if (sizes.length > 0) {
        const hasSize = product.variants.some((v) => sizes.includes(v.size));
        if (!hasSize) return false;
      }

      // 9. Color / Color Family filter
      if (colors.length > 0) {
        const hasColor = product.variants.some(
          (v) =>
            colors.some((c) => c.toLowerCase() === v.colorName.toLowerCase()) ||
            (v.colorFamily && colors.some((c) => c.toLowerCase() === v.colorFamily?.toLowerCase()))
        );
        if (!hasColor) return false;
      }

      if (colorFamilies.length > 0) {
        const hasFamily = product.variants.some(
          (v) => v.colorFamily && colorFamilies.some((cf) => cf.toLowerCase() === v.colorFamily?.toLowerCase())
        );
        if (!hasFamily) return false;
      }

      // 10. Featured / New Arrival flags
      if (isFeatured !== undefined && (product.isTrending || product.isFeatured) !== isFeatured) {
        return false;
      }
      if (isNewArrival !== undefined && product.isNewArrival !== isNewArrival) {
        return false;
      }

      // 11. Keyword Search
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesVariant = product.variants.some(
          (v) => v.colorName.toLowerCase().includes(query) || v.sku.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesBrand && !matchesDesc && !matchesCategory && !matchesTags && !matchesVariant) {
          return false;
        }
      }

      return true;
    });

    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    // Pagination
    const total = sorted.length;
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const totalPages = Math.ceil(total / safeLimit) || 1;
    const startIndex = (safePage - 1) * safeLimit;
    const items = sorted.slice(startIndex, startIndex + safeLimit);

    return {
      items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasMore: safePage < totalPages,
      appliedFilters: params,
    };
  }

  /**
   * Lookup single product by slug
   */
  public async getProductBySlug(slug: string): Promise<Product | null> {
    await new Promise((r) => setTimeout(r, 15));
    const allProducts = this.getProductSource();
    const product = allProducts.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
    return product;
  }

  /**
   * Lookup single product by unique ID
   */
  public async getProductById(id: string): Promise<Product | null> {
    await new Promise((r) => setTimeout(r, 15));
    const allProducts = this.getProductSource();
    const product = allProducts.find((p) => p.id === id) || null;
    return product;
  }

  /**
   * Retrieve related / matching garments
   */
  public async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 20));
    const allProducts = this.getProductSource();
    const target = allProducts.find((p) => p.id === productId);

    if (!target) {
      return allProducts.filter((p) => p.status === 'published').slice(0, limit);
    }

    const related = allProducts
      .filter((p) => p.id !== productId && p.status === 'published')
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        if (a.category === target.category) scoreA += 3;
        if (b.category === target.category) scoreB += 3;

        const sharedCollectionsA = a.collectionIds.filter((c) => target.collectionIds.includes(c)).length;
        const sharedCollectionsB = b.collectionIds.filter((c) => target.collectionIds.includes(c)).length;
        scoreA += sharedCollectionsA * 2;
        scoreB += sharedCollectionsB * 2;

        return scoreB - scoreA;
      });

    return related.slice(0, limit);
  }

  /**
   * Retrieve curated featured showcase products
   */
  public async getFeaturedProducts(limit = 6): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 15));
    const allProducts = this.getProductSource();
    const featured = allProducts
      .filter((p) => p.status === 'published' && (p.isTrending || p.isNewArrival || p.isFeatured))
      .slice(0, limit);

    return featured.length > 0 ? featured : allProducts.slice(0, limit);
  }

  /**
   * Calculate dynamic catalog facets and aggregation counts
   */
  public async getCatalogFacets(): Promise<CatalogFacets> {
    await new Promise((r) => setTimeout(r, 20));
    const products = this.getProductSource().filter((p) => p.status === 'published');

    // 1. Categories
    const categoryCounts: Record<string, { label: string; count: number }> = {
      't-shirts': { label: 'T-Shirts', count: 0 },
      shirts: { label: 'Shirts', count: 0 },
      jackets: { label: 'Outerwear', count: 0 },
      trousers: { label: 'Trousers', count: 0 },
    };

    // 2. Collections
    const collectionCounts: Record<string, { title: string; count: number }> = {};
    SEED_COLLECTIONS.forEach((col) => {
      collectionCounts[col.id] = { title: col.title, count: 0 };
    });

    // 3. Colors
    const colorMap: Map<string, { name: string; hex: string; count: number }> = new Map();

    // 4. Sizes
    const sizeCounts: Record<string, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 };

    // 5. Price range
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    // 6. Fits & Fabrics
    const fitCounts: Record<string, number> = {};
    const fabricCounts: Record<string, number> = {};

    products.forEach((p) => {
      // Category
      if (categoryCounts[p.category]) {
        categoryCounts[p.category].count += 1;
      }

      // Collections
      p.collectionIds.forEach((cId) => {
        if (collectionCounts[cId]) {
          collectionCounts[cId].count += 1;
        }
      });

      // Price
      if (p.price < minPrice) minPrice = p.price;
      if (p.price > maxPrice) maxPrice = p.price;

      // Fit
      if (p.fit) {
        fitCounts[p.fit] = (fitCounts[p.fit] || 0) + 1;
      }

      // Fabric
      const fab = p.fabricType || (p.fabricDetails ? p.fabricDetails.split('(')[0].trim() : undefined);
      if (fab) {
        fabricCounts[fab] = (fabricCounts[fab] || 0) + 1;
      }



      // Variants (Sizes & Colors)
      p.variants.forEach((v) => {
        // Size
        if (sizeCounts[v.size] !== undefined) {
          sizeCounts[v.size] += 1;
        } else {
          sizeCounts[v.size] = 1;
        }

        // Color
        const colorKey = v.colorName.toLowerCase();
        if (colorMap.has(colorKey)) {
          const existing = colorMap.get(colorKey)!;
          existing.count += 1;
        } else {
          colorMap.set(colorKey, { name: v.colorName, hex: v.colorHex, count: 1 });
        }
      });
    });

    return {
      categories: Object.entries(categoryCounts).map(([id, val]) => ({ id, label: val.label, count: val.count })),
      collections: Object.entries(collectionCounts).map(([id, val]) => ({ id, title: val.title, count: val.count })),
      colors: Array.from(colorMap.values()),
      sizes: Object.entries(sizeCounts)
        .filter(([_, count]) => count > 0)
        .map(([size, count]) => ({ size, count })),
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice === -Infinity ? 5000 : maxPrice,
      },
      fits: Object.entries(fitCounts).map(([fit, count]) => ({ fit, count })),
      fabrics: Object.entries(fabricCounts).map(([fabric, count]) => ({ fabric, count })),
    };
  }
}

export const productService = new ProductService();
export default productService;
