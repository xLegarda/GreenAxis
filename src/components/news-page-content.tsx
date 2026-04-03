'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { getThumbnailResponsiveUrl, isCloudinaryUrl } from '@/lib/cloudinary'

interface News {
  id: string
  title: string
  slug: string
  excerpt: string | null
  imageUrl: string | null
  author: string | null
  publishedAt: Date | null
  createdAt: Date
}

interface PlatformConfig {
  siteName: string
}

interface NewsPageContentProps {
  news: News[]
  currentPage: number
  totalPages: number
  total: number
  config: PlatformConfig
}

export function NewsPageContent({ news, currentPage, totalPages, total, config }: NewsPageContentProps) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#005A7A] via-[#004A66] to-[#003D52] dark:from-[#051215] dark:via-[#0a1a1f] dark:to-[#0f2028] py-20">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#6BBE45]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#8BC34A]/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Noticias y Blog
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Mantente informado sobre las últimas novedades en el sector ambiental.
          </p>
        </div>
      </section>
      
      {/* News Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {news.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No hay noticias publicadas por el momento.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article) => (
                  <Card key={article.id} className="group overflow-hidden border-0 bg-card shadow-md hover:shadow-xl transition-shadow">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {article.imageUrl ? (
                        <Image
                          src={isCloudinaryUrl(article.imageUrl) ? getThumbnailResponsiveUrl(article.imageUrl) : article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 gradient-nature flex items-center justify-center">
                          <span className="text-white/50 text-6xl font-bold">
                            {article.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(article.publishedAt)}
                          </span>
                        )}
                        {article.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {article.author}
                          </span>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        <Link href={`/noticias/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>
                      
                      {/* Excerpt */}
                      {article.excerpt && (
                        <p className="text-muted-foreground line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                    </CardContent>
                    
                    <CardFooter className="px-6 pb-6 pt-0">
                      <Link 
                        href={`/noticias/${article.slug}`}
                        className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all"
                      >
                        Leer más
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  {currentPage > 1 && (
                    <Button variant="outline" asChild>
                      <Link href={`/noticias?page=${currentPage - 1}`}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Anterior
                      </Link>
                    </Button>
                  )}
                  
                  <span className="text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  {currentPage < totalPages && (
                    <Button variant="outline" asChild>
                      <Link href={`/noticias?page=${currentPage + 1}`}>
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
