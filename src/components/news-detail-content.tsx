'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Share2, Facebook, Linkedin, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { renderEditorBlocks } from '@/components/editor-js'
import { getHeroResponsiveUrl, isCloudinaryUrl } from '@/lib/cloudinary'
import { useToast } from '@/hooks/use-toast'

// X (Twitter) SVG Icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

// WhatsApp SVG Icon
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

interface News {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  imageUrl: string | null
  author: string | null
  publishedAt: string | null
  createdAt: string
  blocks?: string | null
}

interface PlatformConfig {
  siteName: string
}

interface NewsDetailContentProps {
  news: News
  config: PlatformConfig
  shareUrl: string
}

export function NewsDetailContent({ news, config, shareUrl }: NewsDetailContentProps) {
  const { toast } = useToast()

  const formatDate = (date: Date | string | null) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleInstagramShare = async () => {
    const text = `${news.title}\n\n${shareUrl}`
    
    // Verificar si el portapapeles está disponible
    if (!navigator.clipboard) {
      // Fallback: usar método antiguo
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        toast({
          title: "¡Enlace copiado!",
          description: "Pega el enlace en Instagram para compartir.",
        })
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error al copiar",
          description: `Copia este enlace manualmente: ${shareUrl}`,
        })
      }
      document.body.removeChild(textarea)
      return
    }
    
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "¡Enlace copiado!",
        description: "Pega el enlace en Instagram para compartir.",
      })
    } catch (err) {
      console.error('Error copying to clipboard:', err)
      toast({
        variant: "destructive",
        title: "Error al copiar",
        description: `Copia este enlace manualmente: ${shareUrl}`,
      })
    }
  }
  
  // Parse blocks if available
   
  let blocksData: any = null
  if (news.blocks) {
    try {
      blocksData = JSON.parse(news.blocks)
    } catch {
      blocksData = null
    }
  }

  const hasEditorBlocks = blocksData?.blocks && blocksData.blocks.length > 0
  
  return (
    <>
      {/* Hero */}
      <section className="relative h-[400px] md:h-[500px]">
        {news.imageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={isCloudinaryUrl(news.imageUrl) ? getHeroResponsiveUrl(news.imageUrl) : news.imageUrl}
              alt={news.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 gradient-nature" />
        )}
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 w-fit mb-4"
            asChild
          >
            <Link href="/noticias">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a noticias
            </Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl">
            {news.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-white/80 mt-4">
            {news.publishedAt && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(news.publishedAt)}
              </span>
            )}
            {news.author && (
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {news.author}
              </span>
            )}
          </div>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Contenedor con restricción de ancho máxima - forzado */}
          <div className="mx-auto" style={{ maxWidth: '720px', width: '100%' }}>
            {/* Excerpt */}
            {news.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" style={{ textAlign: 'justify', textWrap: 'pretty', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                {news.excerpt}
              </p>
            )}
            
            {/* Content - Con restricción forzada */}
            <article 
              className="news-article-content" 
              style={{ 
                maxWidth: '720px', 
                width: '100%',
                overflow: 'hidden',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              {hasEditorBlocks ? (
                <>
                  {renderEditorBlocks(blocksData.blocks)}
                </>
              ) : (
                <div className="space-y-4">
                  {news.content.split('\n\n').map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="text-lg leading-relaxed text-muted-foreground"
                      style={{ textAlign: 'justify', textWrap: 'pretty', overflowWrap: 'break-word', wordBreak: 'break-word' }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </article>
            
            {/* Share */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Compartir:
                </span>
                
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Compartir en Facebook"
                    className="p-2 rounded-full bg-accent text-muted-foreground hover:bg-[#1877F2] hover:text-white transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(news.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Compartir en X (Twitter)"
                    className="p-2 rounded-full bg-accent text-muted-foreground hover:bg-black hover:text-white transition-colors"
                  >
                    <XIcon className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(news.title + ' ' + shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Compartir en WhatsApp"
                    className="p-2 rounded-full bg-accent text-muted-foreground hover:bg-[#25D366] hover:text-white transition-colors"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                  </a>
                  <button
                    onClick={handleInstagramShare}
                    title="Compartir en Instagram"
                    className="p-2 rounded-full bg-accent text-muted-foreground hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </button>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Compartir en LinkedIn"
                    className="p-2 rounded-full bg-accent text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
