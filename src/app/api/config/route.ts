import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
