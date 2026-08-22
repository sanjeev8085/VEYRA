# VEYRA — Technical Architecture & Low-Cost Infrastructure Strategy

## 1. Architectural Philosophy
VEYRA is designed as an ultra-luxury 3D fashion e-commerce platform that can run at **near-zero cost** during MVP/Demo stages while having clean abstractions to scale to enterprise infrastructure without code rewrites.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Customer Viewport / UI                   │
│   Mobile (375-430px) | Tablet (768-1024px) | Desktop (1080p-4K)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│              Frontend Layer (Vite + React + TS)             │
│  - Luxury Design System (Tokens, CSS Modules, Glassmorphism)│
│  - Three.js / WebGL 3D Studio & Garment Fitting Engine      │
│  - Client State Engine (Zustand + LocalStorage Sync)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                 Service & Adapter Abstraction               │
│  - AuthService (JWT / Local / Supabase Auth Adapter)        │
│  - ProductService (Query & Variant Matrix Engine)           │
│  - Cart & CheckoutService (Pricing, Tax, Coupons)           │
│  - OrderService (Tracking Pipeline & Fulfillment)           │
│  - StorageService (Local File / Cloudflare R2 / AWS S3)     │
│  - PaymentGateway (Simulated / Razorpay / Stripe Adapter)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                 Data & Asset Persistence Layer              │
│  - Seed Dataset / IndexedDB / SQLite / Supabase PostgreSQL  │
│  - 3D Models (.glb/.gltf) & Optimized WebP Textures         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Low-Cost & Free-Tier Decision Matrix

| Layer | Low-Cost / Free-Tier Choice | Enterprise Upgrade Path | Cost at Launch | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend & Host** | Vite SPA / Cloudflare Pages / Vercel / Netlify Free Tier | Cloudflare Enterprise / Custom Edge CDN | **$0.00** | Unlimited bandwidth, global CDN, instant deployments. |
| **3D Rendering** | Three.js (WebGL client-side) | WebGPU / Cloud Streaming (if needed) | **$0.00** | 100% computed on client GPU; zero server GPU costs. |
| **3D Asset Storage** | Local Assets + Cloudflare R2 (Free 10GB/mo, zero egress) | AWS S3 + CloudFront | **$0.00** | Zero egress fees on Cloudflare R2 makes 3D delivery free. |
| **Database** | TypeScript Repository Layer + SQLite / Local / Supabase Free | AWS RDS PostgreSQL / PlanetScale | **$0.00** | Service interface allows instant swapping of database drivers. |
| **Authentication** | JWT + Local/Session Token Manager | Supabase Auth / Auth0 / Clerk | **$0.00** | Zero cost, self-contained, no external auth vendor lock-in. |
| **Payment Gateway** | Modular Gateway (Simulated Mode + Razorpay / Stripe Test) | Live Razorpay / Stripe Gateway | **$0.00** | Full checkout simulation for testing and client demo. |

---

## 3. Core Component Architecture

### A. 3D Visualization Pipeline
1. **Scene Setup**: Studio three-point lighting, floor contact shadow, environment mapping.
2. **Gesture Controller**: 1-finger orbit, 2-finger pinch zoom, pan, double-tap reset.
3. **Garment Layering**: Avatar base mesh (Male/Female) + garment mesh overlays.
4. **Material Switcher**: Real-time roughness, metalness, and color hex manipulation without reloading meshes.
5. **Progressive Loader**: Percentage loader with Draco mesh decompression.
6. **Graceful Fallback**: High-resolution 360° image sequence when WebGL is unsupported.

### B. E-Commerce Flow
1. **Catalog & Filters**: In-memory faceted indexing for instant filtering (<10ms).
2. **Variants Matrix**: Size (XS-XXXL) × Color × Stock tracking with dynamic out-of-stock prevention.
3. **Cart & Wishlist**: Persistent store with automatic tax, shipping, and coupon calculation.
4. **Checkout**: 4-step multi-step checkout with form validation and guest checkout support.
5. **Orders & Tracking**: Unique `#ORD-XXXXX` generation with 6-stage lifecycle tracking.

### C. Non-Technical Admin Panel
1. **6-Step "+ Add Product" Wizard**: Zero JSON or code required.
2. **3D Model Drag-and-Drop**: Immediate integrity validation (format, polycount, missing textures).
3. **Multi-Device Live Preview**: Desktop, Mobile frame, and 3D viewport preview before publishing.
4. **Stock & Order Management**: Real-time inventory table with low-stock alerts.

---

## 4. Security & Performance Baseline
- All input sanitized against XSS.
- Role-based route guards for Admin (`Super Admin`, `Product Manager`, `Order Manager`).
- Three.js WebGL canvas auto-disposed on unmount to prevent memory leaks.
- IntersectionObserver for pausing offscreen 3D canvases.
- WCAG 2.1 AA accessible with 44px+ touch targets on mobile.
