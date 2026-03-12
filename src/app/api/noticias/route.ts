import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'

// Helper para generar slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      const news = await db.news.findUnique({
        where: { slug }
      })
      return NextResponse.json(news)
    }
    
    const news = await db.news.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Error al obtener noticias' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // A01: Verificar autenticación
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    let slug = body.slug || generateSlug(body.title)
    
    // Verificar si el slug ya existe
    const existing = await db.news.findUnique({
      where: { slug }
    })
    
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }
    
    // Parse publication date if provided
    let publishedAt: Date | null = null
    if (body.published) {
      if (body.publishedAt) {
        // Parse the date string and set to start of day in UTC
        publishedAt = new Date(body.publishedAt + 'T12:00:00.000Z')
      } else {
        publishedAt = new Date()
      }
    }
    
    const news = await db.news.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content || '',
        imageUrl: body.imageUrl || null,
        author: body.author || null,
        published: body.published ?? false,
        featured: body.featured ?? false,
        publishedAt,
        blocks: body.blocks || null,
        showCoverInContent: true,
      }
    })
    
    return NextResponse.json(news)
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json({ error: 'Error al crear noticia' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  // A01: Verificar autenticación
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    // Check if news exists
    const existingNews = await db.news.findUnique({
      where: { id: body.id }
    })
    
    if (!existingNews) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 })
    }
    
    let slug = body.slug
    
    // Si el título cambió, regenerar slug
    if (body.regenerateSlug) {
      slug = generateSlug(body.title)
      
      // Verificar si el nuevo slug ya existe
      const existing = await db.news.findFirst({
        where: { 
          slug,
          NOT: { id: body.id }
        }
      })
      
      if (existing) {
        slug = `${slug}-${Date.now()}`
      }
    }
    
    // Handle publishedAt date
    let publishedAt: Date | null = existingNews.publishedAt
    
    if (body.published) {
      if (body.publishedAt) {
        // Use the provided date
        publishedAt = new Date(body.publishedAt + 'T12:00:00.000Z')
      } else if (!existingNews.publishedAt) {
        // Only set to now if not already set
        publishedAt = new Date()
      }
      // If already published and no new date provided, keep existing date
    } else {
      // If unpublished, clear the date
      publishedAt = null
    }
    
    const news = await db.news.update({
      where: { id: body.id },
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content || '',
        imageUrl: body.imageUrl || null,
        author: body.author || null,
        published: body.published,
        featured: body.featured,
        publishedAt,
        blocks: body.blocks || null,
      }
    })
    
    return NextResponse.json(news)
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json({ error: 'Error al actualizar noticia' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // A01: Verificar autenticación
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    await db.news.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json({ error: 'Error al eliminar noticia' }, { status: 500 })
  }
}
