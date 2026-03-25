import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { getCloudinaryConfig, generateCloudinarySignature } from '@/lib/cloudinary-config'

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, label, category } = body

    if (!key) {
      return NextResponse.json({ error: 'Se requiere key' }, { status: 400 })
    }

    const config = getCloudinaryConfig()
    const timestamp = Math.round(Date.now() / 1000).toString()
    const folder = 'green-axis'

    const params: Record<string, string> = {
      folder,
      public_id: key,
      timestamp,
    }

    const signature = generateCloudinarySignature(params, config.api_secret)

    return NextResponse.json({
      signature,
      timestamp,
      api_key: config.api_key,
      cloud_name: config.cloud_name,
      public_id: key,
      folder,
      label: label || key,
      category: category || null,
    })
  } catch (error) {
    console.error('Error generating upload signature:', error)
    return NextResponse.json({ error: 'Error al generar firma de upload' }, { status: 500 })
  }
}
