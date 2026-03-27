import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WhatsAppBubble } from '@/components/whatsapp-bubble'
import { getPlatformConfig, getServices } from '@/lib/actions'

interface PublicLayoutProps {
  children: React.ReactNode
}

export async function PublicLayout({ children }: PublicLayoutProps) {
  const [config, services] = await Promise.all([
    getPlatformConfig(),
    getServices()
  ])
  
  // Mapear servicios para el footer
  const footerServices = services.map(s => ({
    id: s.id,
    title: s.title,
    slug: s.slug || undefined
  }))
  
  // Preparar config para el footer
  const footerConfig = {
    siteName: config.siteName,
    siteSlogan: config.siteSlogan,
    companyAddress: config.companyAddress,
    companyPhone: config.companyPhone,
    companyEmail: config.companyEmail,
    logoUrl: config.logoUrl,
    facebookUrl: config.facebookUrl,
    instagramUrl: config.instagramUrl,
    twitterUrl: config.twitterUrl,
    linkedinUrl: config.linkedinUrl,
    tiktokUrl: config.tiktokUrl,
    youtubeUrl: config.youtubeUrl,
    footerText: config.footerText,
    socialText: config.socialText,
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header config={config} />
      <main className="flex-1">
        {children}
      </main>
      <Footer config={footerConfig} services={footerServices} />
      <WhatsAppBubble 
        phoneNumber={config.whatsappNumber}
        defaultMessage={config.whatsappMessage || '¡Hola! Me gustaría obtener información sobre sus servicios ambientales.'}
        showBubble={config.whatsappShowBubble}
      />
    </div>
  )
}
