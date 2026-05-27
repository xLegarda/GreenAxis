import { MetadataRoute } from 'next'
import { getPlatformConfig } from '@/lib/actions'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getPlatformConfig()
  const baseUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://greenaxis.com.co'
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/portal-interno/',
        ],
      },
    ],
    sitemap: `${cleanBaseUrl}/sitemap.xml`,
  }
}
