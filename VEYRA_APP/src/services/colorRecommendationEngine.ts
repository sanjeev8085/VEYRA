import { FashionColorOption, SkinToneCategory, SkinToneRecommendation } from '../types';

export const VEYRA_PALETTE: Record<string, FashionColorOption> = {
  ivory: { name: 'Ivory Linen', hex: '#faf8f5', description: 'Clean, luminous neutral that flatters every complexion', category: 'neutral' },
  warm_sand: { name: 'Warm Sand', hex: '#d8caa8', description: 'Sun-drenched Mediterranean neutral with earthy warmth', category: 'neutral' },
  terracotta: { name: 'Earthy Terracotta', hex: '#c45b38', description: 'Rich Tuscan clay hue that highlights natural golden glow', category: 'earth' },
  sage: { name: 'Botanical Sage', hex: '#6c8a66', description: 'Soothing organic green that balances warm undertones', category: 'earth' },
  sky_blue: { name: 'Capri Sky Blue', hex: '#4a7c9f', description: 'Refreshing coastal blue that provides crisp contrast', category: 'cool' },
  navy: { name: 'Midnight Navy', hex: '#1f3044', description: 'Timeless sartorial foundation that frames cool & warm skin', category: 'cool' },
  burgundy: { name: 'Vintage Burgundy', hex: '#722f37', description: 'Decadent wine red with opulent depth and presence', category: 'jewel' },
  coral: { name: 'Sunlit Coral', hex: '#d96b58', description: 'Energetic peach-coral that brings radiance to tired skin', category: 'warm' },
  forest_green: { name: 'Alpine Forest Green', hex: '#2d4a34', description: 'Deep grounding green that accentuates deep & olive tones', category: 'earth' },
  olive: { name: 'Sartorial Olive', hex: '#6b7a42', description: 'Sophisticated muted green inspired by Tuscan olive groves', category: 'earth' },
  lavender: { name: 'Provence Lavender', hex: '#9685a7', description: 'Soft airy pastel that illuminates cool porcelain complexions', category: 'cool' },
  plum: { name: 'Imperial Plum', hex: '#4a2545', description: 'Rich jewel tone that adds aristocratic evening drama', category: 'jewel' },
  mustard: { name: 'Golden Mustard', hex: '#d4a373', description: 'Warm amber pigment celebrating sunlight and texture', category: 'warm' },
  chocolate: { name: 'Dark Cocoa Chocolate', hex: '#4a3728', description: 'Deep espresso tone with velvety softness', category: 'neutral' },
  soft_peach: { name: 'Riviera Soft Peach', hex: '#f4a261', description: 'Warm gentle pastel that boosts natural cheek radiance', category: 'warm' },
};

export const SKIN_TONE_RECOMMENDATIONS: Record<SkinToneCategory, SkinToneRecommendation> = {
  warm_golden: {
    toneKey: 'warm_golden',
    title: 'Warm Golden & Honey Complexion',
    undertone: 'Warm',
    paletteName: 'Sunlit Mediterranean Palette',
    description:
      'Your complexion possesses warm amber and golden honey undertones. Earthy pigments like Terracotta, Botanical Sage, and Warm Sand reflect your natural warmth while Midnight Navy creates a striking contrast.',
    recommendedColors: [
      VEYRA_PALETTE.terracotta,
      VEYRA_PALETTE.sage,
      VEYRA_PALETTE.warm_sand,
      VEYRA_PALETTE.ivory,
      VEYRA_PALETTE.navy,
      VEYRA_PALETTE.soft_peach,
    ],
  },
  cool_rosy: {
    toneKey: 'cool_rosy',
    title: 'Cool Rosy & Alabaster Complexion',
    undertone: 'Cool',
    paletteName: 'Nordic Coastal & Jewel Palette',
    description:
      'Your complexion features delicate cool, blue, or pink undertones. Crisp Capri Sky Blue, Midnight Navy, Vintage Burgundy, and Provence Lavender will enhance your clarity and vibrant facial structure.',
    recommendedColors: [
      VEYRA_PALETTE.sky_blue,
      VEYRA_PALETTE.navy,
      VEYRA_PALETTE.burgundy,
      VEYRA_PALETTE.lavender,
      VEYRA_PALETTE.ivory,
      VEYRA_PALETTE.plum,
    ],
  },
  deep_amber: {
    toneKey: 'deep_amber',
    title: 'Deep Amber & Warm Espresso Complexion',
    undertone: 'Warm',
    paletteName: 'Imperial Warmth & Jewel Palette',
    description:
      'Your rich complexion has deep warmth with radiant resonance. High-contrast Ivory Linen, Golden Mustard, Alpine Forest Green, and Earthy Terracotta make your features command attention.',
    recommendedColors: [
      VEYRA_PALETTE.mustard,
      VEYRA_PALETTE.forest_green,
      VEYRA_PALETTE.terracotta,
      VEYRA_PALETTE.ivory,
      VEYRA_PALETTE.coral,
      VEYRA_PALETTE.sky_blue,
    ],
  },
  olive_neutral: {
    toneKey: 'olive_neutral',
    title: 'Olive & Balanced Neutral Complexion',
    undertone: 'Neutral',
    paletteName: 'Tuscan Earth & Modern Neutral Palette',
    description:
      'Your complexion exhibits a balanced olive or neutral undertone without overpowering pink or yellow. Botanical Sage, Earthy Terracotta, Sartorial Olive, and Midnight Navy harmonize seamlessly.',
    recommendedColors: [
      VEYRA_PALETTE.sage,
      VEYRA_PALETTE.terracotta,
      VEYRA_PALETTE.olive,
      VEYRA_PALETTE.navy,
      VEYRA_PALETTE.warm_sand,
      VEYRA_PALETTE.plum,
    ],
  },
  fair_porcelain: {
    toneKey: 'fair_porcelain',
    title: 'Fair Porcelain & Crisp Complexion',
    undertone: 'Cool',
    paletteName: 'Alpine Azure & Velvet Wine Palette',
    description:
      'Your fair skin benefits from colors with rich saturation that avoid washing out your delicate features. Vintage Burgundy, Capri Sky Blue, Botanical Sage, and Sunlit Coral create a healthy, luminous glow.',
    recommendedColors: [
      VEYRA_PALETTE.burgundy,
      VEYRA_PALETTE.sky_blue,
      VEYRA_PALETTE.sage,
      VEYRA_PALETTE.coral,
      VEYRA_PALETTE.navy,
      VEYRA_PALETTE.ivory,
    ],
  },
  rich_bronze: {
    toneKey: 'rich_bronze',
    title: 'Rich Bronze & Sun-Kissed Complexion',
    undertone: 'Warm',
    paletteName: 'Golden Riviera & Terracotta Palette',
    description:
      'Your bronze complexion is complemented by warm sun-baked hues. Earthy Terracotta, Warm Sand, Riviera Soft Peach, and Midnight Navy offer majestic day-to-evening versatility.',
    recommendedColors: [
      VEYRA_PALETTE.terracotta,
      VEYRA_PALETTE.warm_sand,
      VEYRA_PALETTE.soft_peach,
      VEYRA_PALETTE.navy,
      VEYRA_PALETTE.sage,
      VEYRA_PALETTE.ivory,
    ],
  },
};

/**
 * Analyzes an image element via client-side canvas sampling
 * to determine the approximate skin tone category.
 */
export async function analyzeSkinToneFromImage(
  imageSource: HTMLImageElement | HTMLCanvasElement
): Promise<SkinToneRecommendation> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return SKIN_TONE_RECOMMENDATIONS.warm_golden;
  }

  const width = 120;
  const height = 120;
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(imageSource, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let skinPixelCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Standard heuristic skin filter in RGB space
    if (r > 60 && g > 40 && b > 20 && r > g && r > b && r - g > 15 && Math.abs(r - g) > 10) {
      totalR += r;
      totalG += g;
      totalB += b;
      skinPixelCount++;
    }
  }

  if (skinPixelCount < 100) {
    // Fallback: Sample central portrait area
    const startIdx = Math.floor(data.length * 0.3);
    const endIdx = Math.floor(data.length * 0.7);
    for (let i = startIdx; i < endIdx; i += 4) {
      totalR += data[i];
      totalG += data[i + 1];
      totalB += data[i + 2];
      skinPixelCount++;
    }
  }

  const avgR = totalR / (skinPixelCount || 1);
  const avgG = totalG / (skinPixelCount || 1);
  const avgB = totalB / (skinPixelCount || 1);

  // Determine brightness (Luminance) and Undertone (Warm vs Cool vs Olive)
  const luminance = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
  const redGreenRatio = avgR / (avgG || 1);
  const redBlueRatio = avgR / (avgB || 1);

  let toneCategory: SkinToneCategory = 'warm_golden';

  if (luminance > 180) {
    toneCategory = redBlueRatio > 1.35 ? 'fair_porcelain' : 'cool_rosy';
  } else if (luminance > 140) {
    if (Math.abs(avgR - avgG) < 25 && avgG > avgB) {
      toneCategory = 'olive_neutral';
    } else if (redGreenRatio > 1.25) {
      toneCategory = 'warm_golden';
    } else {
      toneCategory = 'cool_rosy';
    }
  } else if (luminance > 95) {
    toneCategory = redGreenRatio > 1.25 ? 'rich_bronze' : 'olive_neutral';
  } else {
    toneCategory = 'deep_amber';
  }

  return SKIN_TONE_RECOMMENDATIONS[toneCategory] || SKIN_TONE_RECOMMENDATIONS.warm_golden;
}
