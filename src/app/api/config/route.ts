import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

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
    const config = await db.platformConfig.findFirst()

    if (!config) {
      return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 })
    }

    const updated = await db.platformConfig.update({
      where: { id: config.id },
      data: {
        siteName: body.siteName,
        siteSlogan: body.siteSlogan,
        siteDescription: body.siteDescription,
        whatsappMessage: body.whatsappMessage,
        whatsappShowBubble: body.whatsappShowBubble,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
  }
}