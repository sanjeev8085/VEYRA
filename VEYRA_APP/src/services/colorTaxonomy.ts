import { ColorTaxonomy } from '../types';

export const COLOR_TAXONOMY_LIST: ColorTaxonomy[] = [
  // Neutrals / Whites / Creams
  { family: 'Ivory', displayName: 'Ivory Linen', hex: '#faf8f5', undertoneMatch: 'Universal Neutral' },
  { family: 'White', displayName: 'Optical Crisp White', hex: '#ffffff', undertoneMatch: 'Cool & Fair' },
  { family: 'Cream', displayName: 'Alabaster Cream', hex: '#f4efe6', undertoneMatch: 'Warm & Fair' },
  { family: 'Beige', displayName: 'Warm Oat Beige', hex: '#e3dcce', undertoneMatch: 'Warm Golden' },
  { family: 'Brown', displayName: 'Rich Espresso Brown', hex: '#3d2b1f', undertoneMatch: 'Deep Amber & Warm' },
  { family: 'Grey', displayName: 'Heather Slate Grey', hex: '#7a7a85', undertoneMatch: 'Cool & Neutral' },
  { family: 'Black', displayName: 'Obsidian Noir', hex: '#121216', undertoneMatch: 'Universal' },

  // Blues & Sky
  { family: 'Navy', displayName: 'Midnight Navy', hex: '#1f3044', undertoneMatch: 'Universal & Cool' },
  { family: 'Blue', displayName: 'Aegean French Blue', hex: '#2b507d', undertoneMatch: 'Cool Neutral' },
  { family: 'Sky Blue', displayName: 'Capri Sky Blue', hex: '#4a7c9f', undertoneMatch: 'Cool Rosy & Fair' },

  // Greens & Earth
  { family: 'Sage', displayName: 'Botanical Sage', hex: '#6c8a66', undertoneMatch: 'Olive & Warm Tones' },
  { family: 'Olive', displayName: 'Tuscan Olive', hex: '#5b6b47', undertoneMatch: 'Warm Olive & Deep' },
  { family: 'Green', displayName: 'Forest Pine', hex: '#244033', undertoneMatch: 'Neutral Deep' },

  // Earthy Reds & Terracottas
  { family: 'Terracotta', displayName: 'Earthy Terracotta', hex: '#c45b38', undertoneMatch: 'Golden Honey & Warm' },
  { family: 'Burgundy', displayName: 'Vintage Burgundy', hex: '#722f37', undertoneMatch: 'Fair Porcelain & Cool' },
  { family: 'Red', displayName: 'Crimson Rust', hex: '#9e2a2b', undertoneMatch: 'Warm & Olive' },
  { family: 'Pink', displayName: 'Blush Petal', hex: '#dca7a5', undertoneMatch: 'Cool Rosy' },
  { family: 'Orange', displayName: 'Sunlit Coral', hex: '#d96b58', undertoneMatch: 'Rich Bronze & Amber' },

  // Yellows & Purples
  { family: 'Yellow', displayName: 'Warm Sandstone', hex: '#d8caa8', undertoneMatch: 'Warm Golden' },
  { family: 'Mustard', displayName: 'Champagne Ochre', hex: '#c59b27', undertoneMatch: 'Warm Amber' },
  { family: 'Lavender', displayName: 'Muted Lavender', hex: '#9d8ca1', undertoneMatch: 'Cool & Fair' },
  { family: 'Purple', displayName: 'Imperial Plum', hex: '#4a2545', undertoneMatch: 'Deep Bronze' },
];

/**
 * Maps any hex color to the closest Color Family in VEYRA taxonomy
 */
export function getClosestColorTaxonomy(hex: string): ColorTaxonomy {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  let minDistance = Infinity;
  let bestMatch = COLOR_TAXONOMY_LIST[0];

  for (const item of COLOR_TAXONOMY_LIST) {
    const itemHex = item.hex.replace('#', '');
    const ir = parseInt(itemHex.substring(0, 2), 16);
    const ig = parseInt(itemHex.substring(2, 4), 16);
    const ib = parseInt(itemHex.substring(4, 6), 16);

    // Euclidean RGB distance
    const dist = Math.sqrt(
      Math.pow(r - ir, 2) * 0.3 + Math.pow(g - ig, 2) * 0.59 + Math.pow(b - ib, 2) * 0.11
    );

    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = item;
    }
  }

  return bestMatch;
}

/**
 * Automatically extracts dominant primary & secondary colors from an image File
 */
export async function detectColorFromImageFile(
  file: File
): Promise<{ primary: ColorTaxonomy; secondary: ColorTaxonomy; confidence: 'High' | 'Medium' }> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ primary: COLOR_TAXONOMY_LIST[0], secondary: COLOR_TAXONOMY_LIST[1], confidence: 'Medium' });
        return;
      }

      canvas.width = 40;
      canvas.height = 40;
      ctx.drawImage(img, 0, 0, 40, 40);
      const imgData = ctx.getImageData(5, 5, 30, 30).data;

      let totalR = 0, totalG = 0, totalB = 0, count = 0;
      for (let i = 0; i < imgData.length; i += 16) {
        // Skip pure black and pure white background pixels
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        if ((r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) continue;

        totalR += r;
        totalG += g;
        totalB += b;
        count++;
      }

      if (count === 0) {
        resolve({ primary: COLOR_TAXONOMY_LIST[0], secondary: COLOR_TAXONOMY_LIST[1], confidence: 'Medium' });
        return;
      }

      const avgR = Math.round(totalR / count);
      const avgG = Math.round(totalG / count);
      const avgB = Math.round(totalB / count);

      const hex = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
      const primaryMatch = getClosestColorTaxonomy(hex);
      const secondaryMatch = COLOR_TAXONOMY_LIST.find((c) => c.family !== primaryMatch.family) || COLOR_TAXONOMY_LIST[1];

      resolve({
        primary: primaryMatch,
        secondary: secondaryMatch,
        confidence: 'High',
      });
    };

    reader.readAsDataURL(file);
  });
}
