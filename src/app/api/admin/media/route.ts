import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { findMediaReferences } from '@/lib/media-references'

/**
 * Determines the media type from the URL extension
 */
function getMediaType(url: string): 'image' | 'video' | 'audio' {
  const extension = url.split('.').pop()?.toLowerCase() || ''
  
  // Video extensions
  if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(extension)) {
    return 'video'
  }
  
  // Audio extensions
  if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'].includes(extension)) {
    return 'audio'
  }
  
  // Default to image
  return 'image'
}

/**
 * GET /api/admin/media
 * List media files with pagination and filtering
 * 
 * Query Parameters:
 * - page (number, default: 1): Page number
 * - limit (number, default: 50): Items per page
 * - category (string, optional): Filter by category
 * - search (string, optional): Search by label
 * - type (string, optional): Filter by type (image/video/audio)
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const typeFilter = searchParams.get('type') || undefined

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parámetros de paginación inválidos' },
        { status: 400 }
      )
    }

    // Build where clause for filtering
    const where: any = {}
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.label = {
        contains: search,
      }
    }

    // Get total count for pagination (before type filtering)
    const totalBeforeTypeFilter = await db.siteImage.count({ where })

    // Fetch media items with pagination
    const mediaItems = await db.siteImage.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Process items: determine type, calculate usage count
    const items = await Promise.all(
      mediaItems.map(async (item) => {
        const type = getMediaType(item.url)
        
        // Filter by type if specified
        if (typeFilter && type !== typeFilter) {
          return null
        }

        // Calculate usage count
        let usageCount = 0
        try {
          const references = await findMediaReferences(item.url)
          usageCount = references.length
        } catch (error) {
          console.error(`Error calculating usage for ${item.url}:`, error)
          // Continue with usageCount = 0 if reference check fails
        }

        return {
          id: item.id,
          key: item.key,
          label: item.label,
          description: item.description,
          url: item.url,
          category: item.category,
          type,
          usageCount,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        }
      })
    )

    // Filter out null items (type filter mismatches)
    const filteredItems = items.filter((item) => item !== null)

    // Note: When type filter is applied, pagination counts are approximate
    // since type is determined from URL extension, not stored in database
    const total = typeFilter ? filteredItems.length : totalBeforeTypeFilter

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    return NextResponse.json({
      items: filteredItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore,
      },
    })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Error al obtener archivos multimedia' },
      { status: 500 }
    )
  }
}
