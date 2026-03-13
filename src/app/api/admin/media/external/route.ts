import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'

/**
 * POST /api/admin/media/external
 * Register external media URL in the library
 * 
 * Request Body:
 * - key (string): Unique identifier for the media
 * - url (string): External URL of the media file
 * - label (string): Display name for the media
 * - description (string, optional): Description of the media
 * - category (string, optional): Category for the media
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { key, url, label, description, category } = body

    // Validate required fields
    if (!key || !url || !label) {
      return NextResponse.json(
        { error: 'Los campos key, url y label son requeridos' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'La URL proporcionada no es válida' },
        { status: 400 }
      )
    }

    // Check if key already exists
    const existingMedia = await db.siteImage.findUnique({
      where: { key }
    })

    if (existingMedia) {
      return NextResponse.json(
        { error: 'Ya existe un archivo con esa clave' },
        { status: 409 }
      )
    }

    // Check if URL already exists
    const existingUrl = await db.siteImage.findFirst({
      where: { url }
    })

    if (existingUrl) {
      return NextResponse.json(
        { error: 'Esta URL ya está registrada en la biblioteca' },
        { status: 409 }
      )
    }

    // Create new media record
    const newMedia = await db.siteImage.create({
      data: {
        key,
        url,
        label,
        description: description || null,
        category: category || 'general',
        // Generate a simple hash for external URLs
        hash: `external-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      }
    })

    return NextResponse.json({
      success: true,
      media: {
        id: newMedia.id,
        key: newMedia.key,
        url: newMedia.url,
        label: newMedia.label,
        description: newMedia.description,
        category: newMedia.category,
        createdAt: newMedia.createdAt.toISOString(),
        updatedAt: newMedia.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Error registering external media:', error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Ya existe un archivo con esos datos' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}