import { PublicLayout } from '@/components/public-layout'
import { getServices, getPlatformConfig } from '@/lib/actions'
import { ServicesPageContent } from '@/components/services-page-content'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPlatformConfig()
  const siteUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || ''
  const canonicalUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/servicios` : undefined

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function ServiciosPage() {
  const [services, config] = await Promise.all([
    getServices(),
    getPlatformConfig()
  ])
  
  return (
    <PublicLayout>
      <ServicesPageContent services={services} config={config} />
    </PublicLayout>
  )
}
