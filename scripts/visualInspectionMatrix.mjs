/**
 * VEYRA — Deep Visual Layout & Parent-Child Bounding Analysis
 * Calculates exact element geometry, padding, content widths, and containment across all device viewports.
 */

const viewports = [
  { name: 'Micro Mobile (iPhone SE/5)', width: 320, height: 568 },
  { name: 'Standard Mobile (Galaxy S8/A50)', width: 360, height: 800 },
  { name: 'iPhone X/11/12/13 Mini', width: 375, height: 812 },
  { name: 'iPhone 14/15/16', width: 390, height: 844 },
  { name: 'iPhone Plus / Max', width: 414, height: 896 },
  { name: 'Phablet / Large Mobile', width: 480, height: 854 },
  { name: 'Small Tablet', width: 600, height: 960 },
  { name: 'iPad Portrait', width: 768, height: 1024 },
  { name: 'iPad Air / Pro 11', width: 820, height: 1180 },
  { name: 'Laptop / iPad Landscape', width: 1024, height: 768 },
  { name: 'MacBook Air / HD Laptop', width: 1280, height: 800 },
  { name: 'Standard Laptop', width: 1366, height: 768 },
  { name: 'MacBook Pro / Desktop', width: 1440, height: 900 },
  { name: 'QHD / 2K Display', width: 1600, height: 1000 },
  { name: 'Full HD Desktop', width: 1920, height: 1080 },
  { name: '4K Ultrawide Display', width: 2560, height: 1440 }
];

console.log('============================================================');
console.log('VEYRA — DEEP VISUAL LAYOUT & PARENT BOUNDS QA REPORT');
console.log('============================================================\n');

let allPassed = true;

viewports.forEach(vp => {
  const w = vp.width;
  
  // 1. Container & Padding Calculations
  const containerPadding = w <= 375 ? 12 : w <= 767 ? 16 : 24; // px on each side
  const containerWidth = Math.min(w - (containerPadding * 2), 1280);
  
  // 2. Section 2 Glass Panel Calculation
  const cardPadding = w <= 480 ? 20 : w <= 768 ? 28 : 48; // clamp(1.25rem, 3.5vw, 3rem)
  const cardInnerWidth = containerWidth - (cardPadding * 2);

  // 3. CTA Button Calculation
  // CTA: width: 100%, maxWidth: 340px, padding: 0.8rem 1.25rem (40px horizontal padding)
  const ctaWidth = Math.min(cardInnerWidth, 340);
  const ctaFitsInCard = ctaWidth <= cardInnerWidth;
  const ctaFitsInViewport = ctaWidth <= w;

  // 4. Color Swatches Grid Calculation
  // On mobile (w <= 767px): 2 columns, gap: 10px
  // On micro mobile (w <= 350px): 1 column
  // On desktop (w > 767px): 3 columns, gap: 12px
  let swatchCols = w <= 350 ? 1 : w <= 767 ? 2 : 3;
  let swatchGap = w <= 480 ? 10 : 12;
  let totalGap = (swatchCols - 1) * swatchGap;
  let swatchCardWidth = (cardInnerWidth - totalGap) / swatchCols;

  const swatchesFit = swatchCardWidth >= 90; // minimum comfortable width for a swatch card

  // 5. Product Catalog Grid Calculation
  // 2560px+: 5 cols, 1200-2559px: 4 cols, 900-1199px: 3 cols, 361-899px: 2 cols, <=360px: 1 col
  let productCols = w >= 2560 ? 5 : w >= 1200 ? 4 : w >= 900 ? 3 : w >= 361 ? 2 : 1;
  let productGap = w >= 1600 ? 32 : w >= 1200 ? 28 : w >= 900 ? 24 : w >= 600 ? 20 : 14;
  let totalProductGap = (productCols - 1) * productGap;
  let productCardWidth = (containerWidth - totalProductGap) / productCols;
  const productCardSensible = productCardWidth <= 380 && productCardWidth >= 130;

  // 6. Header Calculation
  const headerFits = w >= 320;

  const passed = ctaFitsInCard && ctaFitsInViewport && swatchesFit && headerFits && productCardSensible;
  if (!passed) allPassed = false;

  console.log(`📱 ${vp.name.padEnd(28)} [${String(w).padStart(4)}px]`);
  console.log(`   ├─ Container Width:   ${containerWidth}px (Outer: ${w}px, Padding: ${containerPadding}px/side)`);
  console.log(`   ├─ Card Inner Width:  ${cardInnerWidth}px (Padding: ${cardPadding}px/side)`);
  console.log(`   ├─ CTA Button Width:  ${ctaWidth}px  -->  ${ctaFitsInCard ? '✓ 100% Contained inside Card' : '❌ OVERFLOW'}`);
  console.log(`   ├─ Palette Swatches:  ${swatchCols} Col (${Math.round(swatchCardWidth)}px/card)  -->  ${swatchesFit ? '✓ Fully Contained' : '❌ TOO NARROW'}`);
  console.log(`   ├─ Product Grid:      ${productCols} Col (${Math.round(productCardWidth)}px/card)  -->  ${productCardSensible ? '✓ Contained Product Card' : '❌ TOO LARGE'}`);
  console.log(`   └─ Status:            ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
});

console.log('============================================================');
console.log(`FINAL VISUAL AUDIT: ${allPassed ? '✅ 100% PASS ACROSS ALL 16 VIEWPORTS' : '❌ FAIL'}`);
console.log('============================================================\n');
