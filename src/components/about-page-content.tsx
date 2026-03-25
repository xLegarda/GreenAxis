'use client'

import Image from 'next/image'
import Link from 'next/link'
import { isCloudinaryUrl } from '@/lib/cloudinary'
import { 
  Users, Target, Award, CheckCircle, Shield, Clock, Settings, Heart, 
  Calendar, FolderCheck, ChevronRight, Mail, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PlatformConfig {
  siteName: string
  companyAddress: string | null
  companyPhone: string | null
  companyEmail: string | null
  googleMapsEmbed: string | null
}

interface AboutPage {
  heroTitle: string | null
  heroSubtitle: string | null
  heroImageUrl: string | null
  historyTitle: string | null
  historyContent: string | null
  historyImageUrl: string | null
  missionTitle: string | null
  missionContent: string | null
  visionTitle: string | null
  visionContent: string | null
  valuesTitle: string | null
  valuesContent: string | null
  teamTitle: string | null
  teamEnabled: boolean
  teamMembers: string | null
  whyChooseTitle: string | null
  whyChooseContent: string | null
  ctaTitle: string | null
  ctaSubtitle: string | null
  ctaButtonText: string | null
  ctaButtonUrl: string | null
  statsEnabled: boolean
  statsContent: string | null
  certificationsEnabled: boolean
  certificationsContent: string | null
  showLocationSection: boolean
}

interface AboutPageContentProps {
  config: PlatformConfig
  aboutPage: AboutPage
}

// Mapeo de iconos
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users, Target, Award, CheckCircle, Shield, Clock, Settings, Heart, Calendar, FolderCheck, Mail
}

export function AboutPageContent({ config, aboutPage }: AboutPageContentProps) {
  // Parsear valores
  let values: Array<{ title: string; description: string; icon: string }> = []
  let whyChoose: Array<{ title: string; description: string; icon: string }> = []
  let stats: Array<{ value: string; label: string; icon: string }> = []
  let team: Array<{ name: string; role: string; image: string; bio: string }> = []
  let certifications: Array<{ name: string; image: string }> = []
  
  try {
    if (aboutPage.valuesContent) values = JSON.parse(aboutPage.valuesContent)
  } catch {}
  
  try {
    if (aboutPage.whyChooseContent) whyChoose = JSON.parse(aboutPage.whyChooseContent)
  } catch {}
  
  try {
    if (aboutPage.statsContent) stats = JSON.parse(aboutPage.statsContent)
  } catch {}
  
  try {
    if (aboutPage.teamMembers) team = JSON.parse(aboutPage.teamMembers)
  } catch {}
  
  try {
    if (aboutPage.certificationsContent) certifications = JSON.parse(aboutPage.certificationsContent)
  } catch {}
  
  // Extraer URL del mapa
  const getMapEmbedSrc = () => {
    if (config.googleMapsEmbed) {
      const srcMatch = config.googleMapsEmbed.match(/src=["']([^"']+)["']/)
      if (srcMatch) return srcMatch[1]
      if (config.googleMapsEmbed.startsWith('http')) return config.googleMapsEmbed
    }
    if (config.companyAddress) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(config.companyAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    }
    return null
  }
  
  const mapEmbedSrc = getMapEmbedSrc()
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#005A7A] via-[#004A66] to-[#003D52] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#6BBE45] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#6BBE45] rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {aboutPage.heroTitle || 'Quiénes Somos'}
            </h1>
            <p className="text-xl md:text-2xl text-white/80">
              {aboutPage.heroSubtitle || 'Comprometidos con el medio ambiente'}
            </p>
          </div>
        </div>
      </section>
      
      {/* Historia Section */}
      <section className="py-20 bg-white dark:bg-[#0a1a1f]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[#6BBE45] font-semibold text-sm uppercase tracking-wider">
                Conócenos
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2 mb-6">
                {aboutPage.historyTitle || 'Nuestra Historia'}
              </h2>
              <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400">
                {aboutPage.historyContent?.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={aboutPage.historyImageUrl || "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"}
                  alt="Nuestra historia"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized={!aboutPage.historyImageUrl || !isCloudinaryUrl(aboutPage.historyImageUrl)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Misión y Visión */}
      <section className="py-20 bg-gray-50 dark:bg-[#0f2028]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Misión */}
            <div className="bg-white dark:bg-[#0a1a1f] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="w-14 h-14 bg-[#005A7A]/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-[#005A7A]" />
              </div>
              <h3 className="text-2xl font-bold text-[#005A7A] dark:text-white mb-4">
                {aboutPage.missionTitle || 'Nuestra Misión'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {aboutPage.missionContent}
              </p>
            </div>
            
            {/* Visión */}
            <div className="bg-white dark:bg-[#0a1a1f] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="w-14 h-14 bg-[#6BBE45]/10 rounded-xl flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-[#6BBE45]" />
              </div>
              <h3 className="text-2xl font-bold text-[#005A7A] dark:text-white mb-4">
                {aboutPage.visionTitle || 'Nuestra Visión'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {aboutPage.visionContent}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Valores */}
      {values.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#0a1a1f]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#6BBE45] font-semibold text-sm uppercase tracking-wider">
                Lo que nos define
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2">
                {aboutPage.valuesTitle || 'Nuestros Valores'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const Icon = iconMap[value.icon] || Shield
                return (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-[#0f2028] p-6 rounded-xl text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-[#6BBE45]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-[#6BBE45]" />
                    </div>
                    <h4 className="text-lg font-bold text-[#005A7A] dark:text-white mb-2">{value.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* Estadísticas */}
      {aboutPage.statsEnabled && stats.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-[#005A7A] to-[#004A66]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = iconMap[stat.icon] || Users
                return (
                  <div key={index} className="text-center text-white">
                    <Icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
                    <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/70 mt-1">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* Por qué elegirnos */}
      {whyChoose.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-[#0f2028]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#6BBE45] font-semibold text-sm uppercase tracking-wider">
                Nuestras fortalezas
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2">
                {aboutPage.whyChooseTitle || '¿Por Qué Elegirnos?'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {whyChoose.map((item, index) => {
                const Icon = iconMap[item.icon] || CheckCircle
                return (
                  <div key={index} className="flex items-start gap-4 bg-white dark:bg-[#0a1a1f] p-6 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-[#6BBE45]/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-[#6BBE45]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#005A7A] dark:text-white mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* Equipo */}
      {aboutPage.teamEnabled && team.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#0a1a1f]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#6BBE45] font-semibold text-sm uppercase tracking-wider">
                Conoce al equipo
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2">
                {aboutPage.teamTitle || 'Nuestro Equipo'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={member.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"}
                      alt={member.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                      unoptimized={!member.image || !isCloudinaryUrl(member.image)}
                    />
                  </div>
                  <h4 className="text-lg font-bold text-[#005A7A] dark:text-white">{member.name}</h4>
                  <p className="text-[#6BBE45] text-sm font-medium">{member.role}</p>
                  {member.bio && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Certificaciones */}
      {aboutPage.certificationsEnabled && certifications.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-[#0f2028]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[#005A7A] dark:text-white">
                Certificaciones y Reconocimientos
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              {certifications.map((cert, index) => (
                <div key={index} className="bg-white dark:bg-[#0a1a1f] px-8 py-6 rounded-xl shadow-sm">
                  {cert.image ? (
                    <Image src={cert.image} alt={cert.name} width={120} height={60} className="object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-[#005A7A] dark:text-white">{cert.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Ubicación */}
      {aboutPage.showLocationSection !== false && (config.companyAddress || mapEmbedSrc) && (
        <section className="py-16 bg-white dark:bg-[#0a1a1f]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#005A7A] dark:text-white mb-4">
                Nuestra Ubicación
              </h2>
              {config.companyAddress && (
                <p className="text-gray-600 dark:text-gray-400">{config.companyAddress}</p>
              )}
            </div>
            {mapEmbedSrc && (
              <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
                <iframe
                  src={mapEmbedSrc}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación"
                />
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-[#6BBE45] to-[#5CAE38]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {aboutPage.ctaTitle || '¿Listo para trabajar con nosotros?'}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {aboutPage.ctaSubtitle || 'Contáctanos y descubre cómo podemos ayudarte'}
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-[#005A7A] hover:bg-[#004A66] text-white font-medium px-8"
          >
            <Link href={aboutPage.ctaButtonUrl || '/contacto'}>
              {aboutPage.ctaButtonText || 'Contáctanos'}
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
