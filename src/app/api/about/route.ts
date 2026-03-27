import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { z } from 'zod'

const aboutSchema = z.object({
  heroTitle: z.string().nullable().optional(),
  heroSubtitle: z.string().nullable().optional(),
  heroImageUrl: z.string().nullable().optional(),
  historyTitle: z.string().nullable().optional(),
  historyContent: z.string().nullable().optional(),
  historyImageUrl: z.string().nullable().optional(),
  missionTitle: z.string().nullable().optional(),
  missionContent: z.string().nullable().optional(),
  visionTitle: z.string().nullable().optional(),
  visionContent: z.string().nullable().optional(),
  valuesTitle: z.string().nullable().optional(),
  valuesContent: z.string().nullable().optional(),
  teamTitle: z.string().nullable().optional(),
  teamEnabled: z.boolean().optional(),
  teamMembers: z.string().nullable().optional(),
  whyChooseTitle: z.string().nullable().optional(),
  whyChooseContent: z.string().nullable().optional(),
  ctaTitle: z.string().nullable().optional(),
  ctaSubtitle: z.string().nullable().optional(),
  ctaButtonText: z.string().nullable().optional(),
  ctaButtonUrl: z.string().nullable().optional(),
  statsEnabled: z.boolean().optional(),
  statsContent: z.string().nullable().optional(),
  certificationsEnabled: z.boolean().optional(),
  certificationsContent: z.string().nullable().optional(),
  showLocationSection: z.boolean().optional(),
})

// GET - Obtener contenido de la página Quiénes Somos
export async function GET() {
  try {
    let aboutPage = await db.aboutPage.findFirst()
    
    if (!aboutPage) {
      // Crear con valores por defecto
      aboutPage = await db.aboutPage.create({
        data: {
          heroTitle: 'Quiénes Somos',
          heroSubtitle: 'Comprometidos con el medio ambiente',
          historyTitle: 'Nuestra Historia',
          historyContent: `Somos una empresa líder en servicios ambientales en Colombia, con más de 15 años de experiencia ofreciendo soluciones integrales para la gestión sostenible del medio ambiente.

Nuestro compromiso nace de la convicción de que es posible equilibrar el desarrollo empresarial con la protección del entorno natural. A lo largo de los años, hemos ayudado a cientos de empresas a cumplir con sus objetivos ambientales mientras contribuyen a un futuro más sostenible.`,
          missionTitle: 'Nuestra Misión',
          missionContent: 'Proporcionar soluciones ambientales integrales y de alta calidad que permitan a nuestros clientes cumplir con la normatividad vigente, minimizar su impacto ambiental y contribuir al desarrollo sostenible.',
          visionTitle: 'Nuestra Visión',
          visionContent: 'Ser reconocidos como la empresa líder en servicios ambientales en Colombia, destacando por nuestra excelencia profesional, innovación constante y compromiso con la preservación del medio ambiente.',
          valuesTitle: 'Nuestros Valores',
          valuesContent: JSON.stringify([
            { title: 'Integridad', description: 'Actuamos con honestidad y transparencia en todas nuestras operaciones.', icon: 'Shield' },
            { title: 'Compromiso', description: 'Estamos dedicados a proteger el medio ambiente y cumplir con nuestras promesas.', icon: 'Target' },
            { title: 'Excelencia', description: 'Buscamos la mejora continua en todos nuestros servicios y procesos.', icon: 'Award' },
            { title: 'Responsabilidad', description: 'Asumimos la responsabilidad de nuestras acciones y su impacto ambiental.', icon: 'CheckCircle' }
          ]),
          whyChooseTitle: '¿Por Qué Elegirnos?',
          whyChooseContent: JSON.stringify([
            { title: 'Experiencia Comprobada', description: 'Más de 15 años de experiencia en el sector ambiental.', icon: 'Clock' },
            { title: 'Equipo Profesional', description: 'Profesionales altamente calificados y certificados.', icon: 'Users' },
            { title: 'Soluciones Integrales', description: 'Ofrecemos servicios completos para todas tus necesidades ambientales.', icon: 'Settings' },
            { title: 'Atención Personalizada', description: 'Acompañamiento cercano en cada etapa del proceso.', icon: 'Heart' }
          ]),
          ctaTitle: '¿Listo para trabajar con nosotros?',
          ctaSubtitle: 'Contáctanos y descubre cómo podemos ayudarte',
          ctaButtonText: 'Contáctanos',
          ctaButtonUrl: '/contacto',
          statsEnabled: true,
          statsContent: JSON.stringify([
            { value: '500+', label: 'Clientes Satisfechos', icon: 'Users' },
            { value: '15+', label: 'Años de Experiencia', icon: 'Calendar' },
            { value: '1000+', label: 'Proyectos Completados', icon: 'FolderCheck' },
            { value: '50+', label: 'Profesionales', icon: 'Award' }
          ]),
        }
      })
    }
    
    return NextResponse.json(aboutPage)
  } catch (error) {
    console.error('Error fetching about page:', error)
    return NextResponse.json({ error: 'Error al obtener la página' }, { status: 500 })
  }
}

// PUT - Actualizar contenido (solo admin)
export async function PUT(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    
    const validationResult = aboutSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data

    let aboutPage = await db.aboutPage.findFirst()
    
    if (!aboutPage) {
      aboutPage = await db.aboutPage.create({
        data: {
          heroTitle: val.heroTitle || 'Quiénes Somos',
          heroSubtitle: val.heroSubtitle,
          heroImageUrl: val.heroImageUrl || null,
          historyTitle: val.historyTitle,
          historyContent: val.historyContent,
          historyImageUrl: val.historyImageUrl || null,
          missionTitle: val.missionTitle,
          missionContent: val.missionContent,
          visionTitle: val.visionTitle,
          visionContent: val.visionContent,
          valuesTitle: val.valuesTitle,
          valuesContent: val.valuesContent,
          teamTitle: val.teamTitle,
          teamEnabled: val.teamEnabled ?? false,
          teamMembers: val.teamMembers,
          whyChooseTitle: val.whyChooseTitle,
          whyChooseContent: val.whyChooseContent,
          ctaTitle: val.ctaTitle,
          ctaSubtitle: val.ctaSubtitle,
          ctaButtonText: val.ctaButtonText,
          ctaButtonUrl: val.ctaButtonUrl,
          statsEnabled: val.statsEnabled ?? true,
          statsContent: val.statsContent,
          certificationsEnabled: val.certificationsEnabled ?? false,
          certificationsContent: val.certificationsContent,
          showLocationSection: val.showLocationSection ?? true,
        }
      })
    } else {
      aboutPage = await db.aboutPage.update({
        where: { id: aboutPage.id },
        data: {
          heroTitle: val.heroTitle,
          heroSubtitle: val.heroSubtitle,
          heroImageUrl: val.heroImageUrl || null,
          historyTitle: val.historyTitle,
          historyContent: val.historyContent,
          historyImageUrl: val.historyImageUrl || null,
          missionTitle: val.missionTitle,
          missionContent: val.missionContent,
          visionTitle: val.visionTitle,
          visionContent: val.visionContent,
          valuesTitle: val.valuesTitle,
          valuesContent: val.valuesContent,
          teamTitle: val.teamTitle,
          teamEnabled: val.teamEnabled,
          teamMembers: val.teamMembers,
          whyChooseTitle: val.whyChooseTitle,
          whyChooseContent: val.whyChooseContent,
          ctaTitle: val.ctaTitle,
          ctaSubtitle: val.ctaSubtitle,
          ctaButtonText: val.ctaButtonText,
          ctaButtonUrl: val.ctaButtonUrl,
          statsEnabled: val.statsEnabled,
          statsContent: val.statsContent,
          certificationsEnabled: val.certificationsEnabled,
          certificationsContent: val.certificationsContent,
          showLocationSection: val.showLocationSection,
        }
      })
    }
    
    // Revalidar el caché después de actualizar la página "Quiénes Somos"
    revalidatePath('/quienes-somos', 'page')
    revalidatePath('/', 'page')
    
    return NextResponse.json(aboutPage)
  } catch (error) {
    console.error('Error updating about page:', error)
    return NextResponse.json({ error: 'Error al actualizar la página' }, { status: 500 })
  }
}
