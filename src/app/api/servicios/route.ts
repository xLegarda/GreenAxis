import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { z } from 'zod'

const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string({ message: 'El título es requerido' }).min(1, 'El título es requerido'),
  slug: z.string().nullable().optional(),
  regenerateSlug: z.boolean().optional(),
  description: z.string().nullable().optional(),
  shortBlocks: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  blocks: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  order: z.number().optional().default(0),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  showSummary: z.boolean().optional().default(true),
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

export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { order: 'asc' }
    })
    
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 })
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
    
    const validationResult = serviceSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data

    let slug = val.slug || generateSlug(val.title)

    // Verificar si el slug ya existe
    const existingSlug = await db.service.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const service = await db.service.create({
      data: {
        title: val.title,
        slug,
        description: val.description || null,
        shortBlocks: val.shortBlocks || null,
        content: val.content || null,
        blocks: val.blocks || null,
        icon: val.icon || null,
        imageUrl: val.imageUrl || null,
        order: val.order,
        active: val.active,
        featured: val.featured,
        showSummary: val.showSummary,
      }
    })
    
    // Revalidar el caché después de crear un servicio
    revalidatePath('/servicios', 'page')
    revalidatePath('/', 'page')
    
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 })
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
    
    const validationResult = serviceSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data

    // Handle slug on update
    let slug = val.slug
    if (val.regenerateSlug || (!slug && val.title)) {
      slug = generateSlug(val.title)
    }
    if (slug) {
      // Ensure uniqueness excluding the current record
      const existing = await db.service.findFirst({
        where: { slug, NOT: { id: body.id } }
      })
      if (existing) {
        slug = `${slug}-${Date.now()}`
      }
    }

    const service = await db.service.update({
      where: { id: body.id },
      data: {
        title: val.title,
        slug: slug || undefined,
        description: val.description || null,
        shortBlocks: val.shortBlocks || null,
        content: val.content || null,
        blocks: val.blocks || null,
        icon: val.icon || null,
        imageUrl: val.imageUrl || null,
        order: val.order,
        active: val.active,
        featured: val.featured,
        showSummary: val.showSummary,
      }
    })
    
    // Revalidar el caché después de actualizar un servicio
    revalidatePath('/servicios', 'page')
    revalidatePath('/', 'page')
    if (service.slug) {
      revalidatePath(`/servicios/${service.slug}`, 'page')
    }
    
    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Error al actualizar servicio' }, { status: 500 })
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
    
    await db.service.delete({
      where: { id }
    })
    
    // Revalidar el caché después de eliminar un servicio
    revalidatePath('/servicios', 'page')
    revalidatePath('/', 'page')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Error al eliminar servicio' }, { status: 500 })
  }
}
