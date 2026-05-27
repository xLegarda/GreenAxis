import { PublicLayout } from '@/components/public-layout'
import { getNews, getPlatformConfig } from '@/lib/actions'
import { NewsPageContent } from '@/components/news-page-content'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPlatformConfig()
  const siteUrl = config.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || ''
  const canonicalUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/noticias` : undefined

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function NoticiasPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const [newsData, config] = await Promise.all([
    getNews(page, 6),
    getPlatformConfig()
  ])
  
  return (
    <PublicLayout>
      <NewsPageContent 
        news={newsData.news} 
        currentPage={page}
        totalPages={newsData.pages}
        total={newsData.total}
        config={config}
      />
    </PublicLayout>
  )
}
