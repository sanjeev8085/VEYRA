import { Collection, Product, GarmentCategory } from '../types';
import { SEED_COLLECTIONS, SEED_PRODUCTS } from '../data/seedData';
import { useStore } from '../store/useStore';

export interface CategorySubItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
}

export interface CategoryNode {
  id: string;
  slug: GarmentCategory | string;
  name: string;
  subtitle: string;
  description: string;
  gender: 'men' | 'women' | 'unisex' | 'all';
  imageUrl: string;
  productCount: number;
  subcategories: CategorySubItem[];
}

/**
 * Curated Hierarchical Taxonomies Definition
 */
export const HIERARCHICAL_CATEGORIES: CategoryNode[] = [
  {
    id: 'cat_tshirts',
    slug: 't-shirts',
    name: 'T-Shirts & Polos',
    subtitle: 'Peruvian Supima & Heavyweight Bio-Cotton',
    description: 'Everyday foundation pieces crafted with micro-ribbed necklines and architectural drape.',
    gender: 'unisex',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    productCount: 4,
    subcategories: [
      { id: 'sub_crew', slug: 'crewneck', name: 'Classic Crewneck', description: '220 GSM Supima bio-polished', productCount: 2 },
      { id: 'sub_oversized', slug: 'oversized', name: 'Oversized Street-Luxe', description: '280 GSM heavyweight drop-shoulder', productCount: 1 },
      { id: 'sub_polo', slug: 'polo', name: 'Atelier Knit Polo', description: 'Milano rib structured collar', productCount: 1 },
    ],
  },
  {
    id: 'cat_shirts',
    slug: 'shirts',
    name: 'Button-Downs & Overshirts',
    subtitle: 'Normandy Linen & 120s Two-Ply Giza Cotton',
    description: 'Bespoke casual and formal tailoring featuring mother-of-pearl buttons and clean single-needle seams.',
    gender: 'unisex',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    productCount: 4,
    subcategories: [
      { id: 'sub_linen_resort', slug: 'resort-linen', name: 'Riviera Resort Camp Collar', description: 'Pure Normandy linen', productCount: 2 },
      { id: 'sub_oxford', slug: 'oxford', name: 'Tailored Oxford Cloth', description: 'Pinpoint cotton button-down', productCount: 1 },
      { id: 'sub_formal', slug: 'formal-spread', name: 'Evening Spread Collar', description: '120s Egyptian cotton poplin', productCount: 1 },
    ],
  },
  {
    id: 'cat_jackets',
    slug: 'jackets',
    name: 'Outerwear & Overcoats',
    subtitle: 'Virgin Wool, Structured Twill & Technical Silk',
    description: 'Statement overcoats, structured blazers, and lightweight transition jackets tailored for timeless layering.',
    gender: 'unisex',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    productCount: 2,
    subcategories: [
      { id: 'sub_blazer', slug: 'blazers', name: 'Unstructured Atelier Blazers', description: 'Half-canvas drape', productCount: 1 },
      { id: 'sub_bomber', slug: 'bombers', name: 'Silk-Lined Minimalist Bombers', description: 'Matte technical twill', productCount: 1 },
    ],
  },
  {
    id: 'cat_trousers',
    slug: 'trousers',
    name: 'Trousers & Bottoms',
    subtitle: 'Double-Pleated Linen & Stretch Worsted Wool',
    description: 'High-waisted architectural trousers tailored with relaxed taper and subtle drape.',
    gender: 'unisex',
    imageUrl: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80',
    productCount: 2,
    subcategories: [
      { id: 'sub_pleated', slug: 'pleated', name: 'Double-Pleated Relaxed Trousers', description: 'Wide-leg flowing silhouette', productCount: 1 },
      { id: 'sub_chino', slug: 'tailored-chino', name: 'Tailored Minimalist Chino', description: 'Comfort stretch cotton twill', productCount: 1 },
    ],
  },
];

/**
 * Categories & Collections Management Service
 */
class CollectionService {
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
   * Get all active collections
   */
  public async getCollections(): Promise<Collection[]> {
    await new Promise((r) => setTimeout(r, 15));
    return SEED_COLLECTIONS.filter((c) => c.status === 'active');
  }

  /**
   * Get single collection by slug
   */
  public async getCollectionBySlug(slug: string): Promise<Collection | null> {
    await new Promise((r) => setTimeout(r, 15));
    return SEED_COLLECTIONS.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  /**
   * Get single collection by unique ID
   */
  public async getCollectionById(id: string): Promise<Collection | null> {
    await new Promise((r) => setTimeout(r, 15));
    return SEED_COLLECTIONS.find((c) => c.id === id) || null;
  }

  /**
   * Retrieve all products belonging to a specific collection
   */
  public async getProductsByCollection(collectionIdOrSlug: string): Promise<Product[]> {
    await new Promise((r) => setTimeout(r, 20));
    const allProducts = this.getProductSource();
    const collection =
      SEED_COLLECTIONS.find(
        (c) => c.id === collectionIdOrSlug || c.slug.toLowerCase() === collectionIdOrSlug.toLowerCase()
      ) || null;

    if (!collection) {
      return [];
    }

    return allProducts.filter(
      (p) =>
        p.status === 'published' &&
        (p.collectionIds.includes(collection.id) || collection.featuredProductIds.includes(p.id))
    );
  }

  /**
   * Get category hierarchy tree with live product counts
   */
  public async getCategoryHierarchy(): Promise<CategoryNode[]> {
    await new Promise((r) => setTimeout(r, 15));
    const allProducts = this.getProductSource().filter((p) => p.status === 'published');

    return HIERARCHICAL_CATEGORIES.map((cat) => {
      const matching = allProducts.filter((p) => p.category.toLowerCase() === cat.slug.toLowerCase());
      return {
        ...cat,
        productCount: matching.length,
      };
    });
  }

  /**
   * Generate navigational breadcrumbs for product categories
   */
  public getCategoryBreadcrumbs(
    category: string,
    subcategory?: string
  ): { label: string; path: string }[] {
    const crumbs: { label: string; path: string }[] = [
      { label: 'Home', path: '/' },
      { label: 'Wardrobe Catalog', path: '/catalog' },
    ];

    const foundCategory = HIERARCHICAL_CATEGORIES.find(
      (c) => c.slug.toLowerCase() === category.toLowerCase()
    );

    if (foundCategory) {
      crumbs.push({
        label: foundCategory.name,
        path: `/catalog?category=${foundCategory.slug}`,
      });

      if (subcategory) {
        const foundSub = foundCategory.subcategories.find(
          (s) => s.slug.toLowerCase() === subcategory.toLowerCase()
        );
        if (foundSub) {
          crumbs.push({
            label: foundSub.name,
            path: `/catalog?category=${foundCategory.slug}&sub=${foundSub.slug}`,
          });
        }
      }
    }

    return crumbs;
  }

  /**
   * Retrieve featured curated collections for homepage and lookbooks
   */
  public async getFeaturedCollections(): Promise<Collection[]> {
    await new Promise((r) => setTimeout(r, 15));
    return SEED_COLLECTIONS.slice(0, 3);
  }
}

export const collectionService = new CollectionService();
export default collectionService;
