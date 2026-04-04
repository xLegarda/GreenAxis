import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PortfolioDownloadSectionProps {
  title?: string | null
  url?: string | null
  variant?: 'default' | 'compact'
  className?: string
}

function normalizeUrl(url: string | null | undefined): string {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

export function PortfolioDownloadSection({
  title,
  url,
  variant = 'default',
  className = ''
}: PortfolioDownloadSectionProps) {
  if (!url) return null

  if (variant === 'compact') {
    return (
      <div className={`text-center ${className}`}>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-2 border-[#6BBE45] text-[#6BBE45] hover:bg-[#6BBE45] hover:text-white dark:border-[#8BC34A] dark:text-[#8BC34A] dark:hover:bg-[#8BC34A] dark:hover:text-white font-medium px-8 shadow-lg transition-all"
        >
          <a href={normalizeUrl(url)} target="_blank" rel="noopener noreferrer">
            <Download className="h-5 w-5 mr-2" />
            {title || 'Descargar Portafolio'}
          </a>
        </Button>
      </div>
    )
  }

  return (
    <section className={`py-16 bg-gradient-to-br from-[#005A7A]/5 to-[#6BBE45]/5 dark:from-[#003D52]/20 dark:to-[#8BC34A]/10 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#0f252d] rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Icon */}
              <div className="shrink-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#6BBE45] to-[#5CAE38] dark:from-[#8BC34A] dark:to-[#7AB83A] flex items-center justify-center shadow-lg animate-bounce-slow">
                  <FileText className="h-10 w-10 md:h-12 md:w-12 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-[#005A7A] dark:text-white mb-2">
                  {title || 'Descarga Nuestro Portafolio Corporativo'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Conoce todos nuestros servicios y soluciones ambientales en un solo documento
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#6BBE45] hover:bg-[#5CAE38] dark:bg-[#8BC34A] dark:hover:bg-[#7AB83A] text-white font-medium px-8 shadow-lg"
                >
                  <a href={normalizeUrl(url)} target="_blank" rel="noopener noreferrer">
                    <Download className="h-5 w-5 mr-2" />
                    Descargar Portafolio
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
