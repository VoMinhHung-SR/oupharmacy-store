import type { MetadataRoute } from 'next'
import { getSiteOrigin } from '@/lib/siteUrls'

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/gio-hang', '/don-hang', '/tai-khoan', '/~offline'],
    },
    sitemap: `${origin}/sitemap.xml`,
  }
}
