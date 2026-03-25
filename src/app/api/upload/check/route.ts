import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'

function normalizeFilename(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  let normalized = nameWithoutExt.toLowerCase()
  normalized = normalized.replace(/\d{10,13}-/g, '')
  normalized = normalized.replace(/\d{4}-\d{2}-\d{2}-/g, '')
  normalized = normalized.replace(/\d{8}-/g, '')
  normalized = normalized.replace(/-[a-z0-9]{6,8}$/g, '')
  normalized = normalized.replace(/[-_\s]+/g, '-')
  normalized = normalized.trim().replace(/^-+|-+$/g, '')
  return normalized
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { label, key } = body

    if (!label) {
      return NextResponse.json({ duplicate: { exists: false, suggestions: [] } })
    }

    const normalizedName = normalizeFilename(label)
    const allImages = await db.siteImage.findMany()

    const duplicates = allImages.filter(img => {
      const imgNormalizedName = normalizeFilename(img.label)
      return imgNormalizedName === normalizedName && img.key !== key
    })

    if (duplicates.length > 0) {
      return NextResponse.json({
        duplicate: {
          exists: true,
          suggestions: duplicates.map(dup => ({
            id: dup.id,
            label: dup.label,
            url: dup.url,
            category: dup.category,
            key: dup.key,
          })),
        },
      })
    }

    return NextResponse.json({ duplicate: { exists: false, suggestions: [] } })
  } catch (error) {
    console.error('Error checking duplicates:', error)
    return NextResponse.json({ duplicate: { exists: false, suggestions: [] } })
  }
}
