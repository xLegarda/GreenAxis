import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { emptyToNull, configureCloudinary } from '@/lib/cloudinary-config'

function getCloudinaryResourceType(url: string): string {
  const match = url.match(/\/res\.cloudinary\.com\/[^/]+\/([^/]+)\//)
  return match ? match[1] : 'image'
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, url, label, category } = body

    if (!key || !url) {
      return NextResponse.json({ error: 'Se requieren key y url' }, { status: 400 })
    }

    const existingImage = await db.siteImage.findUnique({
      where: { key },
    })

    if (existingImage) {
      // Intentar borrar en Cloudinary el anterior solo si cambia de URL (ej: de imagen a video).
      // Si la URL nueva es exactamente la anterior, fue sobrescrito automáticamente.
      if (existingImage.url !== url && existingImage.url.includes('cloudinary.com')) {
        try {
          const cloudinary = configureCloudinary()
          const publicId = existingImage.url.split('/').slice(-2).join('/').split('.')[0]
          const resourceType = getCloudinaryResourceType(existingImage.url)
          await new Promise<void>((resolve) => {
            cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error: any) => {
              if (error) console.warn('Failed to delete old file from Cloudinary:', error)
              resolve()
            })
          })
        } catch (error) {
          console.warn('Failed to delete old file:', error)
        }
      }

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
