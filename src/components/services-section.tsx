import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Recycle, TreePine, Droplets, Wind, Building2, Sun, CloudRain, Mountain, Flower2, Landmark, Factory, Tractor, Droplet, CloudSun, Waves, Bird, Bug, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getServiceResponsiveUrl, isCloudinaryUrl } from '@/lib/cloudinary'

interface Service {
  id: string
  title: string
  slug?: string | null
  description: string | null
  icon: string | null
  imageUrl: string | null
  featured?: boolean
}

interface ServicesSectionProps {
  services: Service[]
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

export function ServicesSection({ services }: ServicesSectionProps) {
  const getIconComponent = (iconName: string | null) => {
    return iconName && iconMap[iconName] ? iconMap[iconName] : Leaf
  }

  const getServiceHref = (service: Service) => {
    return service.slug ? `/servicios/${service.slug}` : `/servicios#servicio-${service.id}`
  }

  // Mostrar servicios destacados primero, luego los demás
  const sortedServices = [...services].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  const displayServices = sortedServices.slice(0, 6)
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50/30 dark:from-[#0a1a1f] dark:to-[#0f2028] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6BBE45]/5 dark:bg-[#8BC34A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#005A7A]/5 dark:bg-[#2a7a8a]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#6BBE45]/10 dark:bg-[#8BC34A]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#6BBE45] dark:text-[#8BC34A]" />
            <span className="text-[#6BBE45] dark:text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">
              Nuestros Servicios
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mb-4">
            Soluciones Ambientales Integrales
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Ofrecemos una amplia gama de servicios para satisfacer las necesidades ambientales de su organización.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => {
            const IconComponent = getIconComponent(service.icon)
            const serviceHref = getServiceHref(service)
            
            return (
              <Card 
                key={service.id} 
                className="group relative overflow-hidden border-0 bg-white dark:bg-[#0f252d] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Featured badge */}
                {service.featured && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                      ⭐ Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="p-0">
                  {/* Image or Icon Background */}
                  <Link href={serviceHref} className="relative h-48 overflow-hidden block">
                    {service.imageUrl ? (
                      <>
                        <Image
                          src={isCloudinaryUrl(service.imageUrl) ? getServiceResponsiveUrl(service.imageUrl) : service.imageUrl}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#005A7A]/80 via-[#005A7A]/20 to-transparent dark:from-[#0f252d]/80" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#005A7A] to-[#003D52] dark:from-[#003D52] dark:to-[#0f2028]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="h-24 w-24 text-white/10" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    )}
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">
                        {service.title}
                      </h3>
                    </div>
                  </Link>
                  
                  {/* Content */}
                  <div className="p-5">
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!service.imageUrl && (
                          <div className="w-8 h-8 rounded-lg bg-[#6BBE45]/10 dark:bg-[#8BC34A]/10 flex items-center justify-center">
                            <IconComponent className="h-4 w-4 text-[#6BBE45] dark:text-[#8BC34A]" />
                          </div>
                        )}
                      </div>
                      
                      <Link 
                        href={serviceHref}
                        className="inline-flex items-center text-[#6BBE45] dark:text-[#8BC34A] font-medium text-sm hover:gap-2 gap-1 transition-all group/link"
                      >
                        Conocer más
                        <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            asChild 
            size="lg" 
            className="bg-[#005A7A] hover:bg-[#004A66] dark:bg-[#2a7a8a] dark:hover:bg-[#1a6a7a] text-white font-medium px-8 shadow-lg shadow-blue-900/20"
          >
            <Link href="/servicios">
              Ver todos los servicios
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
