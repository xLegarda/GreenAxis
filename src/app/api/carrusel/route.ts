import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { z } from 'zod'

const carruselSchema = z.object({
  id: z.string().optional(),
  title: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  imageUrl: z.string({ message: 'URL de imagen es requerida' }).min(1, 'URL de imagen es requerida'),
  buttonText: z.string().nullable().optional(),
  buttonUrl: z.string().nullable().optional(),
  linkUrl: z.string().nullable().optional(),
  gradientEnabled: z.boolean().optional().default(true),
  animationEnabled: z.boolean().optional().default(true),
  gradientColor: z.string().nullable().optional(),
  order: z.number().optional().default(0),
  active: z.boolean().optional().default(true),
})

export async function GET() {
  try {
    const slides = await db.carouselSlide.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(slides)
  } catch (error) {
    console.error('Error fetching carousel:', error)
    return NextResponse.json({ error: 'Error al obtener carrusel' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const validationResult = carruselSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data

    const slide = await db.carouselSlide.create({
      data: {
        title: val.title || null,
        subtitle: val.subtitle || null,
        description: val.description || null,
        imageUrl: val.imageUrl,
        buttonText: val.buttonText || null,
        buttonUrl: val.buttonUrl || null,
        linkUrl: val.linkUrl || null,
        gradientEnabled: val.gradientEnabled,
        animationEnabled: val.animationEnabled,
        gradientColor: val.gradientColor || null,
        order: val.order,
        active: val.active,
      }
    })
    
    // Revalidar el caché después de crear un slide
    revalidatePath('/', 'page')
    
    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error creating slide:', error)
    return NextResponse.json({ error: 'Error al crear slide' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    const validationResult = carruselSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const val = validationResult.data

    const slide = await db.carouselSlide.update({
      where: { id: body.id },
      data: {
        title: val.title || null,
        subtitle: val.subtitle || null,
        description: val.description || null,
        imageUrl: val.imageUrl,
        buttonText: val.buttonText || null,
        buttonUrl: val.buttonUrl || null,
        linkUrl: val.linkUrl || null,
        gradientEnabled: val.gradientEnabled,
        animationEnabled: val.animationEnabled,
        gradientColor: val.gradientColor || null,
        order: val.order,
        active: val.active,
      }
    })
    
    // Revalidar el caché después de actualizar un slide
    revalidatePath('/', 'page')
    
    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error updating slide:', error)
    return NextResponse.json({ error: 'Error al actualizar slide' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
    
    await db.carouselSlide.delete({
      where: { id }
    })
    
    // Revalidar el caché después de eliminar un slide
    revalidatePath('/', 'page')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting slide:', error)
    return NextResponse.json({ error: 'Error al eliminar slide' }, { status: 500 })
  }
}
