import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  productSchema?: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock';
    brand?: string;
    sku?: string;
  };
}

export const SEO: React.FC<SEOProps> = ({
  title = 'VEYRA — The Art of Haute Couture & 3D Garment Atelier',
  description = 'Experience modern luxury fashion crafted with Peruvian Supima cotton, pure Normandy linen, and immersive 3D garment fitting.',
  image = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85',
  url = window.location.href,
  type = 'website',
  productSchema,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    setMetaTag('name', 'description', description);

    // Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', type);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // 3. Structured Data (JSON-LD)
    const existingScript = document.getElementById('jsonld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    if (productSchema) {
      const script = document.createElement('script');
      script.id = 'jsonld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: productSchema.name,
        image: productSchema.image,
        description: productSchema.description,
        sku: productSchema.sku || 'VYR-SKU-DEFAULT',
        brand: {
          '@type': 'Brand',
          name: productSchema.brand || 'VEYRA',
        },
        offers: {
          '@type': 'Offer',
          url: url,
          priceCurrency: productSchema.currency || 'INR',
          price: productSchema.price,
          availability: `https://schema.org/${productSchema.availability || 'InStock'}`,
          seller: {
            '@type': 'Organization',
            name: 'VEYRA Atelier',
          },
        },
      });
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById('jsonld-schema');
      if (script) script.remove();
    };
  }, [title, description, image, url, type, productSchema]);

  return null;
};
