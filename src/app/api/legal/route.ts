import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { z } from 'zod'

const legalSchema = z.object({
  slug: z.string({ message: 'El slug es requerido' }).min(1, 'El slug es requerido'),
  title: z.string({ message: 'El título es requerido' }).min(1, 'El título es requerido'),
  content: z.string().nullable().optional(),
  blocks: z.string().nullable().optional(),
  manualDate: z.string().nullable().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      const page = await db.legalPage.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          blocks: true,
          manualDate: true,
          updatedAt: true,
          createdAt: true
        }
      })
      return NextResponse.json(page)
    }
    
    const pages = await db.legalPage.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        blocks: true,
        manualDate: true,
        updatedAt: true,
        createdAt: true
      }
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching legal pages:', error)
    return NextResponse.json({ error: 'Error al obtener páginas' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const validationResult = legalSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data
    
    // Upsert: crear si no existe, actualizar si existe
    const page = await db.legalPage.upsert({
      where: { slug: val.slug },
      create: { 
        slug: val.slug, 
        title: val.title, 
        content: val.content || '', 
        blocks: val.blocks || null,
        manualDate: val.manualDate || null 
      },
      update: { 
        title: val.title, 
        content: val.content || '', 
        blocks: val.blocks || null,
        manualDate: val.manualDate || null 
      }
    })
    
    // Revalidar el caché después de actualizar una página legal
    revalidatePath('/privacidad', 'page')
    revalidatePath('/terminos', 'page')
    
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error saving legal page:', error)
    return NextResponse.json({ error: 'Error al guardar página' }, { status: 500 })
  }
}
