'use client'

import { Calendar } from 'lucide-react'
import { renderEditorBlocks } from '@/components/editor-js'

interface LegalPage {
  id: string
  slug: string
  title: string
  content: string
  blocks?: string | null
  manualDate: string | null
  updatedAt: Date
}

interface PlatformConfig {
  siteName: string
}

interface LegalPageContentProps {
  page: LegalPage | null
  title: string
  defaultContent: string
  config: PlatformConfig
}

export function LegalPageContent({ page, title, defaultContent, config }: LegalPageContentProps) {
  // Parse blocks if available
  let blocksData = null
  if (page?.blocks) {
    try {
      blocksData = JSON.parse(page.blocks)
    } catch {
      blocksData = null
    }
  }
  
  const hasEditorBlocks = blocksData && blocksData.blocks && blocksData.blocks.length > 0
  
  // Usar fecha manual si existe, sino usar la fecha de actualización
  const displayDate = page?.manualDate || (page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }))
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-green-50/30 dark:from-[#0f2028] dark:to-[#0a1a1f] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mb-4">
            {page?.title || title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-[#6BBE45] dark:text-[#8BC34A]" />
            <span>
              Última actualización: {displayDate}
            </span>
          </div>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-12 bg-white dark:bg-[#0a1a1f]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {hasEditorBlocks ? (
              <article className="news-article-content prose prose-lg max-w-none prose-headings:text-[#005A7A] dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-[#6BBE45] dark:prose-a:text-[#8BC34A]">
                {renderEditorBlocks(blocksData.blocks)}
              </article>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Este contenido aún no ha sido configurado. Por favor, edítalo desde el panel de administración.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
