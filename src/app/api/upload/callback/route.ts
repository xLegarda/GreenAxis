import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { emptyToNull } from '@/lib/cloudinary-config'

function extractPublicId(url: string): string | null {
  if (!url.includes('cloudinary.com')) return null
  try {
    const parts = url.split('/')
    const uploadIndex = parts.findIndex(p => p === 'upload')
    if (uploadIndex === -1) return null
    let start = uploadIndex + 1
    if (parts[start]?.startsWith('v') && !isNaN(Number(parts[start].substring(1)))) start++
    const idParts = parts.slice(start)
    const last = idParts[idParts.length - 1]
    idParts[idParts.length - 1] = last.split('.')[0]
    return idParts.join('/')
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { url, label, category } = body

    if (!url) {
      return NextResponse.json({ error: 'Se requiere url' }, { status: 400 })
    }

    // Use Cloudinary public_id as the key so deletion works
    const cloudinaryPublicId = extractPublicId(url) || body.key || `media-${Date.now()}`

    const existingImage = await db.siteImage.findUnique({
      where: { key: cloudinaryPublicId },
    })

    if (existingImage) {
      await db.siteImage.update({
        where: { key: cloudinaryPublicId },
        data: {
          url,
          label: label || existingImage.label,
          category: emptyToNull(category) || existingImage.category,
        },
      })
    } else {
      await db.siteImage.create({
        data: {
          key: cloudinaryPublicId,
          label: label || cloudinaryPublicId,
          category: emptyToNull(category) || 'general',
          url,
        },
      })
    }

    return NextResponse.json({
      success: true,
      url,
      key: cloudinaryPublicId,
      replaced: !!existingImage,
    })
  } catch (error) {
    console.error('Error saving upload:', error)
    return NextResponse.json({ error: 'Error al guardar archivo' }, { status: 500 })
  }
}
