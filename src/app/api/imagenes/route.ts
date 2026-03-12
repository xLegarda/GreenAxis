import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
