import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'

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
    
    const slide = await db.carouselSlide.create({
      data: {
        title: body.title || null,
        subtitle: body.subtitle || null,
        description: body.description || null,
        imageUrl: body.imageUrl,
        buttonText: body.buttonText || null,
        buttonUrl: body.buttonUrl || null,
        linkUrl: body.linkUrl || null,
        gradientEnabled: body.gradientEnabled ?? true,
        animationEnabled: body.animationEnabled ?? true,
        gradientColor: body.gradientColor || null,
        order: body.order ?? 0,
        active: body.active ?? true,
      }
    })
    
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
    
    const slide = await db.carouselSlide.update({
      where: { id: body.id },
      data: {
        title: body.title || null,
        subtitle: body.subtitle || null,
        description: body.description || null,
        imageUrl: body.imageUrl,
        buttonText: body.buttonText || null,
        buttonUrl: body.buttonUrl || null,
        linkUrl: body.linkUrl || null,
        gradientEnabled: body.gradientEnabled,
        animationEnabled: body.animationEnabled,
        gradientColor: body.gradientColor || null,
        order: body.order,
        active: body.active,
      }
    })
    
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
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting slide:', error)
    return NextResponse.json({ error: 'Error al eliminar slide' }, { status: 500 })
  }
}
