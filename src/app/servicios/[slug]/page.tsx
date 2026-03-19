import { PublicLayout } from '@/components/public-layout'
import { getPlatformConfig, getServiceBySlug } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { ServiceDetailContent } from '@/components/service-detail-content'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const [service, config] = await Promise.all([
    getServiceBySlug(slug),
    getPlatformConfig()
  ])

  if (!service || !service.active) {
    return {
      title: 'Servicio no encontrado - GreenAxis'
    }
  }

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = config.siteUrl || `${protocol}://greenaxis.com.co`
  const url = `${baseUrl}/servicios/${slug}`
  const description = service.description || config.siteDescription || ''

  return {
    title: service.title,
    description,
    openGraph: {
      title: service.title,
      description,
      url,
      siteName: config.siteName || 'GreenAxis',
      images: service.imageUrl ? [{
        url: service.imageUrl,
        width: 1200,
        height: 630,
        alt: service.title
      }] : [],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description,
      images: service.imageUrl ? [service.imageUrl] : []
    },
    alternates: {
      canonical: url
    }
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [service, config] = await Promise.all([
    getServiceBySlug(slug),
    getPlatformConfig()
  ])

  if (!service || !service.active) {
    notFound()
  }

  const serializedService = {
    id: service.id,
    title: service.title,
    slug: service.slug,
    description: service.description,
    shortBlocks: service.shortBlocks,
    content: service.content,
    blocks: service.blocks,
    icon: service.icon,
    imageUrl: service.imageUrl,
    showSummary: service.showSummary
  }

  return (
    <PublicLayout>
      <ServiceDetailContent service={serializedService} config={config} />
    </PublicLayout>
  )
}
