import { PublicLayout } from '@/components/public-layout'
import { getPlatformConfig } from '@/lib/actions'
import { AboutPageContent } from '@/components/about-page-content'
import { db } from '@/lib/db'

export default async function QuienesSomosPage() {
  const [config, aboutPage] = await Promise.all([
    getPlatformConfig(),
    getAboutPage()
  ])
  
  return (
    <PublicLayout>
      <AboutPageContent config={config} aboutPage={aboutPage} />
    </PublicLayout>
  )
}

async function getAboutPage() {
  let aboutPage = await db.aboutPage.findFirst()
  
  if (!aboutPage) {
    aboutPage = await db.aboutPage.create({
      data: {
        heroTitle: 'Quiénes Somos',
        heroSubtitle: 'Comprometidos con el medio ambiente',
        historyTitle: 'Nuestra Historia',
        historyContent: 'Somos una empresa líder en servicios ambientales en Colombia.',
        missionTitle: 'Nuestra Misión',
        missionContent: 'Proporcionar soluciones ambientales integrales.',
        visionTitle: 'Nuestra Visión',
        visionContent: 'Ser reconocidos como la empresa líder en servicios ambientales.',
      }
    })
  }
  
  return aboutPage
}
