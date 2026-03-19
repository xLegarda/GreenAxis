'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Phone, Mail, Leaf, Recycle, TreePine, Droplets, Wind, Building2, Sun, CloudRain, Mountain, Flower2, Landmark, Factory, Tractor, Droplet, CloudSun, Waves, Bird, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { editorDataToText, renderEditorBlocks } from '@/components/editor-js'
import { getHeroResponsiveUrl, isCloudinaryUrl } from '@/lib/cloudinary'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf, Recycle, TreePine, Droplets, Wind, Building2,
  Sun, CloudRain, Mountain, Flower2, Landmark, Factory,
  Tractor, Droplet, CloudSun, Waves, Bird, Bug,
}

interface Service {
  id: string
  title: string
  slug: string | null
  description: string | null
  shortBlocks: string | null
  content: string | null
  blocks: string | null
  icon: string | null
  imageUrl: string | null
  showSummary?: boolean
}

interface PlatformConfig {
  siteName: string
  companyPhone?: string | null
  companyEmail?: string | null
}

interface ServiceDetailContentProps {
  service: Service
  config: PlatformConfig
}

export function ServiceDetailContent({ service, config }: ServiceDetailContentProps) {
  const IconComponent = (service.icon && iconMap[service.icon]) ? iconMap[service.icon] : Leaf

  // Parse EditorJS blocks
  let blocksData: any = null
  if (service.blocks) {
    try {
      blocksData = JSON.parse(service.blocks)
    } catch {
      blocksData = null
    }
  }
  const hasEditorBlocks = blocksData?.blocks && blocksData.blocks.length > 0

  let summaryText: string | null = null
  if (service.shortBlocks) {
    try {
      const shortBlocksData = JSON.parse(service.shortBlocks)
      const extracted = editorDataToText(shortBlocksData).trim()
      summaryText = extracted || null
    } catch {
      summaryText = null
    }
  }
  if (!summaryText && service.description) {
    summaryText = service.description
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[380px] md:h-[460px]">
        {service.imageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={isCloudinaryUrl(service.imageUrl) ? getHeroResponsiveUrl(service.imageUrl) : service.imageUrl}
              alt={service.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#005A7A] via-[#004A66] to-[#003D52] dark:from-[#051215] dark:via-[#0a1a1f] dark:to-[#0f2028]">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <IconComponent className="h-64 w-64 text-white" />
            </div>
          </div>
        )}

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 w-fit mb-4"
            asChild
          >
            <Link href="/servicios">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a servicios
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <IconComponent className="h-6 w-6 text-[#6BBE45]" />
            </div>
            <span className="text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">
              Servicio
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">
            {service.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white dark:bg-[#0a1a1f]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">
            <div className="min-w-0">
              <div className="mx-auto" style={{ maxWidth: '760px', width: '100%' }}>
                {/* Summary - only show if showSummary is not explicitly false */}
                {summaryText && service.showSummary !== false ? (
                  <div className="mb-10 rounded-2xl border bg-gradient-to-br from-[#6BBE45]/10 via-white to-white dark:from-[#8BC34A]/10 dark:via-[#0f252d] dark:to-[#0a1a1f] p-6 shadow-sm">
                    <p className="text-sm font-semibold text-[#005A7A] dark:text-white mb-2">
                      Resumen
                    </p>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                      {summaryText}
                    </p>
                  </div>
                ) : null}

                {/* EditorJS blocks or markdown fallback */}
                {hasEditorBlocks ? (
                  <article
                    className="news-article-content"
                    style={{
                      maxWidth: '760px',
                      width: '100%',
                      overflow: 'hidden',
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word',
                      wordBreak: 'break-word'
                    }}
                  >
                    {renderEditorBlocks(blocksData.blocks)}
                  </article>
                ) : service.content ? (
                  <div className="bg-gray-50 dark:bg-[#0f252d] rounded-xl p-6 space-y-3">
                    {service.content.split('\n').filter(line => line.trim()).map((line, i) => {
                      if (line.startsWith('- **') && line.endsWith('**')) {
                        const text = line.replace('- **', '').replace('**', '')
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-[#6BBE45] dark:text-[#8BC34A] shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
                          </div>
                        )
                      } else if (line.startsWith('- ')) {
                        return (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-[#6BBE45] dark:text-[#8BC34A] shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{line.replace('- ', '')}</span>
                          </div>
                        )
                      } else if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-semibold text-[#005A7A] dark:text-white">{line.replace(/\*\*/g, '')}</p>
                      } else {
                        return <p key={i} className="text-gray-600 dark:text-gray-400">{line}</p>
                      }
                    })}
                  </div>
                ) : null}

                {/* CTA (mobile) */}
                <div className="lg:hidden mt-12 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button asChild className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white">
                    <Link href="/contacto">
                      Solicitar este servicio
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>

                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                    {config.companyPhone && (
                      <a href={`tel:${config.companyPhone}`} className="flex items-center gap-2 hover:text-[#6BBE45] transition-colors">
                        <Phone className="h-4 w-4" />
                        {config.companyPhone}
                      </a>
                    )}
                    {config.companyEmail && (
                      <a href={`mailto:${config.companyEmail}`} className="flex items-center gap-2 hover:text-[#6BBE45] transition-colors">
                        <Mail className="h-4 w-4" />
                        {config.companyEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA (desktop) */}
            <aside className="hidden lg:block lg:sticky lg:top-24">
              <div className="rounded-2xl border bg-white dark:bg-[#0f252d] p-6 shadow-sm">
                <p className="text-sm font-semibold text-[#005A7A] dark:text-white mb-3">
                  ¿Te interesa este servicio?
                </p>
                <Button asChild className="w-full bg-[#6BBE45] hover:bg-[#5CAE38] text-white">
                  <Link href="/contacto">
                    Solicitar información
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>

                {(config.companyPhone || config.companyEmail) && (
                  <div className="mt-5 pt-5 border-t space-y-3 text-sm text-muted-foreground">
                    {config.companyPhone && (
                      <a href={`tel:${config.companyPhone}`} className="flex items-center gap-2 hover:text-[#6BBE45] transition-colors">
                        <Phone className="h-4 w-4" />
                        {config.companyPhone}
                      </a>
                    )}
                    {config.companyEmail && (
                      <a href={`mailto:${config.companyEmail}`} className="flex items-center gap-2 hover:text-[#6BBE45] transition-colors">
                        <Mail className="h-4 w-4" />
                        {config.companyEmail}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
