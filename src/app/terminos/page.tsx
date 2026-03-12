import { PublicLayout } from '@/components/public-layout'
import { getLegalPage, getPlatformConfig } from '@/lib/actions'
import { LegalPageContent } from '@/components/legal-page-content'

export default async function TerminosPage() {
  const [legalPage, config] = await Promise.all([
    getLegalPage('terminos'),
    getPlatformConfig()
  ])
  
  return (
    <PublicLayout>
      <LegalPageContent 
        page={legalPage} 
        title="Términos y Condiciones"
        defaultContent=""
        config={config}
      />
    </PublicLayout>
  )
}
