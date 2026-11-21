import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
const routes=['','products','production','manufacturing-by-drawings','about','delivery','payment','warranty','contacts','request-quote'];
export default function sitemap(): MetadataRoute.Sitemap {
  // Configure NEXT_PUBLIC_SITE_URL with the confirmed production domain before publishing.
  const base=(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.invalid').replace(/\/$/,'');
  return routes.map(route=>({url:`${base}/${route ? route+'/' : ''}`,changeFrequency:'monthly' as const,priority:route?0.6:1}));
}
