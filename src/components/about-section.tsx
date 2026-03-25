import Image from 'next/image'
import { CheckCircle, Target, Users, Award } from 'lucide-react'
import { getServiceResponsiveUrl, isCloudinaryUrl } from '@/lib/cloudinary'

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
  if (config.aboutSectionEnabled === false) return null

  const siteName = config.siteName || 'Green Axis S.A.S.'
  const yearsExperience = config.aboutYearsExperience || '15'
  const badgeColor = config.aboutBadgeColor || '#6BBE45'

  let stats: Stat[] = [
    { icon: 'Users', value: '500', label: 'Clientes Satisfechos', bullet: '+' },
    { icon: 'Target', value: '15', label: 'Años de Experiencia', bullet: '+' },
    { icon: 'Award', value: '50', label: 'Proyectos Completados', bullet: '+' },
  ]

  if (config.aboutStats) {
    try {
      stats = JSON.parse(config.aboutStats)
    } catch {
      // Usar defaults si falla el parseo
    }
  }

  let features: string[] = [
    'Equipo profesional altamente calificado',
    'Tecnología de última generación',
    'Cumplimiento normativo garantizado',
    'Atención personalizada 24/7'
  ]

  if (config.aboutFeatures) {
    try {
      features = JSON.parse(config.aboutFeatures)
    } catch {
      // Usar defaults si falla el parseo
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
      Users,
      Target,
      Award,
      CheckCircle,
    }
    return icons[iconName] || Users
  }

  const imageUrl = config.aboutImageUrl && isCloudinaryUrl(config.aboutImageUrl)
    ? getServiceResponsiveUrl(config.aboutImageUrl)
    : (config.aboutImageUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80')

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-[#0a1a1f]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Image Side */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl}
                  alt="Equipo de trabajo ambiental"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized={!isCloudinaryUrl(imageUrl)}
                />
              {/* Overlay gradient para dar profundidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Badge flotante - posicionado de forma segura */}
            <div
              className="absolute -bottom-4 left-4 right-4 sm:left-auto sm:-right-4 sm:w-52 text-white p-4 rounded-xl shadow-xl"
              style={{ backgroundColor: badgeColor }}
            >
              <p className="text-2xl sm:text-3xl font-bold leading-none">{yearsExperience}</p>
              <p className="text-xs sm:text-sm opacity-90 mt-1 leading-snug">
                {config.aboutYearsText || 'Años protegiendo el medio ambiente'}
              </p>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-5 mt-8 lg:mt-0">
            <div>
              <span
                className="font-semibold text-xs sm:text-sm uppercase tracking-wider"
                style={{ color: badgeColor }}
              >
                {config.aboutBadge || 'Sobre Nosotros'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2 leading-tight">
                {config.aboutTitle || config.siteSlogan || 'Comprometidos con el futuro del planeta'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed mt-3">
                {config.aboutDescription || config.siteDescription || `${siteName} es una empresa líder en servicios ambientales en Colombia, dedicada a ofrecer soluciones integrales para la gestión sostenible del medio ambiente.`}
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle
                    className="h-5 w-5 shrink-0 mt-0.5"
                    style={{ color: badgeColor }}
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-5 border-t border-gray-100 dark:border-gray-800">
              {stats.map((stat, index) => {
                const Icon = getIconComponent(stat.icon || 'Users')
                return (
                  <div key={index} className="text-center p-2 sm:p-3 rounded-xl bg-gray-50 dark:bg-[#0f252d]/50">
                    <Icon
                      className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1.5"
                      style={{ color: badgeColor }}
                    />
                    <p className="text-xl sm:text-2xl font-bold text-[#005A7A] dark:text-white leading-none">
                      {stat.value}{stat.bullet || ''}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                      {stat.label}
                    </p>
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
