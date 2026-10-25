import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/it-admin', '/dashboard', '/api/'],
    },
    sitemap: 'https://acoor-clinic.vercel.app/sitemap.xml',
  };
}
