import { PublicLayout } from '@/components/public-layout'
import { getNewsBySlug, getPlatformConfig } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { NewsDetailContent } from '@/components/news-detail-content'
import { headers } from 'next/headers'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const [news, config] = await Promise.all([
    getNewsBySlug(slug),
    getPlatformConfig()
  ])
  
  if (!news || !news.published) {
    return {
      title: 'Noticia no encontrada - GreenAxis'
    }
  }
  
  // Usar siteUrl configurado o valor por defecto
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = config.siteUrl || `${protocol}://greenaxis.com.co`
  const url = `${baseUrl}/noticias/${slug}`
  
  return {
    title: news.title,
    description: news.excerpt || '',
    openGraph: {
      title: news.title,
      description: news.excerpt || '',
      url: url,
      siteName: config.siteName || 'GreenAxis',
      images: news.imageUrl ? [{ 
        url: news.imageUrl,
        width: 1200,
        height: 630,
        alt: news.title
      }] : [],
      type: 'article',
      publishedTime: news.publishedAt?.toISOString(),
      authors: news.author ? [news.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt || '',
      images: news.imageUrl ? [news.imageUrl] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}

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
