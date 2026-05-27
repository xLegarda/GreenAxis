import { PublicLayout } from '@/components/public-layout'
import { getPlatformConfig } from '@/lib/actions'
import { ContactPageContent } from '@/components/contact-page-content'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPlatformConfig()
  const siteUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || ''
  const canonicalUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/contacto` : undefined

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function ContactoPage() {
  const config = await getPlatformConfig()
  
  return (
    <PublicLayout>
      <ContactPageContent config={{
        siteName: config.siteName,
        companyAddress: config.companyAddress,
        companyPhone: config.companyPhone,
        companyEmail: config.companyEmail,
        googleMapsEmbed: config.googleMapsEmbed,
        portfolioEnabled: config.portfolioEnabled ?? false,
        portfolioTitle: config.portfolioTitle,
        portfolioUrl: config.portfolioUrl,
      }} />
    </PublicLayout>
  )
}
