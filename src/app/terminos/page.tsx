import { PublicLayout } from '@/components/public-layout'
import { getLegalPage, getPlatformConfig } from '@/lib/actions'
import { LegalPageContent } from '@/components/legal-page-content'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPlatformConfig()
  const siteUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || ''
  const canonicalUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/terminos` : undefined

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function TerminosPage() {
  const [legalPage, config] = await Promise.all([
    getLegalPage('terminos'),
    getPlatformConfig()
  ])
  
  return (
    <PublicLayout>
      <LegalPageContent 
        page={legalPage} 
        title="Términos y Condiciones"
        defaultContent=""
        config={config}
      />
    </PublicLayout>
  )
}
