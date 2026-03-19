'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'

// Icono X (Twitter)
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

interface Service {
  id: string
  title: string
  slug?: string
}

interface PlatformConfig {
  siteName: string
  siteSlogan: string | null
  companyAddress: string | null
  companyPhone: string | null
  companyEmail: string | null
  logoUrl: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  twitterUrl: string | null
  linkedinUrl: string | null
  tiktokUrl: string | null
  youtubeUrl: string | null
  footerText: string | null
  socialText: string | null
}

interface FooterProps {
  config: PlatformConfig
  services: Service[]
}

export function Footer({ config, services }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const siteName = config.siteName || 'Green Axis S.A.S.'

  const socialLinks = [
    { name: 'facebook', url: config.facebookUrl, icon: Facebook, hoverColor: 'hover:bg-blue-600' },
    { name: 'x', url: config.twitterUrl, icon: XIcon, hoverColor: 'hover:bg-gray-900 dark:hover:bg-gray-100' },
    { name: 'instagram', url: config.instagramUrl, icon: Instagram, hoverColor: 'hover:bg-pink-600' },
    { name: 'linkedin', url: config.linkedinUrl, icon: Linkedin, hoverColor: 'hover:bg-blue-700' },
    { name: 'youtube', url: config.youtubeUrl, icon: Youtube, hoverColor: 'hover:bg-red-600' },
  ].filter(link => link.url)

  const logoUrl = config.logoUrl || '/logo.png'
  
  // Mostrar máximo 4 servicios
  const displayServices = services.slice(0, 4)

  return (
    <footer className="bg-gradient-to-b from-[#005A7A] via-[#004A66] to-[#003D52] dark:from-[#051215] dark:via-[#0a1a1f] dark:to-[#0f2028] text-white relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 pattern-leaves opacity-5 dark:opacity-10" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo y descripción */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <div className="relative h-14 w-auto">
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={160}
                  height={56}
                  className="h-14 w-auto object-contain brightness-0 invert"
                  priority
                  unoptimized
                />
              </div>
            </Link>
            {config.siteSlogan && (
              <p className="text-green-100/70 dark:text-gray-400 text-sm leading-relaxed">
                {config.siteSlogan}
              </p>
            )}
            
            {/* Redes sociales con texto editable */}
            {(socialLinks.length > 0 || config.socialText) && (
              <div className="pt-2">
                {config.socialText && (
                  <p className="text-sm text-green-100/70 dark:text-gray-400 mb-3">
                    {config.socialText}
                  </p>
                )}
                {socialLinks.length > 0 && (
                  <div className="flex gap-3">
                    {socialLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <a
                          key={link.name}
                          href={link.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/10 dark:bg-white/5 text-white transition-all hover:scale-110 hover:bg-opacity-100 ${link.hoverColor}`}
                          aria-label={link.name}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-lg">Navegación</h3>
            <ul className="space-y-3">
              {[
                { name: 'Inicio', href: '/' },
                { name: 'Servicios', href: '/servicios' },
                { name: 'Noticias', href: '/noticias' },
                { name: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-green-100/60 dark:text-gray-400 hover:text-[#8BC34A] dark:hover:text-[#6BBE45] transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 transition-all duration-200 h-0.5 bg-[#8BC34A] dark:bg-[#6BBE45] rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicios dinámicos */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-lg">Servicios</h3>
            <ul className="space-y-3">
              {displayServices.length > 0 ? (
                displayServices.map((service) => (
                  <li key={service.id}>
                    <Link 
                      href={`/servicios#servicio-${service.id}`}
                      className="text-green-100/60 dark:text-gray-400 hover:text-[#8BC34A] dark:hover:text-[#6BBE45] transition-colors text-sm inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 transition-all duration-200 h-0.5 bg-[#8BC34A] dark:bg-[#6BBE45] rounded-full" />
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                // Fallback si no hay servicios
                <>
                  <li>
                    <Link href="/servicios" className="text-green-100/60 dark:text-gray-400 hover:text-[#8BC34A] dark:hover:text-[#6BBE45] transition-colors text-sm">
                      Ver todos los servicios
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-white mb-5 text-lg">Contacto</h3>
            <ul className="space-y-4">
              {config.companyAddress && (
                <li className="flex items-start gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-[#8BC34A] dark:text-[#6BBE45] shrink-0 mt-0.5" />
                  <span className="text-green-100/60 dark:text-gray-400">{config.companyAddress}</span>
                </li>
              )}
              {config.companyPhone && (
                <li className="flex items-center gap-3 text-sm">
                  <Phone className="h-5 w-5 text-[#8BC34A] dark:text-[#6BBE45] shrink-0" />
                  <a href={`tel:${config.companyPhone}`} className="text-green-100/60 dark:text-gray-400 hover:text-[#8BC34A] dark:hover:text-[#6BBE45] transition-colors">
                    {config.companyPhone}
                  </a>
                </li>
              )}
              {config.companyEmail && (
                <li className="flex items-center gap-3 text-sm">
                  <Mail className="h-5 w-5 text-[#8BC34A] dark:text-[#6BBE45] shrink-0" />
                  <a href={`mailto:${config.companyEmail}`} className="text-green-100/60 dark:text-gray-400 hover:text-[#8BC34A] dark:hover:text-[#6BBE45] transition-colors">
                    {config.companyEmail}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-green-100/50 dark:text-gray-500">
              © {currentYear} {siteName}. Todos los derechos reservados.
            </p>
            {config.footerText && (
              <p className="text-xs text-green-100/40 dark:text-gray-600 mt-1">
                {config.footerText}
              </p>
            )}
          </div>
          <div className="flex gap-6">
            <Link href="/terminos" className="text-sm text-green-100/50 dark:text-gray-500 hover:text-[#8BC34A] dark:hover:text-[#6BBE45] transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/privacidad" className="text-sm text-green-100/50 dark:text-gray-500 hover:text-[#8BC34A] dark:hover:text-[#6BBE45] transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
