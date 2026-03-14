import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'

// Helper para convertir string vacío a null
function emptyToNull(value: string | null | undefined): string | null {
  if (value === '' || value === undefined) return null
  return value ?? null
}

export async function GET() {
  // Verificar autenticación
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  try {
    let config = await db.platformConfig.findFirst()
    
    if (!config) {
      config = await db.platformConfig.create({
        data: {
          siteName: 'Green Axis S.A.S.',
          siteSlogan: 'Comprometidos con el medio ambiente',
          siteDescription: 'Empresa líder en servicios ambientales en Colombia.',
          whatsappMessage: '¡Hola! Me gustaría obtener información sobre sus servicios ambientales.',
          whatsappShowBubble: true,
        }
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching admin config:', error)
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  // Verificar autenticación
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    
    let config = await db.platformConfig.findFirst()
    
    const data = {
      siteUrl: emptyToNull(body.siteUrl),
      siteSlogan: emptyToNull(body.siteSlogan),
      siteDescription: emptyToNull(body.siteDescription),
      logoUrl: emptyToNull(body.logoUrl),
      faviconUrl: emptyToNull(body.faviconUrl),
      companyName: emptyToNull(body.companyName),
      companyAddress: emptyToNull(body.companyAddress),
      companyPhone: emptyToNull(body.companyPhone),
      companyEmail: emptyToNull(body.companyEmail),
      notificationEmail: emptyToNull(body.notificationEmail),
      facebookUrl: emptyToNull(body.facebookUrl),
      instagramUrl: emptyToNull(body.instagramUrl),
      twitterUrl: emptyToNull(body.twitterUrl),
      linkedinUrl: emptyToNull(body.linkedinUrl),
      tiktokUrl: emptyToNull(body.tiktokUrl),
      youtubeUrl: emptyToNull(body.youtubeUrl),
      whatsappNumber: emptyToNull(body.whatsappNumber),
      whatsappMessage: body.whatsappMessage,
      whatsappShowBubble: body.whatsappShowBubble,
      footerText: emptyToNull(body.footerText),
      socialText: emptyToNull(body.socialText),
      // About Section
      aboutImageUrl: emptyToNull(body.aboutImageUrl),
      aboutTitle: emptyToNull(body.aboutTitle),
      aboutDescription: emptyToNull(body.aboutDescription),
      aboutYearsExperience: emptyToNull(body.aboutYearsExperience),
      aboutYearsText: emptyToNull(body.aboutYearsText),
      aboutStats: emptyToNull(body.aboutStats),
      aboutFeatures: emptyToNull(body.aboutFeatures),
      aboutSectionEnabled: body.aboutSectionEnabled,
      aboutBadge: emptyToNull(body.aboutBadge),
      aboutBadgeColor: emptyToNull(body.aboutBadgeColor),
      // Map Section
      showMapSection: body.showMapSection,
      // SEO
      metaKeywords: emptyToNull(body.metaKeywords),
      googleAnalytics: emptyToNull(body.googleAnalytics),
      googleMapsEmbed: emptyToNull(body.googleMapsEmbed),
      primaryColor: emptyToNull(body.primaryColor),
    }
    
    const siteName = body.siteName || 'Green Axis S.A.S.'
    
    if (!config) {
      config = await db.platformConfig.create({
        data: {
          siteName,
          ...data
        }
      })
    } else {
      config = await db.platformConfig.update({
        where: { id: config.id },
        data
      })
    }
    
    // Revalidar el caché después de actualizar la configuración
    revalidatePath('/', 'layout')
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating admin config:', error)
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
  }
}
