import { PublicLayout } from '@/components/public-layout'
import { getNews, getPlatformConfig } from '@/lib/actions'
import { NewsPageContent } from '@/components/news-page-content'

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
