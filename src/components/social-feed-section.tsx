import Link from 'next/link'
import { Instagram, Facebook, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface PlatformConfig {
  siteName: string
  facebookUrl: string | null
  instagramUrl: string | null
  socialText: string | null
}

interface SocialFeedSectionProps {
  config: PlatformConfig
}

export function SocialFeedSection({ config }: SocialFeedSectionProps) {
  const socialText = config.socialText || 'Síguenos en nuestras redes'
  
  // Solo mostrar redes que tengan URL configurada
  const hasFacebook = !!config.facebookUrl
  const hasInstagram = !!config.instagramUrl
  
  // Si no hay ninguna red social configurada, no mostrar la sección
  if (!hasFacebook && !hasInstagram) {
    return null
  }

  return (
    <section className="py-20 bg-white dark:bg-[#0a1a1f]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#6BBE45] dark:text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">
            Redes Sociales
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2 mb-4">
            {socialText}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Mantente al día con nuestras actividades y campañas ambientales.
          </p>
        </div>
        
        {/* Social Cards */}
        <div className={`grid grid-cols-1 ${hasFacebook && hasInstagram ? 'md:grid-cols-2' : 'max-w-md mx-auto'} gap-6`}>
          {/* Facebook Card */}
          {hasFacebook && (
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all card-hover group">
              <CardContent className="p-0">
                <a 
                  href={config.facebookUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-gradient-to-br from-[#1877F2] to-[#0D5BBF] p-8 text-white">
                    <Facebook className="h-12 w-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Facebook</h3>
                    <p className="text-white/80 mb-4">
                      Síguenos para noticias, tips ambientales y campañas de concientización.
                    </p>
                    <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                      Visitar página
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              </CardContent>
            </Card>
          )}
          
          {/* Instagram Card */}
          {hasInstagram && (
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all card-hover group">
              <CardContent className="p-0">
                <a 
                  href={config.instagramUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-gradient-to-br from-[#E4405F] via-[#C13584] to-[#833AB4] p-8 text-white">
                    <Instagram className="h-12 w-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Instagram</h3>
                    <p className="text-white/80 mb-4">
                      Descubre nuestro trabajo a través de fotos y videos de nuestros proyectos.
                    </p>
                    <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                      Visitar perfil
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Note for admin */}
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
          Configura los enlaces de tus redes sociales desde el panel de administración.
        </p>
      </div>
    </section>
  )
}
