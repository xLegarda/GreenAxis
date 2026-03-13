import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { findMediaReferences } from '@/lib/media-references'

/**
 * Generates an edit URL for a reference based on table type
 */
function generateEditUrl(table: string, id: string): string {
  switch (table) {
    case 'News':
      return `/admin/noticias/${id}`
    case 'PlatformConfig':
      return `/admin/configuracion`
    case 'CarouselSlide':
      return `/admin/carrusel`
    case 'LegalPage':
      return `/admin/paginas-legales/${id}`
    case 'AboutPage':
      return `/admin/acerca-de`
    default:
      return `/admin`
  }
}

/**
 * POST /api/admin/media/check-references
 * Check where a media file is being used
 * 
 * Request Body:
 * - url (string, required): The media URL to check
 * 
 * Response:
 * - inUse (boolean): Whether the file is referenced anywhere
 * - references (array): List of references with table, id, field, displayName, editUrl
 * - usageCount (number): Total number of references
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    // Parse request body
    const body = await request.json()
    const { url } = body

    // Validate URL parameter
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return NextResponse.json(
        { error: 'URL es requerida' },
        { status: 400 }
      )
    }

    // Find all references to this URL
    const references = await findMediaReferences(url)

    // Add editUrl to each reference
    const referencesWithEditUrl = references.map((ref) => ({
      table: ref.table,
      id: ref.id,
      field: ref.field,
      displayName: ref.displayName,
      editUrl: generateEditUrl(ref.table, ref.id),
    }))

    // Calculate usage metrics
    const usageCount = references.length
    const inUse = usageCount > 0

    return NextResponse.json({
      inUse,
      references: referencesWithEditUrl,
      usageCount,
    })
  } catch (error) {
    console.error('Error checking media references:', error)
    return NextResponse.json(
      { error: 'Error al verificar referencias del archivo' },
      { status: 500 }
    )
  }
}
