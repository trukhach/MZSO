import type { MetadataRoute } from 'next';
// Staging policy. Replace with production robots and sitemap after the domain is approved.
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', disallow: '/' } }; }