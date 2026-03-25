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

    // If body has paramsToSign (Cloudinary widget format), sign those
    if (body.paramsToSign) {
      const signature = generateCloudinarySignature(body.paramsToSign, config.api_secret)
      return NextResponse.json({ signature })
    }

    // If body IS a flat object of params (widget sends params directly)
    // Filter out known non-param fields and sign whatever remains
    const nonParamKeys = ['key', 'label', 'category']
    const hasParamKeys = Object.keys(body).some(k => !nonParamKeys.includes(k) && k !== 'paramsToSign')

    if (hasParamKeys && body.timestamp) {
      const params: Record<string, string> = {}
      for (const [k, v] of Object.entries(body)) {
        if (!nonParamKeys.includes(k) && k !== 'paramsToSign' && v !== undefined && v !== null) {
          params[k] = String(v)
        }
      }
      const signature = generateCloudinarySignature(params, config.api_secret)
      return NextResponse.json({ signature })
    }

    // Direct call with key/label/category - generate full upload config
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
