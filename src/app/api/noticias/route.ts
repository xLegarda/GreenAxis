import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { z } from 'zod'

const newsSchema = z.object({
  id: z.string().optional(),
  title: z.string({ message: 'El título es requerido' }).min(1, 'El título es requerido'),
  slug: z.string().nullable().optional(),
  regenerateSlug: z.boolean().optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  published: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  publishedAt: z.string().nullable().optional(),
  blocks: z.string().nullable().optional(),
  showCoverInContent: z.boolean().optional().default(true),
})

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (slug) {
      const news = await db.news.findUnique({
        where: { slug }
      })
      return NextResponse.json(news)
    }
    
    // Pagination for admin
    const skip = (page - 1) * limit
    
    const [news, total] = await Promise.all([
      db.news.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.news.count()
    ])
    
    return NextResponse.json({
      news,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    })
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
    
    const validationResult = newsSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data

    let slug = val.slug || generateSlug(val.title)
    
    // Verificar si el slug ya existe
    const existing = await db.news.findUnique({
      where: { slug }
    })
    
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }
    
    // Parse publication date if provided
    let publishedAt: Date | null = null
    if (val.published) {
      if (val.publishedAt) {
        // Parse the date string and set to start of day in UTC
        publishedAt = new Date(val.publishedAt + 'T12:00:00.000Z')
      } else {
        publishedAt = new Date()
      }
    }
    
    const news = await db.news.create({
      data: {
        title: val.title,
        slug,
        excerpt: val.excerpt || null,
        content: val.content || '',
        imageUrl: val.imageUrl || null,
        author: val.author || null,
        published: val.published,
        featured: val.featured,
        publishedAt,
        blocks: val.blocks || null,
        showCoverInContent: val.showCoverInContent,
      }
    })
    
    // Revalidar el caché después de crear una noticia
    revalidatePath('/noticias', 'page')
    revalidatePath('/', 'page')
    
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
    
    const validationResult = newsSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data

    // Check if news exists
    const existingNews = await db.news.findUnique({
      where: { id: body.id }
    })
    
    if (!existingNews) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 })
    }
    
    let slug = val.slug
    
    // Si el título cambió, regenerar slug
    if (val.regenerateSlug) {
      slug = generateSlug(val.title)
      
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
    
    if (val.published) {
      if (val.publishedAt) {
        // Use the provided date
        publishedAt = new Date(val.publishedAt + 'T12:00:00.000Z')
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
        title: val.title,
        slug: slug || undefined,
        excerpt: val.excerpt || null,
        content: val.content || '',
        imageUrl: val.imageUrl || null,
        author: val.author || null,
        published: val.published,
        featured: val.featured,
        publishedAt,
        blocks: val.blocks || null,
      }
    })
    
    // Revalidar el caché después de actualizar una noticia
    revalidatePath('/noticias', 'page')
    revalidatePath(`/noticias/${news.slug}`, 'page')
    revalidatePath('/', 'page')
    
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
    
    // Revalidar el caché después de eliminar una noticia
    revalidatePath('/noticias', 'page')
    revalidatePath('/', 'page')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json({ error: 'Error al eliminar noticia' }, { status: 500 })
  }
}
