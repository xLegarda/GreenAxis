import { PublicLayout } from '@/components/public-layout'
import { getServices, getPlatformConfig } from '@/lib/actions'
import { ServicesPageContent } from '@/components/services-page-content'

export default async function ServiciosPage() {
  const [services, config] = await Promise.all([
    getServices(),
    getPlatformConfig()
  ])
  
  return (
    <PublicLayout>
      <ServicesPageContent services={services} config={config} />
    </PublicLayout>
  )
}
