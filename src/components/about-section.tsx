import Image from 'next/image'
import { CheckCircle, Target, Users, Award } from 'lucide-react'
import { getServiceImageUrl, isCloudinaryUrl } from '@/lib/cloudinary'

interface PlatformConfig {
  siteName: string
  siteDescription: string | null
  siteSlogan: string | null
  aboutImageUrl: string | null
  aboutTitle: string | null
  aboutDescription: string | null
  aboutYearsExperience: string | null
  aboutYearsText: string | null
  aboutStats: string | null
  aboutFeatures: string | null
  aboutSectionEnabled?: boolean
  aboutBadge?: string | null
  aboutBadgeColor?: string | null
}

interface AboutSectionProps {
  config: PlatformConfig
}

interface Stat {
  icon: string
  value: string
  label: string
  bullet?: string
}

export function AboutSection({ config }: AboutSectionProps) {
  // Si la sección está desactivada, no renderizar
  if (config.aboutSectionEnabled === false) return null
  
  const siteName = config.siteName || 'Green Axis S.A.S.'
  const yearsExperience = config.aboutYearsExperience || '15'
  const badgeColor = config.aboutBadgeColor || '#6BBE45'
  
  // Parsear stats del JSON o usar defaults
  let stats: Stat[] = [
    { icon: 'Users', value: '500', label: 'Clientes Satisfechos', bullet: '+' },
    { icon: 'Target', value: '15', label: 'Años de Experiencia', bullet: '+' },
    { icon: 'Award', value: '50', label: 'Proyectos Completados', bullet: '+' },
  ]
  
  if (config.aboutStats) {
    try {
      stats = JSON.parse(config.aboutStats)
    } catch (e) {
      // Usar defaults si falla el parseo
    }
  }
  
  // Parsear features del JSON o usar defaults
  let features: string[] = [
    'Equipo profesional altamente calificado',
    'Tecnología de última generación',
    'Cumplimiento normativo garantizado',
    'Atención personalizada 24/7'
  ]
  
  if (config.aboutFeatures) {
    try {
      features = JSON.parse(config.aboutFeatures)
    } catch (e) {
      // Usar defaults si falla el parseo
    }
  }
  
  // Mapear iconos
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
      Users,
      Target,
      Award,
      CheckCircle,
    }
    return icons[iconName] || Users
  }
  
  return (
    <section className="py-20 bg-white dark:bg-[#0a1a1f]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={config.aboutImageUrl && isCloudinaryUrl(config.aboutImageUrl)
                  ? getServiceImageUrl(config.aboutImageUrl)
                  : (config.aboutImageUrl || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80")}
                alt="Equipo de trabajo ambiental"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Card */}
            <div 
              className="absolute -bottom-6 -right-6 text-white p-6 rounded-xl shadow-xl max-w-xs"
              style={{ backgroundColor: badgeColor }}
            >
              <p className="text-3xl font-bold">{yearsExperience}</p>
              <p className="text-sm opacity-90">{config.aboutYearsText || 'Años protegiendo el medio ambiente'}</p>
            </div>
          </div>
          
          {/* Content Side */}
          <div className="space-y-6">
            <span 
              className="font-semibold text-sm uppercase tracking-wider"
              style={{ color: badgeColor }}
            >
              {config.aboutBadge || 'Sobre Nosotros'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white">
              {config.aboutTitle || config.siteSlogan || 'Comprometidos con el futuro del planeta'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {config.aboutDescription || config.siteDescription || `${siteName} es una empresa líder en servicios ambientales en Colombia, dedicada a ofrecer soluciones integrales para la gestión sostenible del medio ambiente.`}
            </p>
            
            {/* Features */}
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle 
                    className="h-5 w-5 shrink-0" 
                    style={{ color: badgeColor }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              {stats.map((stat, index) => {
                const Icon = getIconComponent(stat.icon || 'Users')
                return (
                  <div key={index} className="text-center">
                    <Icon 
                      className="h-8 w-8 mx-auto mb-2" 
                      style={{ color: badgeColor }}
                    />
                    <p className="text-2xl font-bold text-[#005A7A] dark:text-white">
                      {stat.value}{stat.bullet || ''}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
