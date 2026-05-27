import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { getPlatformConfig } from '@/lib/actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener la configuración del sitio
  const config = await getPlatformConfig()
  const baseUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://greenaxis.com.co'
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')

  // Fecha actual para páginas estáticas
  const currentDate = new Date()

  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${cleanBaseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${cleanBaseUrl}/quienes-somos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${cleanBaseUrl}/servicios`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${cleanBaseUrl}/noticias`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${cleanBaseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${cleanBaseUrl}/privacidad`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${cleanBaseUrl}/terminos`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Obtener servicios activos
  const services = await db.service.findMany({
    where: {
      active: true,
      slug: {
        not: null,
      },
    },
    select: {
      slug: true,
      updatedAt: true,
      featured: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${cleanBaseUrl}/servicios/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: service.featured ? 0.9 : 0.7,
  }))

  // Obtener noticias publicadas
  const news = await db.news.findMany({
    where: {
      published: true,
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
      featured: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  const newsPages: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${cleanBaseUrl}/noticias/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: article.featured ? 0.8 : 0.6,
  }))

  // Combinar todas las páginas
  return [...staticPages, ...servicePages, ...newsPages]
}
