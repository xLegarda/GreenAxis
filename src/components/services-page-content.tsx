'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Recycle, TreePine, Droplets, Wind, Building2, ArrowRight, Sun, CloudRain, Mountain, Flower2, Landmark, Factory, Tractor, Droplet, CloudSun, Waves, Bird, Bug, Sparkles, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getServiceResponsiveUrl, isCloudinaryUrl } from '@/lib/cloudinary'

interface Service {
  id: string
  title: string
  slug?: string | null
  description: string | null
  shortBlocks?: string | null
  content: string | null
  blocks?: string | null
  icon: string | null
  imageUrl: string | null
  featured?: boolean
  showSummary?: boolean
}

interface PlatformConfig {
  siteName: string
  companyPhone?: string | null
  companyEmail?: string | null
}

interface ServicesPageContentProps {
  services: Service[]
  config: PlatformConfig
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Recycle,
  TreePine,
  Droplets,
  Wind,
  Building2,
  Sun,
  CloudRain,
  Mountain,
  Flower2,
  Landmark,
  Factory,
  Tractor,
  Droplet,
  CloudSun,
  Waves,
  Bird,
  Bug,
}

export function ServicesPageContent({ services, config }: ServicesPageContentProps) {
  const getIconComponent = (iconName: string | null) => {
    return iconName && iconMap[iconName] ? iconMap[iconName] : Leaf
  }

  const stripHtml = (input: string) => input.replace(/<[^>]*>/g, '')

  const getServiceHref = (service: Service) => {
    return service.slug ? `/servicios/${service.slug}` : `/servicios#servicio-${service.id}`
  }

  const getShortDescriptionText = (service: Service): string => {
    if (service.shortBlocks) {
      try {
        const data = JSON.parse(service.shortBlocks)
        if (Array.isArray(data?.blocks)) {
          const text = data.blocks
            .map((block: any) => {
              switch (block?.type) {
                case 'paragraph':
                case 'header':
                case 'titulo1':
                case 'titulo2':
                case 'titulo3':
                case 'titulo4':
                  return stripHtml(block?.data?.text || '')
                case 'list':
                  return (block?.data?.items || []).map((item: string) => stripHtml(item)).join(' • ')
                case 'quote':
                  return stripHtml(block?.data?.text || '')
                default:
                  return ''
              }
            })
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim()

          if (text) return text
        }
      } catch {
        // Fall through
      }
    }

    return service.description?.trim() || ''
  }

  const renderShortDescription = (service: Service, variant: 'card' | 'detail' = 'card') => {
    // Check if summary should be shown (default to true for backward compatibility)
    if (service.showSummary === false) return null
    
    const text = getShortDescriptionText(service)
    if (!text) return null

    if (variant === 'detail') {
      return <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">{text}</p>
    }

    return <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">{text}</p>
  }

  // Separar servicios destacados
  const featuredServices = services.filter(s => s.featured)
  const regularServices = services.filter(s => !s.featured)

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#005A7A] via-[#004A66] to-[#003D52] dark:from-[#051215] dark:via-[#0a1a1f] dark:to-[#0f2028]">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(107, 190, 69, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(107, 190, 69, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-[#6BBE45]/20 rounded-lg rotate-12 animate-pulse" />
        <div className="absolute bottom-32 right-32 w-40 h-40 border-4 border-[#8BC34A]/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-[#6BBE45]/10 rounded-lg -rotate-12" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center text-white z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Sparkles className="h-4 w-4 text-[#8BC34A]" />
            <span className="text-sm font-medium">Soluciones Profesionales</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Nuestros Servicios
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Soluciones ambientales integrales para empresas comprometidas con el desarrollo sostenible y la protección del medio ambiente.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contacto'}
              className="inline-flex items-center justify-center gap-2 bg-[#6BBE45] hover:bg-[#5CAE38] text-white font-medium px-8 py-3 rounded-lg shadow-xl shadow-green-900/20 transition-all text-base"
            >
              Solicitar Cotización
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('servicios')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#005A7A] bg-white/10 backdrop-blur-sm px-8 py-3 rounded-lg transition-all text-base font-medium"
            >
              Ver Servicios
            </button>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto dark:fill-[#0a1a1f] fill-white">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" />
          </svg>
        </div>
      </section>

      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <section className="py-16 bg-white dark:bg-[#0a1a1f]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#6BBE45] dark:text-[#8BC34A] font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                Servicios Destacados
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2">
                Lo más solicitado
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => {
                const IconComponent = getIconComponent(service.icon)
                const serviceHref = getServiceHref(service)
                
                return (
                  <Card 
                    key={service.id} 
                    className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-green-50/50 dark:from-[#0f252d] dark:to-[#0f2028] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Featured badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        ⭐ Popular
                      </span>
                    </div>
                    
                    <CardContent className="p-0">
                      {/* Image or Icon */}
                      <Link href={serviceHref} className="relative h-48 overflow-hidden block">
                        {service.imageUrl ? (
                          <Image
                            src={isCloudinaryUrl(service.imageUrl) ? getServiceResponsiveUrl(service.imageUrl) : service.imageUrl}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#6BBE45] to-[#005A7A] dark:from-[#8BC34A] dark:to-[#2a7a8a] flex items-center justify-center">
                            <IconComponent className="h-20 w-20 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </Link>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {!service.imageUrl && (
                            <div className="w-10 h-10 rounded-xl bg-[#6BBE45]/10 dark:bg-[#8BC34A]/10 flex items-center justify-center">
                              <IconComponent className="h-5 w-5 text-[#6BBE45] dark:text-[#8BC34A]" />
                            </div>
                          )}
                          <Link href={serviceHref} className="text-xl font-bold text-[#005A7A] dark:text-white hover:underline">
                            {service.title}
                          </Link>
                        </div>
                        
                        <div className="mb-4">
                          {renderShortDescription(service, 'card')}
                        </div>
                        
                        <Link
                          href={serviceHref}
                          className="inline-flex items-center text-[#6BBE45] dark:text-[#8BC34A] font-medium hover:gap-2 gap-1 transition-all text-sm"
                        >
                          Ver detalles
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Services Detail */}
      <section id="servicios" className="py-16 bg-gray-50 dark:bg-[#0f2028]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#6BBE45] dark:text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">
              Catálogo Completo
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2">
              Todos nuestros servicios
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Descubre nuestra amplia gama de servicios ambientales diseñados para satisfacer las necesidades de tu empresa.
            </p>
          </div>
          
          <div className="space-y-12">
            {services.map((service, index) => {
              const IconComponent = getIconComponent(service.icon)
              const isEven = index % 2 === 0
              const serviceHref = getServiceHref(service)
              
              return (
                <div 
                  key={service.id} 
                  id={`servicio-${service.id}`}
                  className="scroll-mt-24"
                >
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}>
                    {/* Image */}
                    <div className="w-full lg:w-1/2">
                      <Link href={serviceHref} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group block">
                        {service.imageUrl ? (
                          <Image
                            src={isCloudinaryUrl(service.imageUrl) ? getServiceResponsiveUrl(service.imageUrl) : service.imageUrl}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#005A7A] to-[#6BBE45] dark:from-[#003D52] dark:to-[#8BC34A] flex items-center justify-center">
                            <IconComponent className="h-32 w-32 text-white/20" />
                          </div>
                        )}
                        
                        {/* Floating badge */}
                        {service.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                              ⭐ Más solicitado
                            </span>
                          </div>
                        )}
                      </Link>
                    </div>
                    
                    {/* Content */}
                    <div className="w-full lg:w-1/2 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#6BBE45]/10 dark:bg-[#8BC34A]/10 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-[#6BBE45] dark:text-[#8BC34A]" />
                        </div>
                        <span className="text-[#6BBE45] dark:text-[#8BC34A] font-semibold">
                          Servicio {index + 1}
                        </span>
                      </div>
                      
                      <Link href={serviceHref} className="text-2xl md:text-3xl font-bold text-[#005A7A] dark:text-white hover:underline">
                      {service.title}
                    </Link>
                    
                    {renderShortDescription(service, 'detail')}
                    
                      <div className="pt-4">
                        <Button asChild className="bg-[#6BBE45] hover:bg-[#5CAE38] dark:bg-[#8BC34A] dark:hover:bg-[#7AB83A] text-white">
                          <Link href="/contacto">
                            Solicitar este servicio
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#005A7A] via-[#004A66] to-[#003D52] dark:from-[#051215] dark:via-[#0a1a1f] dark:to-[#0f2028] relative overflow-hidden">
        <div className="absolute inset-0 pattern-leaves opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Ofrecemos soluciones personalizadas para cada necesidad. Contáctanos y diseñaremos un plan a tu medida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white font-medium px-8 shadow-xl">
                <Link href="/contacto">
                  Solicitar Cotización Personalizada
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
            
            {/* Contact Info */}
            {config.companyPhone || config.companyEmail ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center text-white/80">
                {config.companyPhone && (
                  <a href={`tel:${config.companyPhone}`} className="flex items-center gap-2 hover:text-[#8BC34A] transition-colors">
                    <Phone className="h-5 w-5" />
                    {config.companyPhone}
                  </a>
                )}
                {config.companyEmail && (
                  <a href={`mailto:${config.companyEmail}`} className="flex items-center gap-2 hover:text-[#8BC34A] transition-colors">
                    <Mail className="h-5 w-5" />
                    {config.companyEmail}
                  </a>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}


