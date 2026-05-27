import { db } from '@/lib/db'
import { getPlatformConfig } from '@/lib/actions'

export async function GET() {
  const config = await getPlatformConfig()
  const baseUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://greenaxis.com.co'
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')

  // Obtener servicios con imágenes
  const services = await db.service.findMany({
    where: {
      active: true,
      slug: { not: null },
      imageUrl: { not: null },
    },
    select: {
      slug: true,
      title: true,
      imageUrl: true,
      updatedAt: true,
    },
  })

  // Obtener noticias con imágenes
  const news = await db.news.findMany({
    where: {
      published: true,
      imageUrl: { not: null },
    },
    select: {
      slug: true,
      title: true,
      imageUrl: true,
      updatedAt: true,
    },
  })

  // Generar XML del sitemap de imágenes
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${services
    .map(
      (service) => `
  <url>
    <loc>${cleanBaseUrl}/servicios/${service.slug}</loc>
    <image:image>
      <image:loc>${service.imageUrl}</image:loc>
      <image:title>${escapeXml(service.title)}</image:title>
    </image:image>
  </url>`
    )
    .join('')}
  ${news
    .map(
      (article) => `
  <url>
    <loc>${cleanBaseUrl}/noticias/${article.slug}</loc>
    <image:image>
      <image:loc>${article.imageUrl}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>
  </url>`
    )
    .join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}

// Función para escapar caracteres especiales en XML
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
