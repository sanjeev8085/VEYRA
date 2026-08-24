# VEYRA Haute Couture — Admin User Guide & Boutique Operations Manual

Welcome to the **VEYRA Atelier Administration Portal**. This guide is written for boutique directors, inventory managers, fashion merchandisers, and client concierges to manage products, virtual 3D models, inventory, customer orders, and promotional privileges.

---

## Table of Contents
1. [Access & Role Permissions](#1-access--role-permissions)
2. [Dashboard & Analytics](#2-dashboard--analytics)
3. [Managing Products & 10-Step Creation Wizard](#3-managing-products--10-step-creation-wizard)
4. [3D Digital Garment Upload & Validation Guidelines](#4-3d-digital-garment-upload--validation-guidelines)
5. [Inventory & Stock Control](#5-inventory--stock-control)
6. [Promotions, Privileges & Coupons](#6-promotions-privileges--coupons)
7. [Order Processing & Consignment Tracking](#7-order-processing--consignment-tracking)
8. [Client Notifications & Transactional Alerts](#8-client-notifications--transactional-alerts)

---

## 1. Access & Role Permissions

The VEYRA Admin Portal implements role-based access control (RBAC):
- **Super Administrator (`super_admin`)**: Full authority over products, inventory, orders, customers, financial analytics, and system configurations.
- **Product Manager (`product_manager`)**: Creation, publishing, 3D asset validation, and color taxonomy management.
- **Order Manager (`order_manager`)**: Order fulfillment, tracking number assignment, return processing, and shipment status progression.

---

## 2. Dashboard & Analytics

Upon logging in at `/#/admin`, you will see real-time atelier metrics:
- **Total Revenue**: Aggregated sales with percentage growth indicators.
- **Active Orders**: Orders categorized by fulfillment stage (*Pending, Confirmed, Packed, Shipped, Delivered*).
- **Average Order Value (AOV)**: Basket size metric.
- **Low-Stock Alerts**: Instant warnings when variant inventory drops below minimum thresholds.

---

## 3. Managing Products & 10-Step Creation Wizard

To introduce a new garment into the collection, navigate to **Products → + Add Product**. The 10-step guided wizard walks you through:

1. **Basics**: Garment Title, Brand, Category (*T-Shirts, Shirts, Jackets, Trousers*), Collection, and Editorial Description.
2. **Fabric & Tailoring Attributes**: Fit Type (*Relaxed, Tailored, Oversized*), Fabric Composition (*e.g., 100% Normandy Linen, Peruvian Supima Cotton*), Weave Pattern, Neckline, and Sleeve Length.
3. **Colorways & Auto-Detection**: Select from luxury color families (*Botanical Sage, Warm Sand, Vintage Burgundy, Ivory Linen*) or upload an image to automatically sample hex values with client-side canvas color extraction.
4. **Size Grading Matrix**: Select available sizes (*XS, S, M, L, XL, XXL*).
5. **Inventory Allocations**: Assign quantity per color-size permutation with batch auto-fill shortcuts.
6. **Pricing & Margins**: Set retail price (₹), original MRP (for discount badges), and cost price for gross margin calculations.
7. **3D Model Upload**: Drag-and-drop `.glb` or `.gltf` 3D digital garment assets. Built-in security scanners inspect binary magic bytes and Draco mesh geometry.
8. **Lookbook Photography**: High-resolution multi-angle photography URLs (front, side, detail drape).
9. **Taxonomies & Merchandising**: Gender, Season (*Summer 2026, Autumn/Winter*), Occasion (*Everyday Luxury, Black Tie*), Featured & New Arrival flags.
10. **Review & Publish**: Multi-device viewport preview (Mobile, Tablet, Desktop) before publishing directly to the live customer storefront.

---

## 4. 3D Digital Garment Upload & Validation Guidelines

For optimal 60fps rendering across customer devices:
- **File Format**: Binary glTF (`.glb`) with embedded Draco mesh compression.
- **Polygon Count**: Keep meshes under 35,000 triangles for garments.
- **Textures**: PBR Metallic-Roughness workflow; maximum texture resolution 2048×2048 px.
- **File Size**: Ideal size < 10 MB (Hard limit 50 MB).
- **Security Check**: The system automatically verifies binary header bytes `0x46546C67` to prevent disguised executable uploads.

---

## 5. Inventory & Stock Control

- Navigate to **Admin → Inventory** to view SKU-level availability.
- When an order is placed, variant stock is automatically decremented.
- Products reaching `0` stock will display "Out of Stock" badges and prevent cart additions.

---

## 6. Promotions, Privileges & Coupons

- Create VIP discount coupons (*Percentage off or Flat INR rebate*) with minimum cart value requirements, expiration dates, and usage limits.
- The **Customer Notification Broadcast** tool allows admins to broadcast promotional invitations to all clients simultaneously.

---

## 7. Order Processing & Consignment Tracking

When an order is received:
1. Review items, sizing, and shipping address.
2. Update order status from `Confirmed` → `Packed`.
3. Once handed to the logistics carrier (*BlueDart, DHL, FedEx*), assign the Waybill / Tracking Number and progress status to `Shipped`.
4. The customer immediately receives an In-App Alert and a Transactional Email with a direct tracking link.

---

## 8. Client Notifications & Transactional Alerts

- Click the **Bell Icon** in the header to access the **Notification Center & Email Dispatch Simulator**.
- Preview the exact luxury HTML email dispatched to clients for Order Placement, Payment Verification, and Dispatch Notices.
