import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { z } from 'zod'

const adminConfigSchema = z.object({
  siteName: z.string().optional(),
  siteUrl: z.string().nullable().optional(),
  siteSlogan: z.string().nullable().optional(),
  siteDescription: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  faviconUrl: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  companyAddress: z.string().nullable().optional(),
  companyPhone: z.string().nullable().optional(),
  companyEmail: z.string().nullable().optional(),
  notificationEmail: z.string().nullable().optional(),
  facebookUrl: z.string().nullable().optional(),
  instagramUrl: z.string().nullable().optional(),
  twitterUrl: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  tiktokUrl: z.string().nullable().optional(),
  youtubeUrl: z.string().nullable().optional(),
  whatsappNumber: z.string().nullable().optional(),
  whatsappMessage: z.string().nullable().optional(),
  whatsappShowBubble: z.boolean().optional(),
  footerText: z.string().nullable().optional(),
  socialText: z.string().nullable().optional(),
  aboutImageUrl: z.string().nullable().optional(),
  aboutTitle: z.string().nullable().optional(),
  aboutDescription: z.string().nullable().optional(),
  aboutYearsExperience: z.string().nullable().optional(),
  aboutYearsText: z.string().nullable().optional(),
  aboutStats: z.string().nullable().optional(),
  aboutFeatures: z.string().nullable().optional(),
  aboutSectionEnabled: z.boolean().optional(),
  aboutBadge: z.string().nullable().optional(),
  aboutBadgeColor: z.string().nullable().optional(),
  showMapSection: z.boolean().optional(),
  metaKeywords: z.string().nullable().optional(),
  googleAnalytics: z.string().nullable().optional(),
  googleMapsEmbed: z.string().nullable().optional(),
  primaryColor: z.string().nullable().optional(),
  portfolioEnabled: z.boolean().optional(),
  portfolioTitle: z.string().nullable().optional(),
  portfolioUrl: z.string().nullable().optional(),
})

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
    
    const validationResult = adminConfigSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data
    
    let config = await db.platformConfig.findFirst()
    
    const data = {
      siteUrl: emptyToNull(val.siteUrl),
      siteSlogan: emptyToNull(val.siteSlogan),
      siteDescription: emptyToNull(val.siteDescription),
      logoUrl: emptyToNull(val.logoUrl),
      faviconUrl: emptyToNull(val.faviconUrl),
      companyName: emptyToNull(val.companyName),
      companyAddress: emptyToNull(val.companyAddress),
      companyPhone: emptyToNull(val.companyPhone),
      companyEmail: emptyToNull(val.companyEmail),
      notificationEmail: emptyToNull(val.notificationEmail),
      facebookUrl: emptyToNull(val.facebookUrl),
      instagramUrl: emptyToNull(val.instagramUrl),
      twitterUrl: emptyToNull(val.twitterUrl),
      linkedinUrl: emptyToNull(val.linkedinUrl),
      tiktokUrl: emptyToNull(val.tiktokUrl),
      youtubeUrl: emptyToNull(val.youtubeUrl),
      whatsappNumber: emptyToNull(val.whatsappNumber),
      whatsappMessage: val.whatsappMessage || null,
      whatsappShowBubble: val.whatsappShowBubble ?? true,
      footerText: emptyToNull(val.footerText),
      socialText: emptyToNull(val.socialText),
      // About Section
      aboutImageUrl: emptyToNull(val.aboutImageUrl),
      aboutTitle: emptyToNull(val.aboutTitle),
      aboutDescription: emptyToNull(val.aboutDescription),
      aboutYearsExperience: emptyToNull(val.aboutYearsExperience),
      aboutYearsText: emptyToNull(val.aboutYearsText),
      aboutStats: emptyToNull(val.aboutStats),
      aboutFeatures: emptyToNull(val.aboutFeatures),
      aboutSectionEnabled: val.aboutSectionEnabled ?? true,
      aboutBadge: emptyToNull(val.aboutBadge),
      aboutBadgeColor: emptyToNull(val.aboutBadgeColor),
      // Map Section
      showMapSection: val.showMapSection ?? true,
      // SEO
      metaKeywords: emptyToNull(val.metaKeywords),
      googleAnalytics: emptyToNull(val.googleAnalytics),
      googleMapsEmbed: emptyToNull(val.googleMapsEmbed),
      primaryColor: emptyToNull(val.primaryColor),
      // Portfolio
      portfolioEnabled: val.portfolioEnabled ?? false,
      portfolioTitle: emptyToNull(val.portfolioTitle),
      portfolioUrl: emptyToNull(val.portfolioUrl),
    }
    
    const siteName = val.siteName || 'Green Axis S.A.S.'
    
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
