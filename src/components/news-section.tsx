import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

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

interface NewsSectionProps {
  news: News[]
}

export function NewsSection({ news }: NewsSectionProps) {
  if (news.length === 0) return null
  
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
    <section className="py-20 bg-gradient-to-b from-green-50/30 to-white dark:from-[#0f2028] dark:to-[#0a1a1f]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#6BBE45] dark:text-[#8BC34A] font-semibold text-sm uppercase tracking-wider">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#005A7A] dark:text-white mt-2 mb-4">
            Últimas Noticias
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Mantente informado sobre las últimas novedades en el sector ambiental.
          </p>
        </div>
        
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <Card key={article.id} className="group overflow-hidden border-0 bg-white dark:bg-[#0f2028] shadow-lg hover:shadow-xl transition-all card-hover">
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#005A7A] to-[#6BBE45] dark:from-[#003D52] dark:to-[#8BC34A] flex items-center justify-center">
                    <span className="text-white/50 text-6xl font-bold">
                      {article.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
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
                <h3 className="text-xl font-semibold text-[#005A7A] dark:text-white mb-2 line-clamp-2 group-hover:text-[#6BBE45] dark:group-hover:text-[#8BC34A] transition-colors">
                  <Link href={`/noticias/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                
                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
              </CardContent>
              
              <CardFooter className="px-6 pb-6 pt-0">
                <Link 
                  href={`/noticias/${article.slug}`}
                  className="inline-flex items-center text-[#6BBE45] dark:text-[#8BC34A] font-medium hover:gap-2 gap-1 transition-all"
                >
                  Leer más
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            asChild 
            size="lg" 
            variant="outline"
            className="border-[#005A7A] dark:border-[#2a7a8a] text-[#005A7A] dark:text-[#2a7a8a] hover:bg-[#005A7A] dark:hover:bg-[#2a7a8a] hover:text-white dark:hover:text-white font-medium px-8"
          >
            <Link href="/noticias">
              Ver todas las noticias
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
