import { Product, ThreeDModelAsset } from '../types';
import { SEED_AVATARS } from '../data/seedData';

/**
 * 3D Clothing-to-Model Compatibility Mapping Engine
 * Validates, filters, and maps garments to compatible 3D human mannequins/avatars.
 */

export interface CompatibilityCheckResult {
  isCompatible: boolean;
  reason?: string;
  suggestedAvatarId?: string;
  recommendedScaling?: number;
}

/**
 * Retrieve all registered 3D human avatars
 */
export const getAllAvatars = (): ThreeDModelAsset[] => {
  return SEED_AVATARS;
};

/**
 * Lookup avatar details by ID
 */
export const getAvatarById = (avatarId: string): ThreeDModelAsset | null => {
  return SEED_AVATARS.find((a) => a.id === avatarId) || null;
};

/**
 * Check if a product is compatible with a chosen avatar model ID
 */
export const isAvatarCompatible = (product: Product, avatarId: string): boolean => {
  if (!product || !avatarId) return false;

  // 1. Check explicit compatibleAvatarIds on product record
  if (product.compatibleAvatarIds && product.compatibleAvatarIds.length > 0) {
    return product.compatibleAvatarIds.includes(avatarId);
  }

  // 2. Gender / Silhouette Compatibility Rules
  const avatar = getAvatarById(avatarId);
  if (!avatar) return true; // Default fallback to allow rendering

  const productGender = (product.gender || 'unisex').toLowerCase();
  const avatarGender = (avatar.gender || 'unisex').toLowerCase();

  // Unisex pieces fit all models
  if (productGender === 'unisex' || product.fit === 'Oversized' || product.fit === 'Relaxed') {
    return true;
  }

  // Strict male / female matching for tailored cuts
  return productGender === avatarGender;
};

/**
 * Get full list of compatible avatars for a specific garment
 */
export const getCompatibleAvatars = (product: Product): ThreeDModelAsset[] => {
  if (!product) return SEED_AVATARS;

  if (product.compatibleAvatarIds && product.compatibleAvatarIds.length > 0) {
    const list = SEED_AVATARS.filter((a) => product.compatibleAvatarIds.includes(a.id));
    if (list.length > 0) return list;
  }

  return SEED_AVATARS.filter((a) => isAvatarCompatible(product, a.id));
};

/**
 * Select the optimal default avatar ID for a garment
 */
export const getSuggestedAvatarForProduct = (product: Product): string => {
  if (!product) return 'avatar-male-01';

  const compatible = getCompatibleAvatars(product);
  if (compatible.length > 0) {
    // If product is womenswear, prioritize female avatar
    if (product.gender === 'women') {
      const femaleAvatar = compatible.find((a) => a.gender === 'female');
      if (femaleAvatar) return femaleAvatar.id;
    }
    return compatible[0].id;
  }

  return 'avatar-male-01';
};

/**
 * Diagnostic check providing human-readable incompatibility feedback
 */
export const checkGarmentAvatarCompatibility = (
  product: Product,
  avatarId: string
): CompatibilityCheckResult => {
  const isComp = isAvatarCompatible(product, avatarId);
  const avatar = getAvatarById(avatarId);

  if (isComp) {
    return {
      isCompatible: true,
      recommendedScaling: 1.0,
    };
  }

  const suggestedId = getSuggestedAvatarForProduct(product);
  const productGender = product.gender || 'unisex';
  const avatarName = avatar?.name || 'Selected Avatar';


  return {
    isCompatible: false,
    reason: `This ${product.name} is cut specifically for ${productGender.toUpperCase()} tailoring and may experience mesh collision or unnatural drape on ${avatarName}.`,
    suggestedAvatarId: suggestedId,
    recommendedScaling: 1.0,
  };
};

/**
 * Return warning string for frontend UI pills or null if clean
 */
export const getIncompatibilityWarning = (product: Product, avatarId: string): string | null => {
  const check = checkGarmentAvatarCompatibility(product, avatarId);
  return check.isCompatible ? null : check.reason || 'Silhouette mismatch detected.';
};

/**
 * Filter catalog products to only those compatible with an active avatar
 */
export const filterProductsForAvatar = (products: Product[], avatarId: string): Product[] => {
  return products.filter((p) => isAvatarCompatible(p, avatarId));
};

export default {
  getAllAvatars,
  getAvatarById,
  isAvatarCompatible,
  getCompatibleAvatars,
  getSuggestedAvatarForProduct,
  checkGarmentAvatarCompatibility,
  getIncompatibilityWarning,
  filterProductsForAvatar,
};
