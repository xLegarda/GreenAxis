import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { findMediaReferences, updateMediaReferences } from '@/lib/media-references'
import { configureCloudinary, getCloudinaryConfig } from '@/lib/cloudinary-config'

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

function extractCloudinaryPublicId(url: string): string | null {
  if (!url.includes('cloudinary.com')) return null
  try {
    const parts = url.split('/')
    const uploadIndex = parts.findIndex(part => part === 'upload')
    if (uploadIndex === -1 || uploadIndex >= parts.length - 1) return null

    let startIndex = uploadIndex + 1
    if (parts[startIndex]?.startsWith('v') && !isNaN(Number(parts[startIndex].substring(1)))) {
      startIndex++
    }

    const publicIdParts = parts.slice(startIndex)
    const lastPart = publicIdParts[publicIdParts.length - 1]
    publicIdParts[publicIdParts.length - 1] = lastPart.split('.')[0]
    return publicIdParts.join('/')
  } catch {
    return null
  }
}

async function deleteFromCloudinary(url: string): Promise<{ success: boolean; details: string }> {
  const cloudinary = configureCloudinary()
  const publicId = extractCloudinaryPublicId(url)
  if (!publicId) return { success: false, details: 'Could not extract public_id' }

  const logs: string[] = []

  for (const resourceType of ['image', 'video', 'raw'] as const) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
      logs.push(`${resourceType}: ${JSON.stringify(result)}`)
      if (result.result === 'ok') return { success: true, details: logs.join(' | ') }
    } catch (err) {
      logs.push(`${resourceType}: ${(err as Error).message}`)
    }
  }

  return { success: false, details: logs.join(' | ') }
}

/**
 * PUT /api/admin/media/:id
 * Update media metadata
 * 
 * Request Body:
 * - label (string, optional): New label/name for the media
 * - description (string, optional): New description
 * - category (string, optional): New category
 * - alt (string, optional): New alt text
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { label, description, category, alt } = body

    // Validate that at least one field is being updated
    if (!label && !description && category === undefined && alt === undefined) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Debe proporcionar al menos un campo para actualizar' 
        },
        { status: 400 }
      )
    }

    // Check if media exists
    const existingMedia = await db.siteImage.findUnique({
      where: { id }
    })

    if (!existingMedia) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Archivo no encontrado' 
        },
        { status: 404 }
      )
    }

    // Build update data object, preserving existing values if not provided
    const updateData: {
      label?: string
      description?: string | null
      category?: string | null
      alt?: string | null
      updatedAt: Date
    } = {
      updatedAt: new Date()
    }

    if (label !== undefined) {
      updateData.label = label
    }
    if (description !== undefined) {
      updateData.description = description
    }
    if (category !== undefined) {
      updateData.category = category
    }
    if (alt !== undefined) {
      updateData.alt = alt
    }

    // Update the SiteImage record
    const updatedMedia = await db.siteImage.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      media: updatedMedia
    })
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Error al actualizar archivo',
        error: 'internal_error'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/media/:id
 * Delete media file with reference checking
 * 
 * Query Parameters:
 * - force (boolean, default: false): Force delete even if in use
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    // Check if media exists in database
    const media = await db.siteImage.findUnique({
      where: { id }
    })

    if (!media) {
      return NextResponse.json(
        { 
          success: false,
          deleted: false,
          message: 'Archivo no encontrado' 
        },
        { status: 404 }
      )
    }

    // If not force mode, check for references
    if (!force) {
      try {
        const references = await findMediaReferences(media.url)
        
        if (references.length > 0) {
          // File is in use - return references without deleting
          return NextResponse.json({
            success: false,
            deleted: false,
            message: `Este archivo está siendo usado en ${references.length} lugar${references.length > 1 ? 'es' : ''}`,
            references: references.map(ref => ({
              table: ref.table,
              id: ref.id,
              field: ref.field,
              displayName: ref.displayName,
            }))
          })
        }
      } catch (refError) {
        console.error('Error checking references:', refError)
        // If reference check fails, assume file is in use to be safe
        return NextResponse.json({
          success: false,
          deleted: false,
          message: 'No se pudo verificar el uso del archivo. Por seguridad, no se eliminará.',
          error: 'reference_check_failed'
        }, { status: 500 })
      }
    }

    // Delete from Cloudinary
    let cloudinaryResult = { success: true, details: 'skipped' }
    if (isProduction && media.url.includes('cloudinary.com')) {
      cloudinaryResult = await deleteFromCloudinary(media.url)
    }

    // Delete SiteImage record from database
    await db.siteImage.delete({
      where: { id }
    })

    // If force mode and we need to clear references
    if (force) {
      try {
        await updateMediaReferences(media.url, '')
      } catch (updateError) {
        console.error('Error updating references after force delete:', updateError)
        // Don't fail the deletion if reference update fails
        // The file is already deleted, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      deleted: true,
      message: 'Archivo eliminado correctamente',
      cloudinary: cloudinaryResult
    })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { 
        success: false,
        deleted: false,
        message: 'Error al eliminar archivo',
        error: 'internal_error'
      },
      { status: 500 }
    )
  }
}
