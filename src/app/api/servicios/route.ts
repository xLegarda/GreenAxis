import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'

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
    
    const service = await db.service.create({
      data: {
        title: body.title,
        description: body.description || null,
        content: body.content || null,
        icon: body.icon || null,
        imageUrl: body.imageUrl || null,
        order: body.order || 0,
        active: body.active ?? true,
        featured: body.featured ?? false,
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
    
    const service = await db.service.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description || null,
        content: body.content || null,
        icon: body.icon || null,
        imageUrl: body.imageUrl || null,
        order: body.order,
        active: body.active,
        featured: body.featured,
      }
    })
    
    // Revalidar el caché después de actualizar un servicio
    revalidatePath('/servicios', 'page')
    revalidatePath('/', 'page')
    
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
