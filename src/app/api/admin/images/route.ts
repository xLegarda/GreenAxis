import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { existsSync, unlink } from 'fs'
import path from 'path'

// GET - Listar todas las imágenes (público para que funcione en admin)
export async function GET() {
  try {
    const images = await db.siteImage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json({ error: 'Error al obtener imágenes' }, { status: 500 })
  }
}

// DELETE - Eliminar una imagen
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

    // Buscar la imagen
    const image = await db.siteImage.findUnique({
      where: { id }
    })

    if (!image) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
    }

    // Eliminar archivo físico
    if (image.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', image.url)
      if (existsSync(filePath)) {
        await unlink(filePath).catch(() => {})
      }
    }

    // Eliminar registro de la base de datos
    await db.siteImage.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json({ error: 'Error al eliminar imagen' }, { status: 500 })
  }
}
