import React, { useEffect } from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProductSchemaData {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  condition?: string;
}

export interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article' | 'profile';
  canonical?: string;
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  productSchema?: ProductSchemaData;
  keywords?: string[];
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title = 'VEYRA — Haute Couture & 3D Garment Atelier',
  description = 'Experience bespoke luxury tailoring with Peruvian Supima cotton, pure Normandy linen, and interactive 3D WebGL fitting atelier.',
  image = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85',
  url,
  type = 'website',
  canonical,
  noindex = false,
  breadcrumbs,
  productSchema,
  keywords = [
    'luxury fashion',
    'bespoke tailoring',
    '3D fashion fitting',
    'haute couture',
    'sustainable linen',
    'Peruvian Supima cotton',
    'VEYRA atelier',
  ],
}) => {
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://veyra.luxury');
  const canonicalUrl = canonical || currentUrl.split('?')[0].split('#')[0];

  useEffect(() => {
    // 1. Set Document Title
    document.title = title;

    // 2. Helper to set/update meta tag
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set/update link tag (e.g. canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Standard SEO Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords.join(', '));
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setLinkTag('canonical', canonicalUrl);

    // Open Graph (Facebook / LinkedIn)
    setMetaTag('property', 'og:site_name', 'VEYRA Haute Couture');
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:locale', 'en_IN');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@VeyraAtelier');
    setMetaTag('name', 'twitter:creator', '@VeyraAtelier');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 3. Inject JSON-LD Structured Data
    const existingScripts = document.querySelectorAll('script[data-veyra-seo]');
    existingScripts.forEach((s) => s.remove());

    const schemas: any[] = [];

    // Organization & WebSite Base Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'VEYRA Haute Couture',
      url: 'https://veyra.luxury',
      logo: 'https://veyra.luxury/logo.png',
      sameAs: [
        'https://instagram.com/veyra.luxury',
        'https://pinterest.com/veyraatelier',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-800-VEYRA-01',
        contactType: 'Customer Care & Bespoke Styling',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    });

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'VEYRA',
      url: 'https://veyra.luxury',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://veyra.luxury/#/catalog?query={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });

    // BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `https://veyra.luxury${item.url}`,
        })),
      });
    }

    // Product Schema (Google Rich Snippets)
    if (productSchema) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productSchema.name,
        image: productSchema.image,
        description: productSchema.description,
        sku: productSchema.sku || `VYR-${productSchema.name.replace(/\s+/g, '-').toUpperCase()}`,
        category: productSchema.category || 'Apparel & Accessories > Clothing',
        brand: {
          '@type': 'Brand',
          name: productSchema.brand || 'VEYRA',
        },
        offers: {
          '@type': 'Offer',
          url: currentUrl,
          priceCurrency: productSchema.currency || 'INR',
          price: productSchema.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability: `https://schema.org/${productSchema.availability || 'InStock'}`,
          seller: {
            '@type': 'Organization',
            name: 'VEYRA Atelier',
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'IN',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
        },
        ...(productSchema.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: productSchema.rating,
            reviewCount: productSchema.reviewCount || 1,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      });
    }

    // Append script element
    schemas.forEach((schema, i) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-veyra-seo', `schema-${i}`);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const cleanupScripts = document.querySelectorAll('script[data-veyra-seo]');
      cleanupScripts.forEach((s) => s.remove());
    };
  }, [title, description, image, currentUrl, canonicalUrl, type, noindex, breadcrumbs, productSchema, keywords]);

  return null;
};

/**
 * Utility: Generate dynamic XML Sitemap string for all catalogue products and pages
 */
export const generateSitemapXml = (
  products: Array<{ slug: string; updatedAt?: string }> = [],
  baseUrl = 'https://veyra.luxury'
): string => {
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/catalog', priority: '0.9', changefreq: 'daily' },
    { loc: '/studio', priority: '0.9', changefreq: 'weekly' },
    { loc: '/find-your-colors', priority: '0.8', changefreq: 'monthly' },
    { loc: '/cart', priority: '0.5', changefreq: 'monthly' },
  ];

  const currentDate = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  staticPages.forEach((p) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${p.loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  products.forEach((prod) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/product/${prod.slug}</loc>\n`;
    xml += `    <lastmod>${prod.updatedAt || currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.85</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
};

/**
 * Utility: Generate robots.txt content
 */
export const generateRobotsTxt = (baseUrl = 'https://veyra.luxury'): string => {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /checkout/',
    'Disallow: /order-confirmation/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n');
};
