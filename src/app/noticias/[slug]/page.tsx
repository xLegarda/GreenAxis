import { PublicLayout } from '@/components/public-layout'
import { getNewsBySlug, getPlatformConfig } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { NewsDetailContent } from '@/components/news-detail-content'
import { headers } from 'next/headers'

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [news, config, headersList] = await Promise.all([
    getNewsBySlug(slug),
    getPlatformConfig(),
    headers()
  ])
  
  if (!news || !news.published) {
    notFound()
  }
  
  // Construir URL completa para compartir
  // Usar siteUrl si está configurado, sino usar el host actual
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  
  // siteUrl tiene prioridad (es la URL pública configurada)
  const baseUrl = config.siteUrl || `${protocol}://${host}`
  const shareUrl = `${baseUrl}/noticias/${slug}`
  
  // Serialize news for client component
  const serializedNews = {
    id: news.id,
    title: news.title,
    slug: news.slug,
    excerpt: news.excerpt,
    content: news.content,
    imageUrl: news.imageUrl,
    author: news.author,
    publishedAt: news.publishedAt?.toISOString() || null,
    createdAt: news.createdAt.toISOString(),
    blocks: news.blocks
  }
  
  return (
    <PublicLayout>
      <NewsDetailContent 
        news={serializedNews} 
        config={config} 
        shareUrl={shareUrl} 
      />
    </PublicLayout>
  )
}
