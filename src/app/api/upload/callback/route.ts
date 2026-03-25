import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { emptyToNull } from '@/lib/cloudinary-config'

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, url, label, category, mimeType, fileSize } = body

    if (!key || !url) {
      return NextResponse.json({ error: 'Se requieren key y url' }, { status: 400 })
    }

    const existingImage = await db.siteImage.findUnique({
      where: { key },
    })

    if (existingImage) {
      await db.siteImage.update({
        where: { key },
        data: {
          url,
          label: label || existingImage.label,
          category: emptyToNull(category) || existingImage.category,
        },
      })
    } else {
      await db.siteImage.create({
        data: {
          key,
          label: label || key,
          category: emptyToNull(category) || 'general',
          url,
        },
      })
    }

    return NextResponse.json({
      success: true,
      url,
      key,
      replaced: !!existingImage,
    })
  } catch (error) {
    console.error('Error saving upload:', error)
    return NextResponse.json({ error: 'Error al guardar archivo' }, { status: 500 })
  }
}
