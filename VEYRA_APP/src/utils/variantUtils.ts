import { Product, ProductVariant, ColorFamily } from '../types';

export interface SizeAvailability {
  size: string;
  stock: number;
  isAvailable: boolean;
}

export interface ColorAvailability {
  colorName: string;
  colorHex: string;
  colorFamily?: ColorFamily;
  stock: number;
  isAvailable: boolean;
}

/**
 * Generate a standardized luxury SKU code
 * Format: VYR-{CATEGORY_CODE}-{COLOR_CODE}-{SIZE}
 */
export const generateSKU = (
  brand = 'VYR',
  category: string,
  colorName: string,
  size: string
): string => {
  const catCode = category.substring(0, 3).toUpperCase();
  const colorCode = colorName
    .split(' ')
    .map((w) => w.substring(0, 2).toUpperCase())
    .join('')
    .substring(0, 3);
  return `${brand.substring(0, 3).toUpperCase()}-${catCode}-${colorCode}-${size.toUpperCase()}`;
};

/**
 * Find exact variant matching size and color
 */
export const getVariant = (
  product: Product,
  size: string,
  colorHexOrName: string
): ProductVariant | null => {
  if (!product || !product.variants) return null;
  const match = product.variants.find((v) => {
    const matchesSize = v.size.toLowerCase() === size.toLowerCase();
    const matchesColor =
      v.colorHex.toLowerCase() === colorHexOrName.toLowerCase() ||
      v.colorName.toLowerCase() === colorHexOrName.toLowerCase();
    return matchesSize && matchesColor;
  });
  return match || null;
};

/**
 * Get dedicated stock count for a specific size and color combination
 */
export const getVariantStock = (
  product: Product,
  size: string,
  colorHexOrName: string
): number => {
  const variant = getVariant(product, size, colorHexOrName);
  return variant ? variant.stock : 0;
};

/**
 * Check if a specific variant has available inventory
 */
export const isVariantInStock = (
  product: Product,
  size: string,
  colorHexOrName: string
): boolean => {
  return getVariantStock(product, size, colorHexOrName) > 0;
};

/**
 * Get all available sizes with live stock for a chosen color
 */
export const getAvailableSizesForColor = (
  product: Product,
  colorHexOrName: string
): SizeAvailability[] => {
  if (!product || !product.variants) return [];

  // Group variants for this color
  const colorVariants = product.variants.filter(
    (v) =>
      v.colorHex.toLowerCase() === colorHexOrName.toLowerCase() ||
      v.colorName.toLowerCase() === colorHexOrName.toLowerCase()
  );

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const sizesPresent = Array.from(new Set(product.variants.map((v) => v.size)));

  const sizeOrder = [
    ...standardSizes.filter((s) => sizesPresent.includes(s)),
    ...sizesPresent.filter((s) => !standardSizes.includes(s)),
  ];

  return sizeOrder.map((size) => {
    const variant = colorVariants.find((v) => v.size.toLowerCase() === size.toLowerCase());
    const stock = variant ? variant.stock : 0;
    return {
      size,
      stock,
      isAvailable: stock > 0,
    };
  });
};

/**
 * Get all colors with live stock for a chosen size
 */
export const getAvailableColorsForSize = (
  product: Product,
  size: string
): ColorAvailability[] => {
  if (!product || !product.variants) return [];

  const uniqueColorsMap = new Map<string, { name: string; hex: string; family?: ColorFamily }>();
  product.variants.forEach((v) => {
    if (!uniqueColorsMap.has(v.colorHex.toLowerCase())) {
      uniqueColorsMap.set(v.colorHex.toLowerCase(), {
        name: v.colorName,
        hex: v.colorHex,
        family: v.colorFamily,
      });
    }
  });

  return Array.from(uniqueColorsMap.values()).map((color) => {
    const variant = product.variants.find(
      (v) =>
        v.size.toLowerCase() === size.toLowerCase() &&
        v.colorHex.toLowerCase() === color.hex.toLowerCase()
    );
    const stock = variant ? variant.stock : 0;
    return {
      colorName: color.name,
      colorHex: color.hex,
      colorFamily: color.family,
      stock,
      isAvailable: stock > 0,
    };
  });
};

/**
 * Calculate effective retail price considering variant overrides
 */
export const getEffectivePrice = (
  product: Product,
  variant?: ProductVariant | null
): { price: number; originalPrice?: number; discountPercentage?: number } => {
  if (!product) return { price: 0 };
  const price = variant?.priceOverride ?? product.price;
  const originalPrice = product.originalPrice;
  let discountPercentage = product.discountPercentage;

  if (originalPrice && originalPrice > price && !discountPercentage) {
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  return { price, originalPrice, discountPercentage };
};

/**
 * Get list of all distinct colors across all variants
 */
export const getAllUniqueColors = (
  product: Product
): { name: string; hex: string; family?: ColorFamily }[] => {
  if (!product || !product.variants) return [];
  const map = new Map<string, { name: string; hex: string; family?: ColorFamily }>();
  product.variants.forEach((v) => {
    const key = v.colorHex.toLowerCase();
    if (!map.has(key)) {
      map.set(key, { name: v.colorName, hex: v.colorHex, family: v.colorFamily });
    }
  });
  return Array.from(map.values());
};

/**
 * Get list of all unique sizes present in product variants
 */
export const getAllUniqueSizes = (product: Product): string[] => {
  if (!product || !product.variants) return [];
  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const sizesPresent = Array.from(new Set(product.variants.map((v) => v.size)));
  return [
    ...standardSizes.filter((s) => sizesPresent.includes(s)),
    ...sizesPresent.filter((s) => !standardSizes.includes(s)),
  ];
};

/**
 * Calculate total inventory across all size/color combinations
 */
export const getTotalStock = (product: Product): number => {
  if (!product || !product.variants) return 0;
  return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
};

/**
 * Get inventory badge status (in_stock, low_stock, out_of_stock)
 */
export const getStockStatus = (
  product: Product,
  size?: string,
  colorHexOrName?: string
): 'in_stock' | 'low_stock' | 'out_of_stock' => {
  if (size && colorHexOrName) {
    const stock = getVariantStock(product, size, colorHexOrName);
    if (stock <= 0) return 'out_of_stock';
    if (stock <= 5) return 'low_stock';
    return 'in_stock';
  }

  const total = getTotalStock(product);
  if (total <= 0) return 'out_of_stock';
  if (total <= 15) return 'low_stock';
  return 'in_stock';
};

/**
 * Auto-generate full ProductVariant matrix from selected sizes and colors
 */
export const generateVariantMatrix = (
  productCategory: string,
  sizes: string[],
  colors: { name: string; hex: string; family?: ColorFamily }[],
  defaultStock = 15
): ProductVariant[] => {
  const variants: ProductVariant[] = [];

  colors.forEach((color) => {
    sizes.forEach((size) => {
      const sku = generateSKU('VYR', productCategory, color.name, size);
      variants.push({
        id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        size,
        colorName: color.name,
        colorHex: color.hex,
        colorFamily: color.family,
        sku,
        stock: defaultStock,
      });
    });
  });

  return variants;
};

export default {
  generateSKU,
  getVariant,
  getVariantStock,
  isVariantInStock,
  getAvailableSizesForColor,
  getAvailableColorsForSize,
  getEffectivePrice,
  getAllUniqueColors,
  getAllUniqueSizes,
  getTotalStock,
  getStockStatus,
  generateVariantMatrix,
};
