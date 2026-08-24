# VEYRA Haute Couture — Technical Architecture & Engineering Manual

## 1. System Overview & Technology Stack

VEYRA is a next-generation luxury e-commerce platform combining **React 18**, **Three.js WebGL graphics**, **Zustand reactive state management**, and an offline-first **Local Repository Database Layer**.

### Core Technology Stack:
- **Framework**: React 18 with TypeScript 5.8
- **Build & Dev Tooling**: Vite 6 with esbuild minification & custom code-splitting
- **3D Graphics Engine**: Three.js (`three` 0.174) with `@react-three/fiber` & `@react-three/drei`
- **State Management**: Zustand 5 with local persistence middleware
- **Styling Architecture**: Luxury Vanilla CSS Design System with theme variables, glassmorphism tokens, and responsive clamp scaling
- **Icons**: Lucide React
- **SEO & Schemas**: Schema.org JSON-LD Structured Data & dynamic meta manager
- **Accessibility**: WCAG 2.1 AA compliant (visible focus outlines, ARIA live region announcer, skip-to-content)

---

## 2. 3D Graphics Pipeline & WebGL Lifecycle

```text
[User Viewport]
      │
      ▼
[ThreeCanvas Container] ──► [IntersectionObserver] ──► frameloop: 'always' (visible) / 'never' (offscreen)
      │
      ├─► [Adaptive DPR Scaler] ──► Dynamic DPR (1.0 - 1.5 mobile, up to 2.0 desktop)
      │
      ├─► [Studio 3-Point Lighting Rig] (Studio / Sunset / Runway presets)
      │
      ├─► [Mannequin / Dress Form Geometry]
      │
      ├─► [Draped Garment Mesh + PBR Metallic-Roughness Materials]
      │
      ├─► [Soft Contact Shadows]
      │
      └─► [SceneCleanupManager] ──► Deep disposal on unmount (geometries, materials, textures, buffers)
```

### WebGL Memory Management (`src/utils/threeCleanup.ts`):
- **Deep Recursive Object Disposal**: Traverses scene tree, recursively releasing `geometry.dispose()`, `material.dispose()`, and attached texture maps (`map`, `normalMap`, `roughnessMap`, `envMap`, etc.).
- **Offscreen Canvas Render Loop Pausing**: `useCanvasIntersectionObserver()` pauses the Three.js frameloop when the canvas is outside viewport bounds.
- **Hardware-Aware Adaptive DPR**: `getAdaptiveDPR()` inspects `navigator.hardwareConcurrency`, battery/save-data modes, and window DPI to prevent thermal throttling and maintain 60fps on mobile.

---

## 3. Graceful 3D / Low-Power Device Fallback (`FallbackGallery.tsx`)

If WebGL is unavailable, fails, or is disabled:
- Automatically swaps to the **High-Res 360° Studio Lookbook**.
- Interactive touch/mouse drag scrubber with full 360° angle rotation.
- Magnifier lens inspection following cursor coordinates.
- Dynamic color swatch highlights and tone alignment.

---

## 4. State Management & Repository Layer

State is managed via Zustand stores:
- **`useStore`**: Handles catalog products, cart items, customer wishlist, active avatars, lighting presets, lighting rigs, theme modes, and notification counts.
- **`repository.ts`**: Simulates an asynchronous transactional database with local storage persistence and mock network latencies.

---

## 5. Security Hardening & File Validation (`src/utils/security.ts`)

1. **XSS & Injection Sanitization**: `sanitizeInput()`, `sanitizeHtml()`, and `sanitizeUrl()` encode dangerous entities and strip script payloads.
2. **Binary Magic-Byte File Inspection**: Direct binary byte scanning verifies authentic `.glb` (`0x46546C67`), `.png` (`\x89PNG`), `.jpg` (`\xFF\xD8\xFF`), and `.webp` (`RIFF...WEBP`) signatures, rejecting disguised executable payloads.
3. **Rate Limiting Middleware**: Sliding window token-bucket rate limiter.
4. **Security Audit Logging**: `logSecurityAudit()` maintains persistent logs of administrative changes and sensitive operations.

---

## 6. Accessibility & Keyboard Navigation (WCAG 2.1 AA)

- **Focus Outlines**: `:focus-visible` outline rings with 3px gold outline and 5px blur glow.
- **Skip To Content**: Accessible `<SkipToContent targetId="main-content" />` keyboard bypass link.
- **Screen Reader Live Announcements**: `LiveAnnouncer` with `aria-live="polite"` and `aria-live="assertive"` regions via `announceToScreenReader()`.
- **Touch Target Sizing**: Minimum 44px hit areas on all buttons, swatches, and interactive controls (WCAG 2.5.5).

---

## 7. Production Build & Deployment Guide

### Building for Production:
```bash
cd VEYRA_APP
npm run build
```
Vite compiles the application with granular manual chunks:
- `three-core`: Three.js rendering engine
- `three-fiber`: R3F & Drei fiber abstractions
- `framework`: React, React-DOM, React-Router-DOM
- `store`: Zustand state
- `icons`: Lucide React icon tree

### Deployment Targets:
- **Static Hosting**: Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront.
- **Single Page Application Routing**: Use hash router or configure rewrite rules redirecting all routes to `/index.html`.
- **CORS & Headers**: Serve with Content-Security-Policy headers as defined in `src/utils/security.ts`.
