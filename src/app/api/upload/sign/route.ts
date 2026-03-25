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
    const config = getCloudinaryConfig()

    // Cloudinary Upload Widget sends paramsToSign directly
    if (body.paramsToSign && typeof body.paramsToSign === 'object') {
      const paramsToSign = body.paramsToSign as Record<string, any>

      // Convert all values to strings for signing
      const params: Record<string, string> = {}
      for (const [key, value] of Object.entries(paramsToSign)) {
        if (value !== undefined && value !== null && value !== '') {
          params[key] = String(value)
        }
      }

      const signature = generateCloudinarySignature(params, config.api_secret)
      return NextResponse.json({ signature })
    }

    // Direct call with key/label/category
    const { key, label, category } = body

    if (!key) {
      return NextResponse.json({ error: 'Se requiere key' }, { status: 400 })
    }

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
