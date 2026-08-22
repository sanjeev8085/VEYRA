# VEYRA — Luxury Fashion Atelier & 3D WebGL Storefront
## Deployment & Administrative User Guide

---

### 1. Executive Summary & Architecture
VEYRA is a bespoke, 3D-first luxury fashion e-commerce platform built with React 18, TypeScript, Three.js (@react-three/fiber, @react-three/drei), Zustand, and CSS Design Systems. The platform provides real-time 3D garment customization and fitting onto realistic avatars, paired with an executive CMS and order fulfillment portal.

---

### 2. Storefront Customer Journeys
- **Homepage (`/`)**: Cinematic campaign hero connected to live Editorial CMS, curated collections, interactive 3D atelier showcase banner, and natural fiber craftsmanship stories.
- **Garment Catalog (`/catalog`)**: Multi-faceted filter engine filtering by Category (`T-Shirts`, `Shirts`, `Jackets`), Fit (`Tailored Slim`, `Relaxed Oversized`, `Bespoke Classic`), Color Families, and Sizes (`XS` to `XXXL`).
- **Product Detail Page (`/product/:slug`)**: Split-screen 3D WebGL rotating viewport, PBR material shaders, size selector with real-time stock limits, interactive color switcher, and JSON-LD `schema.org/Product` structured data.
- **3D Fitting Studio (`/studio`)**: Interactive haute couture studio enabling live avatar switching (Male 01, Male 02, Female 01, Female 02), outfit customization, camera orbit gestures, and 1-click cart addition.
- **Shopping Bag & Slide-over Drawer (`/cart`)**: Real-time price calculation, coupon validator (`SUMMER30`, `WELCOME10`), free luxury shipping threshold calculation, and tax breakdown.
- **Multi-Step Checkout & Payment (`/checkout`)**: Frictionless 4-step order flow with simulated UPI, Card, NetBanking, and Wallet gateway processing.
- **Order Confirmation & Tracking (`/order-confirmation/:id`, `/track-order`)**: Real-time shipment stepper (`Confirmed` → `Processing` → `Shipped` → `Delivered`) and courier tracking lookups.

---

### 3. Atelier Admin Portal & Zero-Code CMS (`/admin`)

#### Authentication & Route Guarding:
- **Protected URLs**: `/admin`, `/admin/products`, `/admin/products/new`, `/admin/add-product`
- **Login Portal**: `/admin/login`
- **Default Master Admin**: `admin@veyra.luxury` / `password123` (Token-based session with auto-expiration)

#### Administrative Modules:
1. **Executive Overview**: Real-time KPI metrics for Cataloged Garments, Active Orders, Gross Revenue (INR ₹), and Low-Stock Warnings ($\le 15$ units).
2. **Garments Catalog**: Search, filter by status (`published`, `draft`, `archived`), 1-click duplicate product (creates sister colorways instantly), publish/unpublish, and live storefront preview.
3. **10-Step "+ Add Product" Wizard**:
   - Step 1: Basic Garment Details (Name, SKU, Brand, Category, Collection, Story).
   - Step 2: Tailoring Attributes (Fit, Collar, Sleeve, Fabric GSM, Pattern, Care).
   - Step 3: Color Taxonomy & Automated Image Color Detector.
   - Step 4: Size Chips Selection (`XS` to `XXXL`).
   - Step 5: Color × Size Inventory Matrix Table.
   - Step 6: INR Pricing, MRP, Internal Cost, Gross Margin %.
   - Step 7: 3D Model (.GLB/.GLTF) Drag-and-Drop with PBR validation and polygon counter.
   - Step 8: Lookbook Editorial Photography Gallery.
   - Step 9: Search Discoverability (Gender target, Season, Occasion).
   - Step 10: Pre-Publish Validation Checklist.
4. **Orders & Fulfillment Pipeline**: Search orders by Customer / ID / Tracking, change status (`Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), and assign White-Glove courier tracking numbers.
5. **Variant Stock Matrix**: Inline stock count editor across all sizes and shades.
6. **Customer CRM**: Customer lifetime spend tracker, order history count, contact details, and VIP relationship records.
7. **Promotions & Coupon Codes**: Create, activate, disable, or delete discount promo codes with percentage/flat reductions and minimum cart thresholds.
8. **Editorial Homepage CMS**: Live editor for campaign tag, primary headline, gradient highlight, and editorial story without code redeployment.

---

### 4. Production Build & Deployment Instructions

#### Development Server:
```bash
cd VEYRA_APP
npm install
npm run dev
```

#### Production Build Verification:
```bash
npm run build
```

#### Static Hosting & CDN Deployment:
The production build output is located in `VEYRA_APP/dist/` and can be hosted on any static host or cloud platform (Vercel, Netlify, AWS S3 + CloudFront, Cloudflare Pages):
```bash
# Preview build locally
npm run preview
```
