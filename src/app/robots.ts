import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanmakhuyenmai.vn';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/', '/admin/', '/login'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
