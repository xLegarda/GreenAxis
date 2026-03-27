import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { z } from 'zod'

const configSchema = z.object({
  siteName: z.string().optional(),
  siteSlogan: z.string().nullable().optional(),
  siteDescription: z.string().nullable().optional(),
  whatsappMessage: z.string().nullable().optional(),
  whatsappShowBubble: z.boolean().optional(),
})

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let config = await db.platformConfig.findFirst()
    
    if (!config) {
      config = await db.platformConfig.create({
        data: {
          siteName: 'Servicios Ambientales',
          siteSlogan: 'Comprometidos con el medio ambiente',
          siteDescription: 'Empresa líder en servicios ambientales en Colombia.',
          whatsappMessage: '¡Hola! Me gustaría obtener información sobre sus servicios ambientales.',
          whatsappShowBubble: true,
        }
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const validationResult = configSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data

    const config = await db.platformConfig.findFirst()

    if (!config) {
      return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 })
    }

    const updated = await db.platformConfig.update({
      where: { id: config.id },
      data: {
        siteName: val.siteName,
        siteSlogan: val.siteSlogan,
        siteDescription: val.siteDescription,
        whatsappMessage: val.whatsappMessage,
        whatsappShowBubble: val.whatsappShowBubble,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
  }
}