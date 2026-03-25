import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { getCloudinaryConfig } from '@/lib/cloudinary-config'

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const config = getCloudinaryConfig()
  return NextResponse.json({
    cloudName: config.cloud_name,
    apiKey: config.api_key,
  })
}
