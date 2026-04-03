import { PublicLayout } from '@/components/public-layout'
import { getPlatformConfig } from '@/lib/actions'
import { ContactPageContent } from '@/components/contact-page-content'

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
